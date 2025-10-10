<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Create Post
            </h1>
            <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end"
               href="{{ route('admin.posts.index') }}">
                Back to Posts
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            @if($errors->any())
                <div class="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5 text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.posts.store') }}" enctype="multipart/form-data" class="space-y-6">
                @csrf

                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text"
                           name="title"
                           id="title"
                           value="{{ old('title') }}"
                           required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>

                <div>
                    <label for="slug" class="block text-sm font-medium text-gray-700">Slug (optional)</label>
                    <input type="text"
                           name="slug"
                           id="slug"
                           value="{{ old('slug') }}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>

                <div>
                    <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt (optional)</label>
                    <textarea
                        name="excerpt"
                        id="excerpt"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >{{ old('excerpt') }}</textarea>
                    <p class="mt-2 text-sm text-gray-500">If left blank we'll generate one from the content.</p>
                </div>

                <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">Markdown Content</label>
                    <textarea
                        name="content"
                        id="content"
                        rows="12"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Paste your markdown here..."
                    >{{ old('content') }}</textarea>
                    <p class="mt-2 text-sm text-gray-500">You can paste markdown here or upload a file below.</p>
                </div>

                <div>
                    <label for="markdown_file" class="block text-sm font-medium text-gray-700">Markdown File (optional)</label>
                    <input
                        type="file"
                        name="markdown_file"
                        id="markdown_file"
                        accept=".md,.markdown,.txt,text/markdown"
                        class="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p class="mt-2 text-sm text-gray-500">If both file and text are provided, the file will be used.</p>
                </div>

                <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h2 class="text-sm font-semibold text-gray-700">Upload images to Cloudinary</h2>
                    <p class="mt-1 text-xs text-gray-500">
                        Upload a blog asset and we&rsquo;ll give you a markdown snippet you can paste into the content area above.
                    </p>
                    <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            type="file"
                            id="blog-image-upload-input"
                            accept="image/*"
                            class="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <button type="button" id="blog-image-upload-button" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Upload image
                        </button>
                    </div>
                    <p id="blog-image-upload-status" class="mt-2 text-xs text-gray-500"></p>
                    <ul id="blog-image-upload-results" class="mt-3 space-y-2 text-sm text-gray-700"></ul>
                </div>

                <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="published" value="1" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {{ old('published') ? 'checked' : '' }}>
                        <span class="ml-2 text-sm text-gray-700">Published</span>
                    </label>

                    <div class="flex-1">
                        <label for="published_at" class="block text-sm font-medium text-gray-700">Published At</label>
                        <input type="datetime-local"
                               name="published_at"
                               id="published_at"
                               value="{{ old('published_at', $defaultPublishedAt) }}"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('admin.posts.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Save Post
                    </button>
                </div>
            </form>
        </div>
    </main>

</x-admin-layout>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('blog-image-upload-input');
        const button = document.getElementById('blog-image-upload-button');
        const status = document.getElementById('blog-image-upload-status');
        const results = document.getElementById('blog-image-upload-results');

        if (!input || !button) {
            return;
        }

        const showStatus = (message, type = 'info') => {
            status.textContent = message;
            status.className = `mt-2 text-xs ${type === 'error' ? 'text-red-600' : 'text-gray-500'}`;
        };

        button.addEventListener('click', async () => {
            if (!input.files.length) {
                showStatus('Select an image first.', 'error');
                return;
            }

            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            showStatus('Uploading image…');

            try {
                const response = await fetch('{{ route('admin.posts.upload-image') }}', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                showStatus('Upload complete. Markdown copied below.');

                const listItem = document.createElement('li');
                listItem.className = 'rounded-md border border-gray-200 bg-white p-3';
                listItem.innerHTML = `
                    <div class="flex flex-col gap-2">
                        <a href="${data.url}" target="_blank" class="text-indigo-600 underline">View image</a>
                        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span class="text-xs uppercase tracking-wide text-gray-400">Markdown</span>
                            <code class="break-all rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">${data.markdown}</code>
                            <button type="button" class="copy-markdown inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100" data-markdown="${data.markdown}">
                                Copy
                            </button>
                        </div>
                    </div>
                `;
                results.prepend(listItem);
                input.value = '';
            } catch (error) {
                console.error(error);
                showStatus('Upload failed. Please try again.', 'error');
            }
        });

        results?.addEventListener('click', async (event) => {
            const button = event.target.closest('.copy-markdown');
            if (!button) {
                return;
            }

            try {
                await navigator.clipboard.writeText(button.dataset.markdown);
                showStatus('Markdown copied to clipboard.');
            } catch (error) {
                console.error(error);
                showStatus('Unable to copy markdown.', 'error');
            }
        });
    });
</script>
