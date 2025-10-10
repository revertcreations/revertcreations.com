<?php
namespace App\Http\Controllers;

use App\Http\Requests\ProjectAssetRequest;
use App\Models\Project;
use App\Models\ProjectAsset;
use App\Models\ProjectUpdate;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AdminProjectAssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): View
    {
        $projectId = request('project');

        $assets = ProjectAsset::with(['project', 'projectUpdate'])
            ->when($projectId, fn ($query) => $query->where('project_id', $projectId))
            ->orderBy('project_id')
            ->orderBy('display_order')
            ->paginate(25);

        $projects = Project::orderBy('name')->get(['id', 'name']);

        return view('admin.project-assets.index', compact('assets', 'projects', 'projectId'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('admin.project-assets.create', [
            'asset' => new ProjectAsset([
                'type' => 'image',
                'display_order' => 0,
                'is_featured' => false,
                'project_id' => request('project'),
            ]),
            'projects' => $this->projectsWithUpdates(),
            'types' => $this->typeOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectAssetRequest $request): RedirectResponse
    {
        $asset = ProjectAsset::create($this->transformData($request));

        return redirect()
            ->route('admin.project-assets.edit', $asset)
            ->with('status', 'Asset created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectAsset $projectAsset): RedirectResponse
    {
        return redirect()->route('admin.project-assets.edit', $projectAsset);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectAsset $projectAsset): View
    {
        return view('admin.project-assets.edit', [
            'asset' => $projectAsset,
            'projects' => $this->projectsWithUpdates(),
            'types' => $this->typeOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectAssetRequest $request, ProjectAsset $projectAsset): RedirectResponse
    {
        $projectAsset->update($this->transformData($request, $projectAsset));

        return redirect()
            ->route('admin.project-assets.edit', $projectAsset)
            ->with('status', 'Asset saved.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectAsset $projectAsset): RedirectResponse
    {
        $projectAsset->delete();

        return redirect()
            ->route('admin.project-assets.index')
            ->with('status', 'Asset archived.');
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'max:5120'],
        ]);

        if (blank(config('cloudinary.cloud_url'))) {
            return response()->json([
                'message' => 'Cloudinary is not configured. Set CLOUDINARY_URL or related env vars.',
            ], 422);
        }

        try {
            $upload = $request->file('image')->storeOnCloudinary('projects/assets');

            return response()->json([
                'url' => $upload->getSecurePath(),
                'preview_url' => $upload->getSecurePath(),
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to upload project asset to Cloudinary', [
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to upload asset.',
            ], 422);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projectsWithUpdates(): array
    {
        return Project::query()
            ->orderBy('name')
            ->with(['updates:id,project_id,title'])
            ->get(['id', 'name'])
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'updates' => $project->updates
                    ->map(fn (ProjectUpdate $update) => [
                        'id' => $update->id,
                        'title' => $update->title,
                    ])
                    ->all(),
            ])
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private function typeOptions(): array
    {
        return [
            'image' => 'Image',
            'video' => 'Video',
            'document' => 'Document',
            'link' => 'Link',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformData(ProjectAssetRequest $request, ?ProjectAsset $asset = null): array
    {
        $data = $request->validated();
        $data['is_featured'] = $request->boolean('is_featured');
        $data['display_order'] = $data['display_order'] ?? 0;

        if (empty($data['project_update_id'])) {
            $data['project_update_id'] = null;
        } else {
            $update = ProjectUpdate::query()
                ->where('id', $data['project_update_id'])
                ->where('project_id', $data['project_id'])
                ->first();

            if (!$update) {
                $data['project_update_id'] = null;
            }
        }

        return $data;
    }
}
