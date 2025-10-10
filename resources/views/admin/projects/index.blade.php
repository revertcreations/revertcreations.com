@php use Illuminate\Support\Str; @endphp
<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Projects
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Showcase active products, experiments, and long-running builds.
                </p>
            </div>
            <a class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               href="{{ route('admin.projects.create') }}">
                New Project
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-6 rounded border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Featured</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Published</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        @forelse ($projects as $project)
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-semibold text-gray-900">
                                        <a href="{{ route('admin.projects.edit', $project) }}" class="hover:text-indigo-600">
                                            {{ $project->name }}
                                        </a>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ $project->tagline ?? Str::limit($project->summary, 80) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        {{ ucfirst(str_replace('_', ' ', $project->status)) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    @if ($project->is_featured)
                                        <span class="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Featured</span>
                                    @else
                                        <span class="text-xs text-gray-400">—</span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    {{ optional($project->published_at)->format('M d, Y') ?? 'Draft' }}
                                </td>
                                <td class="px-6 py-4 text-right text-sm">
                                    <a href="{{ route('admin.projects.edit', $project) }}" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                                    No projects yet. Create your first project to start showcasing work.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-6">
                {{ $projects->links('vendor.pagination.jobs') }}
            </div>
        </div>
    </main>
</x-admin-layout>
