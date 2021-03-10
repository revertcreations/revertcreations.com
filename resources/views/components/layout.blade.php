<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>revert creations</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

</head>
<body>

    <div id="app">

        <header>
            <nav>
                <ul>
                    <li><a href="{{ route('code') }}"><span id="computer_icon">&#128421;</span> web development</a></li>
                    <li><a href="{{ route('photography') }}"><span id="camera_icon">&#128247;</span> photography</a></li>
                    <li><a href="{{ route('about') }}">about</code></a></li>
                </ul>
            </nav>
        </header>


        <div id="content">

            <h1>REVERT CREATIONS</h1>

            {{ $slot }}

        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
