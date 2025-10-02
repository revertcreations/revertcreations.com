@props([
    'eyebrow' => null,
    'title',
    'lead' => null,
    'containerClass' => 'max-w-5xl',
    'headerClass' => null,
])

@php
    $headerClasses = trim('space-y-4 text-gruvbox-white ' . ($headerClass ?? '')); 
@endphp

<div class="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-16 py-12">
    <div class="{{ $containerClass }} mx-auto space-y-10">
        <header class="{{ $headerClasses }}" style="padding-bottom: 1.5rem; border-bottom: 1px solid #2f2f2f;">
            @if ($eyebrow)
                <p class="text-sm uppercase tracking-[0.4em] text-gruvbox-light-blue">{{ $eyebrow }}</p>
            @endif
            <h1 class="text-4xl md:text-5xl font-semibold text-gruvbox-light-yellow">{{ $title }}</h1>
            @if ($lead)
                <p class="text-lg text-gruvbox-light-blue/80">{{ $lead }}</p>
            @endif
        </header>

        {{ $slot }}
    </div>
</div>
