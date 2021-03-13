<x-admin-layout>

    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
                Create Photoshoot
            </h1>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            <div class="mt-10 sm:mt-0">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Photoshoot</h3>
                        </div>
                    </div>
                    <div class="mt-5 md:mt-0 md:col-span-2">
                        <form action="{{ route('photoshoot.store') }}" method="POST">
                            @csrf
                            <div class="shadow overflow-hidden sm:rounded-md">
                                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="client_id" class="block text-sm font-medium text-gray-700">Client</label>
                                        <select id="client_id" name="client_id" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                           @forelse ($clients as $client)
                                                <option value="{{ $client->id }}">{{ $client->organization }} - {{ $client->first_name }} {{ $client->last_name }}</option>
                                            @empty
                                                <option value=""><a href="{{ route('client.create') }}">You need one of these first</a></option>
                                            @endforelse
                                        </select>
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                                        <select id="type" name="type" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <option value="photography">Photography</option>
                                            <option value="design">Design</option>
                                            <option value="development">Development</option>
                                        </select>
                                    </div>

                                    <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label for="late_fee" class="block text-sm font-medium text-gray-700">
                                            Late Fee Percent
                                        </label>
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                %
                                            </span>
                                            <input type="number" name="late_fee" id="late_fee" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300">
                                        </div>
                                    </div>

                                    <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label for="price_per_image" class="block text-sm font-medium text-gray-700">
                                            Price Per Full Released Images
                                        </label>
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                $
                                            </span>
                                            <input type="number" name="price_per_image" id="price_per_image" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300">
                                        </div>
                                    </div>

                                    <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label for="retainer_fee" class="block text-sm font-medium text-gray-700">
                                            Retainer Fee
                                        </label>
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                $
                                            </span>
                                            <input type="number" name="retainer_fee" id="retainer_fee" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300">
                                        </div>
                                    </div>

                                    <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label for="delivered_images_count" class="block text-sm font-medium text-gray-700">
                                            Delivered Images
                                        </label>
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                #
                                            </span>
                                            <input type="number" name="delivered_images_count" id="delivered_images_count" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300">
                                        </div>
                                    </div>


                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="title" class="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input type="text" name="title" id="title" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    </div>

                                    <div>
                                        <label for="description" class="block text-sm font-medium text-gray-700">
                                          Description
                                        </label>
                                        <div class="mt-1">
                                          <textarea id="description" name="description" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                                        </div>
                                        <p class="mt-2 text-sm text-gray-500">
                                          Brief description of job.
                                        </p>
                                    </div>


                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="event_starts" class="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <input type="text" name="event_starts" id="event_starts" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="event_ends" class="block text-sm font-medium text-gray-700">
                                            End Date
                                        </label>
                                        <input type="text" name="event_ends" id="event_ends" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    </div>

                                    <fieldset>
                                        <legend class="text-base font-medium text-gray-900">Photoshoot Location</legend>
                                        <div class="mt-4 space-y-4">
                                            <x-address />
                                        </div>
                                    </fieldset>

                                </div>
                                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </main>

</x-admin-layout>
