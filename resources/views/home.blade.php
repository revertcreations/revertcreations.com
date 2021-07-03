<x-layout>

    <span class="z-10">
        <div id="homepage_tag" class="mt-1 text-6xl inline-block italic box-content">Hi there!</div>
    </span>

    <div id="homepage_greeting" class="flex flex-col self-center items-start flex-wrap text-2xl mt-4 w-4/5">


        <p class="m-3">
            I'm a freelance
        </p>

        <p class="m-3">
            {{-- <small class="absolute left-4">(click me) -> </small> --}}
            <span><i id="web_dev" class="mt-1 text-6xl bg-gruvbox-black text-gruvbox-green cursor-pointer hover:underline">developer</i></span>
            <span class="large">&amp;</span>
            <span><i id="photographer" class="mt-1 text-6xl bg-black text-white cursor-pointer hover:underline">photographer</i></span>

        </p>

        <p class="m-3">
            in the Albuquerque, NM area.
        </p>

        <p class="m-3">

        </p>

    </div>

    <div id="photographer_wrap" class="hidden mt-10">

        <div id="photographer_archive" class="m-3 p-6 square-film" width="400px" height="400px">
            <p class="font-bold">A vast majority of my photography has been for my personal enjoyment. In my early ages I used this as an escape from my own reality, and a tool of observation into others' realities.
            I haven't shared many of these images over the past 10 years, and I hope to finally display, and perhaps examine some of them in my</p>
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('public.photoshoot.create')}}">archive</a></span>.
        </div>

        <div id="photographer_book" class="m-3 p-6 square-film" width="400px" height="400px">
            <p class="font-bold">Over the past decade I have professionally photographed conferences, weddings, live performances, portraits, and products.
            If you are in need of a photographer, and like what you see here, feel free to</p>
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('public.photoshoot.create')}}">book me</a></span>.
        </div>

        <div id="photographer_portfolio" class="m-3 p-6 square-film" width="400px" height="400px">
            <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:underline"><a href="{{route('photography')}}">portfolio</a></span>.
        </div>

    </div>

    <div id="developer_wrap" class="hidden h-full w-full">

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <input
            type="hidden"
            class="
                text-gruvbox-red
                text-gruvbox-green
                text-gruvbox-purple
                text-gruvbox-black
                text-gruvbox-black-hidden
                text-gruvbox-white
                text-hmt-green
                text-gruvbox-orange
                text-gruvbox-black-hidden

                bg-gruvbox-red
                bg-gruvbox-green
                bg-gruvbox-purple
                bg-gruvbox-black
                bg-gruvbox-white
                bg-hmt-green
            ">

        {{-- <span class="relative" style="bottom: -1px;">
            <i class="mt-1 bg-gruvbox-black text-gruvbox-green text-4xl italic w-min">Web Development</i>
        </span> --}}

        <div class="flex flex-col flex-1 h-full w-full">

            <div class="flex flex-col md:flex-row flex-grow">
                <div id="playground" class="flex-grow bg-gruvbox-black relative touch-action-none"></div>
            </div>

        </div>


        <script>
            const data = JSON.parse('@json($skills)');
            const portfolio = JSON.parse('@json($portfolio)');
            // Playground.init(data)
        </script>
        <script src="{{ asset('js/home.js') }}"></script>
        <script src="{{ asset('js/playground.js') }}"></script>

    </div>



</x-layout>
