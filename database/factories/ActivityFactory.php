<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['build', 'design', 'ops', 'qa', 'launch'];

        return [
            'occurred_at' => now()->subHours($this->faker->numberBetween(0, 96)),
            'category' => $this->faker->randomElement($categories),
            'headline' => $this->faker->sentence(6),
            'body' => $this->faker->sentences(2, true),
            'link' => $this->faker->boolean(40) ? $this->faker->url() : null,
            'tags' => $this->faker->randomElements([
                'design',
                'agent',
                'review',
                'release',
                'prompt',
                'ux',
                'ops',
            ], $this->faker->numberBetween(1, 3)),
            'public_visibility' => $this->faker->boolean(85),
        ];
    }
}
