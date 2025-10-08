@php
    $existingPost = $post ?? null;
    $publishedAtValue = old('published_at');

    if ($publishedAtValue) {
        try {
            $publishedAtValue = \Carbon\Carbon::parse($publishedAtValue)->format('Y-m-d\TH:i');
        } catch (\Throwable $th) {
            // keep the old value if parsing fails
        }
    } elseif ($existingPost?->published_at) {
        $publishedAtValue = $existingPost->published_at->format('Y-m-d\TH:i');
    } else {
        $publishedAtValue = now()->format('Y-m-d\TH:i');
    }
@endphp

<div class="space-y-6">
    <div>
        <label class="block text-sm font-medium text-gray-700" for="title">Title</label>
        <input
            id="title"
            name="title"
            type="text"
            value="{{ old('title', $existingPost?->title) }}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            required
        >
        @error('title')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700" for="slug">Slug</label>
        <input
            id="slug"
            name="slug"
            type="text"
            value="{{ old('slug', $existingPost?->slug) }}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            placeholder="auto-generated from title when left blank"
        >
        @error('slug')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700" for="excerpt">Excerpt</label>
        <textarea
            id="excerpt"
            name="excerpt"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            required
        >{{ old('excerpt', $existingPost?->excerpt) }}</textarea>
        @error('excerpt')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700" for="content">Markdown Content</label>
        <textarea
            id="content"
            name="content"
            rows="16"
            class="mt-1 block w-full rounded-md border-gray-300 font-mono shadow-sm focus:border-gray-500 focus:ring-gray-500"
        >{{ old('content', $existingPost?->content) }}</textarea>
        <p class="mt-2 text-sm text-gray-500">
            Paste markdown here or upload a file below. Uploading a file will replace the textarea content.
        </p>
        @error('content')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-sm font-medium text-gray-700" for="content_file">Upload Markdown File</label>
        <input
            id="content_file"
            name="content_file"
            type="file"
            accept=".md,.markdown,.txt"
            class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:rounded-md file:border-0
                file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white
                hover:file:bg-gray-700"
        >
        @error('content_file')
            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
        @enderror
    </div>

    <div class="grid gap-6 md:grid-cols-2">
        <div class="flex items-center space-x-2">
            <input
                id="published"
                name="published"
                type="checkbox"
                value="1"
                class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                @if(old('published', $existingPost?->published)) checked @endif
            >
            <label class="text-sm font-medium text-gray-700" for="published">Published</label>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700" for="published_at">Publish Date</label>
            <input
                id="published_at"
                name="published_at"
                type="datetime-local"
                value="{{ $publishedAtValue }}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                required
            >
            @error('published_at')
                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
    </div>
</div>
