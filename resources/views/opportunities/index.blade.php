<x-layout>
    <section class="px-6 md:px-12 lg:px-16 py-10 w-full text-gruvbox-white" style="background: linear-gradient(180deg, #1b191a, #151314 45%, #0f0f0f);">
        <header class="max-w-4xl mb-8 space-y-4">
            <h1 class="text-4xl md:text-5xl font-semibold text-gruvbox-light-yellow">Opportunity Pipeline</h1>
            <p class="text-lg" style="color: rgba(69, 133, 136, 0.85);">
                A transparent view into active roles and pilots Trever is evaluating. Sensitive details may be redacted.
            </p>
        </header>

        @php
            $workflowStates = $workflowStates ?? [];
            $publicWorkflowStates = collect($publicWorkflowStates ?? array_keys($workflowStates));
            $providedOpportunities = $opportunitiesByWorkflow ?? [];
            $opportunitiesByWorkflow = $providedOpportunities instanceof \Illuminate\Support\Collection
                ? $providedOpportunities
                : collect($providedOpportunities);
            $hasVisibleStages = false;
        @endphp

        <div class="space-y-10">
            @foreach ($publicWorkflowStates as $state)
                @php
                    $entries = $opportunitiesByWorkflow->get($state, collect());
                    $label = $workflowStates[$state] ?? \Illuminate\Support\Str::headline($state);
                @endphp

                @continue($entries->isEmpty())

                @php($hasVisibleStages = true)

                <section aria-labelledby="public-pipeline-{{ $state }}" class="space-y-6 max-w-5xl">
                    <div>
                        <p class="text-xs uppercase tracking-[0.3em]" style="color: rgba(69, 133, 136, 0.7);">Pipeline Stage</p>
                        <h2 id="public-pipeline-{{ $state }}" class="text-3xl font-semibold text-gruvbox-light-yellow">{{ $label }}</h2>
                    </div>

                    <div class="grid gap-4">
                        @foreach ($entries as $opportunity)
                            @php($anchor = $opportunity->slug ?? ('id-' . $opportunity->getKey()))
                            <article id="opportunity-{{ $anchor }}" class="card-surface p-6" style="background: rgba(37, 29, 39, 0.9); border-color: #362c39;">
                                <div class="flex flex-wrap justify-between gap-2 mb-4">
                                    <div>
                                        <h3 class="text-2xl font-semibold text-gruvbox-light-yellow">
                                            @if ($opportunity->is_favorite)
                                                <span class="mr-2 inline-flex items-center gap-2 rounded-full bg-gruvbox-purple/40 px-2.5 py-1 text-sm text-gruvbox-light-purple" title="Favorite">
                                                    <span class="text-lg leading-none">★</span>
                                                    <span class="uppercase tracking-wide">Favorite</span>
                                                </span>
                                            @endif
                                            {{ $opportunity->public_visibility ? ($opportunity->company_name ?? 'Stealth Company') : 'Confidential Opportunity' }}
                                        </h3>
                                        <p class="text-gruvbox-aqua">{{ $opportunity->role_title }}</p>
                                    </div>
                                    <span class="badge">{{ ucfirst($opportunity->priority) }} priority</span>
                                </div>

                                <p class="text-gruvbox-white/85 mb-4 leading-relaxed">{{ $opportunity->summary ?? 'More details coming soon.' }}</p>

                                <div class="flex flex-wrap gap-2 text-xs text-gruvbox-light-blue/80">
                                    <span class="px-3 py-1 rounded-full bg-gruvbox-blue/20">Workflow · {{ $label }}</span>
                                    @if ($opportunity->stage)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-light-blue/20">Stage · {{ $opportunity->stage }}</span>
                                    @endif
                                    @if ($opportunity->status)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-green/20">Status · {{ $opportunity->status }}</span>
                                    @endif
                                    @if ($opportunity->is_remote)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-aqua/20">Remote friendly</span>
                                    @endif
                                    @if ($opportunity->fit_score)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-purple/20">Fit score · {{ $opportunity->fit_score }}</span>
                                    @endif
                                    @if ($opportunity->next_action_at)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-yellow/20">Next action {{ $opportunity->next_action_at->diffForHumans() }}</span>
                                    @endif
                                    @if ($opportunity->source)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-purple/20">Found via {{ $opportunity->source }}</span>
                                    @endif
                                </div>

                                @if ($opportunity->source_channel)
                                    <p class="mt-4 text-xs text-gruvbox-light-blue/70">
                                        <span class="font-semibold text-gruvbox-light-yellow/80">Automation detail:</span>
                                        <a href="{{ $opportunity->source_channel }}" target="_blank" rel="nofollow noopener" class="underline decoration-dotted hover:text-gruvbox-light-blue">{{ $opportunity->source_channel }}</a>
                                    </p>
                                @endif
                                @if ($opportunity->salary_min)
                                    <p class="text-xs text-gruvbox-light-blue/70">Salary: {{ $opportunity->salary_currency ?? 'USD' }} {{ number_format($opportunity->salary_min) }}@if($opportunity->salary_max) – {{ number_format($opportunity->salary_max) }}@endif</p>
                                @endif
                                @if ($opportunity->domain_tags)
                                    <p class="text-xs text-gruvbox-light-blue/70">Tags: {{ implode(', ', $opportunity->domain_tags) }}</p>
                                @endif
                            </article>
                        @endforeach
                    </div>
                </section>
            @endforeach
        </div>

        @unless ($hasVisibleStages)
            <p class="text-lg text-gruvbox-white/70">Pipeline updates are on the way.</p>
        @endunless
    </section>
</x-layout>
