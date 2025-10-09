<?php

namespace App\Services\JobSources\Drivers;

use App\DataTransferObjects\JobListingData;
use App\Models\JobSource;
use App\Services\JobSources\Contracts\JobFeed;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class RssJobFeed implements JobFeed
{
    public function collect(JobSource $source): Collection
    {
        if (blank($source->base_url)) {
            return collect();
        }

        $response = Http::withHeaders([
            'User-Agent' => 'revertcreations-job-ingestor/1.0 (+https://revertcreations.com)',
            'Accept' => 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
        ])->get($source->base_url);

        if ($response->failed()) {
            return collect();
        }

        try {
            $xml = simplexml_load_string($response->body());
        } catch (Throwable) {
            return collect();
        }

        if (!$xml) {
            return collect();
        }

        $items = collect($xml->channel->item ?? $xml->item ?? []);

        return $items->map(function ($item, $index) use ($source) {
            $guid = (string) ($item->guid ?? null);
            $link = (string) ($item->link ?? null);
            $title = trim((string) ($item->title ?? 'Remote Job'));
            $description = (string) ($item->description ?? null);
            $summary = $description ? Str::limit(trim(strip_tags($description)), 500) : null;
            $categories = collect($item->category ?? [])->map(fn ($category) => trim((string) $category))->filter()->values()->all();

            return JobListingData::make([
                'external_id' => $guid ?: md5($link ?: $title.$index),
                'title' => $title,
                'company' => (string) ($item->source ?? null),
                'location' => null,
                'is_remote' => true,
                'employment_type' => null,
                'source_url' => $link ?: $source->base_url,
                'apply_url' => $link ?: null,
                'currency' => null,
                'salary_min' => null,
                'salary_max' => null,
                'summary' => $summary,
                'description' => $description,
                'tags' => $categories,
                'posted_at' => (string) ($item->pubDate ?? null),
            ]);
        });
    }
}
