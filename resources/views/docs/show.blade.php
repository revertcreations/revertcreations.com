<x-layout>
    <div class="flex-1 w-full overflow-y-auto px-6 md:px-12 lg:px-16 py-12">
        <article class="max-w-4xl mx-auto card-surface p-10 md:p-12 space-y-6 text-gruvbox-white" style="background: rgba(36, 32, 37, 0.92); border-color: #342c35;">
            <header class="space-y-2">
                <a href="{{ url()->previous() }}" class="text-sm text-gruvbox-green hover:underline">&larr; Back</a>
                <h1 class="text-3xl font-semibold text-gruvbox-light-yellow">{{ $title }}</h1>
            </header>
            <div class="space-y-4 text-gruvbox-white/85 leading-relaxed break-words">
                {!! $html !!}
            </div>
        </article>
    </div>
</x-layout>
