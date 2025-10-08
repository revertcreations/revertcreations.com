<!DOCTYPE html>
<html class="h-screen" lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="theme-color" content="#317EFB">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>REVERT CREATIONS</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

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

<body class="flex flex-col bg-gruvbox-black-hidden overflow-hidden h-full">

    <header id="main_header" class="sticky top-0 z-20 bg-gradient-to-b from-[#1f1f1f]/95 via-[#1a1a1a]/90 to-transparent backdrop-blur border-b border-[#2f2f2f]">
        <div class="mx-auto w-full max-w-6xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <a class="block" style="max-width: clamp(12rem, 50vw, 20rem);" href="{{ route('home') }}">
                <img class="w-full" src="{{ asset('svgs/logoBW.svg') }}" alt="Revert Creations">
            </a>
            <nav class="flex flex-wrap gap-3 text-sm uppercase tracking-wide text-gruvbox-light-blue md:ml-auto">
                <a href="{{ route('build.index') }}" class="nav-link">Build journals</a>
                <a href="{{ route('opportunities.index') }}" class="nav-link">Opportunities</a>
            </nav>
        </div>
    </header>

    <div id="content" class="flex flex-col w-full flex-1 md:max-w-screen-xl self-center overflow-y-auto px-4 md:px-0">
        {{ $slot }}
    </div>

    <x-site-footer />

    @stack('scripts')

</body>

</html>
