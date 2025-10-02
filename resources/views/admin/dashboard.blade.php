<x-admin-layout>
    <div class="space-y-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="text-xs uppercase tracking-[0.3em] text-gruvbox-light-blue">Quarterbacking the pipeline</p>
                <h1 class="mt-1 text-3xl font-semibold text-gruvbox-light-yellow">Admin Dashboard</h1>
            </div>
            <a href="{{ route('admin.opportunities.index') }}" class="primary-btn">Review Opportunities</a>
        </div>

        <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article class="card-surface p-5">
                <p class="text-xs uppercase tracking-wide text-gruvbox-gray">Open roles</p>
                <h2 class="mt-2 text-3xl font-semibold text-gruvbox-light-yellow">{{ $overviewStats['totalOpen'] }}</h2>
                <p class="mt-2 text-xs text-gruvbox-white/70">Active opportunities in the pipeline</p>
            </article>
            <article class="card-surface p-5">
                <p class="text-xs uppercase tracking-wide text-gruvbox-gray">Favorites</p>
                <h2 class="mt-2 text-3xl font-semibold text-gruvbox-light-yellow">{{ $overviewStats['favorites'] }}</h2>
                <p class="mt-2 text-xs text-gruvbox-white/70">Roles to keep front and center</p>
            </article>
            <article class="card-surface p-5">
                <p class="text-xs uppercase tracking-wide text-gruvbox-gray">Actions Today</p>
                <h2 class="mt-2 text-3xl font-semibold text-gruvbox-light-yellow">{{ $overviewStats['remindersToday'] }}</h2>
                <p class="mt-2 text-xs text-gruvbox-white/70">Follow-ups scheduled for {{ now()->format('M j') }}</p>
            </article>
            <article class="card-surface p-5">
                <p class="text-xs uppercase tracking-wide text-gruvbox-gray">Async-ready</p>
                <h2 class="mt-2 text-3xl font-semibold text-gruvbox-light-yellow">{{ $overviewStats['asyncHigh'] }}</h2>
                <p class="mt-2 text-xs text-gruvbox-white/70">High async signal (4+) opportunities</p>
            </article>
        </section>

        <section class="grid gap-6 lg:grid-cols-2">
            <article class="card-surface p-6">
                <header class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gruvbox-light-yellow">Upcoming next actions</h2>
                    <a href="{{ route('admin.opportunities.index', ['sort' => 'next_action_at', 'direction' => 'asc']) }}" class="text-xs uppercase tracking-wide text-gruvbox-light-blue hover:text-gruvbox-yellow">View list</a>
                </header>
                <ul class="space-y-3">
                    @forelse ($upcomingActions as $item)
                        <li class="flex items-center justify-between rounded-lg border border-[#2f2f2f] bg-[#1f1f1f]/60 px-4 py-3">
                            <div>
                                <p class="text-sm font-semibold text-gruvbox-white">{{ $item->role_title }}</p>
                                <p class="text-xs text-gruvbox-light-blue">{{ $item->company_name ?? 'Confidential' }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gruvbox-light-yellow">{{ optional($item->next_action_at)->format('M j, g:ia') }}</p>
                                <p class="text-xs text-gruvbox-gray uppercase">{{ ucfirst($item->workflow_state ?? 'sourced') }}</p>
                            </div>
                        </li>
                    @empty
                        <li class="rounded-lg border border-dashed border-[#3f3f3f] px-4 py-6 text-center text-sm text-gruvbox-gray">No upcoming actions scheduled.</li>
                    @endforelse
                </ul>
            </article>

            <article class="card-surface p-6">
                <header class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gruvbox-light-yellow">Favorite focus list</h2>
                    <a href="{{ route('admin.opportunities.index', ['sort' => 'updated_at', 'direction' => 'desc']) }}" class="text-xs uppercase tracking-wide text-gruvbox-light-blue hover:text-gruvbox-yellow">Manage</a>
                </header>
                <ul class="space-y-3">
                    @forelse ($recentFavorites as $favorite)
                        <li class="flex items-center justify-between rounded-lg border border-[#2f2f2f] bg-[#1f1f1f]/60 px-4 py-3">
                            <div>
                                <p class="text-sm font-semibold text-gruvbox-white">{{ $favorite->role_title }}</p>
                                <p class="text-xs text-gruvbox-light-blue">{{ $favorite->company_name ?? 'Confidential' }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gruvbox-gray uppercase">{{ ucfirst($favorite->priority) }} priority</p>
                                <p class="text-xs text-gruvbox-white/70">Updated {{ $favorite->updated_at->diffForHumans() }}</p>
                            </div>
                        </li>
                    @empty
                        <li class="rounded-lg border border-dashed border-[#3f3f3f] px-4 py-6 text-center text-sm text-gruvbox-gray">Mark favorites to spotlight them here.</li>
                    @endforelse
                </ul>
            </article>
        </section>

        <section class="grid gap-6 lg:grid-cols-2">
            <article class="card-surface p-6">
                <header class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gruvbox-light-yellow">Recent activity</h2>
                    <a href="{{ route('admin.activities.index') }}" class="text-xs uppercase tracking-wide text-gruvbox-light-blue hover:text-gruvbox-yellow">Activity feed</a>
                </header>
                <ul class="space-y-3">
                    @forelse ($recentActivity as $activity)
                        <li class="rounded-lg border border-[#2f2f2f] bg-[#1f1f1f]/60 px-4 py-3">
                            <p class="text-sm font-semibold text-gruvbox-white">{{ $activity->headline }}</p>
                            <p class="text-xs text-gruvbox-light-blue">{{ optional($activity->occurred_at)->format('M j, g:ia') ?? 'Scheduled' }}</p>
                            <p class="mt-1 text-xs text-gruvbox-white/70">{{ \Illuminate\Support\Str::limit($activity->body, 140) }}</p>
                        </li>
                    @empty
                        <li class="rounded-lg border border-dashed border-[#3f3f3f] px-4 py-6 text-center text-sm text-gruvbox-gray">No activity logged yet.</li>
                    @endforelse
                </ul>
            </article>

            <article class="card-surface p-6">
                <header class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gruvbox-light-yellow">Follow-up radar</h2>
                    <span class="text-xs uppercase tracking-wide text-gruvbox-gray">Last touch > 7 days</span>
                </header>
                <ul class="space-y-3">
                    @forelse ($staleLeads as $lead)
                        <li class="flex items-center justify-between rounded-lg border border-[#2f2f2f] bg-[#1f1f1f]/60 px-4 py-3">
                            <div>
                                <p class="text-sm font-semibold text-gruvbox-white">{{ $lead->role_title }}</p>
                                <p class="text-xs text-gruvbox-light-blue">{{ $lead->company_name ?? 'Confidential' }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gruvbox-white/70">Last action {{ optional($lead->last_action_at)->diffForHumans() ?? 'Never' }}</p>
                                <a href="{{ route('admin.opportunities.edit', $lead) }}" class="text-xs uppercase tracking-wide text-gruvbox-green hover:text-gruvbox-light-green">Update</a>
                            </div>
                        </li>
                    @empty
                        <li class="rounded-lg border border-dashed border-[#3f3f3f] px-4 py-6 text-center text-sm text-gruvbox-gray">Everything is fresh—nice work.</li>
                    @endforelse
                </ul>
            </article>
        </section>
    </div>
</x-admin-layout>
