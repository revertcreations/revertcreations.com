@props([
    'title',
    'eyebrow' => null,
    'description' => null,
])

<div class="flex flex-wrap items-center justify-between gap-4">
    <div class="space-y-1">
        @if ($eyebrow)
            <p class="text-xs uppercase tracking-[0.3em] text-gruvbox-light-blue">{{ $eyebrow }}</p>
        @endif
        <h1 class="mt-1 text-3xl font-semibold text-gruvbox-light-yellow">{{ $title }}</h1>
        @if ($description)
            <p class="text-sm text-gruvbox-white/70">{{ $description }}</p>
        @endif
        {{ $slot ?? '' }}
    </div>

    @isset($actions)
        <div class="flex flex-wrap items-center justify-end gap-2">
            {{ $actions }}
        </div>
    @endisset
</div>
