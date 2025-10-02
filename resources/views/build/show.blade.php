<x-layout>
    <div class="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-16 py-12">
        <div class="max-w-6xl mx-auto space-y-10">
            <header class="space-y-3 text-gruvbox-white">
                <a href="{{ route('build.index') }}" class="text-sm text-gruvbox-green hover:underline">&larr; Back to journals</a>
                <h1 class="text-4xl md:text-5xl font-semibold text-gruvbox-light-yellow">{{ $project->title }}</h1>
                <p class="text-lg text-gruvbox-light-blue/80">{{ $project->subtitle }}</p>
                @if ($project->summary)
                    <p class="text-gruvbox-white/80">{{ $project->summary }}</p>
                @endif
                @if ($project->cta_label && $project->cta_url)
                    <a href="{{ $project->cta_url }}" class="ghost-btn inline-flex">{{ $project->cta_label }}</a>
                @endif
                @if (!empty($metrics))
                    <dl class="mt-6 grid gap-4 sm:grid-cols-4 text-sm text-gruvbox-light-blue/80">
                        <div>
                            <dt class="uppercase tracking-wide">Commits</dt>
                            <dd class="text-lg text-gruvbox-light-yellow font-semibold">{{ number_format($metrics['commit_count'] ?? 0) }}</dd>
                        </div>
                        <div>
                            <dt class="uppercase tracking-wide">Lines added</dt>
                            <dd class="text-lg text-gruvbox-light-yellow font-semibold">{{ number_format($metrics['lines_added_since'] ?? 0) }}</dd>
                        </div>
                        <div>
                            <dt class="uppercase tracking-wide">Days active</dt>
                            <dd class="text-lg text-gruvbox-light-yellow font-semibold">{{ number_format($metrics['days_active'] ?? 0) }}</dd>
                        </div>
                        <div>
                            <dt class="uppercase tracking-wide">Build logs</dt>
                            <dd class="text-lg text-gruvbox-light-yellow font-semibold">{{ number_format($metrics['build_logs'] ?? 0) }}</dd>
                        </div>
                    </dl>
                @endif
            </header>

            <section class="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
                <div class="space-y-6">
                    <h2 class="text-2xl font-semibold text-gruvbox-light-yellow">Build log timeline</h2>
                    <div class="space-y-4">
                        @forelse ($buildLogs as $log)
                            <x-ui.card class="space-y-3">
                                <header class="flex flex-wrap justify-between gap-3 text-sm text-gruvbox-light-blue/80 mb-2">
                                    <span class="badge">{{ $log->phase }}</span>
                                    <span>{{ optional($log->logged_at)->toDayDateTimeString() }}</span>
                                </header>
                                <h3 class="text-xl font-semibold text-gruvbox-light-yellow">{{ $log->title }}</h3>
                                <p class="mt-2 text-gruvbox-white/80">{{ $log->description }}</p>

                                @if ($log->agent_contribution)
                                    <div class="mt-4 bg-[#201f1f]/70 border border-[#303030] rounded-xl p-4 text-sm text-gruvbox-light-blue">
                                        <p class="text-xs uppercase tracking-wide text-gruvbox-light-blue mb-1">Agent contribution</p>
                                        <p>{{ $log->agent_contribution }}</p>
                                    </div>
                                @endif

                                @if ($log->review_notes)
                                    <div class="mt-4 text-sm text-gruvbox-green/90">
                                        <p class="font-semibold">Review notes</p>
                                        <p>{{ $log->review_notes }}</p>
                                    </div>
                                @endif

                                @if (!empty($log->links))
                                    <ul class="mt-4 flex flex-wrap gap-2 text-sm">
                                        @foreach ($log->links as $label => $url)
                                            @php
                                                $linkUrl = \Illuminate\Support\Str::startsWith($url, 'docs/')
                                                    ? route('docs.show', ['path' => \Illuminate\Support\Str::after($url, 'docs/')])
                                                    : $url;
                                            @endphp
                                            <li><a href="{{ $linkUrl }}" class="text-gruvbox-green underline">{{ \Illuminate\Support\Str::headline($label) }}</a></li>
                                        @endforeach
                                    </ul>
                                @endif
                            </x-ui.card>
                        @empty
                            <p class="text-gruvbox-white/70">No build log entries yet. Check back soon.</p>
                        @endforelse
                    </div>
                </div>

                <aside class="space-y-4" style="position: sticky; top: 7rem;">
                    <h2 class="text-2xl font-semibold text-gruvbox-light-yellow">Recent activity</h2>
                    <div class="space-y-3" style="max-height: 600px; overflow-y: auto; padding-right: 0.25rem;">
                        @forelse ($activities as $activity)
                            <x-ui.card class="text-sm text-gruvbox-white/80" padding="p-4">
                                <header class="flex justify-between text-xs text-gruvbox-light-blue/70 mb-1">
                                    <span>{{ optional($activity->occurred_at)->diffForHumans() }}</span>
                                    <span class="uppercase tracking-wide">{{ $activity->category }}</span>
                                </header>
                                <p class="text-gruvbox-light-yellow font-semibold">{{ $activity->headline }}</p>
                                <p class="mt-1">{{ $activity->body }}</p>
                                @if ($activity->link)
                                    <a href="{{ $activity->link }}" target="_blank" class="mt-2 inline-flex text-gruvbox-green underline">View artifact</a>
                                @endif
                            </x-ui.card>
                        @empty
                            <p class="text-gruvbox-white/70">No activity yet.</p>
                        @endforelse
                    </div>
                </aside>
            </section>
        </div>
    </div>
</x-layout>
