@php
    $projectOptions = $projects;
@endphp

<div class="space-y-6">
    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Project</label>
            <select
                name="project_id"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
            >
                <option value="">Select project</option>
                @foreach($projectOptions as $project)
                    <option value="{{ $project->id }}" @selected(old('project_id', $update->project_id) == $project->id)>
                        {{ $project->name }}
                    </option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
                name="status"
                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
                @foreach($statuses as $value => $label)
                    <option value="{{ $value }}" @selected(old('status', $update->status) === $value)>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
        </div>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input
            type="text"
            name="title"
            value="{{ old('title', $update->title) }}"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Slug (optional)</label>
            <input
                type="text"
                name="slug"
                value="{{ old('slug', $update->slug) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="launch-announcement"
            >
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Published at</label>
            <input
                type="datetime-local"
                name="published_at"
                value="{{ old('published_at', optional($update->published_at)->format('Y-m-d\TH:i')) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
        </div>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
            name="excerpt"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Short summary for the listing view."
        >{{ old('excerpt', $update->excerpt) }}</textarea>
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700">Content (Markdown)</label>
        <textarea
            name="body"
            rows="12"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="## Highlights&#10;- ...&#10;- ..."
        >{{ old('body', $update->body) }}</textarea>
        <p class="mt-1 text-xs text-gray-500">Supports Markdown. Rendered HTML is cached on save.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Author</label>
            <input
                type="text"
                name="author"
                value="{{ old('author', $update->author) }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Trever Hillis"
            >
        </div>
        <div class="flex items-center gap-2 pt-7">
            <input type="checkbox" name="is_pinned" value="1" id="is_pinned" @checked(old('is_pinned', $update->is_pinned))>
            <label for="is_pinned" class="text-sm text-gray-700">Pin to project timeline</label>
        </div>
    </div>
</div>
