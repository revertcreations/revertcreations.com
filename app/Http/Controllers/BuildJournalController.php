<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\BuildLog;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;

class BuildJournalController extends Controller
{
    protected array $metrics = [];

    public function index()
    {
        $projects = Project::active()
            ->get()
            ->map(function (Project $project) {
                $project->setAttribute('latestLog', BuildLog::public()->forProject($project->slug)->timeline()->first());
                $project->setAttribute('metricsData', $this->metricsFor($project->slug));
                return $project;
            });

        return view('build.index', compact('projects'));
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->active()->firstOrFail();

        $buildLogs = BuildLog::public()
            ->forProject($project->slug)
            ->timeline()
            ->get();

        $activities = Activity::public()
            ->forProject($project->slug)
            ->recent()
            ->take(15)
            ->get();

        $metrics = $this->metricsFor($project->slug);

        return view('build.show', [
            'project' => $project,
            'buildLogs' => $buildLogs,
            'activities' => $activities,
            'metrics' => $metrics,
        ]);
    }

    protected function metricsFor(string $project): array
    {
        if (empty($this->metrics)) {
            if (Storage::disk('local')->exists('journal-metrics.json')) {
                $this->metrics = json_decode(Storage::disk('local')->get('journal-metrics.json'), true) ?? [];
            }
        }

        $metrics = $this->metrics[$project] ?? [];
        $metrics['build_logs'] = BuildLog::public()->forProject($project)->count();

        return $metrics;
    }
}
