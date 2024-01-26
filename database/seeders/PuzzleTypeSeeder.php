<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PuzzleType;

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
            ['name' => 'designer', 'path' => 'home']
        ]);

        foreach ($puzzle_types as $puzzle_type) {
            PuzzleType::create($puzzle_type);
        }
    }
}
