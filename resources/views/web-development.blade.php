<x-layout>

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

        <div class="flex flex-row flex-grow">

            <p class="m-4 max-w-xs align-top self-start">
                Over the past 7+ years, 5 of which spent building ticketing software with the great people at
                <span class="bg-hmt-green underline font-bold text-xl"><a href="tickets.holdmyticket.com">HoldMyTicket</a></span>,
                I've gained a lot of confidence in many technologies, languages, and software. These are the tools that
                help me quickly build interactive, responsive, and secure web applications. Some I am just now learning, and others
                I've been hacking with for years.
            </p>

            <div class="flex-grow bg-red-600">
                <canvas id="canvas"></canvas>
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


    {{-- <div class="fixed bottom-0 right-0">
        <h2
            class="cursor-pointer self-end text-4xl mt-3 bg-gruvbox-black text-gruvbox-green hover:text-gruvbox-purple">
            <a href="{{ route('public.photoshoot.create') }}">
                hire me
            </a>
        </h2>
    </div> --}}

    <script>

        const data = JSON.parse('@json($skills)');

        function getFontBasedOnKnowledge(rating){
            // console.log(((rating * 10) / 10)+'em Monospace');
            return ((rating * 40) / 100)+'em Monospace';
        }

        function resizeCanvas(canvas, canvasWrap) {
            document.getElementById('canvas').parentElement
            canvas.height = canvasWrap.offsetHeight;
            canvas.width = canvasWrap.offsetWidth;
        }

        function draw()
        {

            const canvas = document.getElementById('canvas');
            const canvasWrap = canvas.parentElement;
            const ctx = canvas.getContext('2d');
            const red = '#cc241d'

            resizeCanvas(canvas, canvasWrap)

            ctx.fillStyle = '#282828';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const skill in data) {

                data[skill].ctx = canvas.getContext('2d')

                data[skill].ctx.font = getFontBasedOnKnowledge(data[skill].ranking);
                data[skill].ctx.fillStyle = "white";

                let textMetrics = data[skill].ctx.measureText(data[skill].name)
                let textHeight = textMetrics.fontBoundingBoxAscent+textMetrics.fontBoundingBoxDescent
                let textWidth = textMetrics.width

                let textXBound = (Math.random() * ((canvas.width-textWidth) - textWidth/2) + textWidth/2)
                let textYBound = (Math.random() * ((canvas.height-textHeight) - textHeight/2) + textHeight/2)
                // console.log('textmetrics height', textMetrics)
                //  = ctx.fillText(data[skill].name,  (Math.random() * (canvas.width - textWidth) + 0), (Math.random() * (canvas.height - textWidth) + 0));
                data[skill].ctx.fillText(data[skill].name, textXBound, textYBound)
                // ctx.fillTexst()
            }

        }

        window.addEventListener('resize', draw);

        draw();

    </script>


</x-layout>
