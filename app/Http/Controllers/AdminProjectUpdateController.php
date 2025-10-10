<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class AdminProjectUpdateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        $projectId = request('project');

        $updates = ProjectUpdate::with('project')
            ->when($projectId, fn ($query) => $query->where('project_id', $projectId))
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(20);

        $projects = Project::orderBy('name')->get(['id', 'name']);

        return view('admin.project-updates.index', compact('updates', 'projects', 'projectId'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);

        $update = new ProjectUpdate([
            'status' => 'draft',
            'project_id' => request('project'),
            'is_pinned' => false,
        ]);

        return view('admin.project-updates.create', [
            'update' => $update,
            'projects' => $projects,
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectUpdateRequest $request): RedirectResponse
    {
        $update = ProjectUpdate::create($this->transformData($request));

        return redirect()
            ->route('project-updates.edit', $update)
            ->with('status', 'Project update created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectUpdate $projectUpdate): RedirectResponse
    {
        return redirect()->route('project-updates.edit', $projectUpdate);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectUpdate $projectUpdate): View
    {
        $projects = Project::orderBy('name')->get(['id', 'name']);

        return view('admin.project-updates.edit', [
            'update' => $projectUpdate,
            'projects' => $projects,
            'statuses' => $this->statusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectUpdateRequest $request, ProjectUpdate $projectUpdate): RedirectResponse
    {
        $projectUpdate->update($this->transformData($request, $projectUpdate));

        return redirect()
            ->route('project-updates.edit', $projectUpdate)
            ->with('status', 'Project update saved.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectUpdate $projectUpdate): RedirectResponse
    {
        $projectUpdate->delete();

        return redirect()
            ->route('project-updates.index')
            ->with('status', 'Project update archived.');
    }

    /**
     * @return array<string, string>
     */
    private function statusOptions(): array
    {
        return [
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformData(ProjectUpdateRequest $request, ?ProjectUpdate $update = null): array
    {
        $data = $request->validated();

        $data['is_pinned'] = $request->boolean('is_pinned');

        if (!empty($data['body'])) {
            $data['rendered_body'] = Str::markdown($data['body']);
        }

        if (($data['status'] ?? null) !== 'published') {
            $data['published_at'] = null;
        } elseif (!empty($data['published_at'])) {
            $data['published_at'] = Carbon::parse($data['published_at']);
        } elseif ($update && $update->published_at) {
            $data['published_at'] = $update->published_at;
        } else {
            $data['published_at'] = now();
        }

        return $data;
    }
}
