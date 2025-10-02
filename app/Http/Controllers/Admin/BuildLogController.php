<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuildLog;
use Illuminate\Http\Request;

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
            'agent_contribution' => ['nullable'],
            'review_notes' => ['nullable'],
            'links' => ['nullable'],
            'public_visibility' => ['sometimes', 'boolean'],
        ]);

        $validated['logged_at'] = $validated['logged_at'] ?? now();
        $validated['public_visibility'] = $request->boolean('public_visibility');

        if (!empty($validated['links']) && is_string($validated['links'])) {
            $decoded = json_decode($validated['links'], true);
            $validated['links'] = $decoded ?: null;
        }

        return $validated;
    }
}
