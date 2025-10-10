<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class AdminProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        $projects = Project::orderBy('display_order')
            ->orderByDesc('published_at')
            ->paginate(15);

        return view('admin.projects.index', compact('projects'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        $project = new Project([
            'status' => Project::STATUS_PLANNING,
            'display_order' => 0,
            'is_featured' => false,
            'links' => [],
            'tech_stack' => [],
        ]);

        return view('admin.projects.create', [
            'project' => $project,
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request): RedirectResponse
    {
        $project = Project::create($this->transformData($request));

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Project created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): RedirectResponse
    {
        return redirect()->route('projects.edit', $project);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): View
    {
        return view('admin.projects.edit', [
            'project' => $project,
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($this->transformData($request, $project));

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Project updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()
            ->route('projects.index')
            ->with('status', 'Project archived.');
    }

    /**
     * @return array<string, string>
     */
    private function statusOptions(): array
    {
        return [
            Project::STATUS_PLANNING => 'Planning',
            Project::STATUS_IN_PROGRESS => 'In Progress',
            Project::STATUS_LAUNCHED => 'Launched',
            Project::STATUS_MAINTENANCE => 'Maintenance',
            Project::STATUS_ARCHIVED => 'Archived',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformData(ProjectRequest $request, ?Project $project = null): array
    {
        $data = $request->validated();

        $data['is_featured'] = $request->boolean('is_featured');
        $data['display_order'] = $data['display_order'] ?? 0;

        $data['links'] = $this->parseLinks(Arr::get($data, 'links'));
        $data['tech_stack'] = $this->parseTechStack(Arr::get($data, 'tech_stack'));

        if (!empty($data['published_at'])) {
            $data['published_at'] = Carbon::parse($data['published_at']);
        }

        return $data;
    }

    /**
     * @param string|null $linksInput
     * @return array<int, array<string, string>>
     */
    private function parseLinks(?string $linksInput): array
    {
        return collect(preg_split("/\r\n|\n|\r/", (string) $linksInput))
            ->map(fn ($line) => trim($line))
            ->filter()
            ->map(function (string $line) {
                [$label, $url] = array_pad(explode('|', $line, 2), 2, null);

                return [
                    'label' => trim((string) $label),
                    'url' => trim((string) $url),
                ];
            })
            ->filter(fn ($link) => filled($link['label']) && filled($link['url']))
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function parseTechStack(?string $input): array
    {
        return collect(explode(',', (string) $input))
            ->map(fn ($item) => trim($item))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
