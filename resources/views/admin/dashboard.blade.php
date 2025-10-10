@php
    $visitorTrendCollection = collect($visitorTrend);
    $maxVisitors = max($visitorTrendCollection->pluck('total')->all() ?: [0]);
    $maxVisitors = $maxVisitors > 0 ? $maxVisitors : 1;
@endphp
<x-admin-layout>

    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto flex flex-col gap-2 py-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Quick pulse on visitor activity, puzzle performance, and the job pipeline.
                </p>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span class="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">
                    External traffic
                </span>
                <span class="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700">
                    All traffic
                </span>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">
            <section>
                <h2 class="text-lg font-semibold text-gray-900">
                    Visitor Insights
                </h2>
                <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div class="rounded-lg bg-white p-4 shadow-sm">
                        <p class="text-sm font-medium text-gray-500">External visitors (30 days)</p>
                        <p class="mt-2 text-3xl font-semibold text-gray-900">
                            {{ number_format($visitorSummary['external_last_30_days'] ?? 0) }}
                        </p>
                    </div>
                    <div class="rounded-lg bg-white p-4 shadow-sm">
                        <p class="text-sm font-medium text-gray-500">Total sessions (30 days)</p>
                        <p class="mt-2 text-3xl font-semibold text-gray-900">
                            {{ number_format($visitorSummary['total_last_30_days'] ?? 0) }}
                        </p>
                    </div>
                    <div class="rounded-lg bg-white p-4 shadow-sm">
                        <p class="text-sm font-medium text-gray-500">External visitors today</p>
                        <p class="mt-2 text-3xl font-semibold text-gray-900">
                            {{ number_format($visitorSummary['external_today'] ?? 0) }}
                        </p>
                    </div>
                    <div class="rounded-lg bg-white p-4 shadow-sm">
                        <p class="text-sm font-medium text-gray-500">Lifetime external visitors</p>
                        <p class="mt-2 text-3xl font-semibold text-gray-900">
                            {{ number_format($visitorSummary['lifetime_external'] ?? 0) }}
                        </p>
                    </div>
                </div>

                <div class="mt-6 rounded-lg bg-white p-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold text-gray-900">
                            Last 14 days
                        </h3>
                        <span class="text-xs font-medium uppercase tracking-wide text-gray-400">External vs total sessions</span>
                    </div>
                    <div class="mt-4 space-y-3">
                        @forelse($visitorTrendCollection as $day)
                            @php
                                $externalWidth = $day['external'] > 0 ? number_format(($day['external'] / $maxVisitors) * 100, 2, '.', '') : 0;
                                $internalCount = max($day['total'] - $day['external'], 0);
                                $internalWidth = $internalCount > 0 ? number_format(($internalCount / $maxVisitors) * 100, 2, '.', '') : 0;
                            @endphp
                            <div>
                                <div class="flex items-center justify-between text-xs text-gray-500">
                                    <span class="font-medium text-gray-600">{{ $day['date'] }}</span>
                                    <span>
                                        <span class="text-emerald-600 font-semibold">{{ $day['external'] }}</span>
                                        <span class="mx-1 text-gray-400">/</span>
                                        <span class="font-medium text-gray-700">{{ $day['total'] }}</span>
                                    </span>
                                </div>
                                <div class="mt-2 flex h-2 overflow-hidden rounded bg-gray-100">
                                    @if($externalWidth > 0)
                                        <div class="bg-emerald-500" style="width: {{ $externalWidth }}%"></div>
                                    @endif
                                    @if($internalWidth > 0)
                                        <div class="bg-gray-300" style="width: {{ $internalWidth }}%"></div>
                                    @endif
                                </div>
                            </div>
                        @empty
                            <p class="text-sm text-gray-500">No visitor data recorded yet.</p>
                        @endforelse
                    </div>
                </div>
            </section>

            <section>
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div class="flex-1">
                        <h2 class="text-lg font-semibold text-gray-900">
                            Puzzle Performance
                        </h2>
                        <div class="mt-4 grid gap-4 sm:grid-cols-3">
                            <div class="rounded-lg bg-white p-4 shadow-sm">
                                <p class="text-sm font-medium text-gray-500">External solves (30 days)</p>
                                <p class="mt-2 text-2xl font-semibold text-gray-900">
                                    {{ number_format($puzzleSummary['external_solves_last_30_days'] ?? 0) }}
                                </p>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow-sm">
                                <p class="text-sm font-medium text-gray-500">Total solves (30 days)</p>
                                <p class="mt-2 text-2xl font-semibold text-gray-900">
                                    {{ number_format($puzzleSummary['solves_last_30_days'] ?? 0) }}
                                </p>
                            </div>
                            <div class="rounded-lg bg-white p-4 shadow-sm">
                                <p class="text-sm font-medium text-gray-500">Lifetime external solves</p>
                                <p class="mt-2 text-2xl font-semibold text-gray-900">
                                    {{ number_format($puzzleSummary['lifetime_external_solves'] ?? 0) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 overflow-hidden rounded-lg bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-4 py-3 sm:px-6">
                        <h3 class="text-base font-semibold text-gray-900">
                            Top external scores
                        </h3>
                        <p class="text-sm text-gray-500">
                            Best-performing solves, filtered to visitors marked as external.
                        </p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Score</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Hints</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Time (s)</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Puzzle</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Achieved</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                @forelse($topExternalScores as $score)
                                    <tr>
                                        <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {{ number_format((int) $score->score) }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-700">
                                            {{ $score->hint_count }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-700">
                                            {{ number_format((float) $score->solve_time_in_seconds, 1) }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-700">
                                            {{ optional(optional($score->puzzle)->puzzleType)->name ?? 'Unknown' }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-500">
                                            {{ optional($score->created_at)->diffForHumans() ?? '—' }}
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                                            No external solves recorded yet. Once visitors complete the puzzle you will see their scores here.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section class="grid gap-6 lg:grid-cols-2">
                <div class="rounded-lg bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-4 py-3 sm:px-6">
                        <h2 class="text-base font-semibold text-gray-900">
                            Job Pipeline
                        </h2>
                        <p class="text-sm text-gray-500">
                            Quick snapshot of prospects pulled in by the job collector.
                        </p>
                    </div>
                    <div class="px-4 py-5 sm:px-6">
                        <dl class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Total tracked roles</dt>
                                <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($jobSummary['total'] ?? 0) }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Active pipeline</dt>
                                <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($jobSummary['active_pipeline'] ?? 0) }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm font-medium text-gray-500">Touched this week</dt>
                                <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($jobSummary['recent_activity'] ?? 0) }}
                                </dd>
                            </div>
                        </dl>

                        <div class="mt-6 space-y-3">
                            @foreach($jobSummary['status_counts'] ?? [] as $status)
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-600">
                                        {{ $status['label'] }}
                                    </span>
                                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                                        {{ number_format($status['count']) }}
                                    </span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>

                <div class="rounded-lg bg-white shadow-sm">
                    <div class="border-b border-gray-100 px-4 py-3 sm:px-6">
                        <h2 class="text-base font-semibold text-gray-900">
                            Projects &amp; Content
                        </h2>
                        <p class="text-sm text-gray-500">
                            Publishing cadence helps keep the public site fresh.
                        </p>
                    </div>
                    <div class="px-4 py-5 sm:px-6 space-y-6">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p class="text-sm font-medium text-gray-500">Projects live</p>
                                <p class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($projectSummary['live'] ?? 0) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Featured slots</p>
                                <p class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($projectSummary['featured'] ?? 0) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Draft projects</p>
                                <p class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($projectSummary['drafts'] ?? 0) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-500">Published posts</p>
                                <p class="mt-1 text-2xl font-semibold text-gray-900">
                                    {{ number_format($postSummary['published'] ?? 0) }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-sm font-semibold text-gray-900">
                                Latest posts
                            </h3>
                            <ul class="mt-3 space-y-2">
                                @forelse($postSummary['recent'] ?? [] as $post)
                                    <li class="flex items-center justify-between gap-3 rounded border border-gray-100 bg-gray-50 px-3 py-2">
                                        <span class="text-sm font-medium text-gray-700 truncate">
                                            {{ $post->title ?? 'Untitled post' }}
                                        </span>
                                        <span class="text-xs text-gray-500">
                                            {{ optional($post->published_at)->diffForHumans() ?? 'Draft' }}
                                        </span>
                                    </li>
                                @empty
                                    <li class="text-sm text-gray-500">
                                        No posts yet. Draft something to share progress.
                                    </li>
                                @endforelse
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</x-admin-layout>
