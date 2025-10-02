<x-layout>
    <div class="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-16 py-12">
        <article class="max-w-4xl mx-auto card-surface p-8 space-y-6 text-gruvbox-white">
            <header class="space-y-2">
                <a href="{{ url()->previous() }}" class="text-sm text-gruvbox-green hover:underline">&larr; Back</a>
                <h1 class="text-3xl font-semibold text-gruvbox-light-yellow">{{ $title }}</h1>
            </header>
            <div class="space-y-4 text-gruvbox-white/85 leading-relaxed">
                {!! $html !!}
            </div>
        </article>
    </div>
</x-layout>
