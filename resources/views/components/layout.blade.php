<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>REVERT CREATIONS</title>

    <link rel="stylesheet" href="https://use.typekit.net/pem2qrs.css">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    <!-- Google tag (gtag.js) -->
    @if(app()->environment() == 'production')
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6QN5TG2HZL"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6QN5TG2HZL');
        </script>
    @endif
</head>
<body class="h-full overflow-x-hidden">

    <div id="app" class="flex flex-col md:max-w-3xl mx-auto h-full bg-white">

        <header id="main_header">
            <div id="logo" class="relative h-40 md:h-72">
                <img class="absolute right-2 w-large-square-half md:w-large-square-full" src="{{ asset('svgs/large_red_square.svg') }}" alt="">
                <a class="absolute w-10/12 z-10 right-0 top-2" href="{{ route('home')}}"><img class="" src="{{ asset('svgs/logoBW.svg') }}"></a>
            </div>
        </header>


        <div id="content" class="">

            {{ $slot }}

        </div>

        <footer class="fixed w-full">
            <div class="relative">
                <img class="absolute left-2 w-small-square-half md:w-small-square-full" src="{{ asset('svgs/small_red_square.svg') }}" alt="">
                <a class="md:text-2xl absolute left-0 top-11 md:top-28 bg-revert-black text-white" href="mailto:trever@revertcreations.com">
                    <b>trever@revertcreations.com</b>
                </a>
            </div>
        </footer>

    </div>

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
