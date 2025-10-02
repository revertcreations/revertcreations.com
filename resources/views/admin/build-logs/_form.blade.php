@csrf

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="block text-sm font-medium mb-1" for="title">Title</label>
        <input id="title" name="title" type="text" value="{{ old('title', $buildLog->title) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
        @error('title')<span class="text-red-400 text-sm">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="logged_at">Logged At</label>
        <input id="logged_at" name="logged_at" type="datetime-local" value="{{ old('logged_at', optional($buildLog->logged_at)->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="phase">Phase</label>
        <input id="phase" name="phase" type="text" value="{{ old('phase', $buildLog->phase) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="category">Category</label>
        <input id="category" name="category" type="text" value="{{ old('category', $buildLog->category) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="description">Description</label>
    <textarea id="description" name="description" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('description', $buildLog->description) }}</textarea>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-6">
    <div>
        <label class="block text-sm font-medium mb-1" for="agent_contribution">Agent Contribution</label>
        <textarea id="agent_contribution" name="agent_contribution" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('agent_contribution', $buildLog->agent_contribution) }}</textarea>
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="review_notes">Review Notes</label>
        <textarea id="review_notes" name="review_notes" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('review_notes', $buildLog->review_notes) }}</textarea>
    </div>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="links">Links (JSON)</label>
    <textarea id="links" name="links" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('links', $buildLog->links ? json_encode($buildLog->links) : null) }}</textarea>
    <p class="text-xs text-gray-400 mt-1">Example: {"loom": "https://...", "figma": "https://..."}</p>
</div>

<div class="mt-6 flex items-center space-x-3">
    <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $buildLog->public_visibility ?? true))>
    <label for="public_visibility" class="text-sm">Visible on public build log</label>
</div>

<div class="mt-8">
    <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded">Save</button>
    <a href="{{ route('admin.build-logs.index') }}" class="ml-3 text-gray-300 hover:underline">Cancel</a>
</div>
