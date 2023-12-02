<x-layout>

    <div id="" class="flex flex-row text-revert-black">

        <div id="title" class="self-top bg-gruvbox-red">
            <h1 class="text-5xl md:text-6xl">Hi.</h1>
            <h1 class="text-5xl md:text-6xl">I'm 
                <span class="cursor-not-allowed" id="name"><span id="letter-0">T</span><span id="letter-1">r</span><span id="letter-2">e</span><span id="letter-3">v</span><span id="letter-4">e</span><span id="letter-5">r</span></span>.
            </h1>
        </div>

        <div id="lead" class="self-start grow">
            <p id="default" class="text-xl md:text-2xl">
                I'm a <span class="underline decoration-4 decoration-revert-yellow">designer</span>,
                <span class="underline decoration-4 decoration-revert-green">developer</span>, and
                <span class="underline decoration-4 decoration-revert-blue"><a class="hover:bg-revert-blue hover:text-white" href="{{ route('photography') }}">photographer</a></span>.
                As a multi-disciplinary creative, I blend design, development, and photography
                to craft immersive experiences that capture attention and inspire wonder. 
                Whether I'm typing on a keyboard, clicking a mouse, or releasing a shutter, my
                ultimate goal is to create simple, yet stunning visuals that leave a lasting
                impact on viewers. Let's work together to bring your vision to life.
            </p>
            <p id="code" class="hidden text-xl md:text-2xl">
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
            <p class="hidden text-xl md:text-2xl">
                With over 15 years of photographic experience, I still get butterflies
                unveiling newly developed rolls of film. I mainly shoot medium format
                through my trusty Mamiya RB67, and M645 1000s systems. I use photography as my
                main artistic outlet, and hope to share my work through a subdomain of this site
                current under development. Keep an look out here for a subdomain link coming soon...
            </p>
        </div>
    </div>

    <script src="{{ asset('js/home.js') }}"></script>

</x-layout>
