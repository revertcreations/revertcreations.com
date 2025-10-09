<?php

namespace App\Services\JobSources\Drivers;

use App\DataTransferObjects\JobListingData;
use App\Models\JobSource;
use App\Services\JobSources\Contracts\JobFeed;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class RemotiveJobFeed implements JobFeed
{
    public function collect(JobSource $source): Collection
    {
        $response = Http::withHeaders([
            'User-Agent' => 'revertcreations-job-ingestor/1.0 (+https://revertcreations.com)',
            'Accept' => 'application/json',
        ])->get($source->base_url ?: 'https://remotive.com/api/remote-jobs');

        if ($response->failed()) {
            return collect();
        }

        $payload = $response->json();

        $jobs = $payload['jobs'] ?? [];

        return collect($jobs)
            ->filter(fn ($item) => isset($item['id'], $item['url']))
            ->map(function (array $item) {
                $salaryMin = null;
                $salaryMax = null;

                if (!empty($item['salary'])) {
                    preg_match_all('/(\d[\d,]*)/u', $item['salary'], $matches);
                    if (!empty($matches[1])) {
                        $numbers = array_map(static fn ($value) => (int) str_replace(',', '', $value), $matches[1]);
                        $salaryMin = $numbers[0] ?? null;
                        $salaryMax = $numbers[count($numbers) - 1] ?? $salaryMin;
                    }
                }

                $summary = isset($item['description'])
                    ? Str::limit(trim(strip_tags($item['description'])), 500)
                    : null;

                return JobListingData::make([
                    'external_id' => (string) $item['id'],
                    'title' => $item['title'] ?? 'Remotive Job',
                    'company' => $item['company_name'] ?? null,
                    'location' => $item['candidate_required_location'] ?? null,
                    'is_remote' => true,
                    'employment_type' => $item['job_type'] ?? null,
                    'source_url' => $item['url'],
                    'apply_url' => $item['url'],
                    'currency' => null,
                    'salary_min' => $salaryMin,
                    'salary_max' => $salaryMax,
                    'summary' => $summary,
                    'description' => $item['description'] ?? null,
                    'tags' => $item['tags'] ?? [],
                    'posted_at' => $item['publication_date'] ?? null,
                ]);
            });
    }
}
