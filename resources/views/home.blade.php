<x-layout>

    <span class="z-10">
        <div id="homepage_tag" class="mt-1 text-4xl sm:text-6xl inline-block italic box-content border-4 border-transparent border-dashed bg-black text-white">Photographer</div>
    </span>


    <div id="photographer_wrap" class="mt-10 flex">

        {{-- <div id="photographer_archive" class="m-3 p-6 square-film" width="400px" height="400px">
            <p class="font-bold">A vast majority of my photography has been for my personal enjoyment. In my early ages I used this as an escape from my own reality, and a tool of observation into others' realities.
            I haven't shared many of these images over the past 10 years, and I hope to finally display, and perhaps examine some of them in my</p>
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('public.photoshoot.create')}}">archive</a></span>.
        </div> --}}

        <div id="photographer_book" class="m-3 p-6 square-film" width="400px" height="400px">
            <p class="font-bold">Hey there! My name is Trever Hillis, and over the past decade I have professionally photographed conferences, sports, weddings, live performances, events, portraits, and products.
            If you are in need of a photographer, and like what you see here, feel free to</p>
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('public.photoshoot.create')}}">book me</a></span>.
        </div>

        <div id="photographer_portfolio" class="m-3 p-6 square-film" width="400px" height="400px">
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('photography')}}">portfolio</a></span>.
        </div>

    </div>

    <div id="videographer_wrap" class="hidden h-full w-full"></div>

    <script>
        const portfolio = JSON.parse('@json($portfolio)');
    </script>
    <script src="{{ asset('js/home.js') }}"></script>

</x-layout>
