<x-admin-layout>
    <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">Edit Auction Source</h1>
        </div>
    </header>

    <main>
        <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

            @if($errors->any())
                <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5 text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(session('status'))
                <div class="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('admin.auction-sources.update', $auctionSource) }}" class="space-y-8">
                @csrf
                @method('PUT')

                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Basic Information</h3>

                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Source Name</label>
                                <input type="text" name="name" id="name" value="{{ old('name', $auctionSource->name) }}" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="driver" class="block text-sm font-medium text-gray-700">Driver</label>
                                <select name="driver" id="driver" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    @foreach($drivers as $key => $class)
                                        <option value="{{ $key }}" {{ old('driver', $auctionSource->driver) == $key ? 'selected' : '' }}>
                                            {{ ucfirst($key) }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            <div>
                                <label for="base_url" class="block text-sm font-medium text-gray-700">Base URL</label>
                                <input type="url" name="base_url" id="base_url" value="{{ old('base_url', $auctionSource->base_url) }}"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="https://example.com">
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" name="enabled" id="enabled" value="1" {{ old('enabled', $auctionSource->enabled) ? 'checked' : '' }}
                                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                <label for="enabled" class="ml-2 block text-sm text-gray-900">
                                    Enabled
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Collection Settings</h3>

                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label for="frequency_minutes" class="block text-sm font-medium text-gray-700">Collection Frequency (minutes)</label>
                                <input type="number" name="frequency_minutes" id="frequency_minutes" value="{{ old('frequency_minutes', $auctionSource->frequency_minutes) }}" min="1" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="buyer_premium_percent" class="block text-sm font-medium text-gray-700">Default Buyer Premium (%)</label>
                                <input type="number" name="buyer_premium_percent" id="buyer_premium_percent" value="{{ old('buyer_premium_percent', $auctionSource->buyer_premium_percent) }}" min="0" max="100" step="0.01"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="tax_rate_percent" class="block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                                <input type="number" name="tax_rate_percent" id="tax_rate_percent" value="{{ old('tax_rate_percent', $auctionSource->tax_rate_percent) }}" min="0" max="100" step="0.01"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Advanced Configuration (Optional)</h3>

                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="filters" class="block text-sm font-medium text-gray-700">Filters (JSON)</label>
                                <textarea name="filters" id="filters" rows="4"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          placeholder='{"categories": [], "keywords": []}'>{!! old('filters', $auctionSource->filters ? json_encode($auctionSource->filters, JSON_PRETTY_PRINT) : '') !!}</textarea>
                                <p class="mt-1 text-sm text-gray-500">JSON object for filtering criteria</p>
                            </div>

                            <div>
                                <label for="meta" class="block text-sm font-medium text-gray-700">Metadata (JSON)</label>
                                <textarea name="meta" id="meta" rows="3"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          placeholder='{"description": "Additional info"}'>{!! old('meta', $auctionSource->meta ? json_encode($auctionSource->meta, JSON_PRETTY_PRINT) : '') !!}</textarea>
                                <p class="mt-1 text-sm text-gray-500">Additional metadata for this source</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <a href="{{ route('admin.auction-sources.index') }}" class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Update Source
                    </button>
                </div>
            </form>
        </div>
    </main>
</x-admin-layout>
