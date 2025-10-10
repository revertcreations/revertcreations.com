<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Project Assets
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Manage hero shots, galleries, documents, and links that power each project page.
                </p>
            </div>
            <a class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
               href="{{ route('project-assets.create', ['project' => $projectId]) }}">
                Add asset
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
            @if (session('status'))
                <div class="rounded border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            <form method="GET" action="{{ route('project-assets.index') }}" class="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-gray-500">Filter by project</label>
                    <select name="project" class="mt-1 block rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500">
                        <option value="">All projects</option>
                        @foreach($projects as $project)
                            <option value="{{ $project->id }}" @selected($projectId == $project->id)>
                                {{ $project->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="ml-auto flex items-center gap-3">
                    <a href="{{ route('project-assets.index') }}" class="text-sm text-gray-500 hover:text-gray-700">
                        Reset
                    </a>
                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                        Apply
                    </button>
                </div>
            </form>

            <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Project</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Asset</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Featured</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Order</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        @forelse($assets as $asset)
                            <tr>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    {{ optional($asset->project)->name ?? '—' }}
                                    @if($asset->project_update_id)
                                        <div class="text-xs text-gray-400">
                                            Update: {{ optional($asset->projectUpdate)->title ?? '#'.$asset->project_update_id }}
                                        </div>
                                    @endif
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-semibold text-gray-900">
                                        {{ $asset->title ?? 'Untitled asset' }}
                                    </div>
                                    <div class="text-xs text-gray-500 break-all">
                                        {{ $asset->url }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    {{ ucfirst($asset->type) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    @if($asset->is_featured)
                                        <span class="rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800">Featured</span>
                                    @else
                                        <span class="text-xs text-gray-400">—</span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">
                                    {{ $asset->display_order }}
                                </td>
                                <td class="px-6 py-4 text-right text-sm">
                                    <a href="{{ route('project-assets.edit', $asset) }}" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                                    No assets found. Upload images, videos, or supporting documents to enrich your projects.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div>
                {{ $assets->withQueryString()->links('vendor.pagination.jobs') }}
            </div>
        </div>
    </main>
</x-admin-layout>
