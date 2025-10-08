<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Create Post
            </h1>
            <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end" href="{{ route('admin.posts.index') }}">
                Back to Posts
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
            <form method="POST" action="{{ route('admin.posts.store') }}" enctype="multipart/form-data" class="space-y-8 bg-white p-6 shadow sm:rounded">
                @csrf

                @include('admin.posts._form')

                <div class="flex justify-end gap-3">
                    <a href="{{ route('admin.posts.index') }}" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        Save Post
                    </button>
                </div>
            </form>
        </div>
    </main>

</x-admin-layout>
