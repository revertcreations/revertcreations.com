<x-layout class="bg-white">

    <x-slot name="title">
        {{ $post->title }}
    </x-slot>

    <div class="m-4">
        <h1 class="mb-4 text-5xl text-gruvbox-light-yellow">{{ $post->title }}</h1>
        <a class="hover:cursor-pointer text-gruvbox-light-green hover:text-gruvbox-green" href="{{ route('blog') }}">
            &larr; Back to posts
        </a>
    </div>

    <article class="text-gruvbox-light-blue overscroll-y-auto p-4">
        {!! $post->html !!}
    </article>

</x-layout>
