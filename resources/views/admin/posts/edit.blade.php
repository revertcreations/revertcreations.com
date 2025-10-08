<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Edit Post
            </h1>
            <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end"
               href="{{ route('posts.index') }}">
                Back to Posts
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 space-y-10">
            @if($errors->any())
                <div class="rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5 text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(session('status'))
                <div class="rounded border border-green-300 bg-green-50 px-4 py-2 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('posts.update', $post) }}" enctype="multipart/form-data" class="space-y-6">
                @csrf
                @method('PUT')

                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text"
                           name="title"
                           id="title"
                           value="{{ old('title', $post->title) }}"
                           required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>

                <div>
                    <label for="slug" class="block text-sm font-medium text-gray-700">Slug (optional)</label>
                    <input type="text"
                           name="slug"
                           id="slug"
                           value="{{ old('slug', $post->slug) }}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>

                <div>
                    <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt (optional)</label>
                    <textarea
                        name="excerpt"
                        id="excerpt"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >{{ old('excerpt', $post->excerpt) }}</textarea>
                    <p class="mt-2 text-sm text-gray-500">If left blank we'll generate one from the content.</p>
                </div>

                <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">Markdown Content</label>
                    <textarea
                        name="content"
                        id="content"
                        rows="12"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >{{ old('content', $post->content) }}</textarea>
                    <p class="mt-2 text-sm text-gray-500">You can paste markdown here or upload a file below to replace it.</p>
                </div>

                <div>
                    <label for="markdown_file" class="block text-sm font-medium text-gray-700">Replace with Markdown File</label>
                    <input
                        type="file"
                        name="markdown_file"
                        id="markdown_file"
                        accept=".md,.markdown,.txt,text/markdown"
                        class="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p class="mt-2 text-sm text-gray-500">If both file and text are provided, the file will be used.</p>
                </div>

                <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="published" value="1" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {{ old('published', $post->published) ? 'checked' : '' }}>
                        <span class="ml-2 text-sm text-gray-700">Published</span>
                    </label>

                    <div class="flex-1">
                        <label for="published_at" class="block text-sm font-medium text-gray-700">Published At</label>
                        <input type="datetime-local"
                               name="published_at"
                               id="published_at"
                               value="{{ old('published_at', $publishedAt) }}"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('posts.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Update Post
                    </button>
                </div>
            </form>

            <form method="POST" action="{{ route('posts.destroy', $post) }}" class="flex justify-end">
                @csrf
                @method('DELETE')
                <button type="submit"
                        class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onclick="return confirm('Delete this post? This cannot be undone.');">
                    Delete Post
                </button>
            </form>
        </div>
    </main>

</x-admin-layout>
