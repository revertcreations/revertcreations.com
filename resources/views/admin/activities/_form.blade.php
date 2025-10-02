@csrf

<div class="grid md:grid-cols-2 gap-6">
    <div>
        <label class="block text-sm font-medium mb-1" for="headline">Headline</label>
        <input id="headline" name="headline" type="text" value="{{ old('headline', $activity->headline) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
        @error('headline')<span class="text-red-400 text-sm">{{ $message }}</span>@enderror
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="occurred_at">Occurred At</label>
        <input id="occurred_at" name="occurred_at" type="datetime-local" value="{{ old('occurred_at', optional($activity->occurred_at)->format('Y-m-d\TH:i')) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>

    <div>
        <label class="block text-sm font-medium mb-1" for="category">Category</label>
        <input id="category" name="category" type="text" value="{{ old('category', $activity->category) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
    </div>
    <div>
        <label class="block text-sm font-medium mb-1" for="link">Link</label>
        <input id="link" name="link" type="url" value="{{ old('link', $activity->link) }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
        @error('link')<span class="text-red-400 text-sm">{{ $message }}</span>@enderror
    </div>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="body">Body</label>
    <textarea id="body" name="body" rows="3" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">{{ old('body', $activity->body) }}</textarea>
</div>

<div class="mt-6">
    <label class="block text-sm font-medium mb-1" for="tags">Tags (comma separated)</label>
    <input id="tags" name="tags" type="text" value="{{ old('tags', $activity->tags ? implode(', ', $activity->tags) : '') }}" class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
</div>

<div class="mt-6 flex items-center space-x-3">
    <input id="public_visibility" name="public_visibility" type="checkbox" value="1" @checked(old('public_visibility', $activity->public_visibility ?? true))>
    <label for="public_visibility" class="text-sm">Visible on public activity feed</label>
</div>

<div class="mt-8">
    <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded">Save</button>
    <a href="{{ route('admin.activities.index') }}" class="ml-3 text-gray-300 hover:underline">Cancel</a>
</div>
