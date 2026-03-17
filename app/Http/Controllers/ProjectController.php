<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class ProjectController extends Controller
{
    public function index(Request $request): View
    {
        $canPreview = $this->canPreview($request);

        $projects = Project::query()
            ->when(! $canPreview, fn ($query) => $query->whereNotNull('published_at'))
            ->orderBy('display_order')
            ->orderByDesc('published_at')
            ->withCount([
                'updates as published_updates_count' => fn ($query) => $query->published(),
            ])
            ->get();

        return view('projects.index', compact('projects', 'canPreview'));
    }

    public function show(Request $request, Project $project): View
    {
        $canPreview = $this->canPreview($request);

        if (! $canPreview && ! $project->published_at) {
            abort(404);
        }

        $project->load([
            'assets' => fn ($query) => $query->orderBy('display_order'),
        ]);

        $meta = [
            'title' => $project->name,
            'description' => $project->summary ?? $project->tagline,
            'image' => $project->hero_image_url,
        ];

        return view('projects.show', compact('project', 'meta'));
    }

    private function canPreview(Request $request): bool
    {
        return App::environment('local', 'staging') && $request->boolean('preview');
    }
}
