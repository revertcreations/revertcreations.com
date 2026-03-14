<x-layout>

    <div class="flex w-full flex-1 flex-col text-gruvbox-gray">

        <div class="self-top relative p-2 sm:p-4 md:p-6"
            id="title">
            <h1 class="text-4xl md:text-6xl">Hi. I'm</h1>
            <div class="relative inline-block w-full max-w-max">
                <name-element class="relative z-10 table"
                    data-content="Trever"></name-element>
                <div class="pointer-events-none relative left-[90%] z-0 ml-4 flex -translate-y-32 rotate-[-30deg] flex-row items-center whitespace-nowrap font-handwriting text-2xl text-gruvbox-hint"
                    id="name-hint-text">
                    <svg class="mr-2 h-10 w-10 text-gruvbox-hint"
                        viewBox="0 0 40 40"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M 30 20 C 20 20 10 25 5 25" />
                        <path d="M 12 18 L 5 25 L 12 32" />
                    </svg>
                    <span>Solve the puzzle!</span>
                </div>
            </div>
        </div>

        <div class="w-full flex-1 p-2 text-gruvbox-gray sm:p-4 md:p-6"
            id="lead">

            <content-element
                class="m-auto block w-2/3 select-none text-lg leading-[3rem] md:text-xl md:leading-[4.5rem] lg:text-2xl lg:leading-[5.5rem]">
                I'm a full-stack web <span class="text-xl font-bold text-gruvbox-green md:text-3xl"
                    id="developer">developer</span>.
                Lately I've been even focusing on building
                <span class="group relative inline-block cursor-pointer">
                    <interactive-element class="relative z-10">interactive</interactive-element>
                    <div
                        class="pointer-events-none absolute bottom-full left-1/2 z-0 flex -translate-x-1/2 translate-y-4 rotate-[-4deg] flex-row items-center whitespace-nowrap font-handwriting text-xl text-gruvbox-hint md:text-2xl">
                        <div class="relative pb-2">
                            <span class="transition-all duration-300 group-hover:hidden">Hover over me!</span>
                            <span class="hidden transition-all duration-300 group-hover:inline">Double click me!</span>
                        </div>
                        <svg class="h-8 w-8 translate-y-2 text-gruvbox-hint"
                            viewBox="0 0 40 40"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M 20 5 C 20 15 15 25 10 30" />
                            <path d="M 5 25 L 10 30 L 18 28" />
                        </svg>
                    </div>
                </span>
                user experiences. I love the challenge of turning design into code that users can truly
                <span class="relative inline-block">
                    <treasure-element class="relative z-10"
                        data-name="treasure">treasure</treasure-element>
                </span>.
                Hope you find some
                <span class="relative inline-block">
                    <hint-element class="relative z-10"
                        data-content="hidden"></hint-element>
                    <div
                        class="pointer-events-none absolute bottom-full left-1/2 z-0 flex -translate-x-1/2 translate-y-4 rotate-[-6deg] flex-row items-center whitespace-nowrap font-handwriting text-xl text-gruvbox-hint md:text-2xl">
                        <div class="relative pb-2">
                            <span id="drag-hint-text">Drag me!</span>
                        </div>
                        <svg class="h-8 w-8 translate-y-2 text-gruvbox-hint"
                            id="drag-hint-arrow"
                            viewBox="0 0 40 40"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M 20 5 C 20 15 15 25 10 30" />
                            <path d="M 5 25 L 10 30 L 18 28" />
                        </svg>

                    </div>
                </span>
                gems lying around.
            </content-element>

        </div>

    </div>

    @if (app()->environment('production'))
        <script>
            gtag('event', 'page_view', {
                'page_title': 'Home',
                'page_location': '{{ request()->url() }}',
                'page_path': '{{ request()->path() }}'
            });
        </script>
    @endif

</x-layout>
