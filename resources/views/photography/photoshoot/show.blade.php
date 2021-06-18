<x-layout>

    <form action="{{route('public.photoshoot.download', ['photoshoot' => $photoshoot->id, 'token' => $photoshoot->public_token])}}">
        @csrf
        <i class="mt-1 bg-black text-white text-4xl">{{ $photoshoot->title }}</i>

        <p class="m-5">
            Welcome back <span class=" underline font-bold text-lg">{{ $photoshoot->client->first_name }}</span>!
        </p>

        {{-- <p class="m-5">
            I had a great time on our shoot! Below are un-edited images to review. Double-click to select the images you wish
            to choose. You have <b>{{ $photoshoot->contract->delivered_images_count }}</b> to select for usage. Once you have
            chosen your images, click approve images on the bottom right.
        </p> --}}

        <p class="m-5">
            I had a great time on our shoot! Below are all un-edited images to use. Feel free to reach out for any touch-up's,
            or photoshop requests.
        </p>

        <br>


        <div id="close_button" class="hidden fixed top-10 right-10 text-5xl bg-black text-white hover:text-red-500 cursor-pointer" onclick="closeImage()">
            <span>X</span>
        </div>

        <div class="flex flex-col">

            <div id="thumbnail_wrap" class="flex flex-row flex-wrap justify-center my-10">
                @foreach ($photoshoot->images as $index => $image)
                <div class="m-2 cursor-pointer">
                    <a target="_blank" href="https://res.cloudinary.com/treverhillis/image/upload/{{ $image->public_id }}.{{ $image->extension }}">
                        <img
                            id="{{ $image->id }}"
                            class=""
                            data-src="https://res.cloudinary.com/treverhillis/image/upload/{{ $image->public_id }}.{{ $image->extension }}"
                            src="https://res.cloudinary.com/treverhillis/image/upload/w_400,c_scale,q_auto:low/{{ $image->public_id }}.{{ $image->extension }}"
                            />
                    </a>
                </div>
                @endforeach
            </div>

        </div>

        <div class="fixed bottom-0 right-0">
            <h2 class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:text-black hover:bg-white"><a href="{{ route('public.photoshoot.create') }}">approve images</a></h2>
        </div>


    <script>


        function openImage(e)
        {

            document.getElementById('thumbnail_wrap').style.display = 'none'

            let body = document.body
            body.style.backgroundImage = 'url('+e.target.dataset.src+')'
            body.style.backgroundSize = 'contain'
            body.style.backgroundRepeat = 'no-repeat'
            body.style.backgroundPosition = 'center center'
            body.style.zIndex = 2

            document.getElementById('close_button').style.display = 'block'

            slideOut(document.getElementById('main_header'), 'right')
            slideOut(document.getElementById('page_title'), 'left')
            slideOut(document.getElementById('home_title'), 'right')

            // current_large_photo.classList.add('none')
            // current_large_photo.classList.remove('active')

        }

        function closeImage() {

            document.getElementById('close_button').style.display = 'none'
            document.body.style.backgroundImage = 'unset'

            let thumbnail_wrap = document.getElementById('thumbnail_wrap')
            thumbnail_wrap.style.display = 'flex'

            slideBack(document.getElementById('main_header'), 'right')
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

            // let xPos = window.innerWidth + el.offsetWidth + "px"

            if(el.classList.contains('animate-translate'))
                el.classList.remove('animate-translate')

            // el.style.setProperty('--translate-x', '0px')
            // el.style.setProperty('--translate-origin', (direction == 'left' ? '-' : '')+xPos)
            // el.classList.remove('animate-translate')
            // el.classList.add('animate-translate')

        }

    </script>

    </form>

</x-layout>
