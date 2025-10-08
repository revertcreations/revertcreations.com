<x-layout>

    <div class="flex flex-col flex-1 text-gruvbox-gray w-full">

        <div id="title" class="self-top p-2 sm:p-4 md:p-6">
            <h1 class="text-5xl md:text-6xl">Hi. I'm</h1>
            <name-element data-content="Trever" class="table"></name-element>
        </div>

        <div id="lead" class="flex-1 w-full text-gruvbox-gray p-2 sm:p-4 md:p-6">

            <content-element class="block m-3 text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal select-none">
                I am a full-stack web <span class="text-3xl font-bold text-gruvbox-green"
                    id="developer">developer</span> who strives
                to create applications that users tend to <treasure-element data-name="treasure">treasure</treasure-element>.
            </content-element>

            <content-element class="block m-3 text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal select-none">
                I'm constanstly coming up with startup ideas, tinkering with
                interfaces, and fiddling with technologies. I hope this
                platform can be a source of motivation for myself to bring
                those creative ideas to life and share them with the rest of
                the internet. Hope you find some
                <hint-element data-content="hidden"></hint-element>
                gems laying around.
            </content-element>

        </div>

    </div>
    @push('scripts')
        @vite('resources/js/home.js')
    @endpush
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
