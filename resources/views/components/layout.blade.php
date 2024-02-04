<!DOCTYPE html>
<html class="h-screen"
    lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
    <meta name="theme-color" content="#317EFB">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>REVERT CREATIONS</title>

    <link href="{{ mix('css/app.css') }}"
        rel="preload"
        type="text/css"
        as="style"
        onload="this.onload=null;this.rel='stylesheet';">

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

    <script src="/js/home.js" type="module" defer></script>
</head>

<body class="flex flex-col bg-gruvbox-black-hidden overflow-hidden h-full">

    <header id="main_header">
        <div class="bg-gruvbox-blue"
            id="logo">
            <a class="right-0 top-2 z-10 w-10/12"
                href="{{ route('home') }}">
                <img class="w-full"
                    src="{{ asset('svgs/logoBW.svg') }}"
                    alt="Revert Creations">
            </a>
        </div>
    </header>

    <div id="content" class="flex flex-col w-full flex-1 md:flex-row md:max-w-screen-xl self-center overflow-y-auto">
        {{ $slot }}
    </div>

    <div id="footer" class="flex flex-nowrap bg-gruvbox-orange text-revert-black">

        <div class="relative grow p-4 bg-gruvbox-yellow">
            <a href="{{ route('blog') }}">
                <h2 class="skill inline cursor-pointer text-3xl md:text-5xl"
                    name="design">blog</h2>
            </a>
        </div>

        <div class="relative grow p-4 bg-gruvbox-blue">
            <a href="{{ route('contact') }}">
                <h2 class="skill cursor-pointer text-3xl md:text-5xl">contact</h2>
            </a>
        </div>

</body>

</html>
