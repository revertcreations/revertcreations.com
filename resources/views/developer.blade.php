<x-layout>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <div class="hidden" aria-hidden="true">
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

    <span class="relative" style="bottom: -1px;">
        <i class="mt-1 bg-gruvbox-black text-gruvbox-green text-4xl italic w-min">Web Development</i>
    </span>

    <div class="flex flex-col flex-1">

        <div class="flex flex-col md:flex-row flex-grow">
            <div id="playground" class="flex-grow bg-gruvbox-black relative touch-action-none"></div>
        </div>

    </div>

    @push('scripts')
        @vite('resources/js/playground.js')
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const data = JSON.parse('@json($skills)');
                Playground.init(data);
            });
        </script>
    @endpush


</x-layout>
