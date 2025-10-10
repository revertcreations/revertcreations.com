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

    <div>
        <nav class="bg-gray-800">

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">

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
                                    href="{{ route('client.index') }}"
                                    class="{{ Route::is('client.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">
                                    Clients
                                </a>

                                <a href="{{ route('skills.index') }}" class="{{ Route::is('skills.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Skills</a>

                                <a href="{{ route('projects.index') }}" class="{{ Route::is('projects.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Projects</a>

                                <a href="{{ route('posts.index') }}" class="{{ Route::is('posts.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Blog Posts</a>

                                <a href="{{ route('project-updates.index') }}" class="{{ Route::is('project-updates.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Updates</a>

                                <a href="{{ route('project-assets.index') }}" class="{{ Route::is('project-assets.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Assets</a>

                                <a href="{{ route('jobs.index') }}" class="{{ Route::is('jobs.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Jobs</a>

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
            <div class="md:hidden" id="mobile-menu">

                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                    <a href="{{ route('admin.dashboard') }}" class="{{ Route::is('admin.dashboard') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>

                    <a href="{{ route('client.index') }}" class="{{ Route::is('client.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Clients</a>

                    <a href="{{ route('skills.index') }}" class="{{ Route::is('skills.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Skills</a>

                    <a href="{{ route('projects.index') }}" class="{{ Route::is('projects.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Projects</a>

                    <a href="{{ route('posts.index') }}" class="{{ Route::is('posts.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Blog Posts</a>

                    <a href="{{ route('project-updates.index') }}" class="{{ Route::is('project-updates.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Updates</a>

                    <a href="{{ route('project-assets.index') }}" class="{{ Route::is('project-assets.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Assets</a>

                    <a href="{{ route('jobs.index') }}" class="{{ Route::is('jobs.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Jobs</a>

                    <a href="#" class="{{ Route::is('invoices.*') ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white" }} px-3 py-2 rounded-md text-sm font-medium">Invoices</a>
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

    </div>

</body>

</html>
