<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>AI Product Studio Admin</title>
    <meta name="author" content="Trever Hillis">
    <meta name="description" content="Admin control room for revertcreations.com">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body class="bg-gradient-to-b from-gruvbox-charcoal via-[#1d1d1d] to-gruvbox-black-hidden text-gruvbox-white min-h-screen">

    <div class="flex min-h-screen flex-col">
        <header class="sticky top-0 z-30 border-b border-[#2f2f2f] bg-gradient-to-b from-[#1f1f1f]/95 via-[#1a1a1a]/90 to-transparent backdrop-blur">
            <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <div class="flex items-center gap-3">
                    <a class="hidden md:block w-40" href="{{ route('home') }}">
                        <img class="w-full" src="{{ asset('svgs/logoBW.svg') }}" alt="Revert Creations">
                    </a>
                    <nav class="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                        <a href="{{ route('admin.dashboard') }}" class="nav-link {{ Route::is('admin.dashboard') ? 'bg-gruvbox-highlight/60 text-gruvbox-yellow' : 'text-gruvbox-light-blue' }} px-3 py-2 rounded-md">
                            Dashboard
                        </a>
                        <a href="{{ route('admin.opportunities.index') }}" class="nav-link {{ Route::is('admin.opportunities.*') ? 'bg-gruvbox-highlight/60 text-gruvbox-yellow' : 'text-gruvbox-light-blue' }} px-3 py-2 rounded-md">
                            Opportunities
                        </a>
                        <a href="{{ route('admin.activities.index') }}" class="nav-link {{ Route::is('admin.activities.*') ? 'bg-gruvbox-highlight/60 text-gruvbox-yellow' : 'text-gruvbox-light-blue' }} px-3 py-2 rounded-md">
                            Activity Feed
                        </a>
                        <a href="{{ route('admin.build-logs.index') }}" class="nav-link {{ Route::is('admin.build-logs.*') ? 'bg-gruvbox-highlight/60 text-gruvbox-yellow' : 'text-gruvbox-light-blue' }} px-3 py-2 rounded-md">
                            Build Log
                        </a>
                    </nav>
                </div>
                <div class="flex items-center gap-3">
                    <a href="{{ route('home') }}" class="hidden md:inline-flex items-center rounded-md border border-gruvbox-highlight px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gruvbox-light-blue hover:bg-gruvbox-highlight/40">
                        View Site
                    </a>
                    <a href="{{ route('admin.logout') }}" class="inline-flex items-center rounded-md bg-gruvbox-purple/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gruvbox-light-yellow hover:bg-gruvbox-purple/40">
                        Logout
                    </a>
                </div>
            </div>
        </header>

        <main class="flex-1 px-4 py-10">
            <div class="mx-auto w-full max-w-6xl">
                {{ $slot }}
            </div>
        </main>

        <x-site-footer variant="admin" />
    </div>

    <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>
