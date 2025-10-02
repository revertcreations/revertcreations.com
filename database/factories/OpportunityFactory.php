<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Opportunity>
 */
class OpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $company = $this->faker->company();
        $role = $this->faker->randomElement([
            'AI Product Engineer',
            'Agent Orchestrator',
            'Head of AI Enablement',
            'Principal Product Engineer',
        ]);

        $workflowStates = array_keys(config('opportunity_pipeline.workflow_states', []));
        if (empty($workflowStates)) {
            $workflowStates = ['sourced', 'researching', 'outreach', 'interviewing', 'offer'];
        }

        return [
            'slug' => Str::slug($company . '-' . $role . '-' . $this->faker->unique()->randomNumber()),
            'company_name' => $company,
            'industry' => $this->faker->randomElement([
                'Healthcare AI',
                'Fintech',
                'Productivity SaaS',
                'Developer Tools',
                'Applied Research',
            ]),
            'role_title' => $role,
            'status' => $this->faker->randomElement(['open', 'in_progress', 'closed', 'offer', 'paused']),
            'workflow_state' => $this->faker->randomElement($workflowStates),
            'stage' => $this->faker->randomElement([
                'Applied',
                'Intro Scheduled',
                'Case Study Sent',
                'Interview Loop',
                'Offer Review',
            ]),
            'priority' => $this->faker->randomElement(['high', 'medium', 'low']),
            'source' => $this->faker->randomElement(['agent-scraped', 'newsletter', 'referral', 'manual']),
            'source_channel' => $this->faker->randomElement([
                'LinkedIn automation',
                'Himalayas RSS',
                'Founder intro',
                'Inbound email',
            ]),
            'public_visibility' => $this->faker->boolean(80),
            'archived_at' => $this->faker->boolean(10) ? now()->subDays($this->faker->numberBetween(1, 30)) : null,
            'summary' => $this->faker->sentences(3, true),
            'next_action_at' => now()->addDays($this->faker->numberBetween(-3, 7)),
            'last_action_at' => now()->subDays($this->faker->numberBetween(0, 10)),
            'notes' => $this->faker->paragraph(),
            'links' => [
                'jd' => $this->faker->url(),
                'company' => $this->faker->url(),
            ],
            'is_remote' => $this->faker->boolean(90),
            'async_level' => $this->faker->numberBetween(1, 5),
            'salary_min' => $this->faker->numberBetween(80000, 160000),
            'salary_max' => $this->faker->numberBetween(160000, 220000),
            'salary_currency' => 'USD',
            'domain_tags' => $this->faker->randomElements([
                'photography', 'videography', 'music', 'bmx', 'skateboarding', 'snowboard', 'mountain biking', 'media', 'creative', 'robotics'
            ], $this->faker->numberBetween(1, 3)),
            'fit_score' => $this->faker->numberBetween(0, 10),
        ];
    }
}
