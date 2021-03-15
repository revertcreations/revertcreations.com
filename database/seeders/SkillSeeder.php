<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds
     *
     * @return void
     */
    public function run()
    {
        $skills = collect([
            ['name' => 'CSS', 'experience' => 88],
            ['name' => 'HTML', 'experience' => 98],
            ['name' => 'Javascript', 'experience' => 91],
            ['name' => 'PHP', 'experience' => 96],
            ['name' => 'Linux', 'experience' => 87],
            ['name' => 'Laravel', 'experience' => 78],
            ['name' => 'CodeIgniter', 'experience' => 79],
            ['name' => 'Docker', 'experience' => 86],
            ['name' => 'Kubernetes', 'experience' => 84],
            ['name' => 'Digital Ocean', 'experience' => 93],
            ['name' => 'DNS', 'experience' => 81],
            ['name' => 'Redis', 'experience' => 88],
            ['name' => 'SQL', 'experience' => 87],
            ['name' => 'JSON', 'experience' => 94],
            ['name' => 'tailwindcss', 'experience' => 61],
            ['name' => 'Vim', 'experience' => 85],
            ['name' => 'Bash', 'experience' => 74],
            ['name' => 'Heroku', 'experience' => 63],
            ['name' => 'NodeJS', 'experience' => 68],
            ['name' => 'GoLang', 'experience' => 28],
            ['name' => 'Python', 'experience' => 31],
            ['name' => 'riot.js.org', 'experience' => 85],
            ['name' => 'NGINX', 'experience' => 84],
            ['name' => 'APACHE', 'experience' => 62],
            ['name' => 'Git', 'experience' => 94],
            ['name' => 'Vue', 'experience' => 36],
            ['name' => 'React', 'experience' => 55],
            ['name' => 'Bootstrap', 'experience' => 41],
            ['name' => 'JQuery', 'experience' => 76],
            ['name' => 'npm', 'experience' => 86],
            ['name' => 'webpack', 'experience' => 55],
            ['name' => 'Cloudinary', 'experience' => 73],
            ['name' => 'Photoshop', 'experience' => 94],
            ['name' => 'Illustrator', 'experience' => 89],
            ['name' => 'Lightroom', 'experience' => 93]
        ]);

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
