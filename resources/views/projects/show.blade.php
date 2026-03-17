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

    $transformCloudinary = static function (?string $url, string $transform): ?string {
        if (blank($url) || !str_contains($url, 'res.cloudinary.com')) {
            return $url;
        }

        $parts = explode('/upload/', $url, 2);

        if (count($parts) !== 2) {
            return $url;
        }

        [$prefix, $suffix] = $parts;

        if (str_starts_with($suffix, $transform.'/')) {
            return $url;
        }

        return $prefix.'/upload/'.$transform.'/'.$suffix;
    };

    $imageTransform = 'q_auto,f_auto,w_800';

    $galleryImages = $project->assets->where('type', 'image');
    $videos = $project->assets->where('type', 'video');
@endphp

@include('projects._styles')

<x-layout>
    <x-slot name="title">{{ $project->name }}</x-slot>

    <article class="project-terminal w-full flex-1 flex-col text-gruvbox-white">
        <div class="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6 md:py-12">

            {{-- Header --}}
            <header class="space-y-3 font-mono">
                <a href="{{ route('projects.index') }}" class="terminal-link inline-flex items-center gap-2 text-xs">
                    <span aria-hidden="true">&larr;</span> back to projects
                </a>

                <h1 class="text-2xl text-gruvbox-light-yellow md:text-3xl">{{ $project->name }}</h1>

                @if($project->tagline)
                    <p class="text-sm text-gruvbox-gray">{{ $project->tagline }}</p>
                @endif

                <div class="flex flex-wrap items-center gap-3 text-xs">
                    <span class="inline-flex items-center rounded-full border px-3 py-1 {{ $statusBadges[$project->status] ?? 'text-gruvbox-gray border-gruvbox-gray-dark' }}">
                        {{ str_replace('_', ' ', $project->status) }}
                    </span>
                    @if($project->published_at)
                        <span class="text-gruvbox-gray">{{ $project->published_at->format('M Y') }}</span>
                    @endif
                    @if($project->is_featured)
                        <span class="text-gruvbox-green">featured</span>
                    @endif
                </div>

                <div class="flex flex-wrap items-center gap-3 text-xs">
                    @if($project->primary_link_url && $project->primary_link_label)
                        <a href="{{ $project->primary_link_url }}" target="_blank" rel="noopener" class="terminal-link inline-flex items-center gap-2">
                            {{ $project->primary_link_label }}
                            <span aria-hidden="true">&nearr;</span>
                        </a>
                    @endif
                    @if($project->links)
                        @foreach($project->links as $link)
                            <a href="{{ $link['url'] ?? '#' }}" target="_blank" rel="noopener" class="terminal-link inline-flex items-center gap-2">
                                {{ $link['label'] ?? $link['url'] }}
                                <span aria-hidden="true">&nearr;</span>
                            </a>
                        @endforeach
                    @endif
                </div>

                @if($project->tech_stack)
                    <div class="flex flex-wrap gap-2 text-xs text-gruvbox-gray">
                        @foreach($project->tech_stack as $tech)
                            <span class="terminal-badge border px-2 py-1 text-gruvbox-gray">{{ $tech }}</span>
                        @endforeach
                    </div>
                @endif
            </header>

            {{-- Hero image --}}
            @if($project->hero_image_url)
                <div class="flex justify-center">
                    <img src="{{ $transformCloudinary($project->hero_image_url, 'q_auto,f_auto,w_400') ?? $project->hero_image_url }}"
                         alt="{{ $project->name }}"
                         class="max-w-[280px] w-full"
                         loading="lazy">
                </div>
            @endif

            {{-- Body (markdown prose) --}}
            @if($project->body)
                <div class="project-prose font-mono text-[13px] leading-relaxed">
                    {!! Str::markdown($project->body) !!}
                </div>
            @endif

            {{-- Hero video --}}
            @if($project->hero_video_url)
                <div class="overflow-hidden rounded-lg">
                    <video src="{{ $project->hero_video_url }}"
                           controls muted autoplay loop
                           class="w-full rounded-lg">
                        Your browser does not support the video tag.
                    </video>
                </div>
            @endif

            {{-- Gallery images --}}
            @if($galleryImages->isNotEmpty())
                <div class="flex flex-wrap justify-center gap-4">
                    @foreach($galleryImages as $asset)
                        <figure class="w-48 sm:w-56">
                            @php
                                $imgUrl = $transformCloudinary($asset->url, $imageTransform) ?: $asset->url;
                            @endphp
                            <img src="{{ $imgUrl }}"
                                 alt="{{ $asset->title ?? $project->name.' asset' }}"
                                 class="w-full rounded-lg"
                                 loading="lazy">
                            @if($asset->title || $asset->caption)
                                <figcaption class="mt-2 text-center font-mono text-[11px] text-gruvbox-gray">
                                    {{ $asset->title ?? $asset->caption }}
                                </figcaption>
                            @endif
                        </figure>
                    @endforeach
                </div>
            @endif

            {{-- Inline videos --}}
            @if($videos->isNotEmpty())
                <div class="space-y-6">
                    @foreach($videos as $asset)
                        <figure class="overflow-hidden rounded-lg">
                            <iframe src="{{ $asset->url }}"
                                    title="{{ $asset->title ?? 'Project video' }}"
                                    allowfullscreen
                                    loading="lazy"
                                    class="aspect-video w-full rounded-lg"></iframe>
                            @if($asset->title || $asset->caption)
                                <figcaption class="mt-2 text-center font-mono text-[11px] text-gruvbox-gray">
                                    {{ $asset->title ?? $asset->caption }}
                                </figcaption>
                            @endif
                        </figure>
                    @endforeach
                </div>
            @endif

            {{-- Summary fallback --}}
            @if($project->summary && !$project->body)
                <div class="project-prose font-mono text-[13px] leading-relaxed text-gruvbox-gray">
                    <p>{{ $project->summary }}</p>
                </div>
            @endif

        </div>
    </article>
</x-layout>
