<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuildLog;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class BuildLogController extends Controller
{
    public function index()
    {
        $buildLogs = BuildLog::orderByDesc('logged_at')->paginate(30);

        return view('admin.build-logs.index', compact('buildLogs'));
    }

    public function create()
    {
        return view('admin.build-logs.create', [
            'buildLog' => new BuildLog(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateBuildLog($request);

        if ($request->hasFile('image')) {
            $data = array_merge($data, $this->uploadImageFromRequest($request));
        }

        BuildLog::create($data);

        return redirect()->route('admin.build-logs.index')->with('status', 'Build log entry created.');
    }

    public function show(BuildLog $buildLog)
    {
        return view('admin.build-logs.show', compact('buildLog'));
    }

    public function edit(BuildLog $buildLog)
    {
        return view('admin.build-logs.edit', compact('buildLog'));
    }

    public function update(Request $request, BuildLog $buildLog)
    {
        $data = $this->validateBuildLog($request);

        if ($request->boolean('remove_image')) {
            $data['image_url'] = null;
            $data['image_public_id'] = null;
        }

        if ($request->hasFile('image')) {
            $data = array_merge($data, $this->uploadImageFromRequest($request));
        }

        $buildLog->update($data);

        return redirect()->route('admin.build-logs.index')->with('status', 'Build log entry updated.');
    }

    public function destroy(BuildLog $buildLog)
    {
        $buildLog->delete();

        return redirect()->route('admin.build-logs.index')->with('status', 'Build log entry removed.');
    }

    private function validateBuildLog(Request $request): array
    {
        $validated = $request->validate([
            'logged_at' => ['nullable', 'date'],
            'phase' => ['nullable', 'max:120'],
            'category' => ['nullable', 'max:120'],
            'title' => ['required', 'max:255'],
            'description' => ['nullable'],
            'image' => ['nullable', 'image', 'max:5120'],
            'agent_contribution' => ['nullable'],
            'review_notes' => ['nullable'],
            'links' => ['nullable'],
            'public_visibility' => ['sometimes', 'boolean'],
            'remove_image' => ['sometimes', 'boolean'],
        ]);

        $validated['logged_at'] = $validated['logged_at'] ?? now();
        $validated['public_visibility'] = $request->boolean('public_visibility');

        $validated = Arr::except($validated, ['image', 'remove_image']);

        if (!empty($validated['links']) && is_string($validated['links'])) {
            $decoded = json_decode($validated['links'], true);
            $validated['links'] = $decoded ?: null;
        }

        return $validated;
    }

    private function uploadImageFromRequest(Request $request): array
    {
        if (empty(config('cloudinary.cloud_url'))) {
            throw ValidationException::withMessages([
                'image' => 'Cloudinary is not configured. Add CLOUDINARY_URL to the environment before uploading images.',
            ]);
        }

        try {
            $upload = $request->file('image')->storeOnCloudinary('build-logs');
        } catch (\Throwable $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'image' => 'We couldn’t upload the image right now. Please try again.',
            ]);
        }

        return [
            'image_url' => $upload->getSecurePath(),
            'image_public_id' => $upload->getPublicId(),
        ];
    }
}
