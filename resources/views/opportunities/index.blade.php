<x-layout>
    <x-page title="Opportunity Pipeline" eyebrow="Pipeline" lead="A transparent view into active roles and pilots Trever is evaluating. Sensitive details may be redacted." containerClass="max-w-5xl">

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
                            <x-ui.card id="opportunity-{{ $anchor }}" class="flex flex-col gap-4">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <p class="text-xs uppercase tracking-wide" style="color: rgba(69,133,136,0.7);">{{ $label }}</p>
                                        <h3 class="text-2xl font-semibold text-gruvbox-light-yellow">{{ $opportunity->public_visibility ? ($opportunity->company_name ?? 'Stealth Company') : 'Confidential opportunity' }}</h3>
                                        <p class="text-gruvbox-aqua">{{ $opportunity->role_title }}</p>
                                    </div>
                                    <div class="flex flex-col gap-2 items-end">
                                        @if ($opportunity->is_favorite)
                                            <span class="inline-flex items-center gap-2 rounded-full bg-gruvbox-purple/40 px-2.5 py-1 text-xs text-gruvbox-light-purple" title="Favorite">
                                                <span class="text-base leading-none">★</span>
                                                <span class="uppercase tracking-wide">Favorite</span>
                                            </span>
                                        @endif
                                        <span class="badge">{{ ucfirst($opportunity->priority) }} priority</span>
                                    </div>
                                </div>

                                <p class="text-gruvbox-white/85 leading-relaxed">{{ $opportunity->summary ?? 'More details coming soon.' }}</p>

                                <div class="flex flex-wrap gap-2 text-xs text-gruvbox-light-blue/80">
                                    @if ($opportunity->status)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-green/20">Status · {{ $opportunity->status }}</span>
                                    @endif
                                    @if ($opportunity->stage)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-light-blue/20">Stage · {{ $opportunity->stage }}</span>
                                    @endif
                                    @if ($opportunity->next_action_at)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-yellow/20">Next step {{ $opportunity->next_action_at->diffForHumans() }}</span>
                                    @endif
                                    @if ($opportunity->is_remote)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-aqua/20">Remote friendly</span>
                                    @endif
                                    @if ($opportunity->fit_score)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-purple/20">Fit score · {{ $opportunity->fit_score }}</span>
                                    @endif
                                    @if ($opportunity->domain_tags)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-blue/20">Tags · {{ implode(', ', $opportunity->domain_tags) }}</span>
                                    @endif
                                    @if ($opportunity->source)
                                        <span class="px-3 py-1 rounded-full bg-gruvbox-light-blue/20">Found via {{ $opportunity->source }}</span>
                                    @endif
                                </div>

                                <div class="space-y-2 text-xs text-gruvbox-light-blue/70">
                                    @if ($opportunity->source_channel)
                                        <p>
                                            <span class="font-semibold text-gruvbox-light-yellow/80">Automation detail:</span>
                                            <a href="{{ $opportunity->source_channel }}" target="_blank" rel="nofollow noopener" class="underline decoration-dotted hover:text-gruvbox-light-blue">{{ $opportunity->source_channel }}</a>
                                        </p>
                                    @endif
                                    @if ($opportunity->salary_min)
                                        <p>Salary: {{ $opportunity->salary_currency ?? 'USD' }} {{ number_format($opportunity->salary_min) }}@if($opportunity->salary_max) – {{ number_format($opportunity->salary_max) }}@endif</p>
                                    @endif
                                </div>
                            </x-ui.card>
                        @endforeach
                    </div>
                </section>
            @endforeach
        </div>

        @unless ($hasVisibleStages)
            <p class="text-lg text-gruvbox-white/70">Pipeline updates are on the way.</p>
        @endunless
    </x-page>
</x-layout>
