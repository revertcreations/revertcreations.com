<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ADMIN.revertcreations.com</title>
    <meta name="author" content="name">
    <meta name="description" content="admin page for revertcreations">
    <meta name="keywords" content="revert creations, revertcreations, admin">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>


<body>

    <div class="bg-gray-100 min-h-screen">
        <nav class="bg-gray-800">

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <a href="{{ route('admin.dashboard') }}" class="text-white text-lg font-semibold tracking-tight">Revert Admin</a>
                    </div>

                    <div class="-mr-2 flex md:hidden">
                        <button
                            type="button"
                            id="mobile-menu-button"
                            class="inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            aria-label="Toggle navigation"
                            aria-expanded="false"
                        >
                            <svg id="icon-menu-open" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg id="icon-menu-close" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex items-center">
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                                <a
                                    href="{{ route('admin.dashboard') }}"
                                    class="px-3 py-2 rounded-md text-sm font-medium
                                        {{
                                            Route::is('admin.dashboard') ?
                                            "bg-gray-900 text-white" :
                                            "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }}"
                                >
                                    Dashboard
                                </a>
                                <a
                                    href="{{ route('admin.client.index') }}"
                                    class="{{ Route::is('admin.client.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">
                                    Clients
                                </a>

                                <a href="{{ route('admin.skills.index') }}" class="{{ Route::is('admin.skills.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Skills</a>

                                <a href="{{ route('admin.projects.index') }}" class="{{ Route::is('admin.projects.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Projects</a>

                                <a href="{{ route('admin.posts.index') }}" class="{{ Route::is('admin.posts.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Blog Posts</a>

                                <a href="{{ route('admin.project-updates.index') }}" class="{{ Route::is('admin.project-updates.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Updates</a>

                                <a href="{{ route('admin.project-assets.index') }}" class="{{ Route::is('admin.project-assets.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Assets</a>

                                <a href="{{ route('admin.jobs.index') }}" class="{{ Route::is('admin.jobs.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Jobs</a>

                                <a href="#" class="{{ Route::is('invoices.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Invoices</a>
                            </div>
                        </div>
                    </div>

                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <a class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                href="{{ route('admin.logout') }}">
                                logout
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Mobile menu, show/hide based on menu state. not wired up. maybe someday -->
            <div class="hidden border-t border-gray-700 md:hidden" id="mobile-menu">

                <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                    <a href="{{ route('admin.dashboard') }}" class="{{ Route::is('admin.dashboard') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Dashboard</a>

                    <a href="{{ route('admin.client.index') }}" class="{{ Route::is('admin.client.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Clients</a>

                    <a href="{{ route('admin.skills.index') }}" class="{{ Route::is('admin.skills.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Skills</a>

                    <a href="{{ route('admin.projects.index') }}" class="{{ Route::is('admin.projects.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Projects</a>

                    <a href="{{ route('admin.posts.index') }}" class="{{ Route::is('admin.posts.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Blog Posts</a>

                    <a href="{{ route('admin.project-updates.index') }}" class="{{ Route::is('admin.project-updates.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Updates</a>

                    <a href="{{ route('admin.project-assets.index') }}" class="{{ Route::is('admin.project-assets.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Assets</a>

                    <a href="{{ route('admin.jobs.index') }}" class="{{ Route::is('admin.jobs.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Jobs</a>

                    <a href="#" class="{{ Route::is('invoices.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} block rounded-md px-3 py-2 text-base font-medium">Invoices</a>
                </div>

                <div class="pt-4 pb-3 border-t border-gray-700">
                    <div class="flex items-center px-5">
                        <a class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            href="{{ route('admin.logout') }}">
                            logout
                        </a>
                    </div>
                </div>

            </div>

        </nav>

        {{ $slot }}

        <script src="{{ asset('js/app.js') }}"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const toggleButton = document.getElementById('mobile-menu-button');
                const menu = document.getElementById('mobile-menu');
                const iconOpen = document.getElementById('icon-menu-open');
                const iconClose = document.getElementById('icon-menu-close');

                if (!toggleButton || !menu) {
                    return;
                }

                toggleButton.addEventListener('click', function () {
                    const isHidden = menu.classList.toggle('hidden');

                    toggleButton.setAttribute('aria-expanded', String(!isHidden));

                    if (iconOpen && iconClose) {
                        iconOpen.classList.toggle('hidden', !isHidden);
                        iconClose.classList.toggle('hidden', isHidden);
                    }
                });
            });
        </script>

    </div>

</body>

</html>
