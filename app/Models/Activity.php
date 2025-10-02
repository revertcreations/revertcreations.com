<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'occurred_at',
        'category',
        'project',
        'headline',
        'body',
        'link',
        'tags',
        'public_visibility',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'tags' => 'array',
        'public_visibility' => 'boolean',
    ];

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('public_visibility', true);
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderByDesc('occurred_at');
    }

    public function scopeForProject(Builder $query, string $project): Builder
    {
        return $query->where('project', $project);
    }
}
