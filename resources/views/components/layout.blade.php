<!DOCTYPE html>
<html class="h-screen" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>REVERT CREATIONS</title>

    <link rel="stylesheet" href="https://use.typekit.net/pem2qrs.css">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    @if(app()->environment() == 'production')
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6QN5TG2HZL"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-6QN5TG2HZL');
        </script>
    @endif

</head>
<body class="h-full bg-revert-gray">

    <div id="app" class="flex flex-col h-full space-between overflow-hidden">

        <header id="main_header" class="">
            <div id="logo" class="bg-gruvbox-blue">
                {{-- <img class="w-large-square-half md:w-large-square-full" src="{{ asset('svgs/large_red_square.svg') }}" alt=""> --}}
                <a class="w-10/12 z-10 right-0 top-2" href="{{ route('home')}}"><img class="" src="{{ asset('svgs/logoBW.svg') }}"></a>
            </div>
            
            {{-- <div class=""> --}}
                {{-- <img class="w-small-square-half md:w-small-square-full" src="{{ asset('svgs/small_red_square.svg') }}" alt=""> --}}
                {{-- <a class="md:text-2xl bg-revert-black text-white" href="mailto:trever@revertcreations.com"> --}}
                    {{-- <b>reach out</b> --}}
                    {{-- <b>trever@revertcreations.com</b> --}}
                {{-- </a> --}}
            {{-- </div> --}}
        </header>


        <div id="content" class="grow flex flex-row w-full overflow-y-scroll">

            {{ $slot }}

        </div>

        <div class="flex flex-nowrap text-revert-black bg-gruvbox-orange">
            {{-- <div class=""> --}}

                <div id="" class="grow relative bg-gruvbox-purple">
                    <h2 name="design" class="skill cursor-pointer text-3xl md:text-5xl">Design</h2>
                    <iframe
                        id="design_skill_svg"
                        class="absolute -top-10"
                        src="{{ asset('svgs/designAnimation.html') }}"
                        frameborder="0">
                    </iframe>
                </div>
        
                <div class="grow relative bg-gruvbox-blue">
                    <h2 class="skill cursor-pointer text-3xl md:text-5xl">Code</h2>
                    <iframe
                        id="code_skill_svg"
                        class="absolute top-0"
                        src="{{ asset('svgs/codeAnimation.html') }}"
                        frameborder="0">
                    </iframe>
                </div>
        
                <div class="grow relative bg-gruvbox-yellow">
                    <h2 id="photo_skill" class="skill cursor-pointer text-3xl md:text-5xl">
                        <a href="{{ route('photography') }}">Photo</a>
                    </h2>
                    <iframe
                        id="photo_skill_svg"
                        class="absolute top-0"
                        src="{{ asset('svgs/polaroidAnimation.html') }}"
                        frameborder="0">
                    </iframe>
                </div>
            {{-- </div> --}}
        </div>

        {{-- <footer class="fixed w-full">

        </footer> --}}

    </div>

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
