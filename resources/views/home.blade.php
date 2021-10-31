<x-layout>

    <div class="mx-6 mb-20 text-revert-black">
        <div id="title" class="mb-8">
            <h1 class="text-6xl">Hi.</h1>
            <h1 class="text-6xl">I'm Trever.</h1>
        </div>

        <div id="lead" class="max-w-xs">
            <p class="text-2xl">
                I’m a <span id="designerHighlight">designer</span>,
                <span id="developerHighlight">developer</span>, and
                <span id="photographerHighlight">photographer</span>.
                I type on keyboards, click mice, and release shutters with
                the ambition of producing simple, beautiful, and rich
                experiences for others to enjoy.
            </p>
        </div>
    </div>

    <div class="fixed bottom-8  flex mx-6 text-revert-black">
        <div id="design_skill" class="relative flex-1 mx-4">
            <h2 name="design" class="skill cursor-pointer text-5xl mb-8">Design</h2>
            {{-- <img id="design_skill_svg" class="absolute -top-0.5 left-2" width="80" src="{{ asset('svgs/design.svg') }}" alt=""> --}}
            <iframe
                id="design_skill_svg"
                class="absolute -top-14 -left-10"
                src="{{ asset('svgs/designAnimation.html') }}"
                frameborder="0">
            </iframe>

            <p class="hidden">

            </p>
        </div>
        <div class="relative flex-1 mx-4">
            <h2 class="relative skill cursor-pointer text-5xl mb-8">Code</h2>
            {{-- <img id="code_skill_svg" class="absolute -top-0.5 left-1" width="50" src="{{ asset('svgs/code.svg') }}" alt=""> --}}
            <iframe
                id="code_skill_svg"
                class="absolute -top-2 left-14"
                src="{{ asset('svgs/codeAnimation.html') }}"
                frameborder="0">
            </iframe>
            <p class="hidden">
                My previous position I worked as a full-stack web developer building ticketing
                software with the great people at
                <a  class="text-hmt-green underline"
                    target="_blank"
                    href="https://tickets.holdmyticket.com">
                    HoldMyTicket
                </a>.
                I've gained a lot of confidence in many technologies - Docker, Kubernetes, Heroku,
                Git; languages - Javascript, NodeJS, PHP, Bash, and Swift; and software - DevTools,
                Xcode, GitHub, Cloudinary, Vagrant, Linux. These tools help me effenciently
                build complex, interactive, responsive, and secure applications, where limitations
                now only lie in my imagination.
            </p>
        </div>
        <div class="flex-1 mx-4 relative">
            <h2 id="photo_skill" class="skill relative cursor-pointer text-5xl mb-8">Photo</h2>
            {{-- <img id="photo_skill_svg" class="absolute -top-0.5 right-2" width="50" src="{{ asset('svgs/photo.svg') }}" alt=""> --}}
            <iframe
                id="photo_skill_svg"
                class="absolute top-1 left-12"
                src="{{ asset('svgs/polaroidAnimation.html') }}"
                frameborder="0">
            </iframe>
            <p class="hidden">
                With over 15 years of photographic experience, I still get butterflies
                unveiling newly developed rolls of film. I mainly shoot medium format
                through my trusty Mamiya RB67, and m645 1000s systems. I use photography as my
                main artistic outlet, and hope to share my work through a subdomain of this site
                current under development. Keep an look out here for a subdomain link coming soon...
            </p>
        </div>
    </div>

    {{-- <div class="mb-20 h-20"></div> --}}

    <script src="{{ asset('js/home.js') }}"></script>

</x-layout>
