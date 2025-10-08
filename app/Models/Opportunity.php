<?php

namespace App\Models;

use App\Models\JobApplication;
use App\Models\OpportunityIngest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Opportunity extends Model
{
    use HasFactory;

    public const STATUS_OPEN = 'open';
    public const STATUS_NEW = 'open';
    public const STATUS_SHORTLISTED = 'shortlisted';
    public const STATUS_APPLIED = 'applied';
    public const STATUS_ARCHIVED = 'archived';

    /**
     * @var array<int, string>
     */
    public const STATUSES = [
        self::STATUS_OPEN,
        self::STATUS_SHORTLISTED,
        self::STATUS_APPLIED,
        self::STATUS_ARCHIVED,
    ];

    /**
     * Mass assignable columns for quick pipeline updates.
     */
    protected $fillable = [
        'slug',
        'company_name',
        'industry',
        'role_title',
        'status',
        'workflow_state',
        'stage',
        'priority',
        'source',
        'source_channel',
        'public_visibility',
        'is_favorite',
        'archived_at',
        'summary',
        'next_action_at',
        'last_action_at',
        'notes',
        'links',
        'is_remote',
        'async_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'domain_tags',
        'fit_score',
        'source_url',
        'ingest_status',
        'ingest_payload',
        'ingest_raw_content',
        'ingest_errors',
    ];

    protected $casts = [
        'links' => 'array',
        'next_action_at' => 'datetime',
        'last_action_at' => 'datetime',
        'public_visibility' => 'boolean',
        'is_remote' => 'boolean',
        'is_favorite' => 'boolean',
        'domain_tags' => 'array',
        'archived_at' => 'datetime',
        'ingest_payload' => 'array',
        'ingest_errors' => 'array',
    ];

    /**
     * Scope for pipeline sections that can be shown publicly.
     */
    public function scopePublic(Builder $query): Builder
    {
        return $query
            ->where('public_visibility', true)
            ->whereNull('archived_at');
    }

    /**
     * Filter to workflow states appropriate for the public pipeline view.
     */
    public function scopePublicWorkflow(Builder $query): Builder
    {
        $states = array_filter(config('opportunity_pipeline.public_workflow_states', []));

        if (empty($states)) {
            return $query;
        }

        return $query->whereIn('workflow_state', $states);
    }

    /**
     * Default ordering: highest priority first, then most recent activity.
     */
    public function scopePipelineOrder(Builder $query): Builder
    {
        return $query
            ->whereNull('archived_at')
            ->orderByDesc('is_favorite')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByDesc('next_action_at')
            ->orderBy('company_name');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    public function scopeArchived(Builder $query): Builder
    {
        return $query->whereNotNull('archived_at');
    }

    /**
     * Related job applications.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function ingests(): HasMany
    {
        return $this->hasMany(OpportunityIngest::class);
    }
}
