<x-layout>

    <span>
        <i class="mt-1 bg-black text-white text-4xl">Hi there!</i>
    </span>

    <div class="flex flex-col self-center items-start flex-wrap text-2xl mt-4 w-4/5">


        <p class="m-3">
            I'm a freelance
        </p>

        <p class="m-3">
            {{-- <small class="absolute left-4">(click me) -> </small> --}}
            <span><i id="web_dev" class="mt-1 text-6xl bg-gruvbox-black text-gruvbox-green cursor-pointer hover:underline">web developer</i></span>
            <span class="large">&amp;</span>
            <span><i id="photographer" class="mt-1 text-6xl bg-black text-white cursor-pointer hover:underline">photographer</i></span>

        </p>

        <p class="m-3">
            in the Albuquerque, NM area.
        </p>

    </div>

    <div id="photographer_info" class="m-3 hidden w-80 h-80 p-3">
        Over the past decade I have professionally photographed conferences, weddings, live performances, portraits, and products. However, a vast majority of my photography
        has been for my personal enjoyment. I haven't shared many of these images over the past 10 years, and I hope to display some of them here ->
        <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:text-black hover:bg-white"><a class= href="{{route('public.photoshoot.create')}}">archive</a></span>.
        If you are in need of a photographer, and like what you see here, feel free to
        <span class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:text-black hover:bg-white"><a class= href="{{route('public.photoshoot.create')}}">book me</a></span>.
    </div>


</x-layout>
