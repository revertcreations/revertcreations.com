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

    $groupedAssets = [
        'featured' => $project->assets->where('is_featured', true),
        'gallery' => $project->assets->where('type', 'image')->where('is_featured', false),
        'videos' => $project->assets->where('type', 'video'),
        'documents' => $project->assets->whereIn('type', ['document', 'link']),
    ];

    $featuredAssets = $groupedAssets['featured'];
    $assetGroups = collect($groupedAssets)
        ->except('featured')
        ->filter(fn ($assets) => $assets->isNotEmpty());

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

    $featuredThumbTransform = 'c_fill,g_auto,q_auto,f_auto,w_200,h_150';
    $featuredDisplayTransform = 'q_auto,f_auto,w_1280';
    $galleryImageTransform = 'q_auto,f_auto,w_1280';
@endphp

@include('projects._styles')

@once
    @push('scripts')
        <script src="{{ asset('js/projectDetail.js') }}" defer></script>
    @endpush
@endonce

<x-layout>
    <x-slot name="title">{{ $project->name }}</x-slot>

    <article class="project-terminal w-full flex-1 flex-col text-gruvbox-white" data-project-detail>
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-10 p-4 sm:p-6 md:p-10">

            <header class="terminal-card terminal-card--accent relative overflow-hidden">
                @if($project->hero_image_url)
                    <div class="pointer-events-none absolute inset-0 opacity-15">
                        <img src="{{ $project->hero_image_url }}" alt="{{ $project->name }} hero" class="h-full w-full object-cover">
                    </div>
                @endif

                <div class="relative space-y-4 font-mono">
                    <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
                        <span class="inline-flex items-center rounded-full border px-3 py-1 {{ $statusBadges[$project->status] ?? 'text-gruvbox-gray border-gruvbox-gray-dark' }}">
                            {{ str_replace('_', ' ', $project->status) }}
                        </span>
                        @if($project->published_at)
                            <span class="text-gruvbox-gray">published {{ $project->published_at->format('M d, Y') }}</span>
                        @endif
                        @if($project->is_featured)
                            <span class="text-gruvbox-green">featured</span>
                        @endif
                    </div>

                    <h1 class="text-3xl text-gruvbox-light-yellow md:text-4xl">{{ $project->name }}</h1>

                    @if($project->tagline)
                        <p class="max-w-2xl text-sm text-gruvbox-gray">{{ $project->tagline }}</p>
                    @endif

                    <div class="flex flex-wrap items-center gap-3 text-xs">
                        @if($project->primary_link_url && $project->primary_link_label)
                            <a href="{{ $project->primary_link_url }}" target="_blank" rel="noopener" class="terminal-link inline-flex items-center gap-2">
                                {{ $project->primary_link_label }}
                                <span aria-hidden="true">↗</span>
                            </a>
                        @endif
                        <a href="{{ route('projects.index') }}" class="terminal-link inline-flex items-center gap-2">
                            back to projects
                            <span aria-hidden="true">⌘</span>
                        </a>
                    </div>

                    @if($project->links)
                        <div class="flex flex-wrap gap-2 text-xs">
                            @foreach($project->links as $link)
                                <a href="{{ $link['url'] ?? '#' }}" target="_blank" rel="noopener" class="terminal-link inline-flex items-center gap-2">
                                    {{ $link['label'] ?? $link['url'] }}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            @endforeach
                        </div>
                    @endif

                    @if($project->tech_stack)
                        <div class="flex flex-wrap gap-2 text-xs text-gruvbox-gray">
                            @foreach($project->tech_stack as $tech)
                                <span class="terminal-badge border px-2 py-1 text-gruvbox-gray">{{ $tech }}</span>
                            @endforeach
                        </div>
                    @endif
                </div>
            </header>

            <div class="terminal-grid">
                <div class="space-y-10">
                    @if($project->body)
                        <section class="terminal-card space-y-4 font-mono">
                            <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/overview</p>
                            <div class="markdown-body word-break text-sm">
                                {!! Str::markdown($project->body) !!}
                            </div>
                        </section>
                    @endif

                    @foreach($assetGroups as $group => $assets)
                        <section class="terminal-card space-y-4 font-mono">
                            <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/assets/{{ $group }}</p>
                            <div class="asset-grid {{ $group === 'gallery' ? 'asset-grid--gallery' : '' }}">
                                @foreach($assets as $asset)
                                    <figure class="asset-figure">
                                        @if($asset->type === 'video')
                                            <iframe src="{{ $asset->url }}" title="{{ $asset->title ?? 'Project video' }}" allowfullscreen loading="lazy"></iframe>
                                        @elseif($asset->type === 'image')
                                            @php
                                                $imageUrl = ($transformCloudinary($asset->url, $galleryImageTransform) ?: $asset->url);
                                            @endphp
                                            <div class="asset-image-wrapper">
                                                <img src="{{ $imageUrl }}" alt="{{ $asset->title ?? $project->name.' asset' }}" loading="lazy">
                                            </div>
                                        @else
                                            <a href="{{ $asset->url }}" target="_blank" rel="noopener" class="terminal-link block px-4 py-3">
                                                {{ $asset->title ?? $asset->url }}
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        @endif

                                        @if($asset->title || $asset->caption)
                                            <figcaption>
                                                @if($asset->title)
                                                    <p class="font-semibold text-gruvbox-light-yellow">{{ $asset->title }}</p>
                                                @endif
                                                @if($asset->caption)
                                                    <p>{{ $asset->caption }}</p>
                                                @endif
                                            </figcaption>
                                        @endif
                                    </figure>
                                @endforeach
                            </div>
                        </section>
                    @endforeach

                    <section class="terminal-card space-y-6 font-mono">
                        <div class="flex items-center justify-between">
                            <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/timeline</p>
                            @if($canPreview)
                                <span class="text-xs uppercase tracking-widest text-gruvbox-yellow">preview mode</span>
                            @endif
                        </div>

                        @if($pinnedUpdates->isNotEmpty())
                            <div class="rounded-lg border border-gruvbox-yellow/40 bg-gruvbox-yellow/10 p-4">
                                <p class="mb-3 text-xs uppercase tracking-[0.4em] text-gruvbox-yellow">pinned</p>
                                <ul class="space-y-3 text-sm text-gruvbox-gray">
                                    @foreach($pinnedUpdates as $update)
                                        <li>
                                            <p class="font-semibold text-gruvbox-light-yellow">{{ $update->title }}</p>
                                            <p class="text-xs uppercase tracking-widest text-gruvbox-yellow/70">{{ optional($update->published_at)->format('M d, Y') ?? 'Draft' }}</p>
                                            @if($update->excerpt)
                                                <p class="text-xs">{{ $update->excerpt }}</p>
                                            @endif
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        @if($updates->isEmpty())
                            <p class="text-xs text-gruvbox-gray">No updates yet. They&rsquo;ll land here once the build log starts rolling.</p>
                        @else
                            <div class="space-y-8">
                                @foreach($updates as $year => $entries)
                                    <section class="space-y-4">
                                        <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-blue">{{ $year ?? 'upcoming' }}</p>
                                        <div class="space-y-6">
                                            @foreach($entries as $update)
                                                <article class="timeline-entry">
                                                    <header>
                                                        <h3 class="timeline-entry__title">{{ $update->title }}</h3>
                                                        <p class="timeline-entry__meta">{{ optional($update->published_at)->format('M d, Y') ?? 'Draft' }}</p>
                                                    </header>

                                                    @if($update->excerpt)
                                                        <p class="timeline-entry__excerpt">{{ $update->excerpt }}</p>
                                                    @endif

                                                    <div class="timeline-entry__actions">
                                                        <button
                                                            type="button"
                                                            class="terminal-link timeline-entry__button"
                                                            data-update-trigger="update-modal-{{ $update->id ?? $loop->index }}"
                                                        >
                                                            view update <span aria-hidden="true">↗</span>
                                                        </button>
                                                    </div>

                                                    <template id="update-modal-{{ $update->id ?? $loop->index }}">
                                                        <div class="project-modal-content">
                                                            <h2>{{ $update->title }}</h2>
                                                            @if($update->published_at)
                                                                <time datetime="{{ $update->published_at->toDateString() }}">{{ $update->published_at->format('M d, Y') }}</time>
                                                            @endif

                                                            @if($update->assets->isNotEmpty())
                                                                <div class="project-modal-assets">
                                                                    @foreach($update->assets as $asset)
                                                                        @php
                                                                            $assetUrl = $asset->type === 'image'
                                                                                ? ($transformCloudinary($asset->url, $featuredDisplayTransform) ?: $asset->url)
                                                                                : $asset->url;
                                                                        @endphp
                                                                        <figure>
                                                                            @if($asset->type === 'video')
                                                                                <iframe src="{{ $assetUrl }}" title="{{ $asset->title ?? 'Update video' }}" allowfullscreen loading="lazy"></iframe>
                                                                            @elseif($asset->type === 'image')
                                                                                <img src="{{ $assetUrl }}" alt="{{ $asset->title ?? $project->name.' update asset' }}" loading="lazy">
                                                                            @else
                                                                                <div class="p-4">
                                                                                    <a href="{{ $assetUrl }}" target="_blank" rel="noopener" class="terminal-link flex items-center gap-2">
                                                                                        {{ $asset->title ?? $assetUrl }}
                                                                                        <span aria-hidden="true">↗</span>
                                                                                    </a>
                                                                                </div>
                                                                            @endif

                                                                            @if($asset->title || $asset->caption)
                                                                                <figcaption>
                                                                                    @if($asset->title)
                                                                                        <p class="font-semibold text-gruvbox-light-yellow">{{ $asset->title }}</p>
                                                                                    @endif
                                                                                    @if($asset->caption)
                                                                                        <p>{{ $asset->caption }}</p>
                                                                                    @endif
                                                                                </figcaption>
                                                                            @endif
                                                                        </figure>
                                                                    @endforeach
                                                                </div>
                                                            @endif

                                                            @if($update->rendered_body)
                                                                <div class="markdown-body">
                                                                    {!! $update->rendered_body !!}
                                                                </div>
                                                            @endif

                                                            @if(!$update->rendered_body && $update->assets->isEmpty())
                                                                <p class="text-sm text-gruvbox-gray">Details coming soon.</p>
                                                            @endif
                                                        </div>
                                                    </template>
                                                </article>
                                            @endforeach
                                        </div>
                                    </section>
                                @endforeach
                            </div>
                        @endif
                    </section>
                </div>

                <aside class="space-y-6">
                    @if($featuredAssets->isNotEmpty())
                        <section class="terminal-card space-y-4 font-mono">
                            <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/assets/featured</p>
                            <div class="featured-asset-thumbnails" data-featured-thumbs>
                                @foreach($featuredAssets as $asset)
                                    @php
                                        $assetKey = 'asset-'.($asset->id ?? $loop->index);
                                        $thumbnailUrl = $asset->type === 'image'
                                            ? ($transformCloudinary($asset->url, $featuredThumbTransform) ?: $asset->url)
                                            : ($asset->preview_url ?: null);
                                        $fullUrl = $asset->type === 'image'
                                            ? ($transformCloudinary($asset->url, $featuredDisplayTransform) ?: $asset->url)
                                            : $asset->url;
                                        $thumbLabel = $asset->title ?? ucfirst(str_replace('_', ' ', $asset->type));
                                    @endphp
                                    <button
                                        type="button"
                                        class="featured-asset-thumb"
                                        data-featured-thumb="{{ $assetKey }}"
                                        data-asset-type="{{ $asset->type }}"
                                        data-asset-url="{{ $fullUrl }}"
                                        data-asset-title="{{ $asset->title ?? '' }}"
                                        data-asset-caption="{{ $asset->caption ?? '' }}"
                                        aria-label="Preview {{ $thumbLabel }}"
                                    >
                                        @if($thumbnailUrl)
                                            <img src="{{ $thumbnailUrl }}" alt="{{ $thumbLabel }} thumbnail" loading="lazy">
                                        @else
                                            <span class="featured-asset-thumb__placeholder">{{ strtoupper(substr($asset->type, 0, 1)) }}</span>
                                        @endif
                                        <span class="featured-asset-thumb__label">{{ $thumbLabel }}</span>
                                    </button>
                                @endforeach
                            </div>
                        </section>
                    @endif

                    @if($project->summary)
                        <section class="terminal-card font-mono">
                            <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/summary</p>
                            <p class="mt-3 text-sm text-gruvbox-gray">{{ $project->summary }}</p>
                        </section>
                    @endif

                    <section class="terminal-card font-mono">
                        <p class="text-xs uppercase tracking-[0.4em] text-gruvbox-orange">~/meta</p>
                        <dl class="mt-4 space-y-2 text-xs text-gruvbox-gray">
                            <div class="flex justify-between">
                                <dt>status</dt>
                                <dd>{{ str_replace('_', ' ', $project->status) }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt>updates</dt>
                                <dd>{{ $updatesCollection->count() }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt>created</dt>
                                <dd>{{ $project->created_at->format('M d, Y') }}</dd>
                            </div>
                        </dl>
                    </section>
                </aside>
            </div>
        </div>
    </article>
</x-layout>
