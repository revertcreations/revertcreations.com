<x-layout>

    <div class="flex w-full flex-1 flex-col text-gruvbox-gray">

        <div class="self-top p-2 sm:p-4 md:p-6"
            id="title">
            <h1 class="text-5xl md:text-6xl">Hi. I'm</h1>
            <name-element class="table"
                data-content="Trever"></name-element>
        </div>

        <div class="w-full flex-1 p-2 text-gruvbox-gray sm:p-4 md:p-6"
            id="lead">

            <content-element
                class="m-3 block select-none text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal">
                I am a full-stack web <span class="text-3xl font-bold text-gruvbox-green"
                    id="developer">developer</span> who loves the process of creation. Lately I've been even more
                interested in crafting <interactive-element>interactive</interactive-element>
                and engaging user experiences. I enjoy the challenge of designing and implementing intuitive, rich
                experiences users can
                <treasure-element data-name="treasure">treasure</treasure-element>.
            </content-element>

            <content-element
                class="m-3 block select-none text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal">
                I'm always brainstorming new startup ideas, tinkering with new
                interface designs, and exploring new technologies. I hope this
                platform can be a source of motivation for me to bring
                some of those creative ideas to life and give them a home to display. Hope you find some
                <hint-element data-content="hidden"></hint-element>
                gems lying around.
            </content-element>

        </div>

    </div>

    <script src="/js/home.js"></script>
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
