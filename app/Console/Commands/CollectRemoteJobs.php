<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Throwable;

class CollectRemoteJobs extends Command
{
    /**
     * Boards that have been reviewed along with their scraping policy.
     *
     * Boards marked as scrapeable expose public feeds or APIs that explicitly
     * allow automated access in robots.txt. Boards that are not scrapeable
     * require partner agreements or block automated access.
     */
    protected array $boardPolicies = [
        'weworkremotely' => [
            'name' => 'We Work Remotely',
            'scrapeable' => true,
            'robots' => 'Allow / (https://weworkremotely.com/robots.txt)',
        ],
        'remoteok' => [
            'name' => 'Remote OK',
            'scrapeable' => true,
            'robots' => 'Allow / with crawl-delay 1 and attribution requirement (https://remoteok.com/robots.txt)',
        ],
        'indeed' => [
            'name' => 'Indeed',
            'scrapeable' => false,
            'robots' => 'Robots served behind Cloudflare challenge; automated access restricted by ToS.',
        ],
        'linkedin' => [
            'name' => 'LinkedIn',
            'scrapeable' => false,
            'robots' => 'Robots explicitly disallow all automated access (https://www.linkedin.com/robots.txt).',
        ],
        'himalayas' => [
            'name' => 'Himalayas',
            'scrapeable' => true,
            'robots' => 'Allow / except /apply (https://himalayas.app/robots.txt).',
        ],
        'justremote' => [
            'name' => 'JustRemote',
            'scrapeable' => false,
            'robots' => 'Allow / with a few disallowed paths (https://justremote.co/robots.txt) but full listings require dynamic rendering.',
        ],
        'workingnomads' => [
            'name' => 'Working Nomads',
            'scrapeable' => false,
            'robots' => 'Allow / (https://www.workingnomads.com/robots.txt) yet no static feed is available.',
        ],
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remote-jobs:collect
        {--keyword=full stack developer : Keyword used to filter results}
        {--boards=* : Restrict to one or more boards (e.g. weworkremotely,remoteok)}
        {--limit=50 : Maximum number of jobs to return after aggregating}
        {--output=remote-jobs/latest.json : Relative path under storage/app for the JSON snapshot}
        {--skip-save : Only print results to the console without writing a file}
        {--persist : Store or refresh listings in the opportunities table}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Collect remote job postings from boards that allow automated access.';

    /**
     * Default HTTP headers applied to outbound requests.
     */
    protected array $httpHeaders = [
        'Accept' => 'application/json,text/xml',
        'User-Agent' => 'RevertCreationsJobScout/1.0 (+https://revertcreations.com)',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $keyword = trim((string) $this->option('keyword'));
        $limit = (int) $this->option('limit');
        $requestedBoards = collect($this->option('boards'))
            ->filter()
            ->map(fn ($board) => Str::of($board)->lower()->trim()->toString())
            ->unique()
            ->values();

        $scrapeableBoards = collect($this->boardPolicies)
            ->filter(fn ($policy) => Arr::get($policy, 'scrapeable') === true);

        $boardsToProcess = $requestedBoards->isEmpty()
            ? $scrapeableBoards->keys()
            : $requestedBoards->reject(function ($board) use ($scrapeableBoards) {
                if (! $scrapeableBoards->has($board)) {
                    $policy = Arr::get($this->boardPolicies, $board);

                    if ($policy && Arr::get($policy, 'scrapeable') === false) {
                        $this->warn(sprintf(
                            'Skipping %s: %s',
                            Arr::get($policy, 'name', ucfirst($board)),
                            Arr::get($policy, 'robots', 'Automated access not permitted.')
                        ));
                    } else {
                        $this->warn("Unknown or unsupported board '{$board}'.");
                    }

                    return true;
                }

                return false;
            })->values();

        if ($boardsToProcess->isEmpty()) {
            $this->info('No scrapeable boards selected. Nothing to do.');

            return self::SUCCESS;
        }

        $this->line('Boards reviewed:');
        $this->table(
            ['Board', 'Scrapeable', 'Robots Summary'],
            collect($this->boardPolicies)->map(function ($policy, $slug) use ($boardsToProcess) {
                return [
                    Arr::get($policy, 'name', ucfirst($slug)),
                    Arr::get($policy, 'scrapeable') ? 'yes' : 'no',
                    Arr::get($policy, 'robots', 'n/a'),
                ];
            })->values()->toArray()
        );

        $jobs = collect();

        foreach ($boardsToProcess as $board) {
            $policy = Arr::get($this->boardPolicies, $board, []);
            $boardName = Arr::get($policy, 'name', ucfirst($board));

            $this->info("Fetching {$boardName} listings...");

            try {
                $jobs = $jobs->merge(
                    $this->fetchBoard(Str::lower($board), $keyword)
                );
            } catch (Throwable $exception) {
                $this->error("Failed to fetch {$boardName}: {$exception->getMessage()}");
            }
        }

        $jobs = $jobs
            ->unique('url')
            ->sortByDesc('posted_at')
            ->values();

        if ($keyword !== '') {
            $jobs = $jobs->filter(function (array $job) use ($keyword) {
                $haystack = Str::lower($job['title'].' '.$job['description'].' '.$job['tags'].' '.$job['company']);

                return Str::contains($haystack, Str::lower($keyword));
            })->values();
        }

        if ($limit > 0) {
            $jobs = $jobs->take($limit)->values();
        }

        $shouldPersist = (bool) $this->option('persist');

        if ($jobs->isEmpty()) {
            $this->warn('No jobs matched the criteria.');
        } else {
            $this->table(
                ['Source', 'Title', 'Company', 'Location', 'Published', 'Apply'],
                $jobs->map(function (array $job) {
                    return [
                        $job['source'],
                        Str::limit($job['title'], 60),
                        Str::limit($job['company'], 40),
                        $job['location'] ?: 'remote',
                        optional($job['posted_at'])->toDateTimeString(),
                        $job['apply_url'],
                    ];
                })->toArray()
            );
        }

        if ($shouldPersist && $jobs->isNotEmpty()) {
            try {
                $persisted = $this->persistJobs($jobs);
                $this->info("Persisted {$persisted->count()} opportunities to the database.");
            } catch (Throwable $throwable) {
                $this->error('Unable to persist opportunities: '.$throwable->getMessage());
            }
        }

        if (! $this->option('skip-save')) {
            $outputPath = Str::of((string) $this->option('output'))
                ->trim('/')
                ->toString() ?: 'remote-jobs/latest.json';

            Storage::disk('local')->put(
                $outputPath,
                json_encode($jobs->map(function (array $job) {
                    $job['posted_at'] = optional($job['posted_at'])->toIso8601String();

                    return $job;
                })->toArray(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            );

            $this->info("Saved snapshot to storage/app/{$outputPath}");
        }

        $this->newLine();
        $this->line('Next steps: review the saved JSON and drive any automated application workflows via board-specific APIs or webhooks where permitted.');

        return self::SUCCESS;
    }

    /**
     * Persist job listings into the opportunities table.
     */
    protected function persistJobs(Collection $jobs): Collection
    {
        $stored = collect();

        foreach ($jobs as $job) {
            $opportunity = Opportunity::firstOrNew([
                'source' => $job['source'],
                'url' => $job['url'],
            ]);

            if (! $opportunity->exists) {
                $opportunity->first_seen_at = Carbon::now();
            }

            $currentMeta = $opportunity->meta;

            if (! is_array($currentMeta)) {
                $currentMeta = [];
            }

            $opportunity->fill([
                'external_id' => $job['external_id'] ?? null,
                'title' => $job['title'],
                'company' => $job['company'],
                'location' => $job['location'],
                'tags' => Str::limit($job['tags'] ?? '', 250),
                'url' => $job['url'],
                'apply_url' => $job['apply_url'] ?? null,
                'description' => $job['description'] ?? null,
                'posted_at' => $job['posted_at'] ?? $opportunity->posted_at,
                'last_seen_at' => Carbon::now(),
                'meta' => array_merge($currentMeta, [
                    'raw' => $job,
                ]),
            ]);

            if ($opportunity->status === null) {
                $opportunity->status = Opportunity::STATUS_NEW;
            }

            $opportunity->save();
            $stored->push($opportunity);
        }

        return $stored;
    }

    /**
     * Fetches job listings for a specific board.
     */
    protected function fetchBoard(string $board, string $keyword): Collection
    {
        return match ($board) {
            'weworkremotely' => $this->fetchWeWorkRemotely($keyword),
            'remoteok' => $this->fetchRemoteOk(),
            'himalayas' => $this->fetchHimalayas($keyword),
            'justremote' => $this->fetchJustRemote($keyword),
            'workingnomads' => $this->fetchWorkingNomads(),
            default => collect(),
        };
    }

    /**
     * Retrieve We Work Remotely programming jobs via the public RSS feed.
     */
    protected function fetchWeWorkRemotely(string $keyword): Collection
    {
        $response = Http::withHeaders($this->httpHeaders)
            ->accept('application/xml')
            ->get('https://weworkremotely.com/categories/remote-programming-jobs.rss');

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }

        $xml = @simplexml_load_string($response->body());

        if ($xml === false) {
            throw new \RuntimeException('Unable to parse RSS feed.');
        }

        $items = Arr::get(json_decode(json_encode($xml), true), 'channel.item', []);

        return collect($items)->map(function (array $item) {
            $title = trim(Arr::get($item, 'title', ''));
            $description = trim(strip_tags(Arr::get($item, 'description', '')));
            $company = trim(Arr::get($item, 'dc:creator', ''));
            $link = Arr::get($item, 'link');

            return [
                'source' => 'We Work Remotely',
                'external_id' => md5($link),
                'title' => $title,
                'company' => $company !== '' ? $company : Str::before($title, ':'),
                'location' => 'Remote',
                'tags' => '',
                'url' => $link,
                'apply_url' => $link,
                'description' => $description,
                'posted_at' => $this->carbonOrNull(Arr::get($item, 'pubDate')),
            ];
        });
    }

    /**
     * Remote OK exposes a JSON API with job listings.
     *
     * Important: Remote OK requires attribution when consuming their API.
     */
    protected function fetchRemoteOk(): Collection
    {
        $response = Http::withHeaders($this->httpHeaders)
            ->acceptJson()
            ->get('https://remoteok.com/api');

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }

        $payload = collect($response->json());

        // First entry contains usage notes; skip it.
        return $payload->skip(1)->map(function (array $item) {
            return [
                'source' => 'Remote OK',
                'external_id' => Arr::get($item, 'id'),
                'title' => Arr::get($item, 'position', ''),
                'company' => Arr::get($item, 'company', ''),
                'location' => Arr::get($item, 'location', 'Remote'),
                'tags' => implode(', ', Arr::get($item, 'tags', [])),
                'url' => Arr::get($item, 'url'),
                'apply_url' => Arr::get($item, 'apply_url', Arr::get($item, 'url')),
                'description' => Str::of(Arr::get($item, 'description', ''))->stripTags()->toString(),
                'posted_at' => $this->carbonOrNull(Arr::get($item, 'date')),
            ];
        });
    }

    /**
     * Himalayas exposes job listings via their sitemap; we filter by keyword.
     */
    protected function fetchHimalayas(string $keyword): Collection
    {
        $response = Http::withHeaders($this->httpHeaders)
            ->accept('*/*')
            ->get('https://himalayas.app/sitemap-jobs.xml.gz');

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }

        $decoded = @gzdecode($response->body());

        if ($decoded === false) {
            throw new \RuntimeException('Unable to decompress sitemap.');
        }

        $xml = @simplexml_load_string($decoded);

        if ($xml === false) {
            throw new \RuntimeException('Unable to parse sitemap.');
        }

        $urls = Arr::get(json_decode(json_encode($xml), true), 'url', []);

        return collect($urls)
            ->sortByDesc(fn (array $entry) => Arr::get($entry, 'lastmod'))
            ->take(200)
            ->map(function (array $entry) {
                $link = Arr::get($entry, 'loc');

                return [
                    'source' => 'Himalayas',
                    'external_id' => md5($link),
                    'title' => Str::headline(Str::afterLast((string) $link, '/')),
                    'company' => '',
                    'location' => 'Remote',
                    'tags' => '',
                    'url' => $link,
                    'apply_url' => $link,
                    'description' => '',
                    'posted_at' => $this->carbonOrNull(Arr::get($entry, 'lastmod')),
                ];
            });
    }

    /**
     * Stub implementation kept for future expansion if a static feed becomes available.
     */
    protected function fetchJustRemote(string $keyword): Collection
    {
        return collect();
    }

    /**
     * Stub for Working Nomads; their public sitemap lists only section pages.
     */
    protected function fetchWorkingNomads(): Collection
    {
        return collect();
    }

    /**
     * Safely convert a timestamp to Carbon.
     */
    protected function carbonOrNull(?string $value): ?Carbon
    {
        if (! $value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (Throwable) {
            return null;
        }
    }
}
