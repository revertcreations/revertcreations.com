<?php

namespace App\Services\JobSources\Drivers;

use App\DataTransferObjects\JobListingData;
use App\Models\JobSource;
use App\Services\JobSources\Contracts\JobFeed;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class RemoteOkJobFeed implements JobFeed
{
    public function collect(JobSource $source): Collection
    {
        $response = Http::withHeaders([
            'User-Agent' => 'revertcreations-job-ingestor/1.0 (+https://revertcreations.com)',
            'Accept' => 'application/json',
        ])->get($source->base_url ?: 'https://remoteok.com/api');

        if ($response->failed()) {
            return collect();
        }

        $payload = $response->json();

        return collect($payload)
            ->filter(fn ($item) => is_array($item) && isset($item['id'], $item['url']))
            ->map(function (array $item) {
                $summary = isset($item['description'])
                    ? Str::limit(trim(strip_tags($item['description'])), 500)
                    : null;

                return JobListingData::make([
                    'external_id' => (string) $item['id'],
                    'title' => $item['position'] ?? $item['title'] ?? 'Remote OK Job',
                    'company' => $item['company'] ?? null,
                    'location' => $item['location'] ?? null,
                    'is_remote' => true,
                    'employment_type' => $item['employment_type'] ?? null,
                    'source_url' => $item['url'],
                    'apply_url' => $item['apply_url'] ?? ($item['url'] ?? null),
                    'currency' => $item['currency'] ?? null,
                    'salary_min' => isset($item['salary_min']) ? (int) preg_replace('/\D/', '', (string) $item['salary_min']) : null,
                    'salary_max' => isset($item['salary_max']) ? (int) preg_replace('/\D/', '', (string) $item['salary_max']) : null,
                    'summary' => $summary,
                    'description' => $item['description'] ?? null,
                    'tags' => $item['tags'] ?? [],
                    'posted_at' => $item['date'] ?? null,
                ]);
            });
    }
}
