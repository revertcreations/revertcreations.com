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

    {{-- <div
        class="cursor-pointer text-2xl mt-3 bg-gruvbox-black text-gruvbox-green hover:text-gruvbox-purple"
    >
        <a
            target="_blank"
            href="https://github.com/revertcreations">
            github
        </a>
    </div> --}}
    <div class="flex flex-col flex-1">

        <div class="flex flex-col md:flex-row flex-grow">

            <p class="m-4 max-w-xs align-top  md:self-start self-center">
                Over the past 7+ years, 5 of which spent building ticketing software with the great people at
                <span class="bg-hmt-green underline font-bold text-xl"><a href="tickets.holdmyticket.com">HoldMyTicket</a></span>,
                I've gained a lot of confidence in many technologies, languages, and software. These are the tools that
                help me quickly build interactive, responsive, and secure web applications. Some I am just now learning, and others
                I've been hacking with for years.
            </p>

            <div id="playground" class="flex-grow bg-gruvbox-black relative">
            {{-- <div class="flex-grow bg-red-600">
                <canvas id="canvas"></canvas>
            </div> --}}


            </div>
            {{-- <div class="flex flew-row flex-wrap w-4/5 bg-gray-200 items-center justify-center">
                @foreach($skills as $skill => $points)
                    <div class="">
                        <i style="font-size: {{ (($points * 2) * 10) / 20 }}em;" class="bg-gruvbox-black text-gruvbox-green ">{{ $skill }}</i>
                    </div>
                @endforeach
            </div> --}}
        </div>

    </div>


    <script src="{{ asset('js/playground.js') }}"></script>

    <script>

        const data = JSON.parse('@json($skills)');

        Playground.init(data)

    </script>


</x-layout>
