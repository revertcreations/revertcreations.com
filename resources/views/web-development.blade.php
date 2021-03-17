<x-layout>

    {{-- <input
        type="hidden"
        class="
            text-gruvbox-light-red
            text-gruvbox-red
            text-gruvbox-light-yellow
            text-gruvbox-yellow
            text-gruvbox-light-orange
            text-gruvbox-orange
            text-gruvbox-light-blue
            text-gruvbox-blue
            text-gruvbox-light-aqua
            text-gruvbox-aqua
            text-gruvbox-gray
            text-gruvbox-light-green
            text-gruvbox-green
            text-gruvbox-light-purple
            text-gruvbox-purple
            text-gruvbox-black
            text-gruvbox-white
            text-hmt-green

            bg-gruvbox-light-red
            bg-gruvbox-red
            bg-gruvbox-light-yellow
            bg-gruvbox-yellow
            bg-gruvbox-light-orange
            bg-gruvbox-orange
            bg-gruvbox-light-blue
            bg-gruvbox-blue
            bg-gruvbox-light-aqua
            bg-gruvbox-aqua
            bg-gruvbox-gray
            bg-gruvbox-light-green
            bg-gruvbox-green
            bg-gruvbox-light-purple
            bg-gruvbox-purple
            bg-gruvbox-black
            bg-gruvbox-white
            bg-hmt-green
        "> --}}

    <span>
        <i class="mt-1 bg-gruvbox-black text-gruvbox-green text-4xl"><input style="width:272px;" class="bg-gruvbox-black italic w-min" value="Web Development" /></i>
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
