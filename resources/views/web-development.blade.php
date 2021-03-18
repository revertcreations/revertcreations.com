<x-layout>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <input
        type="hidden"
        class="
            text-gruvbox-red
            text-gruvbox-green
            text-gruvbox-purple
            text-gruvbox-black
            text-gruvbox-white
            text-hmt-green

            bg-gruvbox-red
            bg-gruvbox-green
            bg-gruvbox-purple
            bg-gruvbox-black
            bg-gruvbox-white
            bg-hmt-green
        ">

    <span class="relative" style="bottom: -1px;">
        <i class="mt-1 bg-gruvbox-black text-gruvbox-green text-4xl italic w-min">Web Development</i>
    </span>

    <div class="flex flex-col flex-1">

        <div class="flex flex-col md:flex-row flex-grow">
            <div id="playground" class="flex-grow bg-gruvbox-black relative" style="touch-action: none; overflow: hidden;"></div>
        </div>

    </div>


    <script src="{{ asset('js/playground.js') }}"></script>

    <script>

        const data = JSON.parse('@json($skills)');

        Playground.init(data)

    </script>


</x-layout>
