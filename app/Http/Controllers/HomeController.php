<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\BuildLog;
use App\Models\Opportunity;
use App\Models\Project;
use App\Models\SiteStatus;

class HomeController extends Controller
{
    public function index()
    {
        $visibleOpportunities = Opportunity::public()->pipelineOrder()->take(6)->get();
        $recentActivities = Activity::public()->recent()->take(8)->get();
        $recentBuildLogs = BuildLog::public()->timeline()->take(5)->get();

        $siteStatus = SiteStatus::latest('updated_at')->first();
        $metrics = [
            'availability' => $siteStatus?->availability ?? 'Availability coming soon',
            'current_focus' => $siteStatus?->current_focus ?? 'Project updates coming soon',
            'next_in_queue' => $siteStatus?->next_in_queue ?? 'Next initiative coming soon',
            'last_update' => optional($recentActivities->first())->occurred_at?->diffForHumans() ?? 'just getting started',
        ];

        $featureProject = Project::featured()->first() ?? Project::active()->first();

        return view('home', [
            'pipeline' => $visibleOpportunities,
            'activities' => $recentActivities,
            'buildLogs' => $recentBuildLogs,
            'metrics' => $metrics,
            'featureProject' => $featureProject,
        ]);
    }
}
