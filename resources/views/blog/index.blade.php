<x-layout>

@if($posts->count())
    @foreach($posts as $post)
        <article class="m-8">
            <h2 class="text-2xl text-gruvbox-light-yellow hover:underline">
                <a href="{{ route('dispatches.show', $post->slug) }}">
                    {{ $post->title }}
                </a>
            </h2>

            <small class="text-gruvbox-aqua">
                {{ Carbon\Carbon::create($post->published_at)->toFormattedDateString() }}
            </small>

            <p class="text-gruvbox-white">
                {{ $post->excerpt }}
            </p>
        </article>
    @endforeach
@else
    <h2>No posts yet!</h2>
@endif

</x-layout>
