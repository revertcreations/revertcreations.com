<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">New Project Update</h1>
                <p class="mt-1 text-sm text-gray-500">Log a milestone or release note for a project.</p>
            </div>
            <a href="{{ route('admin.project-updates.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Back to updates
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

            <form method="POST" action="{{ route('admin.project-updates.store') }}" class="space-y-8">
                @csrf

                @include('admin.project-updates._form', ['update' => $update, 'projects' => $projects, 'statuses' => $statuses])

                <div class="flex justify-end gap-3">
                    <a href="{{ route('admin.project-updates.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Save update
                    </button>
                </div>
            </form>
        </div>
    </main>
</x-admin-layout>
