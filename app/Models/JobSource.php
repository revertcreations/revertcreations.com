<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSource extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'driver',
        'base_url',
        'enabled',
        'frequency_minutes',
        'last_ran_at',
        'last_status',
        'filters',
        'meta',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'enabled' => 'boolean',
        'frequency_minutes' => 'integer',
        'filters' => 'array',
        'meta' => 'array',
        'last_ran_at' => 'datetime',
    ];

    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }
}
