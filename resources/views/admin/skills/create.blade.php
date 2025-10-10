<x-admin-layout>

    <header class="bg-white shadow">
        <div class="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Skills
            </h1>
            <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium self-end"
                href="{{ route('admin.skills.index') }}">
                Back
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            <form action="{{ route('admin.skills.store') }}" method="POST">
                @csrf
                <div class="shadow overflow-hidden sm:rounded-md">
                    <div class="px-4 py-5 bg-white space-y-6 sm:p-6">

                        <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                            <label for="name" class="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value="{{ old('name') }}"
                                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                    required>
                            </div>
                        </div>

                        <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                            <label for="experience" class="block text-sm font-medium text-gray-700">
                                Experience
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input type="range" min="1" max="102" value="{{ old('experience', 50) }}" class="slider"
                                    id="experience" name="experience">
                            </div>
                        </div>

                        <div>
                            <label for="excerpt" class="block text-sm font-medium text-gray-700">
                                Excerpt
                            </label>
                            <div class="mt-1">
                                <textarea id="excerpt" name="excerpt" rows="3"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md">{{ old('excerpt') }}</textarea>
                            </div>
                        </div>

                        <div>
                            <label for="logo" class="block text-sm font-medium text-gray-700">
                                Logo
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="logo"
                                    id="logo"
                                    value="{{ old('logo') }}"
                                    class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300">
                            </div>
                        </div>

                    </div>

                    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Create
                        </button>
                    </div>

                </div>
            </form>

        </div>
    </main>

</x-admin-layout>
