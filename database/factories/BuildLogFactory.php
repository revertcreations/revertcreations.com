<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BuildLog>
 */
class BuildLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $phases = ['Discovery', 'Strategy', 'Build', 'QA', 'Launch'];

        return [
            'logged_at' => now()->subHours($this->faker->numberBetween(0, 168)),
            'phase' => $this->faker->randomElement($phases),
            'category' => $this->faker->randomElement(['research', 'architecture', 'delivery', 'retro']),
            'title' => $this->faker->sentence(6),
            'description' => $this->faker->paragraph(),
            'image_url' => null,
            'image_public_id' => null,
            'agent_contribution' => $this->faker->boolean(70) ? $this->faker->sentences(2, true) : null,
            'review_notes' => $this->faker->boolean(65) ? $this->faker->sentences(2, true) : null,
            'links' => $this->faker->boolean(50) ? [
                'artifact' => $this->faker->url(),
            ] : null,
            'public_visibility' => $this->faker->boolean(85),
        ];
    }
}
