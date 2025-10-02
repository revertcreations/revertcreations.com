<x-layout>
    <div class="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-16 py-12">
        <div class="max-w-5xl mx-auto space-y-10">
            <header class="space-y-4 text-gruvbox-white" style="padding-bottom: 1.5rem; border-bottom: 1px solid #2f2f2f;">
                <p class="text-sm uppercase tracking-[0.4em] text-gruvbox-light-blue">Build Journals</p>
                <h1 class="text-4xl md:text-5xl font-semibold text-gruvbox-light-yellow">Projects in motion</h1>
                <p class="text-lg text-gruvbox-light-blue/80">Dive into the work that’s shipping right now—from the Junkyard Watchdog app to this site relaunch. Each journal captures the build logs, activity feed, and key artifacts.</p>
            </header>

            <div class="grid gap-6 md:grid-cols-2">
                @foreach ($projects as $project)
                    <x-ui.card class="flex flex-col justify-between">
                        <div class="space-y-4">
                            <h2 class="text-2xl text-gruvbox-light-yellow">{{ $project->title }}</h2>
                            <p class="text-gruvbox-white/80">{{ $project->subtitle }}</p>
                            @if ($project->status_label)
                                <p class="text-xs uppercase tracking-wide text-gruvbox-light-blue">{{ $project->status_label }}</p>
                            @endif
                            @if ($project->latestLog)
                                <div class="rounded-xl p-4 text-sm" style="background: rgba(32, 31, 31, 0.7); border: 1px solid #2f2f2f;">
                                    <p class="text-xs uppercase tracking-wide text-gruvbox-light-blue mb-1">Latest log · {{ optional($project->latestLog->logged_at)->toFormattedDateString() }}</p>
                                    <p class="text-gruvbox-light-yellow font-semibold">{{ $project->latestLog->title }}</p>
                                    <p class="text-gruvbox-white/80">{{ \Illuminate\Support\Str::limit($project->latestLog->description, 140) }}</p>
                                </div>
                            @endif
                        </div>
                        <div class="mt-6">
                            @php $metrics = $project->metricsData ?? []; @endphp
                            @if (!empty($metrics))
                                <dl class="grid grid-cols-3 gap-4 text-xs text-gruvbox-light-blue/80 mb-4">
                                    <div>
                                        <dt class="uppercase tracking-wide">Commits</dt>
                                        <dd class="text-gruvbox-light-yellow text-base">{{ number_format($metrics['commit_count'] ?? 0) }}</dd>
                                    </div>
                                    <div>
                                        <dt class="uppercase tracking-wide">Lines added</dt>
                                        <dd class="text-gruvbox-light-yellow text-base">{{ number_format($metrics['lines_added_since'] ?? 0) }}</dd>
                                    </div>
                                    <div>
                                        <dt class="uppercase tracking-wide">Build logs</dt>
                                        <dd class="text-gruvbox-light-yellow text-base">{{ number_format($metrics['build_logs'] ?? 0) }}</dd>
                                    </div>
                                </dl>
                            @endif
                            <a href="{{ route('build.show', $project->slug) }}" class="primary-btn w-full justify-center">Open journal</a>
                        </div>
                    </x-ui.card>
                @endforeach
            </div>
        </div>
    </div>
</x-layout>
