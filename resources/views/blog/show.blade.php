<x-layout class="bg-white">

    <x-slot name="title">
        {{ $post->title }}
    </x-slot>

    <div class="m-4">
        <h1 class="mb-4 text-5xl text-gruvbox-light-yellow">{{ $post->title }}</h1>
        <a class="hover:cursor-pointer text-gruvbox-light-green hover:text-gruvbox-green" href="{{ route('projects.index') }}">
            &larr; Back to posts
        </a>
    </div>

    <article class="text-gruvbox-light-blue overscroll-y-auto p-4">
        {!! $post->html !!}
    </article>

    @if (app()->environment('production'))
    <script>
        gtag('event', 'page_view', {
            'page_title': '{{ $post->title }}',
            'page_location': '{{ request()->url() }}',
            'page_path': '{{ request()->path() }}'
        });
    </script>
    @endif
</x-layout>
