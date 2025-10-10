@php
    use App\Models\Project;
    use Illuminate\Support\Str;

    $statusBadges = [
        Project::STATUS_PLANNING => 'text-gruvbox-yellow border-gruvbox-yellow',
        Project::STATUS_IN_PROGRESS => 'text-gruvbox-blue border-gruvbox-blue',
        Project::STATUS_LAUNCHED => 'text-gruvbox-green border-gruvbox-green',
        Project::STATUS_MAINTENANCE => 'text-gruvbox-purple border-gruvbox-purple',
        Project::STATUS_ARCHIVED => 'text-gruvbox-gray border-gruvbox-gray-dark',
    ];
@endphp

@include('projects._styles')

<x-layout>
    <x-slot name="title">projects</x-slot>

    <section class="flex w-full flex-1 flex-col text-gruvbox-white">
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-10 p-4 sm:p-6 md:p-10">

            <header class="terminal-card">
                <p class="font-mono text-sm uppercase tracking-[0.35em] text-gruvbox-blue">~/projects</p>
                <h1 class="mt-4 font-mono text-3xl text-gruvbox-light-yellow md:text-4xl">Projects &amp; Experiments</h1>
                <p class="mt-4 max-w-2xl font-mono text-sm text-gruvbox-gray">
                    A living log of the products, experiments, and systems I&rsquo;m actively building or shipping.
                    Check them out to inspect build logs,
                    assets, and the running changelog.
                </p>
            </header>

            <div class="grid gap-6 font-mono">
                @forelse($projects as $project)
                    <article class="terminal-card transition">
                        <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                            <div class="flex-1 space-y-3">
                                <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider">
                                    <span class="inline-flex items-center rounded-full border px-3 py-1 {{ $statusBadges[$project->status] ?? 'text-gruvbox-gray border-gruvbox-gray-dark' }}">
                                        {{ str_replace('_', ' ', $project->status) }}
                                    </span>
                                    @if($project->published_at)
                                        <span class="text-gruvbox-gray">published {{ $project->published_at->format('M Y') }}</span>
                                    @endif
                                    @if($project->is_featured)
                                        <span class="text-gruvbox-green">featured</span>
                                    @endif
                                </div>

                                <h2 class="text-2xl text-gruvbox-light-yellow">
                                    <a href="{{ route('projects.show', $project) }}" class="hover:text-gruvbox-yellow">
                                        {{ $project->name }}
                                    </a>
                                </h2>

                                @if($project->tagline)
                                    <p class="text-sm text-gruvbox-gray">{{ $project->tagline }}</p>
                                @elseif($project->summary)
                                    <p class="text-sm text-gruvbox-gray">{{ Str::limit($project->summary, 180) }}</p>
                                @endif

                                <div class="flex flex-wrap items-center gap-3 text-xs">
                                    <a href="{{ route('projects.show', $project) }}" class="inline-flex items-center gap-2 rounded border border-gruvbox-light-yellow px-3 py-1 text-gruvbox-light-yellow hover:bg-gruvbox-light-yellow hover:text-gruvbox-black">
                                        details
                                        <span aria-hidden="true">↵</span>
                                    </a>

                                    @if($project->primary_link_url && $project->primary_link_label)
                                        <a href="{{ $project->primary_link_url }}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded border border-gruvbox-blue px-3 py-1 text-gruvbox-blue hover:bg-gruvbox-blue hover:text-gruvbox-black">
                                            {{ $project->primary_link_label }}
                                            <span aria-hidden="true">↗</span>
                                        </a>
                                    @endif
                                </div>

                                @if($project->tech_stack)
                                    <div class="flex flex-wrap gap-2 pt-2 text-xs text-gruvbox-gray">
                                        @foreach($project->tech_stack as $tech)
                                            <span class="rounded border border-gruvbox-gray px-2 py-1">
                                                {{ $tech }}
                                            </span>
                                        @endforeach
                                    </div>
                                @endif
                            </div>

                            @if($project->hero_image_url)
                                <div class="mt-2 w-full overflow-hidden sm:w-56">
                                    <img src="{{ $project->hero_image_url }}" alt="{{ $project->name }} hero" class="w-full rounded-md object-cover opacity-80">
                                </div>
                            @endif
                        </div>
                    </article>
                @empty
                    <p class="text-center text-sm text-gruvbox-gray">projects will appear here once they&rsquo;re ready to share.</p>
                @endforelse
            </div>
        </div>
    </section>
</x-layout>
