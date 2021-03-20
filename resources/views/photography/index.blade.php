<x-layout>

    <span>
        <i class="mt-1 bg-black text-white text-4xl">Portfolio</i>
    </span>

    <div class="flex flex-col">

        <div class="flex flex-row">
            @foreach ($portfolio as $index => $image)
            <div class="m-2 cursor-pointer">
                <img
                    id="{{ $image->id }}"
                    onclick="changeImage(event)"
                    class="w-28"
                    data-src="https://res.cloudinary.com/treverhillis/image/upload/w_1000,c_scale,q_auto:best/{{ $image->public_id }}.{{ $image->extension }}"
                    src="https://res.cloudinary.com/treverhillis/image/upload/w_400,c_scale,q_auto:low/{{ $image->public_id }}.{{ $image->extension }}"
                    />
            </div>
            @endforeach
        </div>

        @foreach ($portfolio as $index => $image)
        <div
            id="large_photo_{{ $image->id }}"
            class="mx-auto my-8 m-w-1000 {{ $index == 0 ? 'active' : 'hidden' }}"
        >
            <img
                src="https://res.cloudinary.com/treverhillis/image/upload/w_1000,c_scale,q_auto:best/{{ $image->public_id }}.{{ $image->extension }}"
                alt="" />
        </div>
        @endforeach
    </div>

    <div class="fixed bottom-0 right-0">
        <h2 class="cursor-pointer self-end text-4xl mt-3 bg-black text-white hover:text-black hover:bg-white"><a href="{{ route('public.photoshoot.create') }}">book me</a></h2>
    </div>


<script>


    function changeImage(e)
    {
        let current_large_photo = document.querySelector('.active')
        current_large_photo.classList.add('hidden')
        current_large_photo.classList.remove('active')

        let large_photo = document.getElementById('large_photo_'+e.target.id)
        large_photo.classList.remove('hidden')
        large_photo.classList.add('active')
    }

</script>

</x-layout>
