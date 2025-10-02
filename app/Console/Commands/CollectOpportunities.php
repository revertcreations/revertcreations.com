<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CollectOpportunities extends Command
{
    protected $signature = 'opportunity:collect {--store=} {--no-import}';

    protected $description = 'Collect remote opportunities from configured sources and import them into the pipeline.';

    public function handle(): int
    {
        $sources = [
            'remotive' => fn () => $this->fromRemotive(),
            'remoteok' => fn () => $this->fromRemoteOk(),
            'weworkremotely' => fn () => $this->fromRss('weworkremotely'),
            'larajobs' => fn () => $this->fromRss('larajobs'),
        ];

        $leads = [];

        foreach ($sources as $key => $resolver) {
            $config = config("opportunity_sources.{$key}.enabled", false);
            if (! $config) {
                continue;
            }

            try {
                $results = $resolver();
                $count = count($results);
                $this->info("{$key}: collected {$count} leads");
                $leads = array_merge($leads, $results);
            } catch (\Throwable $e) {
                $this->warn("{$key}: {$e->getMessage()}");
            }
        }

        if (empty($leads)) {
            $this->warn('No leads collected.');
            return self::SUCCESS;
        }

        [$leads, $stats] = $this->filterLeads($leads);

        $this->info(sprintf(
            'Filtering results → kept %d, skipped %d (non-remote), skipped %d (role mismatch)',
            $stats['kept'],
            $stats['remoteRejected'],
            $stats['roleRejected']
        ));

        if ($stats['kept'] === 0) {
            $this->warn('No leads met the preference filters.');
            return self::SUCCESS;
        }

        $storePath = $this->option('store')
            ?: storage_path('app/opportunities/opportunities-' . now()->format('Ymd-His') . '.json');

        $relativePath = Str::after($storePath, storage_path('app') . DIRECTORY_SEPARATOR);
        Storage::disk('local')->makeDirectory('opportunities');
        Storage::disk('local')->put($relativePath, json_encode($leads, JSON_PRETTY_PRINT));

        $this->info("Stored leads at {$storePath}");

        if (! $this->option('no-import')) {
            $this->call('opportunity:import', ['--path' => $storePath]);
            $this->call('opportunity:score');
        }

        return self::SUCCESS;
    }

    protected function filterLeads(array $leads): array
    {
        $include = collect(config('opportunity_sources.role_includes', []))->map(fn ($value) => strtolower($value));
        $exclude = collect(config('opportunity_sources.role_excludes', []))->map(fn ($value) => strtolower($value));

        $remoteRejected = 0;
        $roleRejected = 0;
        $kept = [];

        foreach ($leads as $lead) {
            $title = strtolower($lead['role'] ?? '');
            $summary = strtolower($lead['summary'] ?? '');

            $isRemote = $lead['is_remote'] ?? null;
            if ($isRemote !== true) {
                $isRemote = $this->detectRemote([
                    Arr::get($lead, 'location'),
                    $lead['role'] ?? null,
                    $lead['summary'] ?? null,
                    Arr::get($lead, 'links.posting'),
                ]);
            }

            if (! $isRemote) {
                $remoteRejected++;
                continue;
            }

            $lead['is_remote'] = true;

            if ($exclude->contains(fn ($bad) => str_contains($title, $bad) || str_contains($summary, $bad))) {
                $roleRejected++;
                continue;
            }

            if ($include->isNotEmpty() && ! $include->contains(fn ($good) => str_contains($title, $good) || str_contains($summary, $good))) {
                $roleRejected++;
                continue;
            }

            $kept[] = $lead;
        }

        return [$kept, [
            'remoteRejected' => $remoteRejected,
            'roleRejected' => $roleRejected,
            'kept' => count($kept),
        ]];
    }

    protected function fromRemotive(): array
    {
        $config = config('opportunity_sources.remotive');
        $params = $config['params'] ?? [];
        $searchTerms = collect($config['search_terms'] ?? [])->filter();

        $requests = $searchTerms->isEmpty()
            ? collect([null])
            : $searchTerms;

        $jobs = collect();

        foreach ($requests as $term) {
            $query = $term === null
                ? $params
                : array_merge($params, ['search' => $term]);

            $response = Http::timeout(10)->get($config['endpoint'], $query);

            if (! $response->successful()) {
                throw new \RuntimeException('Remotive request failed');
            }

            $jobs = $jobs->merge($response->json('jobs', []));
        }

        $jobs = $jobs
            ->unique(fn ($job) => Arr::get($job, 'id') ?? Arr::get($job, 'url'))
            ->values();

        return collect($jobs)
            ->map(function ($job) {
                $location = Arr::get($job, 'candidate_required_location', Arr::get($job, 'location', ''));
                $isRemote = $this->detectRemote([
                    $location,
                    Arr::get($job, 'job_type'),
                    Arr::get($job, 'title'),
                ]);

                $domainTags = $this->deriveDomainTags(
                    Arr::get($job, 'title', ''),
                    Arr::get($job, 'company_name', '')
                );

                return [
                    'company' => Arr::get($job, 'company_name'),
                    'role' => Arr::get($job, 'title'),
                    'industry' => Arr::get($job, 'category'),
                    'location' => $location,
                    'status' => 'open',
                    'stage' => 'Identified',
                    'priority' => 'high',
                    'source' => 'remotive',
                    'source_channel' => Arr::get($job, 'url'),
                    'summary' => Str::limit(strip_tags(Arr::get($job, 'description', '')), 220),
                    'links' => [
                        'posting' => Arr::get($job, 'url'),
                        'company' => Arr::get($job, 'company_url') ?: Arr::get($job, 'candidate_required_location'),
                    ],
                    'is_remote' => $isRemote,
                    'async_level' => $this->guessAsyncLevel(Arr::get($job, 'description', '')),
                    'salary_min' => Arr::get($job, 'salary_min'),
                    'salary_max' => Arr::get($job, 'salary_max'),
                    'salary_currency' => Arr::get($job, 'salary_currency', 'USD'),
                    'domain_tags' => $domainTags,
                ];
            })
            ->values()
            ->all();
    }

    protected function fromRemoteOk(): array
    {
        $config = config('opportunity_sources.remoteok');
        $response = Http::timeout(10)->get($config['endpoint']);

        if (! $response->successful()) {
            throw new \RuntimeException('RemoteOK request failed');
        }

        $jobs = $response->json();
        if (! is_array($jobs)) {
            return [];
        }

        return collect($jobs)
            ->skip(1) // first row contains meta
            ->filter(fn ($job) => Arr::get($job, 'position'))
            ->map(function ($job) {
                $isRemote = $this->detectRemote([
                    Arr::get($job, 'location'),
                    Arr::get($job, 'tags', []),
                    Arr::get($job, 'description'),
                ]);

                $domainTags = $this->deriveDomainTags(
                    Arr::get($job, 'position', ''),
                    Arr::get($job, 'company', '')
                );

                return [
                    'company' => Arr::get($job, 'company'),
                    'role' => Arr::get($job, 'position'),
                    'industry' => Arr::get($job, 'tags') ? implode(', ', Arr::get($job, 'tags')) : null,
                    'location' => Arr::get($job, 'location'),
                    'status' => 'open',
                    'stage' => 'Identified',
                    'priority' => 'medium',
                    'source' => 'remoteok',
                    'source_channel' => Arr::get($job, 'url'),
                    'summary' => Str::limit(strip_tags(Arr::get($job, 'description', '')), 220),
                    'links' => [
                        'posting' => Arr::get($job, 'url'),
                    ],
                    'is_remote' => $isRemote,
                    'async_level' => $this->guessAsyncLevel(Arr::get($job, 'description', '')), 
                    'salary_min' => Arr::get($job, 'salary_min'),
                    'salary_max' => Arr::get($job, 'salary_max'),
                    'salary_currency' => Arr::get($job, 'salary_currency', 'USD'),
                    'domain_tags' => $domainTags,
                ];
            })
            ->values()
            ->all();
    }

    protected function fromRss(string $key): array
    {
        $endpoint = config("opportunity_sources.{$key}.endpoint");
        $response = Http::timeout(10)->get($endpoint);

        if (! $response->successful()) {
            throw new \RuntimeException("{$key} request failed");
        }

        $xml = @simplexml_load_string($response->body());
        if (! $xml) {
            return [];
        }

        $items = $xml->channel->item ?? [];

        return collect($items)
            ->map(function ($item) use ($key) {
                $title = (string) $item->title;
                $company = (string) ($item->children('http://purl.org/dc/elements/1.1/')->creator ?? '');
                $link = (string) $item->link;
                $description = (string) $item->description;
                $domainTags = $this->deriveDomainTags($title, $company);

                $assumeRemote = (bool) config("opportunity_sources.{$key}.assume_remote", false);
                $isRemote = $this->detectRemote([
                    $title,
                    $description,
                    $company,
                ]) || $assumeRemote;

                return [
                    'company' => $company ?: ucfirst($key),
                    'role' => $title,
                    'industry' => ucfirst($key),
                    'status' => 'open',
                    'stage' => 'Identified',
                    'priority' => 'medium',
                    'source' => $key,
                    'source_channel' => $link,
                    'summary' => Str::limit(strip_tags($description), 220),
                    'links' => [
                        'posting' => $link,
                    ],
                    'is_remote' => $isRemote,
                    'async_level' => $this->guessAsyncLevel($description),
                    'salary_min' => null,
                    'salary_max' => null,
                    'salary_currency' => 'USD',
                    'domain_tags' => $domainTags,
                ];
            })
            ->values()
            ->all();
    }

    protected function detectRemote($segments): bool
    {
        $keywords = collect(config('opportunity_sources.keywords.remote', []))
            ->map(fn ($keyword) => strtolower($keyword));

        $haystack = collect(Arr::wrap($segments))
            ->flatten()
            ->filter()
            ->implode(' ');

        if ($haystack === '') {
            return false;
        }

        $haystack = strtolower($haystack);

        return $keywords->contains(fn ($keyword) => Str::contains($haystack, $keyword));
    }

    protected function deriveDomainTags(string $title, string $company): array
    {
        $keywords = config('opportunity_sources.keywords.domain', []);
        $toolKeywords = config('opportunity_sources.tool_keywords', []);
        $haystack = strtolower($title . ' ' . $company);

        $tags = collect($keywords)
            ->filter(fn ($terms) => collect($terms)->contains(fn ($term) => Str::contains($haystack, strtolower($term))))
            ->keys()
            ->values()
            ->all();

        foreach ($toolKeywords as $tool) {
            if (Str::contains($haystack, strtolower($tool))) {
                $tags[] = 'tools';
                break;
            }
        }

        return array_values(array_unique($tags));
    }

    protected function guessAsyncLevel(string $description): int
    {
        $keywords = config('opportunity_sources.keywords.async', []);
        $haystack = strtolower($description);

        foreach ($keywords as $term) {
            if (Str::contains($haystack, strtolower($term))) {
                return 4;
            }
        }

        return 2; // default assumption for remote roles
    }
}
