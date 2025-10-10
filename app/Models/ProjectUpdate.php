<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ProjectUpdate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'slug',
        'title',
        'excerpt',
        'body',
        'rendered_body',
        'status',
        'is_pinned',
        'author',
        'meta',
        'published_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (ProjectUpdate $update) {
            if ($update->isDirty('title') && blank($update->slug)) {
                $update->slug = $update->generateUniqueSlug($update->title);
            }
        });
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(ProjectAsset::class)->orderBy('display_order');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    private function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $counter = 1;

        while (
            static::where('project_id', $this->project_id)
                ->where('slug', $slug)
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
