@props([
    'type' => 'info',
    'icon' => null,
])

@php
    $variantClasses = [
        'success' => 'border-gruvbox-green/40 text-gruvbox-green',
        'error' => 'border-gruvbox-light-red/40 text-gruvbox-light-red',
        'warning' => 'border-gruvbox-yellow/40 text-gruvbox-light-yellow',
        'info' => 'border-gruvbox-blue/40 text-gruvbox-light-blue',
    ];
    $classes = $variantClasses[$type] ?? $variantClasses['info'];
@endphp

<div class="card-surface flex items-start gap-3 px-4 py-3 text-sm {{ $classes }}">
    @if ($icon)
        <span class="mt-0.5 text-base">{!! $icon !!}</span>
    @endif
    <div class="space-y-1">
        {{ $slot }}
    </div>
</div>
