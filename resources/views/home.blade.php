<x-layout>

    <div class="flex w-full flex-1 flex-col text-gruvbox-gray">

        <div class="self-top p-2 sm:p-4 md:p-6"
            id="title">
            <h1 class="text-4xl md:text-6xl">Hi. I'm</h1>
            <name-element class="table"
                data-content="Trever"></name-element>
        </div>

        <div class="w-full flex-1 p-2 text-gruvbox-gray sm:p-4 md:p-6"
            id="lead">

            <content-element
                class="w-2/3 m-auto block select-none text-lg sm:leading-tight md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal">
                I'm a full-stack web <span class="text-xl md:text-3xl font-bold text-gruvbox-green" id="developer">developer</span>.
                Lately I've been even focusing on building <interactive-element>interactive</interactive-element> user experiences.
                I love the challenge of turning design into code that users can truly
                <treasure-element data-name="treasure">treasure</treasure-element>. Hope you find some <hint-element data-content="hidden"></hint-element>
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
