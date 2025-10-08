@php
    use App\Models\JobApplication;
@endphp

<x-admin-layout>
    <div class="max-w-7xl mx-auto py-8 px-4 space-y-8">
        @if (session('status'))
            <div class="rounded-md bg-green-50 p-4 border border-green-200">
                <p class="text-green-700 text-sm">{{ session('status') }}</p>
            </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-3">Refresh Remote Listings</h2>
                <p class="text-sm text-gray-600 mb-4">Pull the latest remote opportunities from approved boards and persist them to the dashboard.</p>
                <form action="{{ route('admin.jobs.sync') }}" method="POST" class="space-y-4">
                    @csrf
                    <div>
                        <label for="keyword" class="block text-sm font-medium text-gray-700">Keyword</label>
                        <input
                            type="text"
                            id="keyword"
                            name="keyword"
                            value="{{ old('keyword', request('keyword', 'full stack developer')) }}"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="limit" class="block text-sm font-medium text-gray-700">Limit</label>
                            <input
                                type="number"
                                min="1"
                                max="200"
                                id="limit"
                                name="limit"
                                value="{{ old('limit', 50) }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Boards</label>
                            <div class="mt-2 space-y-2">
                                <label class="inline-flex items-center text-sm text-gray-700">
                                    <input type="checkbox" name="boards[]" value="remoteok" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                    <span class="ml-2">Remote OK</span>
                                </label>
                                <label class="inline-flex items-center text-sm text-gray-700">
                                    <input type="checkbox" name="boards[]" value="weworkremotely" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                    <span class="ml-2">We Work Remotely</span>
                                </label>
                                <label class="inline-flex items-center text-sm text-gray-700">
                                    <input type="checkbox" name="boards[]" value="himalayas" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                    <span class="ml-2">Himalayas</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sync Listings
                        </button>
                    </div>
                </form>
            </div>

            <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-3">Queue Mass Applications</h2>
                <p class="text-sm text-gray-600 mb-4">Select opportunities to queue for automated outreach. The batch worker will create or update draft applications and prepare collateral.</p>
                <form action="{{ route('admin.jobs.mass-apply') }}" method="POST" class="space-y-4">
                    @csrf
                    <div>
                        <label for="opportunity_ids" class="block text-sm font-medium text-gray-700">Opportunities</label>
                        <select
                            id="opportunity_ids"
                            name="opportunity_ids[]"
                            multiple
                            size="8"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                            @forelse ($bulkCandidates as $candidate)
                                <option value="{{ $candidate->id }}">
                                    {{ $candidate->title }} — {{ $candidate->company ?? 'Unknown company' }}
                                </option>
                            @empty
                                <option disabled>No opportunities available yet.</option>
                            @endforelse
                        </select>
                        <p class="text-xs text-gray-500 mt-1">Hold command (⌘) or control (Ctrl) to select multiple rows.</p>
                    </div>
                    <div>
                        <label for="target_status" class="block text-sm font-medium text-gray-700">Target application status</label>
                        <select
                            id="target_status"
                            name="target_status"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                            @foreach ($applicationStatuses as $status)
                                <option value="{{ $status }}">{{ ucwords(str_replace('_', ' ', $status)) }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label for="follow_up_at" class="block text-sm font-medium text-gray-700">Follow up date</label>
                        <input
                            type="date"
                            id="follow_up_at"
                            name="follow_up_at"
                            value="{{ old('follow_up_at') }}"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                    </div>
                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700">Automation notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >{{ old('notes') }}</textarea>
                    </div>
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            Queue Automation
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="bg-white shadow rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">Recent Opportunities</h2>
                    <p class="text-sm text-gray-600">Scraped roles that match your filters. Update statuses as you review leads.</p>
                </div>
                <form method="GET" action="{{ route('admin.jobs.index') }}" class="flex items-center space-x-3">
                    <label for="status" class="text-sm text-gray-700">Filter</label>
                    <select
                        id="status"
                        name="status"
                        class="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onchange="this.form.submit()"
                    >
                        <option value="">All statuses</option>
                        @foreach ($opportunityStatuses as $status)
                            <option value="{{ $status }}" @selected($statusFilter === $status)>{{ ucwords($status) }}</option>
                        @endforeach
                    </select>
                </form>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seen</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Application</th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse ($opportunities as $opportunity)
                            @php
                                $application = $opportunity->applications->first();
                            @endphp
                            <tr>
                                <td class="px-4 py-4 align-top">
                                    <div class="space-y-1">
                                        <div class="flex items-center space-x-2">
                                            <a href="{{ $opportunity->url }}" target="_blank" rel="noopener" class="text-sm font-semibold text-indigo-600 hover:underline">
                                                {{ $opportunity->title }}
                                            </a>
                                            <span class="text-xs text-gray-400">{{ $opportunity->source }}</span>
                                        </div>
                                        <p class="text-xs text-gray-500">
                                            {!! nl2br(e(\Illuminate\Support\Str::limit($opportunity->description ?? 'No description available', 180))) !!}
                                        </p>
                                        <div class="flex items-center space-x-3 text-xs text-gray-400">
                                            <span>Posted {{ optional($opportunity->posted_at)->diffForHumans() ?? 'n/a' }}</span>
                                            <span>First seen {{ optional($opportunity->first_seen_at)->toDateString() ?? 'n/a' }}</span>
                                            <span>Last refreshed {{ optional($opportunity->last_seen_at)->diffForHumans() ?? 'n/a' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <div class="text-sm text-gray-900">{{ $opportunity->company ?? 'Unknown company' }}</div>
                                    <div class="text-xs text-gray-500">{{ $opportunity->location ?? 'Remote' }}</div>
                                    @if (! empty($opportunity->tags))
                                        <div class="mt-1 text-xs text-gray-400">{{ $opportunity->tags }}</div>
                                    @endif
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <div class="text-sm text-gray-900">{{ optional($opportunity->first_seen_at)->diffForHumans() ?? 'n/a' }}</div>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form action="{{ route('admin.jobs.opportunities.update', $opportunity) }}" method="POST" class="space-y-2">
                                        @csrf
                                        @method('PATCH')
                                        <select
                                            name="status"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            @foreach ($opportunityStatuses as $status)
                                                <option value="{{ $status }}" @selected($opportunity->status === $status)>{{ ucwords($status) }}</option>
                                            @endforeach
                                        </select>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Update
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form action="{{ route('admin.jobs.applications.store', $opportunity) }}" method="POST" class="space-y-2">
                                        @csrf
                                        <select
                                            name="status"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            @foreach ($applicationStatuses as $status)
                                                <option value="{{ $status }}" @selected(optional($application)->status === $status)>
                                                    {{ ucwords(str_replace('_', ' ', $status)) }}
                                                </option>
                                            @endforeach
                                        </select>
                                        <textarea
                                            name="notes"
                                            rows="3"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Notes, prompts, next steps..."
                                        >{{ $application?->notes }}</textarea>
                                        <label class="block text-xs text-gray-500">
                                            Follow up
                                            <input
                                                type="date"
                                                name="follow_up_at"
                                                value="{{ optional($application?->follow_up_at)->format('Y-m-d') }}"
                                                class="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                        </label>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-indigo-500 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            Save Application
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top text-right space-y-2">
                                    <a
                                        href="{{ $opportunity->apply_url ?? $opportunity->url }}"
                                        target="_blank"
                                        rel="noopener"
                                        class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        Apply Link
                                    </a>
                                    <a
                                        href="{{ $opportunity->url }}"
                                        target="_blank"
                                        rel="noopener"
                                        class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        View Posting
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                                    No opportunities stored yet. Run the sync tool to populate this table.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-100">
                {{ $opportunities->links() }}
            </div>
        </div>

        <div class="bg-white shadow rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">Application Pipeline</h2>
                    <p class="text-sm text-gray-600">Track the state of every application that has been drafted or dispatched.</p>
                </div>
                <form method="GET" action="{{ route('admin.jobs.index') }}" class="flex items-center space-x-3">
                    <label for="application_status" class="text-sm text-gray-700">Filter</label>
                    <select
                        id="application_status"
                        name="application_status"
                        class="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onchange="this.form.submit()"
                    >
                        <option value="">All statuses</option>
                        @foreach ($applicationStatuses as $status)
                            <option value="{{ $status }}" @selected($applicationStatus === $status)>{{ ucwords(str_replace('_', ' ', $status)) }}</option>
                        @endforeach
                    </select>
                </form>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow Up</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                            <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @forelse ($applications as $application)
                            <tr>
                                <td class="px-4 py-4 align-top">
                                    <div class="text-sm font-semibold text-gray-900">
                                        {{ $application->opportunity?->title ?? 'Unknown role' }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ $application->opportunity?->company ?? 'Unknown company' }}
                                    </div>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form method="POST" action="{{ route('admin.jobs.applications.update', $application) }}" class="space-y-2">
                                        @csrf
                                        @method('PATCH')
                                        <select
                                            name="status"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            @foreach ($applicationStatuses as $status)
                                                <option value="{{ $status }}" @selected($application->status === $status)>{{ ucwords(str_replace('_', ' ', $status)) }}</option>
                                            @endforeach
                                        </select>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Update
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form method="POST" action="{{ route('admin.jobs.applications.update', $application) }}" class="space-y-2">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="{{ $application->status }}">
                                        <input
                                            type="date"
                                            name="applied_at"
                                            value="{{ optional($application->applied_at)->format('Y-m-d') }}"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form method="POST" action="{{ route('admin.jobs.applications.update', $application) }}" class="space-y-2">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="{{ $application->status }}">
                                        <input
                                            type="date"
                                            name="follow_up_at"
                                            value="{{ optional($application->follow_up_at)->format('Y-m-d') }}"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top">
                                    <form method="POST" action="{{ route('admin.jobs.applications.update', $application) }}" class="space-y-2">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="{{ $application->status }}">
                                        <textarea
                                            name="notes"
                                            rows="3"
                                            class="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >{{ $application->notes }}</textarea>
                                        <button
                                            type="submit"
                                            class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </td>
                                <td class="px-4 py-4 align-top text-right">
                                    <a
                                        href="{{ optional($application->opportunity)->apply_url ?? optional($application->opportunity)->url }}"
                                        target="_blank"
                                        rel="noopener"
                                        class="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        View Posting
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                                    No applications queued yet. Create one from the opportunities table above.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-100">
                {{ $applications->links('pagination::tailwind') }}
            </div>
        </div>
    </div>
</x-admin-layout>

