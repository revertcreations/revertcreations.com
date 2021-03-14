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

            {{-- <div class="flex-grow bg-red-600">
                <canvas id="canvas"></canvas>
            </div> --}}

            <div onmousemove="mousePosition(event)" id="playground" class="flex-grow bg-gruvbox-black relative">

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
        const playground = document.getElementById('playground')


        for (const skill in data) {

            data[skill].element = document.createElement('div')
            let element = data[skill].element
            let name = data[skill].name
            let ranking = data[skill].ranking

            styleElement(element, name, ranking)
            playground.appendChild(element)
            positionElement(element)


            let timePressed = 0;
            let press = false;

            data[skill].listeners = []
            data[skill].listeners.push(element.addEventListener('mousedown', pressingDown, false))
            data[skill].listeners.push(element.addEventListener('mouseup', notPressingDown, false))
            // data[skill].listeners.push(element.addEventListener('mouseleave', notPressingDown, false))

            data[skill].listeners.push(element.addEventListener('touchstart', pressingDown, false))
            data[skill].listeners.push(element.addEventListener('touchend', notPressingDown, false))


            function counter() {
                if (press) {
                    timePressed++;

                    console.log('click', window.mouseClientY, window.mouseClientX)

                    setTimeout(() => {
                        element.style.top = window.mouseClientY+'px'
                        element.style.left = window.mouseClientX+'px'
                    }, 200);

                    // element.style.top = event
                    // element.style.left = textXBound+'px'
                } else {
                    timePressed = 0;
                    element.style.top = element.style.top
                    element.style.left = element.style.left
                }

                requestAnimationFrame(counter);
            }
            counter();

            function pressingDown(e) {
                console.log('upclick')
                press = true;
                e.preventDefault();
            }
            function notPressingDown(e) {
                cancelAnimationFrame(timePressed);
                press = false;
            }
        }

        function getFontBasedOnKnowledge(ranking){
            return ((ranking * 40) / 100)+'em';
        }

        function styleElement(element, name, ranking) {
            element.innerText = name
            element.style.position = "absolute"
            element.style.display = "hidden"
            element.style.fontSize = getFontBasedOnKnowledge(ranking)
            element.style.color = '#98971a'
            element.style.background = '#282828'
        }

        function positionElement(element) {
            let width = element.offsetWidth
            let height = element.offsetHeight
            let textXBound = (Math.random() * ((playground.offsetWidth-width) - width/2) + width/2)
            let textYBound = (Math.random() * ((playground.offsetHeight-height) - height/2) + height/2)

            element.style.top = textYBound+'px'
            element.style.left = textXBound+'px'
        }



        function mousePosition(e) {
            // console.log(e)
            window.mouseClientX = e.x
            window.mouseClientY = e.y
        }

        // window.addEventListener('resize', draw);


    </script>


</x-layout>
