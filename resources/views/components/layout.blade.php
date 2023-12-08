<!DOCTYPE html>
<html class="h-screen"
    lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
    <title>REVERT CREATIONS</title>

    <link href="https://use.typekit.net/pem2qrs.css"
        rel="stylesheet">
    <link href="{{ mix('css/app.css') }}"
        rel="stylesheet">

    @if (app()->environment() == 'production')
        <!-- Google tag (gtag.js) -->
        <script async
            src="https://www.googletagmanager.com/gtag/js?id=G-6QN5TG2HZL"></script>
        <script>
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());

            gtag('config', 'G-6QN5TG2HZL');
        </script>
    @endif

</head>

<body class="h-full bg-gruvbox-black-hidden overflow-hidden">

    <div class="space-between flex h-full flex-col overflow-hidden"
        id="app">

        <header class=""
            id="main_header">
            <div class="bg-gruvbox-blue"
                id="logo">
                {{-- <img class="w-large-square-half md:w-large-square-full" src="{{ asset('svgs/large_red_square.svg') }}" alt=""> --}}
                <a class="right-0 top-2 z-10 w-10/12"
                    href="{{ route('home') }}"><img class=""
                        src="{{ asset('svgs/logoBW.svg') }}"></a>
            </div>

            {{-- <div class="">
                <img class="w-small-square-half md:w-small-square-full" src="{{ asset('svgs/small_red_square.svg') }}" alt="">
                <a class="md:text-2xl bg-revert-black text-white" href="mailto:trever@revertcreations.com">
                <b>reach out</b>
                <b>trever@revertcreations.com</b>
                </a>
            </div> --}}

        </header>

        <div class="flex w-full grow flex-row md:max-w-screen-lg self-center"
            id="content">

            {{ $slot }}

        </div>

        <div class="flex flex-nowrap bg-gruvbox-orange text-revert-black">

            <div class="relative grow p-4 bg-gruvbox-yellow"
                id="">
                <h2 class="skill inline cursor-pointer text-3xl md:text-5xl"
                    name="design">blog</h2>
                <iframe class="absolute -top-10 left-10 hidden"
                    id="design_skill_svg"
                    src="{{ asset('svgs/designAnimation.html') }}"
                    frameborder="0">
                </iframe>
            </div>

            <div class="relative grow p-4 bg-gruvbox-blue">
                <h2 class="skill cursor-pointer text-3xl md:text-5xl">contact</h2>
                <iframe class="absolute right-0 top-0 hidden"
                    id="code_skill_svg"
                    src="{{ asset('svgs/codeAnimation.html') }}"
                    frameborder="0"
                    width="44"
                    height="76">
                </iframe>
            </div>
{{-- 
            <div class="relative grow p-4 bg-gruvbox-yellow">
                <h2 class="skill cursor-pointer text-3xl md:text-5xl"
                    id="photo_skill">
                    <a href="{{ route('photography') }}">Photograph</a>
                </h2>
                <iframe class="absolute top-0 hidden"
                    id="photo_skill_svg"
                    src="{{ asset('svgs/polaroidAnimation.html') }}"
                    frameborder="0"
                    width="66"
                    height="79">
                </iframe>
            </div>
        </div> --}}

    </div>

    <script src="{{ mix('js/app.js') }}"></script>
</body>

</html>
