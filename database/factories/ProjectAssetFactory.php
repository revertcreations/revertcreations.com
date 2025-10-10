<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectAsset;
use App\Models\ProjectUpdate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class ProjectAssetFactory extends Factory
{
    protected $model = ProjectAsset::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = Arr::random(['image', 'video', 'document', 'link']);

        return [
            'project_id' => Project::factory(),
            'project_update_id' => null,
            'type' => $type,
            'title' => $this->faker->sentence(4),
            'caption' => $this->faker->sentence(),
            'url' => $type === 'image'
                ? $this->faker->imageUrl(1600, 900, 'tech')
                : $this->faker->url(),
            'preview_url' => $type === 'video'
                ? 'https://img.youtube.com/vi/'.$this->faker->lexify('???????').'/hqdefault.jpg'
                : null,
            'provider' => $type === 'video' ? 'youtube' : 'cloudinary',
            'meta' => [
                'width' => 1600,
                'height' => 900,
            ],
            'display_order' => $this->faker->numberBetween(0, 10),
            'is_featured' => $this->faker->boolean(15),
        ];
    }

    public function forUpdate(ProjectUpdate $update): self
    {
        return $this->state(fn () => [
            'project_id' => $update->project_id,
            'project_update_id' => $update->id,
        ]);
    }
}
