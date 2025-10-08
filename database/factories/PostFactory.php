<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'content' => implode("\n\n", $this->faker->paragraphs(4)),
            'excerpt' => $this->faker->sentences(2, true),
            'published' => $this->faker->boolean(),
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function published(): self
    {
        return $this->state(fn () => [
            'published' => true,
            'published_at' => now(),
        ]);
    }

    public function draft(): self
    {
        return $this->state(fn () => [
            'published' => false,
            'published_at' => now(),
        ]);
    }
}
