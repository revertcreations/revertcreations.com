<x-layout>

    <div class="overflow-hidden text-gruvbox-gray">

        <div id="title" class="self-top p-2 sm:p-4 md:p-6">
            <h1 class="text-5xl md:text-6xl">Hi. I'm</h1>
            <h1 class="md:text-6xl"><span class="text-5xl" cursor-pointer
                id="name"
                select-none
                text-8xl"><span class="cursor-pointer select-none text-8xl"
                    id="letter-0">T</span><span class="cursor-pointer select-none text-8xl"
                    id="letter-1">r</span><span class="cursor-pointer select-none text-8xl"
                    id="letter-2">e</span><span class="cursor-pointer select-none text-8xl"
                    id="letter-3">v</span><span class="cursor-pointer select-none text-8xl"
                    id="letter-4">e</span><span class="cursor-pointer select-none text-8xl"
                    id="letter-5">r</span>.</span></h1>
        </div>

        <div class="w-full overflow-y-scroll text-gruvbox-gray p-2 sm:p-4 md:p-6"
            id="lead">
            <p class="m-3 text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal"
                id="default">
                I am a <span class="text-3xl font-bold text-gruvbox-purple"
                    id="designer">designer</span>
                and <span class="text-3xl font-bold text-gruvbox-green"
                    id="developer">developer</span> who strives
                to create web applications that users treasure.
            </p>
            <p class="m-3 text-lg sm:leading-tight md:m-4 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-normal"
                id="secondary">
                I'm constanstly coming up with startup ideas, tinkering with interfaces, and fiddling with designs. I hope
                this creative platform can be a source of motivation for myself to bring those ideas to life and
                share with the rest of the internet. Hope you find some
                <span class="text-gruvbox-black"
                    id="hint">hidden</span> gems.
            </p>
        </div>
    </div>

    <script src="{{ asset('js/home.js') }}"></script>

</x-layout>
