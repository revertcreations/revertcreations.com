<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Edit Post
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    {{ $post->title }}
                </p>
            </div>
            <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end" href="{{ route('admin.posts.index') }}">
                Back to Posts
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
            @if (session('status'))
                <div class="rounded-md bg-green-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 006.293 10.707l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">
                                {{ session('status') }}
                            </p>
                        </div>
                    </div>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.posts.update', $post) }}" enctype="multipart/form-data" class="space-y-8 bg-white p-6 shadow sm:rounded">
                @csrf
                @method('PUT')

                @include('admin.posts._form', ['post' => $post])

                <div class="flex justify-end">
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        Update Post
                    </button>
                </div>
            </form>

            <form method="POST" action="{{ route('admin.posts.destroy', $post) }}" class="bg-white p-6 shadow sm:rounded">
                @csrf
                @method('DELETE')
                <button type="submit" class="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" onclick="return confirm('Delete this post?')">
                    Delete Post
                </button>
            </form>
        </div>
    </main>

</x-admin-layout>
