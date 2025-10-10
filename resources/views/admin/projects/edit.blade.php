<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Edit Project</h1>
                <p class="mt-1 text-sm text-gray-500">{{ $project->name }}</p>
            </div>
            <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Back to Projects
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 space-y-8">
            @if(session('status'))
                <div class="rounded border border-green-300 bg-green-50 px-4 py-2 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            @if($errors->any())
                <div class="rounded border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5 text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.projects.update', $project) }}" class="space-y-8">
                @csrf
                @method('PUT')

                @include('admin.projects._form', ['project' => $project, 'statuses' => $statuses])

                <div class="flex justify-end gap-3">
                    <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Update Project
                    </button>
                </div>
            </form>

            <form method="POST" action="{{ route('admin.projects.destroy', $project) }}" onsubmit="return confirm('Archive this project?')" class="flex justify-end">
                @csrf
                @method('DELETE')
                <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Archive Project
                </button>
            </form>
        </div>
    </main>
</x-admin-layout>
