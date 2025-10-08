<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Opportunity extends Model
{
    use HasFactory;

    public const STATUS_NEW = 'new';
    public const STATUS_SHORTLISTED = 'shortlisted';
    public const STATUS_APPLIED = 'applied';
    public const STATUS_ARCHIVED = 'archived';

    /**
     * @var array<int, string>
     */
    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_SHORTLISTED,
        self::STATUS_APPLIED,
        self::STATUS_ARCHIVED,
    ];

    protected $guarded = [];

    protected $casts = [
        'posted_at' => 'datetime',
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'meta' => 'array',
    ];

    /**
     * Related job applications.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Scope for opportunities considered active.
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_ARCHIVED]);
    }
}

