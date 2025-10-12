<!DOCTYPE html>
<html class="h-screen"
    lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
    <meta name="theme-color"
        content="#317EFB">
    <meta name="csrf-token"
        content="{{ csrf_token() }}">
    <meta name="description"
        content="Trever Hillis is a full-stack web developer crafting animated, interactive front-end experiences that fuse code, motion, and design for modern brands.">
    <title>
        @isset($title)
            {{ $title }} | REVERT CREATIONS
        @else
            REVERT CREATIONS
        @endisset
    </title>

    @php
        $appCssVersion = file_exists(public_path('css/app.css')) ? filemtime(public_path('css/app.css')) : time();
    @endphp
    <link href="{{ asset('css/app.css') }}?v={{ $appCssVersion }}"
        rel="stylesheet">
    @stack('styles')

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

<body class="flex h-full flex-col overflow-hidden bg-gruvbox-black-hidden">

    <header id="main_header">
        <div class=""
            id="logo">
            <a class="right-0 top-2 z-10 flex w-10/12 items-center"
                href="{{ route('home') }}"
                aria-label="Revert Creations home">
                <span class="sr-only">Revert Creations home</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1600 158">
                    <defs>
                        <style>
                            .cls-1 {
                                fill: #232323;
                            }

                            .cls-2 {
                                fill: #bcbcbc;
                            }
                        </style>
                    </defs>
                    <g id="Background">
                        <rect class="cls-1"
                            id="background"
                            width="1600"
                            height="158" />
                    </g>
                    <g id="REVERT_CREATIONS"
                        data-name="REVERT CREATIONS">
                        <path class="cls-2"
                            id="R"
                            d="M127.68,58.81c-2.1,14.94-11.66,26-23.51,30.74l18.26,40.94h-32.85l-12.93-38.38h-13.46l-5.4,38.38h-30l14.76-105h57.84c17.45,0,30.23,13.24,27.29,33.31h0ZM90.83,67.61c3.74,0,8.28-3.1,9.08-8.79.82-5.59-2.86-8.72-6.62-8.72h-24.19l-2.46,17.51h24.19Z" />
                        <path class="cls-2"
                            id="E"
                            d="M174.66,63.22h44.05l-3.46,24.6h-44.05l-2.54,18.08h51.4l-3.46,24.6h-81.4l14.76-105h79.9l-3.46,24.6h-49.9l-1.84,13.12Z" />
                        <path class="cls-2"
                            id="V"
                            d="M261.7,130.5l-21.09-105h32.33l9.98,70.66,30.19-70.66h33.07l-50.61,105h-33.87Z" />
                        <path class="cls-2"
                            id="E-2"
                            data-name="E"
                            d="M383.46,63.22h44.05l-3.46,24.6h-44.05l-2.54,18.08h51.4l-3.46,24.6h-81.4l14.76-105h79.9l-3.46,24.6h-49.9l-1.84,13.12Z" />
                        <path class="cls-2"
                            id="R-2"
                            data-name="R"
                            d="M541.08,58.81c-2.1,14.94-11.66,26-23.51,30.74l18.26,40.94h-32.85l-12.93-38.38h-13.46l-5.4,38.38h-30l14.76-105h57.84c17.45,0,30.23,13.24,27.29,33.31h0ZM504.23,67.61c3.74,0,8.28-3.1,9.08-8.79.82-5.59-2.86-8.72-6.62-8.72h-24.19l-2.46,17.51h24.19Z" />
                        <path class="cls-2"
                            id="T"
                            d="M611.63,50.1l-11.3,80.4h-30l11.3-80.4h-28.48l3.46-24.6h86.96l-3.46,24.6h-28.48Z" />
                        <path class="cls-2"
                            id="C"
                            d="M745.5,23.4c14.37,0,29.07,5.61,41.04,15.49l-9.22,19.49c-9.78-6.52-20.6-9.68-29.79-9.65-16.1.05-29.94,9.75-32.92,30.93-2.75,19.57,7.26,27.55,21.96,27.57,10.86,0,23.31-4.28,34.99-11.15l5.74,21.35c-14.78,10.29-31.22,15.15-44.4,15.15-33.81,0-52.8-25.24-48.44-56.27,4.16-29.56,28.61-52.92,61.04-52.92h0Z" />
                        <path class="cls-2"
                            id="R-3"
                            data-name="R"
                            d="M891.33,58.81c-2.1,14.94-11.66,26-23.51,30.74l18.26,40.94h-32.85l-12.93-38.38h-13.46l-5.4,38.38h-30l14.76-105h57.84c17.45,0,30.22,13.24,27.29,33.31h0ZM854.47,67.61c3.74,0,8.28-3.1,9.08-8.79.82-5.59-2.86-8.72-6.62-8.72h-24.19l-2.46,17.51h24.19Z" />
                        <path class="cls-2"
                            id="E-3"
                            data-name="E"
                            d="M938.3,63.22h44.05l-3.46,24.6h-44.05l-2.54,18.08h51.4l-3.46,24.6h-81.4l14.76-105h79.9l-3.46,24.6h-49.9l-1.84,13.12Z" />
                        <path class="cls-2"
                            id="A"
                            d="M1068.65,130.5l-3.35-17.43h-34.87l-8.25,17.43h-33.11l55.7-105h29.96l26.19,105h-32.29ZM1060.57,88.47l-5.15-27.77-13.34,27.77h18.49Z" />
                        <path class="cls-2"
                            id="T-2"
                            data-name="T"
                            d="M1165.72,50.1l-11.3,80.4h-30l11.3-80.4h-28.48l3.46-24.6h86.96l-3.46,24.6h-28.48Z" />
                        <path class="cls-2"
                            id="I"
                            d="M1195.7,130.5l14.76-105h30l-14.76,105h-30Z" />
                        <path class="cls-2"
                            id="O"
                            d="M1364.12,79.67c-4.13,29.36-29.04,52.92-62.71,52.92s-54.47-25.24-50.11-56.27c4.16-29.56,29.27-52.92,62.71-52.92s54.47,25.24,50.11,56.27ZM1313.28,48.75c-16.33,0-29.32,13.13-31.82,30.93-2.26,16.12,5.89,27.58,20.78,27.58,16.14,0,29.25-13.16,31.75-30.93,2.28-16.24-5.98-27.58-20.7-27.58h0Z" />
                        <path class="cls-2"
                            id="N"
                            d="M1471.38,130.5h-26.77l-.22-.6-33.22-58.58-8.18,59.17h-28.8l14.76-105h26.78l.17.52,33.12,59.7,8.32-60.23h28.8l-14.75,105Z" />
                        <path class="cls-2"
                            id="S"
                            d="M1581.94,37.07l-18.05,18.58c-5.8-4.95-12.85-6.9-21.55-6.9-7.35,0-12.9,1.35-13.95,7.2-.75,4.35,1.95,6.15,14.4,9.6,15.15,4.2,36.45,10.2,32.55,34.8-3.9,25.05-27.9,32.25-45.6,32.25s-34.65-6.9-42.31-18.95l18.92-16.77c4.19,6.18,13.19,10.38,24.3,10.38s13.63-3.9,14.23-7.95c.75-5.25-2.7-6.45-13.5-9.75-23.1-7.05-36.75-11.4-33.6-33,3.6-24.15,23.4-33.15,46.05-33.15,17.4,0,29.85,5.25,38.1,13.67Z" />
                    </g>
                </svg>
            </a>
        </div>
    </header>

    <div class="flex w-full flex-1 flex-col self-center overflow-y-auto md:max-w-screen-xl md:flex-row"
        id="content">
        {{ $slot }}
    </div>

    <div class="flex flex-nowrap bg-gruvbox-orange text-revert-black"
        id="footer">

        <footer-magnet-element class="relative grow bg-gruvbox-yellow">
            <a class="relative flex h-full w-full cursor-pointer items-center justify-center p-4"
                href="{{ route('projects.index') }}">
                <h2 class="skill inline text-3xl font-bold md:text-5xl"
                    data-footer-label
                    name="design">projects</h2>
            </a>
        </footer-magnet-element>

        <footer-magnet-element class="relative grow bg-gruvbox-blue">
            <a class="relative flex h-full w-full cursor-pointer items-center justify-center p-4"
                href="mailto:trever@revertcreations.com">
                <h2 class="skill inline text-3xl font-bold md:text-5xl"
                    data-footer-label>email</h2>
            </a>
        </footer-magnet-element>

    </div>

    @php
        $homeJsVersion = file_exists(public_path('js/home.js')) ? filemtime(public_path('js/home.js')) : time();
    @endphp
    <script src="{{ asset('js/home.js') }}?v={{ $homeJsVersion }}" defer></script>
    @stack('scripts')
</body>

</html>
