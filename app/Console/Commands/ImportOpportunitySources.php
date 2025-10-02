<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportOpportunitySources extends Command
{
    protected $signature = 'opportunity:import {--path= : Path to a directory or file containing JSON opportunities}';

    protected $description = 'Import opportunity leads from JSON files into the pipeline.';

    public function handle(): int
    {
        $path = $this->option('path') ?: resource_path('opportunities');

        if (! File::exists($path)) {
            $this->error("Path {$path} does not exist.");
            return self::FAILURE;
        }

        $files = File::isDirectory($path) ? File::files($path) : [new \SplFileInfo($path)];

        $total = 0;
        $fitFloor = (int) config('opportunity_prefs.fit_score_floor', 0);
        $hiddenBelowFloor = 0;
        $skippedArchived = 0;
        $workflowIgnore = config('opportunity_pipeline.ignore_on_import', []);

        foreach ($files as $file) {
            if ($file->getExtension() !== 'json') {
                continue;
            }

            $this->info("Processing {$file->getFilename()}...");

            $entries = json_decode(File::get($file->getPathname()), true);

            if (! is_array($entries)) {
                $this->warn('  Skipped (invalid JSON)');
                continue;
            }

            foreach ($entries as $item) {
                if (! is_array($item)) {
                    continue;
                }

                $total++;

                $slug = Arr::get($item, 'slug') ?: Str::slug(Arr::get($item, 'company', 'unknown') . '-' . Arr::get($item, 'role'));
                $existing = Opportunity::where('slug', $slug)->first();

                if ($existing && ($existing->archived_at || in_array($existing->workflow_state, $workflowIgnore, true) || in_array(strtolower($existing->status), $workflowIgnore, true))) {
                    $skippedArchived++;
                    continue;
                }

                $domainTags = Arr::get($item, 'domain_tags');
                if (is_string($domainTags)) {
                    $domainTags = array_filter(array_map('trim', explode(',', $domainTags)));
                }

                $attributes = [
                    'company_name' => Arr::get($item, 'company'),
                    'industry' => Arr::get($item, 'industry'),
                    'role_title' => Arr::get($item, 'role'),
                    'status' => Arr::get($item, 'status', 'open'),
                    'workflow_state' => Arr::get($item, 'workflow_state', optional($existing)->workflow_state ?? 'sourced'),
                    'stage' => Arr::get($item, 'stage'),
                    'priority' => Arr::get($item, 'priority', 'medium'),
                    'source' => Arr::get($item, 'source', 'manual'),
                    'source_channel' => Arr::get($item, 'source_channel'),
                    'summary' => Arr::get($item, 'summary'),
                    'next_action_at' => Arr::get($item, 'next_action_at'),
                    'last_action_at' => Arr::get($item, 'last_action_at', optional($existing)->last_action_at),
                    'notes' => Arr::get($item, 'notes'),
                    'links' => Arr::get($item, 'links'),
                    'is_remote' => (bool) Arr::get($item, 'is_remote', false),
                    'async_level' => Arr::get($item, 'async_level'),
                    'salary_min' => Arr::get($item, 'salary_min'),
                    'salary_max' => Arr::get($item, 'salary_max'),
                    'salary_currency' => Arr::get($item, 'salary_currency', 'USD'),
                    'domain_tags' => $domainTags,
                ];

                if (! $attributes['last_action_at'] && ! $existing) {
                    $attributes['last_action_at'] = now();
                }

                $score = $this->score($attributes);
                $attributes['fit_score'] = $score;

                $desiredVisibility = Arr::has($item, 'public_visibility')
                    ? (bool) Arr::get($item, 'public_visibility')
                    : true;

                if ($score < $fitFloor) {
                    $hiddenBelowFloor++;
                    $attributes['public_visibility'] = false;
                } else {
                    $attributes['public_visibility'] = $desiredVisibility;
                }

                if (!empty($attributes['domain_tags']) && is_array($attributes['domain_tags'])) {
                    $attributes['domain_tags'] = array_values(array_unique(array_map('strtolower', $attributes['domain_tags'])));
                }

                Opportunity::updateOrCreate(
                    ['slug' => $slug],
                    $attributes
                );
            }
        }

        if ($hiddenBelowFloor > 0) {
            $this->info("Hidden {$hiddenBelowFloor} opportunities below fit score floor of {$fitFloor}.");
        }

        if ($skippedArchived > 0) {
            $this->info("Skipped {$skippedArchived} archived or closed opportunities.");
        }

        $this->info("Imported/updated {$total} opportunities.");

        return self::SUCCESS;
    }

    protected function score(array $payload): int
    {
        $score = 0;

        if ($payload['is_remote'] ?? false) {
            $score += 2;
        }

        $async = $payload['async_level'] ?? 0;
        if ($async >= 4) {
            $score += 2;
        } elseif ($async >= 2) {
            $score += 1;
        }

        $prefs = config('opportunity_prefs');
        $salaryMin = $payload['salary_min'] ?? 0;
        $currency = strtoupper($payload['salary_currency'] ?? 'USD');
        if ($currency === strtoupper($prefs['salary_currency']) && $salaryMin >= ($prefs['minimum_salary'] ?? 0)) {
            $score += 3;
        }

        $domainTags = collect($payload['domain_tags'] ?? [])->map(fn ($tag) => strtolower($tag));
        $preferred = collect($prefs['preferred_domains'] ?? []);
        $matches = $preferred->intersect($domainTags)->count();
        $score += min(3, $matches * 2);

        return min(10, $score);
    }
}
