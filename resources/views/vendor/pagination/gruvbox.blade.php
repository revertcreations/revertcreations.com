@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <ul class="inline-flex items-center gap-2">
            @if ($paginator->onFirstPage())
                {{-- no previous link --}}
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev"
                        class="inline-flex items-center rounded-full bg-gruvbox-highlight/70 px-3 py-1 text-gruvbox-white hover:bg-gruvbox-highlight/90 transition">
                        ‹ Prev
                    </a>
                </li>
            @endif

            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="px-2 py-1 text-gruvbox-gray">…</li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li>
                                <span class="inline-flex items-center rounded-full bg-gruvbox-purple px-3 py-1 text-gruvbox-white">{{ $page }}</span>
                            </li>
                        @else
                            <li>
                                <a href="{{ $url }}"
                                    class="inline-flex items-center rounded-full bg-gruvbox-highlight/70 px-3 py-1 text-gruvbox-white hover:bg-gruvbox-highlight/90 transition">
                                    {{ $page }}
                                </a>
                            </li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            @if ($paginator->hasMorePages())
                <li>
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next"
                        class="inline-flex items-center rounded-full bg-gruvbox-highlight/70 px-3 py-1 text-gruvbox-white hover:bg-gruvbox-highlight/90 transition">
                        Next ›
                    </a>
                </li>
            @endif
        </ul>
    </nav>
@endif
