<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>REVERT CREATIONS</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

</head>
<body class="h-full overflow-x-hidden">

    <div id="app" class="flex flex-col h-full">

        {{-- <header id="main_header">
            <nav>
                <ul class="flex justify-between">
                    <li class="m-5"><a href="{{ route('web-development') }}"><span id="computer_icon">&#128421;</span> web development</a></li>
                    <li class="m-5"><a href="{{ route('photography') }}"><span id="camera_icon">&#128247;</span> photography</a></li>
                </ul>
            </nav>
        </header> --}}


        <div id="content" class="flex flex-col h-full">

            <h1
                id="home_title"
                class="self-end text-6xl sm:text-8xl mt-3 mb-3 logo-link {{ (Route::is('web-development') || Route::is('web-development.*') ? 'web-development' : (Route::is('home') ? 'home' : 'photography')) }}">
                    <a href="{{ route('home')}}">REVERT CREATIONS</a>
            </h1>

            {{ $slot }}

        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
