<?php

namespace App\DataTransferObjects;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class JobListingData
{
    public function __construct(
        public readonly ?string $externalId,
        public readonly string $title,
        public readonly ?string $company,
        public readonly ?string $location,
        public readonly bool $isRemote,
        public readonly ?string $employmentType,
        public readonly string $sourceUrl,
        public readonly ?string $applyUrl,
        public readonly ?string $currency,
        public readonly ?int $salaryMin,
        public readonly ?int $salaryMax,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly array $tags,
        public readonly ?CarbonInterface $postedAt,
        public readonly CarbonInterface $collectedAt
    ) {
    }

    public static function make(array $payload): self
    {
        return new self(
            externalId: $payload['external_id'] ?? null,
            title: $payload['title'],
            company: $payload['company'] ?? null,
            location: isset($payload['location']) ? Str::limit((string) $payload['location'], 255, '') : null,
            isRemote: (bool) ($payload['is_remote'] ?? true),
            employmentType: $payload['employment_type'] ?? null,
            sourceUrl: $payload['source_url'],
            applyUrl: $payload['apply_url'] ?? null,
            currency: $payload['currency'] ?? null,
            salaryMin: isset($payload['salary_min']) ? (int) $payload['salary_min'] : null,
            salaryMax: isset($payload['salary_max']) ? (int) $payload['salary_max'] : null,
            summary: $payload['summary'] ?? null,
            description: $payload['description'] ?? null,
            tags: array_values(array_filter($payload['tags'] ?? [])),
            postedAt: isset($payload['posted_at']) ? Carbon::parse($payload['posted_at']) : null,
            collectedAt: isset($payload['collected_at']) ? Carbon::parse($payload['collected_at']) : Carbon::now(),
        );
    }

    public function toArray(): array
    {
        return [
            'external_id' => $this->externalId,
            'title' => $this->title,
            'company' => $this->company,
            'location' => $this->location,
            'is_remote' => $this->isRemote,
            'employment_type' => $this->employmentType,
            'source_url' => $this->sourceUrl,
            'apply_url' => $this->applyUrl,
            'currency' => $this->currency,
            'salary_min' => $this->salaryMin,
            'salary_max' => $this->salaryMax,
            'summary' => $this->summary,
            'description' => $this->description,
            'tags' => $this->tags,
            'posted_at' => $this->postedAt,
            'collected_at' => $this->collectedAt,
        ];
    }
}
