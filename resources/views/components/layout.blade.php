<!DOCTYPE html>
<html class="h-screen"
    lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
    <meta name="theme-color" content="#317EFB"/>
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

<body class="h-full bg-gruvbox-black-hidden overflow-hidden">

    <div class="space-between flex h-full flex-col overflow-hidden"
        id="app">

        <header class=""
            id="main_header">
            <div class="bg-gruvbox-blue"
                id="logo">
                <a class="right-0 top-2 z-10 w-10/12"
                    href="{{ route('home') }}">
                    <img class="w-full"
                        src="{{ asset('svgs/logoBW.svg') }}"
                        alt="Revert Creations">
                </a>
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

        <div id="footer" class="flex flex-nowrap bg-gruvbox-orange text-revert-black">

            <div class="relative grow p-4 bg-gruvbox-yellow"
                id="">
                <h2 class="skill inline cursor-pointer text-3xl md:text-5xl"
                    name="design">blog</h2>
            </div>

            <div class="relative grow p-4 bg-gruvbox-blue">
                <h2 class="skill cursor-pointer text-3xl md:text-5xl">contact</h2>
            </div>
    </div>

</body>

</html>
