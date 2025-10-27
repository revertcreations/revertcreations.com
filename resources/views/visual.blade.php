<x-layout>

    <div class="flex flex-col mx-auto">
        <div class="flex flex-col mt-2">
            <i class="mt-1 bg-black text-white text-4xl">Shorts</i>
            <div class="flex flex-row">

                <iframe width="315" height="560"
                    src="https://youtube.com/embed/jikZedWNWO4?si=d4NUNcjbJKjt4Acz"
                    title="Charvel Jake E Lee"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>

                <iframe width="315" height="560"
                    src="https://youtube.com/embed/CiOJgVWf9pE?feature=share"
                    title="1980 Gibson Firebrand"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>

                <iframe width="315" height="560"
                    src="https://youtube.com/embed/xcynwkfcXaQ?feature=share"
                title="2008 EVH Wolfgang USA"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
            </div>
        </div>

        <div class="flex flex-col mt-2">
            <i class="mt-1 bg-black text-white text-4xl">Photography</i>

            <div id="thumbnail_wrap" class="flex flex-row flex-wrap justify-center my-10">
                @foreach ($portfolio as $index => $image)
                <div class="m-2 cursor-pointer">
                    <img
                        id="{{ $image->id }}"
                        onclick="openImage(event)"
                        class=""
                        data-src="https://res.cloudinary.com/junkyardwatchdog/image/upload/{{ $image->public_id }}.{{ $image->extension }}"
                        src="https://res.cloudinary.com/junkyardwatchdog/image/upload/w_400,c_scale,q_auto:low/{{ $image->public_id }}.{{ $image->extension }}"
                        />
                </div>
                @endforeach
            </div>

        </div>




        <div class="flex flex-col mt-2">
            <i class="mt-1 bg-black text-white text-4xl">Show Reel</i>
            <p class="text-gruvbox-white">Coming Soon...</p>
        </div>
</div>
    <script type="text/javascript">

        function openImage(e) {

            document.getElementById('thumbnail_wrap').style.display = 'none'
            let close_button = document.createElement('div')
            close_button.id = 'close_button'
            close_button.classList.add('absolute', 'right-20', 'text-5xl', 'bg-black', 'text-white', 'hover:text-red-500', 'cursor-pointer');
            close_button.addEventListener('click', closeImage)
            close_button.innerHTML = '<span>X</span>'

            let body = document.body
            let content = document.getElementById('content');

            content.appendChild(close_button)
            content.style.backgroundImage = 'url('+e.target.dataset.src+')'
            content.style.backgroundSize = 'contain'
            content.style.backgroundRepeat = 'no-repeat'
            content.style.backgroundPosition = 'center center'

            document.getElementById('app').classList.add('hidden');

        }

        function closeImage() {

            let close_button = document.getElementById('close_button')
            let thumbnail_wrap = document.getElementById('thumbnail_wrap')
            thumbnail_wrap.style.display = 'flex'

            close_button.remove()
            let content = document.getElementById('content');

            content.style.backgroundImage = 'unset'
            document.getElementById('app').classList.remove('hidden');

        }

        function slideOut(el, direction) {
            let xPos = window.innerWidth + el.offsetWidth + "px"

            if(el.classList.contains('animate-translate'))
                el.classList.remove('animate-translate')

            el.style.setProperty('--translate-x', (direction == 'left' ? '-' : '')+xPos)
            el.style.setProperty('--translate-origin', '0px')
            el.classList.add('animate-translate')
        }

        function slideBack(el, direction) {

            if(el.classList.contains('animate-translate'))
                el.classList.remove('animate-translate')

        }

    </script>
</x-layout>
