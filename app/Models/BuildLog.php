<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'logged_at',
        'phase',
        'category',
        'project',
        'title',
        'description',
        'agent_contribution',
        'review_notes',
        'links',
        'public_visibility',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
        'links' => 'array',
        'public_visibility' => 'boolean',
    ];

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('public_visibility', true);
    }

    public function scopeTimeline(Builder $query): Builder
    {
        return $query->orderByDesc('logged_at');
    }

    public function scopeForProject(Builder $query, string $project): Builder
    {
        return $query->where('project', $project);
    }
}
