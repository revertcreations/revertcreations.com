@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination" class="flex justify-center mt-4">
        <ul class="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow-sm">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li>
                    <span class="inline-flex items-center rounded-md px-3 py-1 text-gray-300 cursor-not-allowed select-none">
                        &laquo;
                    </span>
                </li>
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev"
                       class="inline-flex items-center rounded-md px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                        &laquo;
                    </a>
                </li>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <li>
                        <span class="inline-flex items-center px-3 py-1 text-gray-400 select-none">{{ $element }}</span>
                    </li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li>
                                <span class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-white shadow-sm select-none">
                                    {{ $page }}
                                </span>
                            </li>
                        @else
                            <li>
                                <a href="{{ $url }}" class="inline-flex items-center rounded-md px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                    {{ $page }}
                                </a>
                            </li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li>
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next"
                       class="inline-flex items-center rounded-md px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                        &raquo;
                    </a>
                </li>
            @else
                <li>
                    <span class="inline-flex items-center rounded-md px-3 py-1 text-gray-300 cursor-not-allowed select-none">
                        &raquo;
                    </span>
                </li>
            @endif
        </ul>
    </nav>
@endif
