<x-admin-layout>
    <div class="space-y-6">
        <x-admin.page-header
            title="Opportunities"
            eyebrow="Pipeline command center"
        >
            <x-slot:actions>
                <a href="{{ route('admin.opportunities.create') }}" class="primary-btn">New Opportunity</a>
            </x-slot:actions>
        </x-admin.page-header>

        @if (session('status'))
            <x-admin.flash type="success">
                {{ session('status') }}
            </x-admin.flash>
        @endif

        @php
            $sort = $currentSort ?? request('sort', 'updated_at');
            $direction = $currentDirection ?? request('direction', 'desc');
            $workflowStates = $workflowStates ?? config('opportunity_pipeline.workflow_states', []);
            $sortLink = function (string $column) use ($sort, $direction) {
                $nextDirection = ($sort === $column && $direction === 'asc') ? 'desc' : 'asc';
                $indicator = $sort === $column ? ($direction === 'asc' ? ' ^' : ' v') : '';
                $queryParams = request()->except(['page']);

                return [
                    'url' => route('admin.opportunities.index', array_merge($queryParams, [
                        'sort' => $column,
                        'direction' => $nextDirection,
                    ])),
                    'indicator' => $indicator,
                ];
            };

            $stageSort = $sortLink('stage');
            $prioritySort = $sortLink('priority');
            $fitSort = $sortLink('fit_score');
            $nextActionSort = $sortLink('next_action_at');
        @endphp

        <div class="flex flex-wrap gap-3">
            <a href="{{ route('admin.opportunities.index', request()->except(['archived', 'page']) ) }}"
               class="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide {{ !($showArchived ?? false) ? 'bg-gruvbox-green/30 text-gruvbox-green' : 'bg-gruvbox-highlight/60 text-gruvbox-gray' }}">
                Active
            </a>
            <a href="{{ route('admin.opportunities.index', array_merge(request()->except('page'), ['archived' => '1'])) }}"
               class="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide {{ ($showArchived ?? false) ? 'bg-gruvbox-green/30 text-gruvbox-green' : 'bg-gruvbox-highlight/60 text-gruvbox-gray' }}">
                Archived
            </a>
        </div>

        <div class="card-surface overflow-hidden">
            <table class="min-w-full divide-y divide-[#2f2f2f] text-sm">
                <thead class="bg-gruvbox-highlight/80 text-xs uppercase tracking-wide text-gruvbox-gray">
                    <tr>
                        <th class="px-4 py-3 text-left">Role</th>
                        <th class="px-4 py-3 text-left">Company</th>
                        <th class="px-4 py-3 text-left">Workflow</th>
                        <th class="px-4 py-3 text-left">
                            <a href="{{ $stageSort['url'] }}" class="hover:text-gruvbox-yellow">Stage{{ $stageSort['indicator'] }}</a>
                        </th>
                        <th class="px-4 py-3 text-left">
                            <a href="{{ $prioritySort['url'] }}" class="hover:text-gruvbox-yellow">Priority{{ $prioritySort['indicator'] }}</a>
                        </th>
                        <th class="px-4 py-3 text-left">Remote</th>
                        <th class="px-4 py-3 text-left">
                            <a href="{{ $fitSort['url'] }}" class="hover:text-gruvbox-yellow">Fit{{ $fitSort['indicator'] }}</a>
                        </th>
                        <th class="px-4 py-3 text-left">Source</th>
                        <th class="px-4 py-3 text-left">
                            <a href="{{ $nextActionSort['url'] }}" class="hover:text-gruvbox-yellow">Next Action{{ $nextActionSort['indicator'] }}</a>
                        </th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#2f2f2f]">
                    @forelse ($opportunities as $opportunity)
                        @php($anchor = $opportunity->slug ?? ('id-' . $opportunity->getKey()))
                        <tr class="transition-colors odd:bg-gruvbox-highlight/20 even:bg-transparent hover:bg-gruvbox-highlight/40">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <form method="POST" action="{{ route('admin.opportunities.favorite', $opportunity) }}">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" class="inline-flex items-center justify-center rounded-full border border-transparent px-2 py-1 text-lg transition {{ $opportunity->is_favorite ? 'bg-gruvbox-purple/30 text-gruvbox-light-purple hover:bg-gruvbox-purple/40' : 'bg-gruvbox-highlight/60 text-gruvbox-gray hover:bg-gruvbox-purple/30 hover:text-gruvbox-light-purple' }}" aria-label="{{ $opportunity->is_favorite ? 'Remove from favorites' : 'Add to favorites' }}">
                                            {{ $opportunity->is_favorite ? '★' : '☆' }}
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('admin.opportunities.visibility', $opportunity) }}">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="redirect" value="{{ request()->fullUrl() }}">
                                        <button type="submit"
                                            class="inline-flex items-center justify-center rounded-full px-2 py-1 text-base transition {{ $opportunity->public_visibility ? 'bg-gruvbox-green/25 text-gruvbox-green hover:bg-gruvbox-green/35' : 'bg-gruvbox-highlight/60 text-gruvbox-gray hover:bg-gruvbox-red/25 hover:text-gruvbox-light-red' }}"
                                            aria-label="{{ $opportunity->public_visibility ? 'Hide from public pipeline' : 'Show on public pipeline' }}">
                                            {{ $opportunity->public_visibility ? '👁' : '👁‍🗨' }}
                                        </button>
                                    </form>
                                    <span class="font-semibold text-gruvbox-white">{{ $opportunity->role_title }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-gruvbox-light-blue">{{ $opportunity->company_name ?? 'Confidential' }}</td>
                            <td class="px-4 py-3">
                                <form method="POST" action="{{ route('admin.opportunities.workflow', $opportunity) }}" class="flex flex-col gap-1">
                                    @csrf
                                    @method('PATCH')
                                    <input type="hidden" name="redirect" value="{{ request()->fullUrl() }}">
                                    <select name="workflow_state" class="bg-[#432b47] border border-gruvbox-purple/40 rounded px-2 py-1 text-xs text-gruvbox-white focus:outline-none focus:ring-2 focus:ring-gruvbox-purple/50" onchange="this.form.submit()">
                                        @foreach ($workflowStates as $value => $label)
                                            <option value="{{ $value }}" @selected($opportunity->workflow_state === $value)>{{ $label }}</option>
                                        @endforeach
                                    </select>
                                </form>
                                @if ($opportunity->last_action_at)
                                    <p class="mt-1 text-xs text-gruvbox-gray">Last action {{ $opportunity->last_action_at->diffForHumans() }}</p>
                                @endif
                            </td>
                            <td class="px-4 py-3 text-gruvbox-white/80">{{ $opportunity->stage ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <span class="badge">{{ ucfirst($opportunity->priority) }}</span>
                            </td>
                            <td class="px-4 py-3">
                                @if ($opportunity->is_remote)
                                    <span class="badge bg-gruvbox-aqua/30 text-gruvbox-aqua">Remote</span>
                                @else
                                    <span class="badge bg-gruvbox-red/30 text-gruvbox-light-red">Onsite</span>
                                @endif
                            </td>
                            <td class="px-4 py-3 text-gruvbox-white/80">{{ $opportunity->fit_score ?? '—' }}</td>
                            <td class="px-4 py-3 text-gruvbox-white/70">{{ $opportunity->source ?? '—' }}</td>
                            <td class="px-4 py-3 text-gruvbox-white/70">{{ optional($opportunity->next_action_at)->format('M j, Y') ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <div class="flex flex-wrap items-center justify-end gap-2 text-xs font-semibold uppercase tracking-wide">
                                    <a href="{{ route('opportunities.index') }}#opportunity-{{ $anchor }}" target="_blank" class="inline-flex items-center rounded-md bg-gruvbox-purple/30 px-2.5 py-1 text-gruvbox-light-yellow hover:bg-gruvbox-purple/40">Site</a>
                                    @if ($posting = data_get($opportunity->links, 'posting'))
                                        <a href="{{ $posting }}" target="_blank" class="inline-flex items-center rounded-md bg-gruvbox-blue/30 px-2.5 py-1 text-gruvbox-light-blue hover:bg-gruvbox-blue/40">Posting</a>
                                    @endif
                                    <a href="{{ route('admin.opportunities.edit', $opportunity) }}" class="inline-flex items-center rounded-md bg-gruvbox-green/25 px-2.5 py-1 text-gruvbox-green hover:bg-gruvbox-green/35">Edit</a>
                                    @if ($opportunity->archived_at)
                                        <form action="{{ route('admin.opportunities.restore', $opportunity) }}" method="POST" class="inline">
                                            @csrf
                                            @method('PATCH')
                                            <button type="submit" class="inline-flex items-center rounded-md bg-gruvbox-yellow/30 px-2.5 py-1 text-gruvbox-light-yellow hover:bg-gruvbox-yellow/40" onclick="return confirm('Restore this opportunity?')">Restore</button>
                                        </form>
                                    @else
                                        <form action="{{ route('admin.opportunities.archive', $opportunity) }}" method="POST" class="inline">
                                            @csrf
                                            @method('PATCH')
                                            <button type="submit" class="inline-flex items-center rounded-md bg-gruvbox-red/25 px-2.5 py-1 text-gruvbox-light-red hover:bg-gruvbox-red/35" onclick="return confirm('Archive this opportunity?')">Archive</button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="px-4 py-10 text-center text-sm text-gruvbox-gray">No opportunities yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-6 text-right">
            {{ $opportunities->links('vendor.pagination.gruvbox') }}
        </div>
    </div>
</x-admin-layout>
