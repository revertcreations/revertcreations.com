<x-layout>

    <meta name="csrf-token"
        content="{{ csrf_token() }}">

    <div class="hidden"
        aria-hidden="true">
        <span class="text-gruvbox-red"></span>
        <span class="text-gruvbox-green"></span>
        <span class="text-gruvbox-purple"></span>
        <span class="text-gruvbox-black"></span>
        <span class="text-gruvbox-black-hidden"></span>
        <span class="text-gruvbox-white"></span>
        <span class="text-hmt-green"></span>
        <span class="text-gruvbox-orange"></span>

        <span class="bg-gruvbox-red"></span>
        <span class="bg-gruvbox-green"></span>
        <span class="bg-gruvbox-purple"></span>
        <span class="bg-gruvbox-black"></span>
        <span class="bg-gruvbox-white"></span>
        <span class="bg-hmt-green"></span>
    </div>

    <span class="relative"
        style="bottom: -1px;">
        <i class="mt-1 w-min bg-gruvbox-black text-4xl italic text-gruvbox-green">Web Development</i>
    </span>

    <div class="flex flex-1 flex-col">

        <div class="flex flex-grow flex-col md:flex-row">
            <div class="touch-action-none relative flex-grow bg-gruvbox-black"
                id="playground"></div>
        </div>

    </div>

    @push('scripts')
        @vite('resources/js/playground.js')
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const data = JSON.parse('@json($skills)');
                Playground.init(data);
            });
        </script>
    @endpush

</x-layout>
