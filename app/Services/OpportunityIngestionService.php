<?php

namespace App\Services;

use App\Models\Opportunity;
use App\Models\OpportunityIngest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use function collect;
use function optional;

class OpportunityIngestionService
{
    public function __construct(private OpportunityScoringService $scoringService)
    {
    }

    public function process(OpportunityIngest $ingest): array
    {
        $meta = [
            'fetch' => [
                'attempted' => false,
                'allowed' => false,
                'status' => null,
            ],
        ];

        $html = $ingest->raw_html;
        $text = $ingest->raw_text;

        if (! $html && ! $text && $this->isFetchAllowed($ingest->source_url)) {
            $meta['fetch']['allowed'] = true;
            $meta['fetch']['attempted'] = true;

            try {
                $response = Http::timeout(10)->get($ingest->source_url);
                $meta['fetch']['status'] = $response->status();

                if ($response->successful()) {
                    $html = $response->body();
                }
            } catch (\Throwable $exception) {
                $meta['fetch']['status'] = 'error';
                $meta['fetch']['error'] = $exception->getMessage();
                Log::warning('Opportunity fetch failed', [
                    'ingest_id' => $ingest->id,
                    'source_url' => $ingest->source_url,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        if (! $text && $html) {
            $text = $this->htmlToText($html);
        }

        $cleanText = $this->cleanSummary($text ?? '');
        $htmlMeta = $html ? $this->extractHtmlMetadata($html) : [];
        $structured = $this->extractStructuredData($text ?? '', $ingest->note, $ingest->source_url, $htmlMeta);
        $summarySource = $structured['summary'] ?? ($cleanText !== '' ? Str::limit($cleanText, 480) : null);
        $summary = $summarySource ? Str::limit($summarySource, 360) : null;
        $slug = $this->uniqueSlug($structured['company_name'] ?? null, $structured['role_title'] ?? null);

        $commonAttributes = [
            'company_name' => $structured['company_name'] ?? null,
            'industry' => $structured['industry'] ?? null,
            'role_title' => $structured['role_title'] ?? 'Untitled Role',
            'status' => $structured['status'] ?? 'open',
            'source_channel' => $structured['source_channel'] ?? null,
            'source_url' => $ingest->source_url,
            'summary' => $summary,
            'is_remote' => $structured['is_remote'] ?? false,
            'async_level' => $structured['async_level'] ?? null,
            'domain_tags' => $structured['domain_tags'] ?? null,
            'ingest_status' => 'drafted',
            'ingest_payload' => $structured,
            'ingest_raw_content' => $html ?: $text,
            'ingest_errors' => null,
        ];

        $opportunity = $ingest->opportunity;

        if ($opportunity) {
            $update = array_filter(
                $commonAttributes,
                fn ($value, $key) => ! is_null($value) || in_array($key, ['is_remote', 'ingest_status', 'ingest_payload', 'ingest_raw_content', 'ingest_errors', 'source_url'])
            , ARRAY_FILTER_USE_BOTH);

            $opportunity->fill($update);
        } else {
            $creationAttributes = array_merge($commonAttributes, array_filter([
                'slug' => $slug,
                'workflow_state' => 'sourced',
                'stage' => 'Identified',
                'priority' => Arr::get($structured, 'priority', 'medium'),
                'source' => $structured['source'] ?? 'ingest',
                'public_visibility' => false,
                'is_favorite' => false,
            ], fn ($value) => ! is_null($value)));

            $opportunity = Opportunity::create($creationAttributes);
        }

        $this->scoringService->apply($opportunity);

        $ingest->update([
            'status' => 'drafted',
            'opportunity_id' => $opportunity->id,
            'meta' => array_merge($ingest->meta ?? [], $meta, [
                'structured' => $structured,
            ]),
            'errors' => null,
        ]);

        return [
            'opportunity' => $opportunity,
            'meta' => $meta,
        ];
    }

    private function isFetchAllowed(string $url): bool
    {
        $parsed = parse_url($url);
        if (! $parsed || empty($parsed['host'])) {
            return false;
        }

        $robotsUrl = ($parsed['scheme'] ?? 'https') . '://' . $parsed['host'] . '/robots.txt';

        try {
            $response = Http::timeout(5)->get($robotsUrl);
            if (! $response->ok()) {
                return true;
            }

            $body = $response->body();
            $lines = preg_split('/\r?\n/', $body);
            $disallows = [];
            $currentAgent = null;

            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || Str::startsWith($line, '#')) {
                    continue;
                }

                if (Str::startsWith(strtolower($line), 'user-agent:')) {
                    $currentAgent = trim(Str::after($line, ':'));
                    continue;
                }

                if (Str::startsWith(strtolower($line), 'disallow:')) {
                    $path = trim(Str::after($line, ':'));
                    if (($currentAgent === '*' || $currentAgent === null) && $path !== '') {
                        $disallows[] = $path;
                    }
                }
            }

            $path = $parsed['path'] ?? '/';
            foreach ($disallows as $disallowed) {
                if ($disallowed === '/') {
                    return false;
                }
                if (Str::startsWith($path, $disallowed)) {
                    return false;
                }
            }
        } catch (\Throwable $exception) {
            Log::debug('robots.txt fetch failed; defaulting to allow', [
                'robots_url' => $robotsUrl,
                'message' => $exception->getMessage(),
            ]);
        }

        return true;
    }

    private function htmlToText(string $html): string
    {
        $decoded = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $internalErrors = libxml_use_internal_errors(true);

        $dom = new \DOMDocument();
        $success = $dom->loadHTML('<?xml encoding="utf-8" ?>' . $decoded, LIBXML_NOWARNING | LIBXML_NOERROR);

        if (! $success) {
            libxml_clear_errors();
            libxml_use_internal_errors($internalErrors);

            return trim(strip_tags($decoded));
        }

        $xpath = new \DOMXPath($dom);
        foreach ($xpath->query('//script|//style|//noscript|//template') as $node) {
            $node->parentNode?->removeChild($node);
        }

        $body = $xpath->query('//body')->item(0);
        $text = $body ? $body->textContent : $dom->textContent;

        libxml_clear_errors();
        libxml_use_internal_errors($internalErrors);

        return trim(preg_replace('/\s+/', ' ', $text));
    }

    private function extractHtmlMetadata(?string $html): array
    {
        if (! $html) {
            return [];
        }

        $decoded = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $internalErrors = libxml_use_internal_errors(true);
        $dom = new \DOMDocument();

        if (! $dom->loadHTML('<?xml encoding="utf-8" ?>' . $decoded, LIBXML_NOWARNING | LIBXML_NOERROR)) {
            libxml_clear_errors();
            libxml_use_internal_errors($internalErrors);

            return [];
        }

        $xpath = new \DOMXPath($dom);

        $title = optional($xpath->query('//meta[@property="og:title"]')->item(0))->getAttribute('content');
        if (! $title) {
            $title = optional($xpath->query('//meta[@name="twitter:title"]')->item(0))->getAttribute('content');
        }
        if (! $title) {
            $titleNode = $xpath->query('//title')->item(0);
            $title = $titleNode ? $titleNode->textContent : null;
        }

        $description = optional($xpath->query('//meta[@property="og:description"]')->item(0))->getAttribute('content');
        if (! $description) {
            $description = optional($xpath->query('//meta[@name="description"]')->item(0))->getAttribute('content');
        }

        $headingNode = $xpath->query('//h1[normalize-space()]')->item(0);
        $heading = $headingNode ? trim($headingNode->textContent) : null;

        libxml_clear_errors();
        libxml_use_internal_errors($internalErrors);

        return array_filter([
            'title' => $title ? trim($title) : null,
            'description' => $description ? trim($description) : null,
            'heading' => $heading,
        ], fn ($value) => filled($value));
    }

    private function extractStructuredData(string $text, ?string $note, string $url, array $meta = []): array
    {
        $host = parse_url($url, PHP_URL_HOST) ?: null;
        $roleTitle = $this->deriveRoleTitle($text, $meta);
        $companyName = $this->deriveCompany($host, $roleTitle, $text, $meta);
        $isRemote = $this->detectRemote($text, $note);
        $asyncLevel = $this->detectAsyncLevel($text, $isRemote);
        $domainTags = $this->detectDomainTags($text);

        return array_filter([
            'role_title' => $roleTitle,
            'company_name' => $companyName,
            'priority' => $isRemote ? 'high' : 'medium',
            'status' => 'open',
            'source' => 'ingest',
            'source_channel' => $host,
            'summary' => $this->deriveSummary($text, $note, $meta),
            'note' => $note,
            'host' => $host,
            'captured_at' => now()->toIso8601String(),
            'is_remote' => $isRemote,
            'async_level' => $asyncLevel,
            'domain_tags' => $domainTags,
        ], fn ($value) => ! is_null($value) && $value !== '');
    }

    private function deriveRoleTitle(string $text, array $meta = []): ?string
    {
        $candidates = collect([
            $meta['title'] ?? null,
            $meta['heading'] ?? null,
        ])->filter(fn ($value) => filled($value));

        if ($candidates->isNotEmpty()) {
            return Str::of($candidates->first())->trim()->limit(180);
        }

        $firstSentence = Str::of($text)->trim()->before('.')->before('\n');
        if ($firstSentence->isEmpty()) {
            return null;
        }

        return $firstSentence->limit(120);
    }

    private function deriveCompany(?string $host, ?string $roleTitle, string $text, array $meta = []): ?string
    {
        $base = $this->deriveCompanyFromHost($host);

        if (! $host) {
            return $base;
        }

        if ($this->isAggregatorHost($host)) {
            if (! empty($meta['title'])) {
                $fromMeta = $this->companyFromTitle($meta['title']);
                if ($fromMeta) {
                    return $fromMeta;
                }
            }
            $fromTitle = $this->companyFromTitle($roleTitle);
            if ($fromTitle) {
                return $fromTitle;
            }

            $fromText = $this->companyFromText($text);
            if ($fromText) {
                return $fromText;
            }
        }

        return $base;
    }

    private function deriveSummary(string $text, ?string $note, array $meta = []): ?string
    {
        if ($note) {
            return Str::of($this->normaliseSpaces($note))->ascii()->trim()->limit(480);
        }

        $metaDescription = $meta['description'] ?? null;
        if ($metaDescription) {
            return Str::of($this->normaliseSpaces(html_entity_decode($metaDescription, ENT_QUOTES | ENT_HTML5, 'UTF-8')))
                ->ascii()
                ->trim()
                ->limit(480);
        }

        $clean = $this->cleanSummary($text);

        return $clean === '' ? null : Str::of($clean)->ascii()->trim()->limit(480);
    }

    private function deriveCompanyFromHost(?string $host): ?string
    {
        if (! $host) {
            return null;
        }

        $host = preg_replace('/^www\./', '', $host);
        $segments = explode('.', $host);
        $company = $segments[count($segments) - 2] ?? $segments[0];

        return Str::of($company)->replace('-', ' ')->title();
    }

    private function companyFromTitle(?string $title): ?string
    {
        if (! $title) {
            return null;
        }

        $separators = [' - ', ' — ', ' – '];
        foreach ($separators as $separator) {
            if (Str::contains($title, $separator)) {
                $candidate = trim(Str::before($title, $separator));
                if ($candidate !== '') {
                    return Str::title($candidate);
                }
            }
        }

        return null;
    }

    private function companyFromText(string $text): ?string
    {
        $lower = Str::lower($text);
        if (preg_match('/at ([a-z0-9.&\-\s]{2,40})/i', $text, $matches)) {
            $candidate = trim($matches[1]);
            if ($candidate !== '') {
                return Str::title($candidate);
            }
        }

        if (preg_match('/join ([a-z0-9.&\-\s]{2,40})/i', $text, $matches)) {
            $candidate = trim($matches[1]);
            if ($candidate !== '') {
                return Str::title($candidate);
            }
        }

        return null;
    }

    private function isAggregatorHost(string $host): bool
    {
        $aggregators = array_map('strtolower', config('opportunity.ingest.aggregator_hosts', []));

        return in_array(strtolower($host), $aggregators, true);
    }

    private function detectRemote(string $text, ?string $note): bool
    {
        $haystack = Str::lower(($note ?? '') . ' ' . $text);
        $keywords = config('opportunity.ingest.remote_keywords', []);

        foreach ($keywords as $keyword) {
            if (Str::contains($haystack, Str::lower($keyword))) {
                return true;
            }
        }

        if (preg_match('/\bremote\b/', $haystack)) {
            return true;
        }

        return false;
    }

    private function detectAsyncLevel(string $text, bool $isRemote): ?int
    {
        $haystack = Str::lower($text);

        if (Str::contains($haystack, 'async-first') || Str::contains($haystack, 'asynchronous')) {
            return 4;
        }

        if ($isRemote && Str::contains($haystack, ['distributed', 'documentation-first', 'written communication'])) {
            return 3;
        }

        return $isRemote ? 2 : null;
    }

    private function detectDomainTags(string $text): array
    {
        $haystack = Str::lower($text);
        $mapping = config('opportunity.ingest.domain_keyword_map', []);
        $found = [];

        foreach ($mapping as $tag => $keywords) {
            foreach ($keywords as $keyword) {
                if (Str::contains($haystack, Str::lower($keyword))) {
                    $found[] = strtolower($tag);
                    break;
                }
            }
        }

        return array_values(array_unique($found));
    }

    private function cleanSummary(?string $text): string
    {
        if (! $text) {
            return '';
        }

        $normalized = Str::of($this->normaliseSpaces($text))
            ->replaceMatches('/[#\.][a-z0-9_-]+/i', ' ')
            ->replaceMatches('/\{[^}]*\}/', ' ')
            ->replaceMatches('/[^A-Za-z0-9.,%\-\(\)\/\s]/', ' ')
            ->replaceMatches('/\s+/', ' ')
            ->trim();

        $cssStopWords = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'th', 'thead', 'tbody', 'table', 'hover',
            'section', 'span', 'div', 'class', 'id', 'ul', 'ol', 'last-child', 'first-child',
            'nth-child', 'before', 'after'
        ];

        $tokens = collect(explode(' ', (string) $normalized))
            ->filter(function ($token) use ($cssStopWords) {
                $token = trim($token, " ,.;:()[]{}");
                if ($token === '') {
                    return false;
                }

                $lower = strtolower($token);
                if (in_array($lower, $cssStopWords, true)) {
                    return false;
                }

                if (str_contains($lower, 'child') || str_contains($lower, 'hover')) {
                    return false;
                }

                if (strlen($token) <= 2 && ! in_array($lower, ['ai', 'us', 'uk', 'ca', 'eu'], true)) {
                    return false;
                }

                return true;
            })
            ->map(fn ($token) => trim($token, " ,.;:()[]{}"))
            ->filter()
            ->values();

        return Str::of($tokens->take(80)->implode(' '))->ascii()->trim();
    }

    private function normaliseSpaces(string $value): string
    {
        return preg_replace('/(\x{00A0}|\x{200B}|\xC2\xA0)/u', ' ', $value);
    }

    private function uniqueSlug(?string $company, ?string $role): string
    {
        $base = Str::slug(trim(($company ?: 'opportunity') . '-' . ($role ?: Str::random(6))));
        if ($base === '') {
            $base = Str::slug('opportunity-' . Str::random(6));
        }

        $slug = $base;
        $counter = 1;
        while (Opportunity::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
