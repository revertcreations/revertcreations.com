<?php

namespace Database\Seeders;

use App\Models\JobSource;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class JobSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = [
            [
                'name' => 'Remote OK',
                'slug' => 'remote-ok',
                'driver' => 'remote_ok',
                'base_url' => 'https://remoteok.com/api',
                'frequency_minutes' => 30,
                'filters' => [
                    'keywords' => ['php', 'laravel', 'full stack', 'javascript'],
                ],
            ],
            [
                'name' => 'We Work Remotely',
                'slug' => 'we-work-remotely',
                'driver' => 'we_work_remotely',
                'base_url' => 'https://weworkremotely.com/remote-jobs.rss',
                'filters' => [
                    'keywords' => ['full stack', 'laravel', 'vue', 'javascript'],
                ],
            ],
            [
                'name' => 'Remote Jobs',
                'slug' => 'remotejobs-io',
                'driver' => 'remotejobs_io',
                'base_url' => 'https://remotejobs.io/remote-programming-jobs.rss',
            ],
            [
                'name' => 'FlexJobs',
                'slug' => 'flexjobs',
                'driver' => 'flexjobs',
                'base_url' => 'https://www.flexjobs.com/jobs/rss',
            ],
            [
                'name' => 'NoDesk',
                'slug' => 'nodesk',
                'driver' => 'nodesk',
                'base_url' => 'https://nodesk.co/resources/rss/jobs/',
            ],
            [
                'name' => 'Working Nomads',
                'slug' => 'working-nomads',
                'driver' => 'working_nomads',
                'base_url' => 'https://www.workingnomads.com/jobs.rss',
            ],
            [
                'name' => 'Remote.com',
                'slug' => 'remote-com',
                'driver' => 'remote_com',
                'base_url' => 'https://remote.com/jobs/rss',
            ],
            [
                'name' => 'Jobspresso',
                'slug' => 'jobspresso',
                'driver' => 'jobspresso',
                'base_url' => 'https://jobspresso.co/remote-work/feed/',
            ],
            [
                'name' => 'Remotive',
                'slug' => 'remotive',
                'driver' => 'remotive',
                'base_url' => 'https://remotive.com/api/remote-jobs',
            ],
            [
                'name' => 'Indeed',
                'slug' => 'indeed',
                'driver' => 'indeed',
                'base_url' => 'https://www.indeed.com/jobs',
                'enabled' => false,
            ],
        ];

        foreach ($sources as $source) {
            JobSource::updateOrCreate(
                ['slug' => $source['slug']],
                Arr::except($source, ['slug'])
            );
        }
    }
}
