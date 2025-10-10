@php
    use App\Models\JobListing;
    use Illuminate\Support\Str;

    $currentSort = $filters['sort'];
    $currentDirection = $filters['direction'];

    $toggleSortDirection = function (string $column) use ($currentSort, $currentDirection) {
        if ($currentSort === $column) {
            return $currentDirection === 'asc' ? 'desc' : 'asc';
        }

        return 'asc';
    };

    $sortIndicator = function (string $column) use ($currentSort, $currentDirection) {
        if ($currentSort !== $column) {
            return '';
        }

        return $currentDirection === 'asc' ? '↑' : '↓';
    };

    $statusStyles = [
        JobListing::STATUS_NEW => 'bg-gray-100 text-gray-800',
        JobListing::STATUS_INTERESTED => 'bg-sky-100 text-sky-800',
        JobListing::STATUS_APPLIED => 'bg-indigo-100 text-indigo-800',
        JobListing::STATUS_INTERVIEWING => 'bg-amber-100 text-amber-800',
        JobListing::STATUS_DENIED => 'bg-red-100 text-red-800',
        JobListing::STATUS_ACCEPTED => 'bg-emerald-100 text-emerald-800',
        JobListing::STATUS_ARCHIVED => 'bg-gray-200 text-gray-600',
    ];

    $statusLabels = [
        JobListing::STATUS_NEW => 'New',
        JobListing::STATUS_INTERESTED => 'Interested',
        JobListing::STATUS_APPLIED => 'Applied',
        JobListing::STATUS_INTERVIEWING => 'Interviewing',
        JobListing::STATUS_DENIED => 'Denied',
        JobListing::STATUS_ACCEPTED => 'Accepted',
        JobListing::STATUS_ARCHIVED => 'Archived',
    ];
