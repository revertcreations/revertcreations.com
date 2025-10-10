<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ProjectUpdateFactory extends Factory
{
    protected $model = ProjectUpdate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $status = Arr::random(['draft', 'published', 'archived']);
        $publishedAt = $status === 'published'
            ? $this->faker->dateTimeBetween('-6 months', 'now')
            : null;

        return [
            'project_id' => Project::factory(),
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(100, 999),
            'title' => $title,
            'excerpt' => $this->faker->paragraph(),
            'body' => implode("\n\n", [
                '## Update',
                $this->faker->paragraph(),
                '### Highlights',
                '- '.$this->faker->sentence(),
                '- '.$this->faker->sentence(),
            ]),
            'rendered_body' => null,
            'status' => $status,
            'is_pinned' => $this->faker->boolean(10),
            'author' => $this->faker->name(),
            'meta' => ['source' => 'factory'],
            'published_at' => $publishedAt,
        ];
    }
}
