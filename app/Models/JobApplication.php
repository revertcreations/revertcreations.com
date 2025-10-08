<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_QUEUED = 'queued';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_RESPONSE_PENDING = 'response_pending';
    public const STATUS_INTERVIEW = 'interview';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_OFFER = 'offer';

    /**
     * @var array<int, string>
     */
    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_QUEUED,
        self::STATUS_SUBMITTED,
        self::STATUS_RESPONSE_PENDING,
        self::STATUS_INTERVIEW,
        self::STATUS_REJECTED,
        self::STATUS_OFFER,
    ];

    protected $guarded = [];

    protected $casts = [
        'applied_at' => 'datetime',
        'follow_up_at' => 'datetime',
        'automation_payload' => 'array',
    ];

    /**
     * Related opportunity.
     */
    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }
}