@endphp
<x-admin-layout>
    <header class="bg-white shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Jobs
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Automated feed of remote roles tailored to Trever's skillset.
                </p>
            </div>

            <div class="flex gap-3">
                <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    href="{{ route('admin.jobs.create') }}">
                    Add job manually
                </a>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <form method="GET" action="{{ route('admin.jobs.index') }}" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                name="search"
                                value="{{ $filters['search'] }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Title, company, description…"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                @foreach($statusOptions as $value => $label)
                                    <option value="{{ $value }}" @selected($filters['status'] === $value)>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Source</label>
                            <select
                                name="source"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All sources</option>
                                @foreach($sources as $source)
                                    <option value="{{ $source->slug }}" @selected($filters['source'] === $source->slug)>
                                        {{ $source->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                name="location"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All locations</option>
                                @foreach($locationOptions as $location)
                                    <option value="{{ $location }}" @selected(Str::lower($filters['location']) === Str::lower($location))>
                                        {{ $location }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Min. match score</label>
                            <input
                                type="number"
                                name="match"
                                min="0"
                                max="100"
                                value="{{ $filters['match'] }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g. 30"
                            >
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" name="remote_only" id="remote_only" value="1" @checked($filters['remote_only'])>
                            <label for="remote_only" class="text-sm text-gray-700">Remote only</label>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" name="archived" id="archived" value="1" @checked($filters['archived'])>
                            <label for="archived" class="text-sm text-gray-700">Show archived</label>
                        </div>

                        <div class="lg:col-span-6 flex items-center justify-end gap-3">
                            <a href="{{ route('admin.jobs.index') }}" class="text-sm text-gray-500 hover:text-gray-700">
                                Reset
                            </a>
                            <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Apply filters
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="mt-6 space-y-6">
                <div class="space-y-4 sm:hidden">
                    @forelse($jobs as $job)
                        <article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h2 class="text-base font-semibold text-gray-900">
                                        <a href="{{ route('admin.jobs.show', $job) }}" class="hover:underline">
                                            {{ $job->title }}
                                        </a>
                                    </h2>
                                    <p class="text-sm text-gray-500">{{ $job->company }}</p>
                                </div>
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $statusStyles[$job->status] }}">
                                    {{ $statusLabels[$job->status] ?? Str::title($job->status) }}
                                </span>
                            </div>

                            <div class="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
                                <div class="flex-1 min-w-[45%] space-y-2">
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Match</span>
                                        <span class="text-base font-semibold text-gray-900">
                                            {{ !is_null($job->match_score) ? number_format((float) $job->match_score, 1) . '%' : '—' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</span>
                                        <span class="text-right text-gray-900">
                                            {{ $job->displayLocation() }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Added</span>
                                        <span class="text-right text-gray-900">
                                            {{ optional($job->collected_at ?? $job->created_at)->format('M d, Y') ?? 'Not available' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-[45%] space-y-2">
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Source</span>
                                        <span class="text-right text-gray-900">
                                            {{ optional($job->jobSource)->name ?? 'Manual' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Posted</span>
                                        <span class="text-right text-gray-900">
                                            {{ optional($job->posted_at)->format('M d, Y') ?? 'Not available' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Primary skill</span>
                                        <span class="text-right text-gray-900">
                                            {{ $job->primarySkill() ?? '—' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-4">
                                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Industry</span>
                                        <span class="text-right text-gray-900">
                                            {{ $job->inferredIndustry() ?? '—' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            @php
                                $tags = $job->topTags(6);
                            @endphp
                            @if($tags->isNotEmpty())
                                <div class="mt-4 flex flex-wrap gap-2">
                                    @foreach($tags as $tag)
                                        <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                            {{ $tag }}
                                        </span>
                                    @endforeach
                                </div>
                            @endif

                            <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
                                <a href="{{ route('admin.jobs.show', $job) }}" class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
                                    View details
                                </a>
                                <form method="POST" action="{{ route('admin.jobs.destroy', $job) }}">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="inline-flex items-center rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100">
                                        Archive
                                    </button>
                                </form>
                            </div>
                        </article>
                    @empty
                        <p class="text-sm text-gray-500">No jobs match the current filters.</p>
                    @endforelse
                </div>

                <div class="hidden sm:block">
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'title', 'direction' => $toggleSortDirection('title')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Role
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('title') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'company', 'direction' => $toggleSortDirection('company')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Company
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('company') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Location</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'match_score', 'direction' => $toggleSortDirection('match_score')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Match
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('match_score') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Primary Skill</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Industry</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'status', 'direction' => $toggleSortDirection('status')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Status
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('status') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'collected_at', 'direction' => $toggleSortDirection('collected_at')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Added
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('collected_at') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <a
                                        href="{{ request()->fullUrlWithQuery(['sort' => 'posted_at', 'direction' => $toggleSortDirection('posted_at')]) }}"
                                        class="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900"
                                    >
                                        Posted
                                        <span class="text-xs text-gray-400 group-hover:text-gray-700">{{ $sortIndicator('posted_at') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            @forelse($jobs as $job)
                                <tr class="{{ $job->is_archived ? 'bg-gray-50' : '' }}">
                                    <td class="px-6 py-4">
                                        <div class="text-sm font-semibold text-gray-900">
                                            <a href="{{ route('admin.jobs.show', $job) }}" class="hover:underline">
                                                {{ $job->title }}
                                            </a>
                                        </div>
                                        <div class="mt-1 text-xs text-gray-500 max-w-sm">
                                            {{ Str::limit($job->summary ?? strip_tags($job->description), 120) }}
                                        </div>
                                        @php $tags = $job->topTags(4); @endphp
                                        @if($tags->isNotEmpty())
                                            <div class="mt-2 flex flex-wrap gap-2">
                                                @foreach($tags as $tag)
                                                    <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                                        {{ $tag }}
                                                    </span>
                                                @endforeach
                                            </div>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        <div class="font-medium text-gray-900">{{ $job->company ?? 'Unknown' }}</div>
                                        <div class="text-xs text-gray-500">
                                            {{ optional($job->jobSource)->name ?? 'Manual' }}
                                            @if($job->is_remote)
                                                · Remote OK
                                            @endif
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        {{ $job->displayLocation() }}
                                    </td>
                                    <td class="px-6 py-4">
                                        @if(!is_null($job->match_score))
                                            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $job->match_score >= 40 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                                                {{ number_format((float) $job->match_score, 1) }}%
                                            </span>
                                        @else
                                            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-500">
                                                n/a
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        {{ $job->primarySkill() ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        {{ $job->inferredIndustry() ?? '—' }}
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        @php
                                            $statusClass = $statusStyles[$job->status] ?? 'bg-gray-100 text-gray-800';
                                            $statusLabel = $statusLabels[$job->status] ?? Str::title(str_replace('_', ' ', $job->status));
                                        @endphp
                                        <span class="inline-flex rounded-md px-2 py-1 text-xs font-semibold {{ $statusClass }}">
                                            {{ $statusLabel }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        {{ optional($job->collected_at ?? $job->created_at)->format('M d, Y') ?? 'n/a' }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700">
                                        {{ optional($job->posted_at)->format('M d, Y') ?? 'n/a' }}
                                    </td>
                                    <td class="px-6 py-4 text-right text-sm">
                                        <div class="flex items-center justify-end gap-3">
                                            <a href="{{ route('admin.jobs.show', $job) }}" class="text-indigo-600 hover:text-indigo-900">Review</a>
                                            <form method="POST" action="{{ route('admin.jobs.destroy', $job) }}">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-gray-500 hover:text-gray-700">
                                                    Archive
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500">
                                        No jobs found. Try adjusting filters or running the collector.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            <div class="mt-6">
                {{ $jobs->links('vendor.pagination.jobs') }}
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
                @foreach($sources as $source)
                    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-semibold text-gray-900">
                                {{ $source->name }}
                            </h3>
                            <span class="text-xs font-medium uppercase tracking-wide text-gray-400">
                                {{ $source->driver }}
                            </span>
                        </div>
                        <dl class="mt-3 space-y-1 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <dt>Frequency</dt>
                                <dd>{{ $source->frequency_minutes }} min</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt>Last run</dt>
                                <dd>{{ optional($source->last_ran_at)->diffForHumans() ?? 'Never' }}</dd>
                            </div>
                            <div>
                                <dt class="font-medium text-gray-700">Status</dt>
                                <dd class="text-xs text-gray-500">
                                    {{ $source->last_status ?? 'not yet collected' }}
                                </dd>
                            </div>
                        </dl>
                    </div>
                @endforeach
            </div>
        </div>
    </main>
</x-admin-layout>
