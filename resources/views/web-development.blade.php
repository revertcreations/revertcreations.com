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

            <div id="playground" class="flex-grow bg-gruvbox-black relative">

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

            data[skill].active = false;
            data[skill].currentX;
            data[skill].currentY;
            data[skill].initialX;
            data[skill].initialY;
            data[skill].xOffset = 0;
            data[skill].yOffset = 0;

            styleElement(element, name, ranking)
            playground.appendChild(element)
            positionElement(element)
            addClickMove(data[skill])

        }

        function getFontBasedOnKnowledge(ranking){
            return ((ranking * 40) / 100)+'em';
        }

        function styleElement(element, name, ranking) {
            element.innerText = name
            element.style.position = "absolute"
            // element.style.display = "none"
            element.style.fontSize = getFontBasedOnKnowledge(ranking)
            element.style.background = '#282828'
            element.classList.add('cursor-pointer')
            element.classList.add('hover:text-gruvbox-purple')
            element.classList.add('text-gruvbox-green')
        }

        function positionElement(element) {
            let width = element.offsetWidth
            let height = element.offsetHeight
            let textXBound = (Math.random() * ((playground.offsetWidth-width) - width/2) + width/2)
            let textYBound = (Math.random() * ((playground.offsetHeight-height) - height/2) + height/2)

            element.style.top = textYBound+'px'
            element.style.left = textXBound+'px'
        }


        function addClickMove(skill) {

            skill.element.addEventListener('mousedown', dragStart, false)
            skill.element.addEventListener('mouseup', dragEnd, false)
            skill.element.addEventListener('mousemove', drag, false)

            skill.element.addEventListener('touchstart', dragStart, false)
            skill.element.addEventListener('touchend', dragEnd, false)
            skill.element.addEventListener('touchmove', dragStart, false)

            function dragStart(e) {

                skill.element.style.zIndex = "2"
                if (e.type === "touchstart") {
                    skill.initialX = e.touches[0].clientX - skill.xOffset;
                    skill.initialY = e.touches[0].clientY - skill.yOffset;
                } else {
                    skill.initialX = e.clientX - skill.xOffset;
                    skill.initialY = e.clientY - skill.yOffset;
                }

                if (e.target === skill.element) {
                    skill.active = true;
                }
            }

            function dragEnd(e) {
                skill.initialX = skill.currentX;
                skill.initialY = skill.currentY;

                if(skill.elementChild) {
                    skill.element.removeChild(skill.elementChild)
                    delete skill.elementChild
                }

                skill.active = false;
            }

            function drag(e) {
                if (skill.active) {

                    e.preventDefault();

                    if(e.movementX > 15 || e.movementX < -15) {
                        console.log('shake it like a poloriod picture')

                        if(skill.elementChild) {
                            skill.element.removeChild(skill.elementChild)
                            delete skill.elementChild
                        } else {
                            skill.elementChild =  document.createElement('div')
                            skill.elementChild.innerText = 'more info here'
                            skill.elementChild.style.position = "block"
                            skill.elementChild.style.background = '#282828'
                            skill.elementChild.classList.add('cursor-pointer')
                            skill.elementChild.classList.add('p-4')
                            skill.elementChild.classList.add('text-white')

                            skill.element.appendChild(skill.elementChild)
                        }
                    }

                    // console.log('e', e.movementX)

                    if (e.type === "touchmove") {
                        skill.currentX = e.touches[0].clientX - skill.initialX;
                        skill.currentY = e.touches[0].clientY - skill.initialY;
                    } else {
                        skill.currentX = e.clientX - skill.initialX;
                        skill.currentY = e.clientY - skill.initialY;
                    }

                    skill.xOffset = skill.currentX;
                    skill.yOffset = skill.currentY;

                    setTranslate(skill.currentX, skill.currentY, skill.element);
                }
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            }
        }

    </script>


</x-layout>
