<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectAsset extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'project_update_id',
        'type',
        'title',
        'caption',
        'url',
        'preview_url',
        'provider',
        'meta',
        'display_order',
        'is_featured',
    ];

    protected $casts = [
        'meta' => 'array',
        'display_order' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function projectUpdate(): BelongsTo
    {
        return $this->belongsTo(ProjectUpdate::class, 'project_update_id');
    }
}
