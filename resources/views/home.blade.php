<x-layout>

    <div class="mx-6 mb-20 text-revert-black">
        <div id="title" class="mb-8">
            <h1 class="text-5xl md:text-6xl">Hi.</h1>
            <h1 class="text-5xl md:text-6xl">I'm Trever.</h1>
        </div>

        <div id="lead" class="max-w-xs">
            <p class="text-xl md:text-2xl">
                I'm a <span id="designerHighlight">designer</span>,
                <span id="developerHighlight">developer</span>, and
                <span id="photographerHighlight">photographer</span>.
                As a multi-disciplinary creative, I blend design, development, and photography
                to craft immersive experiences that capture attention and inspire wonder.
                Whether I'm typing on a keyboard, clicking a mouse, or releasing a shutter, my
                ultimate goal is to create simple, yet stunning visuals that leave a lasting
                impact on viewers. Let's work together to bring your vision to life!
            </p>
        </div>
    </div>

    <div class="fixed bottom-8  flex mx-6 text-revert-black">

        <div id="design_skill" class="relative flex-1 mx-4">
            <h2 name="design" class="skill cursor-pointer text-3xl md:text-5xl mb-8">Design</h2>
            <iframe
                id="design_skill_svg"
                class="absolute"
                src="{{ asset('svgs/designAnimation.html') }}"
                frameborder="0">
            </iframe>
        </div>

        <div class="relative flex-1 mx-4">
            <a href="https://github.com/revertcreations" target="_blank">
                <h2 class="relative skill cursor-pointer text-3xl md:text-5xl mb-8">Code</h2>
            </a>
            <iframe
                id="code_skill_svg"
                class="absolute"
                src="{{ asset('svgs/codeAnimation.html') }}"
                frameborder="0">
            </iframe>
        </div>

	    <div class="relative flex-1 mx-4">
            <a href="{{ route('photography') }}">
                <h2 id="photo_skill" class="skill relative cursor-pointer text-3xl md:text-5xl mb-8">Photo</h2>
                <iframe
                    id="photo_skill_svg"
                    class="absolute"
                    src="{{ asset('svgs/polaroidAnimation.html') }}"
                    frameborder="0">
                </iframe>
            </a>
        </div>

    </div>


</x-layout>
