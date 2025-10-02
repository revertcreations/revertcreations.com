<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    use HasFactory;

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
}
