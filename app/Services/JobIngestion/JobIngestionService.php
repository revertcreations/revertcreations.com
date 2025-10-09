<?php

namespace App\Services\JobIngestion;

use App\DataTransferObjects\JobListingData;
use App\Models\JobListing;
use App\Models\JobSource;
use App\Models\Skill;
use App\Services\JobSources\JobFeedManager;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class JobIngestionService
{
    private const ARCHIVE_THRESHOLD = 15;

    private ?Collection $skillKeywords = null;
    /**
     * Technologies Trever is strongest in for extra weighting.
     *
     * @var array<int, string>
     */
    private array $preferredTechnologies = [
        'php',
        'laravel',
        'livewire',
        'javascript',
        'typescript',
        'vue',
        'react',
        'inertia',
        'tailwind',
        'mysql',
        'docker',
        'aws',
    ];

    /**
     * Simple geo keywords that indicate US-based opportunities.
     *
     * @var array<int, string>
     */
    private array $priorityLocations = [
        'united states',
        'u.s.',
        'u.s.a',
        'usa',
        'us-only',
        'us only',
        'north america',
        'remote - us',
        'remote usa',
    ];

    public function __construct(
        private readonly JobFeedManager $feedManager
    ) {
    }

    public function ingest(JobSource $source): array
    {
        $created = 0;
        $updated = 0;

        try {
            $results = $this->feedManager->collect($source);
        } catch (Throwable $exception) {
            Log::error('Job feed manager failed', [
                'source_id' => $source->id,
                'driver' => $source->driver,
                'message' => $exception->getMessage(),
            ]);

            return compact('created', 'updated');
        }

        /** @var JobListingData $item */
        foreach ($results as $item) {
            $matchScore = $this->calculateMatchScore($item, $source);
            $shouldArchive = $matchScore < self::ARCHIVE_THRESHOLD;

            $payload = array_merge(
                $item->toArray(),
                [
                    'match_score' => $matchScore,
                    'is_archived' => $shouldArchive,
                ]
            );

            $attributes = [
                'job_source_id' => $source->id,
                'external_id' => $item->externalId ?: md5($item->sourceUrl),
            ];

            /** @var JobListing|null $existing */
            $existing = JobListing::query()
                ->where('job_source_id', $attributes['job_source_id'])
                ->where('external_id', $attributes['external_id'])
                ->first();

            if ($existing) {
                $existing->fill($payload);

                if ($existing->isDirty()) {
                    // Do not overwrite manual status changes.
                    $existing->save();
                    $updated++;
                }

                continue;
            }

            JobListing::create(array_merge(
                $attributes,
                $payload,
                ['status' => JobListing::STATUS_NEW]
            ));
            $created++;
        }

        return compact('created', 'updated');
    }

    private function calculateMatchScore(JobListingData $item, JobSource $source): float
    {
        $searchText = Str::lower(
            implode(' ', array_filter([
                $item->title,
                $item->summary,
                $item->description,
                implode(' ', $item->tags),
            ]))
        );

        $keywords = $this->skillKeywords();

        if ($searchText === '') {
            return 0.0;
        }

        $possibleWeight = $keywords->sum('weight');
        $score = 0.0;

        foreach ($keywords as $keyword) {
            if (Str::contains($searchText, $keyword['keyword'])) {
                $score += $keyword['weight'];
            }
        }

        if ($item->isRemote) {
            $score += 5;
            $possibleWeight += 5;
        }

        $locationBonusApplied = false;
        $location = Str::lower((string) $item->location);
        foreach ($this->priorityLocations as $priorityLocation) {
            if ($location !== '' && Str::contains($location, $priorityLocation)) {
                $score += 10;
                $possibleWeight += 10;
                $locationBonusApplied = true;
                break;
            }
        }

        $techBonus = 0;
        foreach ($this->preferredTechnologies as $technology) {
            $possibleWeight += 4;
            if (Str::contains($searchText, $technology)) {
                $score += 4;
                $techBonus += 4;
            }
        }

        // Encourage postings that explicitly mention remote US-based even when location blank.
        if (!$locationBonusApplied && Str::contains($searchText, 'us based')) {
            $score += 6;
            $possibleWeight += 6;
        }

        $filters = collect($source->filters ?? []);
        $keywords = collect($filters->get('keywords', []))
            ->map(fn ($keyword) => Str::lower((string) $keyword))
            ->filter()
            ->values();

        foreach ($keywords as $keyword) {
            $possibleWeight += 2;
            if (Str::contains($searchText, $keyword)) {
                $score += 2;
            }
        }

        $score = $possibleWeight > 0 ? ($score / $possibleWeight) * 100 : 0;

        return round(min($score, 100), 2);
    }

    private function skillKeywords(): Collection
    {
        if ($this->skillKeywords === null) {
            $this->skillKeywords = $this->loadSkillKeywords();
        }

        return $this->skillKeywords;
    }

    private function loadSkillKeywords(): Collection
    {
        try {
            return Skill::query()
                ->select(['name', 'experience'])
                ->get()
                ->map(function (Skill $skill) {
                    $keyword = Str::lower($skill->name);
                    $weight = max(((int) $skill->experience ?: 1), 1);

                    return [
                        'keyword' => $keyword,
                        'weight' => $weight,
                    ];
                });
        } catch (Throwable $exception) {
            Log::warning('Unable to load skills for job ingestion.', [
                'message' => $exception->getMessage(),
            ]);

            return collect();
        }
    }
}
