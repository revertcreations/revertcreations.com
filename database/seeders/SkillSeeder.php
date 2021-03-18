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
            ['name' => 'README.md', 'experience' => 100, 'excerpt' => "Over the past 7+ years, 5 of which spent building ticketing software with the great people at <span class='text-hmt-green underline font-bold text-xl'>HoldMyTicket</span>, I've gained a lot of confidence in many technologies, languages, and software. These are the tools that help me effenciently build complex, interactive, responsive, and secure web applications. Some of these I am just now learning, and others I've been hacking with for years."],
            ['name' => 'hire me', 'experience' => 101, 'excerpt' => "Whoa, really? You're in need a some web development work? If so, I'm very excited to out more about this..."],
            ['name' => 'reset();', 'experience' => 102, 'excerpt' => "refreshing!"],
            ['name' => 'CSS', 'experience' => 91, 'excerpt' => "The first time I interacted with CSS was back in the 7th grade. I took a beginner course at my middle school. Considering I was born in the late 80's, and lived out in the middle of nowhere New Mexico, this was a fairly unique opportunity. I remember most of the home work was learning HTML, and writing markup over and over. While bored writing div's p's and a's, I browsed around for some cool menus I've been seeing on the internet. I found a few examples, and spent the rest of the time building my own drop down menu with CSS. Don't think I ever actually finished the home work, and probably passed with a C. But I learned more than anyone in that class, no doubt. Needless to say, I'm pretty comfortable with CSS."],
            ['name' => 'HTML', 'experience' => 98, 'excerpt' => "Well here it is, the sharpest tool in the tool box. Now, this isn't due to an enormous amount of time spent digging into through depths of the W3C's stadards for the standard web markup language, but nearly 20 years spent interacting with this fairly simplistic markup. Perhaps Photoshop has been in the tool bag for the longest, however the depths of Photoshop prove to be humbling."],
            ['name' => 'Javascript', 'experience' => 91, 'excerpt' => "I really enjoy Javascript. I've spent more effort deep diving Javascript than any other programming language I know. Fasinated by its effeciency, and versitility, many hours of Kyle Simpson's, aka getify, videos, books, and tweets have been consumed. "],
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
            ['name' => 'GitHub', 'experience' => 85, 'excerpt' => "Well, the best way for me to show you my GitHub experience is with my profile page. Shake me up and down to open my GitHub profile in new tab."],
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
