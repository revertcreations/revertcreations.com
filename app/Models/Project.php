<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const STATUS_PLANNING = 'planning';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_LAUNCHED = 'launched';
    public const STATUS_MAINTENANCE = 'maintenance';
    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'slug',
        'name',
        'tagline',
        'summary',
        'body',
        'status',
        'hero_image_url',
        'hero_video_url',
        'primary_link_label',
        'primary_link_url',
        'links',
        'tech_stack',
        'display_order',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'links' => 'array',
        'tech_stack' => 'array',
        'display_order' => 'integer',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (Project $project) {
            if ($project->isDirty('name') && blank($project->slug)) {
                $project->slug = $project->generateUniqueSlug($project->name);
            }
        });
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class)->orderByDesc('published_at')->orderByDesc('created_at');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(ProjectAsset::class)->orderBy('display_order');
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    private function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: Str::random(8);
        $slug = $base;
        $counter = 1;

        while (
            static::where('slug', $slug)
                ->when($this->exists, fn ($query) => $query->where('id', '!=', $this->id))
                ->withTrashed()
                ->exists()
        ) {
            $slug = Str::slug($base.'-'.$counter);
            $counter++;
        }

        return $slug;
    }
}
