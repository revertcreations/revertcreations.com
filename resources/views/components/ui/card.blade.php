@props([
    'as' => 'article',
    'padding' => 'p-6',
    'variant' => 'default',
])

@php
    $tag = $as;
    $styleMap = [
        'default' => 'background: linear-gradient(180deg, rgba(43,35,48,0.92) 0%, rgba(34,27,35,0.92) 100%); border-color: #372c3d;'
    ];
    $styleAttr = trim(($styleMap[$variant] ?? $styleMap['default']) . ' ' . ($attributes->get('style') ?? ''));
    $attrs = $attributes->merge([
        'class' => trim('card-surface ' . $padding),
    ])->except('style');
@endphp

<{{ $tag }} {{ $attrs }} @if($styleAttr !== '') style="{{ $styleAttr }}" @endif>
    {{ $slot }}
</{{ $tag }}>
