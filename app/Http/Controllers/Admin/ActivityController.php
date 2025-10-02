<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::orderByDesc('occurred_at')->paginate(30);

        return view('admin.activities.index', compact('activities'));
    }

    public function create()
    {
        return view('admin.activities.create', [
            'activity' => new Activity(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateActivity($request);
        Activity::create($data);

        return redirect()->route('admin.activities.index')->with('status', 'Activity logged.');
    }

    public function show(Activity $activity)
    {
        return view('admin.activities.show', compact('activity'));
    }

    public function edit(Activity $activity)
    {
        return view('admin.activities.edit', compact('activity'));
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $this->validateActivity($request);
        $activity->update($data);

        return redirect()->route('admin.activities.index')->with('status', 'Activity updated.');
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return redirect()->route('admin.activities.index')->with('status', 'Activity removed.');
    }

    private function validateActivity(Request $request): array
    {
        $validated = $request->validate([
            'occurred_at' => ['nullable', 'date'],
            'category' => ['nullable', 'max:120'],
            'headline' => ['required', 'max:255'],
            'body' => ['nullable'],
            'link' => ['nullable', 'url'],
            'tags' => ['nullable', 'string'],
            'public_visibility' => ['sometimes', 'boolean'],
        ]);

        $validated['occurred_at'] = $validated['occurred_at'] ?? now();
        $validated['public_visibility'] = $request->boolean('public_visibility');

        if (!empty($validated['tags'])) {
            $validated['tags'] = collect(explode(',', $validated['tags']))
                ->map(fn ($tag) => trim($tag))
                ->filter()
                ->values()
                ->all();
        } else {
            $validated['tags'] = null;
        }

        return $validated;
    }
}
