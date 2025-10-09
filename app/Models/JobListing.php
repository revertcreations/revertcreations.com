<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
