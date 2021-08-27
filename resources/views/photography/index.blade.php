<x-layout>

    <span id="page_title">
        <i class="mt-1 bg-black text-white text-4xl">Portfolio</i>
    </span>

    <div id="close_button" class="hidden fixed top-10 right-10 text-5xl bg-black text-white hover:text-red-500 cursor-pointer" onclick="closeImage()">
        <span>X</span>
    </div>

    <div class="flex flex-col">


    {{-- @foreach ($portfolio as $index => $image)
        <div
            id="large_photo_{{ $image->id }}"
            class="mx-auto my-8 m-w-1000 {{ $index == 0 ? 'active' : 'hidden' }}"
        >
            <img
                src="https://res.cloudinary.com/treverhillis/image/upload/w_1000,c_scale,q_auto:best/{{ $image->public_id }}.{{ $image->extension }}"
                alt="" />
        </div>
	@endforeach --}}

	    <div id="thumbnail_wrap" class="flex flex-row flex-wrap justify-center my-10">
            @foreach ($portfolio as $index => $image)
            <div class="m-2 cursor-pointer">
                <img
                    id="{{ $image->id }}"
                    onclick="openImage(event)"
                    class=""
                    data-src="https://res.cloudinary.com/treverhillis/image/upload/{{ $image->public_id }}.{{ $image->extension }}"
                    src="https://res.cloudinary.com/treverhillis/image/upload/w_400,c_scale,q_auto:low/{{ $image->public_id }}.{{ $image->extension }}"
                    />
            </div>
            @endforeach
        </div>

    </div>

    <div class="fixed bottom-0 right-0">
        <h2 class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:text-black hover:bg-white"><a href="{{ route('public.photoshoot.create') }}">book me</a></h2>
    </div>

    <script type="text/javascript">
        const homeTitle = document.getElementById('home_title')

        function openImage(e) {

            document.getElementById('thumbnail_wrap').style.display = 'none'

            let body = document.body
            body.style.backgroundImage = 'url('+e.target.dataset.src+')'
            body.style.backgroundSize = 'contain'
            body.style.backgroundRepeat = 'no-repeat'
            body.style.backgroundPosition = 'center center'
            body.style.zIndex = 2

            document.getElementById('close_button').style.display = 'block'

            slideOut(document.getElementById('page_title'), 'left')
            slideOut(document.getElementById('home_title'), 'right')

        }

        function closeImage() {

            document.getElementById('close_button').style.display = 'none'
            document.body.style.backgroundImage = 'unset'

            let thumbnail_wrap = document.getElementById('thumbnail_wrap')
            thumbnail_wrap.style.display = 'flex'

            slideBack(document.getElementById('page_title'), 'left')
            slideBack(document.getElementById('home_title'), 'right')
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
