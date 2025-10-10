@php
    use App\Models\JobListing;
    use Illuminate\Support\Str;

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

    $statusLabel = $statusLabels[$job->status] ?? Str::title(str_replace('_', ' ', $job->status));
    $statusClass = $statusStyles[$job->status] ?? 'bg-gray-100 text-gray-800';

    $lifecycleStatuses = [
        JobListing::STATUS_NEW => 'New',
        JobListing::STATUS_INTERESTED => 'Interested',
        JobListing::STATUS_APPLIED => 'Applied',
        JobListing::STATUS_INTERVIEWING => 'Interviewing',
        JobListing::STATUS_DENIED => 'Denied',
        JobListing::STATUS_ACCEPTED => 'Accepted',
    ];
@endphp

<x-admin-layout>
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        {{ $job->title }}
                    </h1>
                    <p class="mt-1 text-sm text-gray-600">
                        {{ $job->company ?? 'Unknown company' }} &middot; {{ optional($job->jobSource)->name ?? 'Manual entry' }}
                    </p>
                    <span class="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold {{ $statusClass }}">
                        Status: {{ $statusLabel }}
                    </span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold {{ $job->match_score >= 40 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                        Match score: {{ number_format((float) $job->match_score, 1) }}%
                    </span>
                    <a href="{{ $job->source_url }}" target="_blank" rel="noopener" class="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-gray-700">
                        View listing
                    </a>
                    @if($job->apply_url)
                        <a href="{{ $job->apply_url }}" target="_blank" rel="noopener" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Apply link
                        </a>
                    @endif
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="grid gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <section class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h2 class="text-lg font-medium text-gray-900">Description</h2>
                            <div class="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {!! nl2br(e(strip_tags($job->description ?? $job->summary ?? 'No description provided.'))) !!}
                            </div>
                        </div>
                    </section>

                    @if(!empty($job->tags))
                        <section class="bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <h2 class="text-lg font-medium text-gray-900">Tags</h2>
                                <div class="mt-3 flex flex-wrap gap-2">
                                    @foreach($job->tags as $tag)
                                        <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                                            {{ $tag }}
                                        </span>
                                    @endforeach
                                </div>
                            </div>
                        </section>
                    @endif

                    <section class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h2 class="text-lg font-medium text-gray-900">Notes</h2>
                            <p class="mt-2 text-sm text-gray-600">
                                Keep track of outreach, follow-ups, or red flags.
                            </p>
                            <form action="{{ route('admin.jobs.update', $job) }}" method="POST" class="mt-4 space-y-4">
                                @csrf
                                @method('PUT')
                                <input type="hidden" name="status" value="{{ $job->status }}">

                                <div>
                                    <textarea
                                        name="notes"
                                        rows="4"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >{{ old('notes', $job->notes) }}</textarea>
                                </div>

                                <div class="flex items-center justify-end">
                                    <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                                        Save notes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>

                <div class="space-y-6">
                    <section class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6 space-y-4">
                            <h2 class="text-lg font-medium text-gray-900">At a glance</h2>

                            <dl class="space-y-3">
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Status</dt>
                                    <dd class="text-sm text-gray-900">{{ $statusLabel }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Source</dt>
                                    <dd class="text-sm text-gray-900">{{ optional($job->jobSource)->name ?? 'Manual entry' }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Posted</dt>
                                    <dd class="text-sm text-gray-900">{{ optional($job->posted_at)->format('M d, Y') ?? 'Unknown' }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Collected</dt>
                                    <dd class="text-sm text-gray-900">{{ optional($job->collected_at)->diffForHumans() }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Location</dt>
                                    <dd class="text-sm text-gray-900">{{ $job->location ?? 'Remote / flexible' }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Employment</dt>
                                    <dd class="text-sm text-gray-900">{{ $job->employment_type ?? 'Unspecified' }}</dd>
                                </div>
                                <div class="sm:flex sm:justify-between">
                                    <dt class="text-sm text-gray-500">Remote</dt>
                                    <dd class="text-sm text-gray-900">{{ $job->is_remote ? 'Yes' : 'No' }}</dd>
                                </div>
                                @if($job->salary_min || $job->salary_max)
                                    <div class="sm:flex sm:justify-between">
                                        <dt class="text-sm text-gray-500">Compensation</dt>
                                        <dd class="text-sm text-gray-900">
                                            {{ $job->currency ?? '$' }}
                                            {{ number_format($job->salary_min) }}
                                            –
                                            {{ $job->salary_max ? number_format($job->salary_max) : '?' }}
                                        </dd>
                                    </div>
                                @endif

                                @if($job->applied_at)
                                    <div class="sm:flex sm:justify-between">
                                        <dt class="text-sm text-gray-500">Applied on</dt>
                                        <dd class="text-sm text-gray-900">{{ $job->applied_at->format('M d, Y') }}</dd>
                                    </div>
                                @endif
                            </dl>
                        </div>
                    </section>

                    <section class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h2 class="text-lg font-medium text-gray-900">Update status</h2>
                            <form action="{{ route('admin.jobs.update', $job) }}" method="POST" class="mt-4 space-y-4">
                                @csrf
                                @method('PUT')
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        @foreach($statusOptions as $value => $label)
                                            <option value="{{ $value }}" @selected($job->status === $value)>{{ $label }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Match score</label>
                                    <input type="number" name="match_score" min="0" max="100" value="{{ old('match_score', $job->match_score) }}" step="0.1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Applied at</label>
                                    <input type="date" name="applied_at" value="{{ optional($job->applied_at)->format('Y-m-d') }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Application URL</label>
                                    <input
                                        type="url"
                                        name="apply_url"
                                        value="{{ old('apply_url', $job->apply_url ?? $job->source_url) }}"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="https://company.com/apply"
                                    >
                                    <p class="mt-1 text-xs text-gray-500">Use this to replace the scraped link when the actual application lives deeper.</p>
                                </div>

                                <div class="flex items-center gap-2">
                                    <input type="checkbox" name="is_archived" id="is_archived" value="1" @checked($job->is_archived)>
                                    <label for="is_archived" class="text-sm text-gray-700">Archive this job</label>
                                </div>

                                <div class="flex items-center justify-between">
                                    <a href="{{ route('admin.jobs.edit', $job) }}" class="text-sm text-gray-500 hover:text-gray-700">Edit details</a>
                                    <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        Save updates
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6 space-y-4">
                            <h2 class="text-lg font-medium text-gray-900">Quick actions</h2>
                            <div class="grid gap-2 sm:grid-cols-2">
                                @foreach($lifecycleStatuses as $value => $label)
                                    <form action="{{ route('admin.jobs.update', $job) }}" method="POST">
                                        @csrf
                                        @method('PUT')
                                        <input type="hidden" name="status" value="{{ $value }}">
                                        <button
                                            type="submit"
                                            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 {{ $job->status === $value ? 'border-indigo-500 text-indigo-600' : '' }}"
                                            {{ $job->status === $value ? 'disabled' : '' }}
                                        >
                                            Mark {{ Str::lower($label) }}
                                        </button>
                                    </form>
                                @endforeach
                            </div>

                            <form action="{{ route('admin.jobs.destroy', $job) }}" method="POST" onsubmit="return confirm('Archive this job?')" class="space-y-3 pt-3 border-t border-gray-200">
                                @csrf
                                @method('DELETE')
                                <p class="text-sm text-gray-600">Archiving keeps history but hides the role from the active queue.</p>
                                <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                    Archive job
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </main>
</x-admin-layout>
