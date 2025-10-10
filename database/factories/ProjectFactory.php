<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->sentence(3);
        $status = Arr::random([
            Project::STATUS_PLANNING,
            Project::STATUS_IN_PROGRESS,
            Project::STATUS_LAUNCHED,
            Project::STATUS_MAINTENANCE,
        ]);

        $publishedAt = $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-1 year', 'now') : null;

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'tagline' => $this->faker->catchPhrase(),
            'summary' => $this->faker->paragraph(),
            'body' => implode("\n\n", $this->faker->paragraphs(4)),
            'status' => $status,
            'hero_image_url' => $this->faker->imageUrl(1600, 900, 'tech'),
            'hero_video_url' => null,
            'primary_link_label' => 'View project',
            'primary_link_url' => $this->faker->url(),
            'links' => [
                ['label' => 'GitHub', 'url' => $this->faker->url()],
                ['label' => 'Landing Page', 'url' => $this->faker->url()],
            ],
            'tech_stack' => $this->faker->randomElements([
                'Laravel', 'Livewire', 'Vue', 'Tailwind', 'PostgreSQL', 'Redis',
                'Expo', 'React Native', 'AWS', 'Cloudinary',
            ], $this->faker->numberBetween(3, 5)),
            'display_order' => $this->faker->numberBetween(0, 10),
            'is_featured' => $this->faker->boolean(20),
            'published_at' => $publishedAt,
        ];
    }
}
