<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectAsset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class JunkyardWatchdogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Artisan::call('projects:import-junkyard-watchdog', [
            '--path' => resource_path('projects/junkyard-watchdog/blog'),
        ]);

        $project = Project::query()
            ->where('slug', 'junkyard-watchdog')
            ->firstOrFail();

        $assets = [
            [
                'type' => 'image',
                'title' => 'Inventory Screen',
                'caption' => 'Latest inventory for a tracked yard.',
                'url' => 'https://res.cloudinary.com/junkyardwatchdog/image/upload/v1760043518/projects/assets/n0nd1pwv5jd11pa9fkac.png',
                'preview_url' => null,
                'provider' => 'cloudinary',
                'display_order' => 1,
                'is_featured' => true,
            ],
            [
                'type' => 'image',
                'title' => 'Garage',
                'caption' => 'A snapshot of the watchlist garage view.',
                'url' => 'https://res.cloudinary.com/junkyardwatchdog/image/upload/v1760053862/projects/assets/u9fzelydmchdxmvmy6mx.png',
                'preview_url' => null,
                'provider' => 'cloudinary',
                'display_order' => 2,
                'is_featured' => true,
            ],
        ];

        $activeUrls = [];

        foreach ($assets as $assetData) {
            $record = ProjectAsset::updateOrCreate(
                [
                    'project_id' => $project->id,
                    'url' => $assetData['url'],
                ],
                array_merge($assetData, [
                    'project_id' => $project->id,
                ])
            );

            $activeUrls[] = $record->url;
        }

        ProjectAsset::query()
            ->where('project_id', $project->id)
            ->whereNotIn('url', $activeUrls)
            ->delete();
    }
}
