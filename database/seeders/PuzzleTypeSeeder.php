<?php

namespace Database\Seeders;

use App\Models\PuzzleType;
use Illuminate\Database\Seeder;

class PuzzleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $puzzle_types = collect([
            ['name' => 'analytics_treasure', 'path' => 'home'],
            ['name' => 'developer', 'path' => 'home'],
            ['name' => 'designer', 'path' => 'home'],
        ]);

        foreach ($puzzle_types as $puzzle_type) {
            PuzzleType::create($puzzle_type);
        }
    }
}
