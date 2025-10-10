<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class JobListing extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const STATUS_NEW = 'new';
    public const STATUS_INTERESTED = 'interested';
    public const STATUS_APPLIED = 'applied';
    public const STATUS_INTERVIEWING = 'interviewing';
    public const STATUS_DENIED = 'denied';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_ARCHIVED = 'archived';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'job_source_id',
        'external_id',
        'title',
        'company',
        'location',
        'is_remote',
        'employment_type',
        'source_url',
        'apply_url',
        'currency',
        'salary_min',
        'salary_max',
        'match_score',
        'summary',
        'description',
        'tags',
        'posted_at',
        'collected_at',
        'applied_at',
        'status',
        'notes',
        'is_archived',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_remote' => 'boolean',
        'salary_min' => 'integer',
        'salary_max' => 'integer',
        'match_score' => 'decimal:2',
        'tags' => 'array',
        'posted_at' => 'datetime',
        'collected_at' => 'datetime',
        'applied_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    public function jobSource(): BelongsTo
    {
        return $this->belongsTo(JobSource::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    public function tagCollection(): Collection
    {
        return collect($this->tags ?? [])
            ->map(fn ($tag) => trim((string) $tag))
            ->filter()
            ->unique()
            ->values();
    }

    public function topTags(int $limit = 5): Collection
    {
        return $this->tagCollection()->take($limit);
    }

    public function primarySkill(): ?string
    {
        $tags = $this->tagCollection();
        if ($tags->isNotEmpty()) {
            return (string) $tags->first();
        }

        $haystack = Str::lower(($this->summary ?? '').' '.($this->description ?? ''));

        foreach ($this->skillKeywords() as $keyword => $label) {
            if (Str::contains($haystack, $keyword)) {
                return $label;
            }
        }

        return null;
    }

    public function inferredIndustry(): ?string
    {
        $tags = $this->tagCollection()->map(fn ($tag) => Str::lower($tag));
        $haystack = Str::lower(($this->summary ?? '').' '.($this->description ?? ''));

        foreach ($this->industryKeywords() as $label => $keywords) {
            foreach ($keywords as $keyword) {
                if ($tags->contains(fn ($tag) => Str::contains($tag, $keyword)) ||
                    Str::contains($haystack, $keyword)
                ) {
                    return $label;
                }
            }
        }

        return null;
    }

    public function displayLocation(): string
    {
        $location = $this->location ? trim($this->location) : null;

        if ($this->is_remote && $location) {
            return $location.' · Remote OK';
        }

        if ($this->is_remote) {
            return 'Remote';
        }

        return $location ?: 'Location TBD';
    }

    protected function skillKeywords(): array
    {
        return [
            'laravel' => 'Laravel',
            'symfony' => 'PHP / Symfony',
            'php' => 'PHP',
            'javascript' => 'JavaScript',
            'typescript' => 'TypeScript',
            'react' => 'React',
            'vue' => 'Vue.js',
            'node' => 'Node.js',
            'python' => 'Python',
            'django' => 'Python / Django',
            'flask' => 'Python / Flask',
            'ruby' => 'Ruby',
            'rails' => 'Ruby on Rails',
            'golang' => 'Go',
            'go ' => 'Go',
            'java' => 'Java',
            'kotlin' => 'Kotlin',
            'swift' => 'Swift',
            'android' => 'Android',
            'ios' => 'iOS',
            'aws' => 'AWS',
            'azure' => 'Azure',
            'gcp' => 'Google Cloud',
            'devops' => 'DevOps',
            'ml' => 'Machine Learning',
            'machine learning' => 'Machine Learning',
            'ai' => 'AI / ML',
        ];
    }

    protected function industryKeywords(): array
    {
        return [
            'Fintech' => ['fintech', 'bank', 'finance', 'trading', 'crypto', 'blockchain', 'capital markets'],
            'Healthcare' => ['health', 'healthcare', 'medical', 'clinical', 'biotech', 'pharma'],
            'E-commerce / Retail' => ['ecommerce', 'e-commerce', 'retail', 'shopify', 'marketplace'],
            'SaaS / B2B' => ['saas', 'b2b', 'enterprise', 'workflow', 'productivity'],
            'AI / Data' => ['ai', 'machine learning', 'ml', 'data science', 'analytics'],
            'Climate / Energy' => ['climate', 'energy', 'sustainability', 'solar', 'carbon'],
            'Gaming / Media' => ['gaming', 'game', 'media', 'streaming', 'content'],
            'Government / Civic' => ['government', 'civic', 'public sector'],
            'Education' => ['education', 'edtech', 'student', 'learning'],
        ];
    }
}
