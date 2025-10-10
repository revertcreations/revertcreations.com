<x-admin-layout>

    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto flex flex-col gap-4 py-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Edit Client
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Update contact details, address information, or remove spam submissions.
                </p>
            </div>
            <a href="{{ route('admin.client.index') }}" class="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Back to list
            </a>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto space-y-6 py-6 sm:px-6 lg:px-8">
            @if ($errors->any())
                <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p class="font-semibold">Please fix the following:</p>
                    <ul class="mt-2 list-disc space-y-1 pl-5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <div class="md:grid md:grid-cols-3 md:gap-6">
                <div class="md:col-span-1">
                    <div class="px-4 sm:px-0">
                        <h2 class="text-lg font-medium text-gray-900">Client Details</h2>
                        <p class="mt-1 text-sm text-gray-500">
                            Keep this information current so follow-ups stay organized.
                        </p>
                    </div>
                </div>

                <div class="mt-5 md:mt-0 md:col-span-2">
                    <form method="POST" action="{{ route('admin.client.update', $client) }}">
                        @csrf
                        @method('PUT')

                        <div class="overflow-hidden rounded-md shadow">
                            <div class="bg-white px-4 py-5 sm:p-6">
                                <div class="grid grid-cols-6 gap-6">
                                    <div class="col-span-6 sm:col-span-4">
                                        <label for="organization" class="block text-sm font-medium text-gray-700">Organization</label>
                                        <input
                                            type="text"
                                            name="organization"
                                            id="organization"
                                            value="{{ old('organization', $client->organization) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="first_name" class="block text-sm font-medium text-gray-700">First name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            value="{{ old('first_name', $client->first_name) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="last_name" class="block text-sm font-medium text-gray-700">Last name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            value="{{ old('last_name', $client->last_name) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                    </div>

                                    <div class="col-span-6 sm:col-span-4">
                                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value="{{ old('email', $client->email) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone number</label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            id="phone_number"
                                            value="{{ old('phone_number', $client->phone) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                    </div>

                                    <div class="col-span-6 sm:col-span-3">
                                        <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            id="website"
                                            value="{{ old('website', $client->website) }}"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="https://example.com"
                                        >
                                    </div>

                                    <div class="col-span-6">
                                        <label for="description" class="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            rows="3"
                                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >{{ old('description', $client->description) }}</textarea>
                                    </div>

                                    <x-address
                                        :country-code="optional($address)->country_code ?? 'US'"
                                        :state-code="optional($address)->state_code"
                                        :street-address="optional($address)->street_address"
                                        :street-address2="optional($address)->street_address_2"
                                        :city="optional($address)->city"
                                        :postal-code="optional($address)->postal_code"
                                    />
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                <button
                                    type="submit"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="rounded-md border border-red-200 bg-red-50 px-4 py-5 sm:px-6">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-sm font-semibold text-red-700">Delete client</h3>
                        <p class="text-sm text-red-600">
                            Removing a client detaches their saved address. Deleted clients cannot be recovered.
                        </p>
                    </div>
                    <form method="POST" action="{{ route('admin.client.destroy', $client) }}" onsubmit="return confirm('Delete this client permanently?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Delete client
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</x-admin-layout>
