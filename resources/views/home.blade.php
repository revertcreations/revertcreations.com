<x-layout>
    <div class="flex-1 w-full overflow-y-auto">
        <section class="px-6 py-12 md:px-12 lg:px-16 text-gruvbox-white">
            <div class="max-w-6xl mx-auto grid gap-12 md:grid-cols-[2fr,1fr] items-start">
                <div class="space-y-6">
                    <p class="text-sm uppercase tracking-[0.4em] text-gruvbox-light-blue">Hi, I’m Trever Hillis</p>
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                        I ship production-ready products by pairing AI agents with senior engineering oversight so real apps go live fast.
                    </h1>
                    <p class="text-lg text-gruvbox-light-blue/80">
                        I revived the shelved Junkyard Watchdog idea on September 3rd and, with agents plus senior review, submitted a production-ready iOS build to Apple 28 days later. This site unpacks exactly what the agents tackled, where I stepped in, and what shipped.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <a href="mailto:trever@revertcreations.com" class="primary-btn">Let’s talk about your project</a>
                        <a href="{{ route('build.index') }}" class="ghost-btn">Follow the build journals</a>
                    </div>
                </div>
                <x-ui.card as="div" class="space-y-4">
                    <h2 class="text-xl font-semibold text-gruvbox-light-yellow">Current status</h2>
                    <ul class="space-y-3 text-sm text-gruvbox-light-blue">
                        <li class="flex items-start gap-2">
                            <span class="mt-1 h-2 w-2 rounded-full bg-gruvbox-green"></span>
                            <span><span class="text-gruvbox-light-yellow">Availability:</span> {{ $metrics['availability'] }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="mt-1 h-2 w-2 rounded-full bg-gruvbox-green"></span>
                            <span><span class="text-gruvbox-light-yellow">Actively shipping:</span> {{ $metrics['current_focus'] }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="mt-1 h-2 w-2 rounded-full bg-gruvbox-green"></span>
                            <span><span class="text-gruvbox-light-yellow">Next in queue:</span> {{ $metrics['next_in_queue'] }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="mt-1 h-2 w-2 rounded-full bg-gruvbox-green"></span>
                            <span><span class="text-gruvbox-light-yellow">Last update:</span> {{ $metrics['last_update'] }}</span>
                        </li>
                    </ul>
                </x-ui.card>
            </div>
        </section>

        <section class="px-6 md:px-12 lg:px-16 py-10 bg-gruvbox-black-hidden" style="border-top: 1px solid rgba(47,47,47,0.8);">
            <div class="max-w-6xl mx-auto space-y-8">
                <x-ui.card class="space-y-5">
                    <p class="text-sm uppercase tracking-wide text-gruvbox-light-blue">Project spotlight</p>
                    @if ($featureProject)
                        <h2 class="text-3xl font-semibold text-gruvbox-light-yellow">{{ $featureProject->title }}</h2>
                        <p class="text-gruvbox-white/80">{{ $featureProject->summary }}</p>
                        <ul class="space-y-3 text-sm text-gruvbox-light-blue">
                            @if ($featureProject->status_label)
                                <li><span class="text-gruvbox-light-yellow">What’s live:</span> {{ $featureProject->status_label }}</li>
                            @endif
                            @if ($featureProject->how_it_works)
                                <li><span class="text-gruvbox-light-yellow">How it works:</span> {{ $featureProject->how_it_works }}</li>
                            @endif
                            @if ($featureProject->contribution)
                                <li><span class="text-gruvbox-light-yellow">What I handled:</span> {{ $featureProject->contribution }}</li>
                            @endif
                        </ul>
                        @if ($featureProject->cta_label && $featureProject->cta_url)
                            <a href="{{ $featureProject->cta_url }}" class="inline-flex items-center gap-2 text-gruvbox-green font-semibold uppercase tracking-wide">
                                {{ $featureProject->cta_label }}
                                <span aria-hidden="true">→</span>
                            </a>
                        @endif
                    @else
                        <h2 class="text-3xl font-semibold text-gruvbox-light-yellow">Coming Soon</h2>
                        <p class="text-gruvbox-white/80">I’ll rotate featured projects here as they go live.</p>
                    @endif
                </x-ui.card>

                <x-ui.card class="space-y-4">
                    <header class="space-y-1">
                        <h2 class="text-3xl font-semibold text-gruvbox-light-yellow">What moved this week</h2>
                        <p class="text-sm text-gruvbox-light-blue/80">Quick snippets from the build log—code reviews, design tweaks, automation updates.</p>
                    </header>
                    <div class="grid gap-3">
                        @forelse ($activities->take(4) as $activity)
                            <x-ui.card class="border border-transparent/0" padding="p-4">
                                <header class="flex justify-between text-[11px] uppercase tracking-wide text-gruvbox-light-blue/70">
                                    <span>{{ optional($activity->occurred_at)->diffForHumans() }}</span>
                                    <span class="uppercase tracking-wide text-gruvbox-aqua">{{ $activity->category ?? 'general' }}</span>
                                </header>
                                <h3 class="mt-1 text-base font-semibold text-gruvbox-light-yellow">{{ $activity->headline }}</h3>
                                <p class="text-sm text-gruvbox-white/75">{{ \Illuminate\Support\Str::limit($activity->body, 140) }}</p>
                                <div class="mt-2 flex flex-wrap gap-2 text-[11px] text-gruvbox-light-blue">
                                    @foreach (($activity->tags ?? []) as $tag)
                                        <span class="px-2 py-1 rounded-full bg-gruvbox-blue/20 text-gruvbox-light-blue lowercase">#{{ $tag }}</span>
                                    @endforeach
                                    @if ($activity->link)
                                        <a href="{{ $activity->link }}" target="_blank" class="text-gruvbox-green underline">View artifact</a>
                                    @endif
                                </div>
                            </x-ui.card>
                        @empty
                            <p class="text-gruvbox-white/70">No activity logged yet.</p>
                        @endforelse
                    </div>
                </x-ui.card>
            </div>
        </section>

        <section class="px-6 md:px-12 lg:px-16 py-10 bg-gruvbox-black">
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-3xl font-semibold text-gruvbox-light-yellow">Roles & pilots I’m exploring</h2>
                    <a href="{{ route('opportunities.index') }}" class="text-sm uppercase tracking-wide text-gruvbox-green hover:underline">View the full pipeline</a>
                </div>
                <p class="text-sm text-gruvbox-light-blue/80">Each card shows where the lead came from, what’s automated, and the next move.</p>
                <div class="grid gap-4 md:grid-cols-2">
                    @forelse ($pipeline->take(4) as $item)
                        <article class="card-surface p-6" style="background: rgba(42, 35, 43, 0.88); border-color: #3a303d;">
                            <header class="space-y-1">
                                <p class="text-xs uppercase tracking-wide" style="color: rgba(69,133,136,0.7);">{{ $item->stage ?? 'Stage TBD' }}</p>
                                <h3 class="text-2xl font-semibold text-gruvbox-light-yellow">{{ $item->role_title }}</h3>
                                <p class="text-gruvbox-white/75">{{ $item->public_visibility ? ($item->company_name ?? 'Stealth Company') : 'Confidential' }}</p>
                            </header>
                            <p class="mt-3 text-gruvbox-white/85 leading-relaxed">{{ $item->summary ?? 'Details coming soon.' }}</p>
                            <div class="mt-4 flex flex-wrap gap-2 text-xs text-gruvbox-light-blue/80">
                                <span class="px-3 py-1 rounded-full bg-gruvbox-blue/20">Status · {{ $item->status }}</span>
                                @if ($item->next_action_at)
                                    <span class="px-3 py-1 rounded-full bg-gruvbox-yellow/20">Next step {{ $item->next_action_at->diffForHumans() }}</span>
                                @endif
                                @if ($item->is_remote)
                                    <span class="px-3 py-1 rounded-full bg-gruvbox-aqua/20">Remote friendly</span>
                                @endif
                                @if ($item->fit_score)
                                    <span class="px-3 py-1 rounded-full bg-gruvbox-purple/20">Fit score · {{ $item->fit_score }}</span>
                                @endif
                                @if ($item->source)
                                    <span class="px-3 py-1 rounded-full bg-gruvbox-light-blue/20">Found via {{ $item->source }}</span>
                                @endif
                            </div>
                            @if ($item->source_channel)
                                <p class="mt-4 text-xs text-gruvbox-light-blue/70 break-words">
                                    <span class="font-semibold text-gruvbox-light-yellow/80">Automation detail:</span>
                                    {{ $item->source_channel }}
                                </p>
                            @endif
                            @if ($item->salary_min)
                                <p class="text-xs text-gruvbox-light-blue/70 mt-2">Salary: {{ $item->salary_currency ?? 'USD' }} {{ number_format($item->salary_min) }}@if($item->salary_max) – {{ number_format($item->salary_max) }}@endif</p>
                            @endif
                            @if ($item->domain_tags)
                                <p class="text-xs text-gruvbox-light-blue/70 mt-2">Tags: {{ implode(', ', $item->domain_tags) }}</p>
                            @endif
                        </article>
                    @empty
                        <p class="text-gruvbox-white/70">Pipeline updates are on the way.</p>
                    @endforelse
                </div>
            </div>
        </section>

        <section class="px-6 md:px-12 lg:px-16 py-10 bg-gruvbox-black-hidden" style="border-top: 1px solid rgba(47,47,47,0.7);">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-semibold text-gruvbox-light-yellow">Latest build notes</h2>
                    <a href="{{ route('build.index') }}" class="text-sm uppercase tracking-wide text-gruvbox-green hover:underline">Browse build journals</a>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                    @forelse ($buildLogs->take(4) as $log)
                        <x-ui.card class="p-5">
                            <header class="flex justify-between text-xs text-gruvbox-light-blue/70">
                                <span>{{ optional($log->logged_at)->toFormattedDateString() }}</span>
                                <span>{{ $log->phase ?? '—' }}</span>
                            </header>
                            <h3 class="mt-2 text-2xl font-semibold text-gruvbox-light-yellow">{{ $log->title }}</h3>
                            @if ($log->image_url)
                                <div class="mt-3 overflow-hidden rounded-md border border-[#2f2f2f] bg-black/30">
                                    <img src="{{ $log->image_url }}" alt="{{ $log->title }} image" class="w-full h-auto object-cover">
                                </div>
                            @endif
                            <p class="mt-2 text-gruvbox-white/80">{{ \Illuminate\Support\Str::limit($log->description, 160) }}</p>
                            @if ($log->review_notes)
                                <p class="mt-3 text-sm text-gruvbox-green/80">Review highlight: {{ \Illuminate\Support\Str::limit($log->review_notes, 120) }}</p>
                            @endif
                        </x-ui.card>
                    @empty
                        <p class="text-gruvbox-white/70">Build notes coming soon.</p>
                    @endforelse
                </div>
            </div>
        </section>

        <section class="px-6 md:px-12 lg:px-16 py-12 bg-[#1d1d1d] border-t border-[#2f2f2f]">
            <div class="max-w-4xl mx-auto text-center space-y-6 text-gruvbox-white">
                <h2 class="text-4xl font-semibold text-gruvbox-light-yellow">Want to see what we can ship together?</h2>
                <p class="text-lg text-gruvbox-light-blue/80">Send over the role or product idea. I’ll reply with how I’d spin up the agents, the review checkpoints, and the week-one plan.</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="mailto:trever@revertcreations.com" class="primary-btn">Email Trever</a>
                    <a href="{{ route('build.index') }}" class="ghost-btn">Browse build journals</a>
                </div>
            </div>
        </section>
    </div>

    @push('scripts')
        @vite('resources/js/home.js')
    @endpush
    @if (app()->environment('production'))
        <script>
            gtag('event', 'page_view', {
                'page_title': 'Home',
                'page_location': '{{ request()->url() }}',
                'page_path': '{{ request()->path() }}'
            });
        </script>
    @endif
</x-layout>
