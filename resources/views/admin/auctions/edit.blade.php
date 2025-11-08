<x-admin-layout>
    <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">Edit Auction Listing</h1>
        </div>
    </header>

    <main>
        <div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">

            @if($errors->any())
                <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    <ul class="list-disc pl-5 text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.auctions.update', $auction) }}" class="space-y-6">
                @csrf
                @method('PUT')

                <!-- Basic Information -->
                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="auction_source_id" class="block text-sm font-medium text-gray-700">Source</label>
                                <select name="auction_source_id" id="auction_source_id"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Manual Entry</option>
                                    @foreach($sources as $source)
                                        <option value="{{ $source->id }}" {{ old('auction_source_id', $auction->auction_source_id) == $source->id ? 'selected' : '' }}>
                                            {{ $source->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            <div>
                                <label for="title" class="block text-sm font-medium text-gray-700">Title *</label>
                                <input type="text" name="title" id="title" value="{{ old('title', $auction->title) }}" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" id="description" rows="4"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">{{ old('description', $auction->description) }}</textarea>
                            </div>

                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" name="category" id="category" value="{{ old('category', $auction->category) }}"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>

                                <div>
                                    <label for="lot_number" class="block text-sm font-medium text-gray-700">Lot Number</label>
                                    <input type="text" name="lot_number" id="lot_number" value="{{ old('lot_number', $auction->lot_number) }}"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>

                                <div>
                                    <label for="seller" class="block text-sm font-medium text-gray-700">Seller</label>
                                    <input type="text" name="seller" id="seller" value="{{ old('seller', $auction->seller) }}"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>

                                <div>
                                    <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" name="location" id="location" value="{{ old('location', $auction->location) }}"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pricing -->
                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Pricing</h3>

                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label for="current_bid" class="block text-sm font-medium text-gray-700">Current Bid</label>
                                <input type="number" name="current_bid" id="current_bid" value="{{ old('current_bid', $auction->current_bid) }}" step="0.01" min="0"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="buy_now_price" class="block text-sm font-medium text-gray-700">Buy Now Price</label>
                                <input type="number" name="buy_now_price" id="buy_now_price" value="{{ old('buy_now_price', $auction->buy_now_price) }}" step="0.01" min="0"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="shipping_cost" class="block text-sm font-medium text-gray-700">Shipping Cost</label>
                                <input type="number" name="shipping_cost" id="shipping_cost" value="{{ old('shipping_cost', $auction->shipping_cost) }}" step="0.01" min="0"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="condition" class="block text-sm font-medium text-gray-700">Condition</label>
                                <select name="condition" id="condition"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Select condition</option>
                                    <option value="new" {{ old('condition', $auction->condition) == 'new' ? 'selected' : '' }}>New</option>
                                    <option value="used" {{ old('condition', $auction->condition) == 'used' ? 'selected' : '' }}>Used</option>
                                    <option value="parts" {{ old('condition', $auction->condition) == 'parts' ? 'selected' : '' }}>Parts/Not Working</option>
                                </select>
                            </div>

                            <div>
                                <label for="buyer_premium_percent" class="block text-sm font-medium text-gray-700">Buyer Premium (%)</label>
                                <input type="number" name="buyer_premium_percent" id="buyer_premium_percent" value="{{ old('buyer_premium_percent', $auction->buyer_premium_percent) }}" step="0.01" min="0" max="100"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="tax_rate_percent" class="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                <input type="number" name="tax_rate_percent" id="tax_rate_percent" value="{{ old('tax_rate_percent', $auction->tax_rate_percent) }}" step="0.01" min="0" max="100"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div class="mt-6 flex items-center">
                            <input type="checkbox" name="local_pickup_only" id="local_pickup_only" value="1" {{ old('local_pickup_only', $auction->local_pickup_only) ? 'checked' : '' }}
                                   class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <label for="local_pickup_only" class="ml-2 block text-sm text-gray-900">
                                Local Pickup Only
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Auction Timing -->
                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Auction Timing</h3>

                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label for="auction_start" class="block text-sm font-medium text-gray-700">Auction Start</label>
                                <input type="datetime-local" name="auction_start" id="auction_start"
                                       value="{{ old('auction_start', $auction->auction_start?->format('Y-m-d\TH:i')) }}"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>

                            <div>
                                <label for="auction_end" class="block text-sm font-medium text-gray-700">Auction End</label>
                                <input type="datetime-local" name="auction_end" id="auction_end"
                                       value="{{ old('auction_end', $auction->auction_end?->format('Y-m-d\TH:i')) }}"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Info -->
                <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>

                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="source_url" class="block text-sm font-medium text-gray-700">Source URL</label>
                                <input type="url" name="source_url" id="source_url" value="{{ old('source_url', $auction->source_url) }}"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="https://...">
                            </div>

                            <div>
                                <label for="images" class="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
                                <textarea name="images" id="images" rows="2"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg">{{ old('images', is_array($auction->images) ? implode(', ', $auction->images) : '') }}</textarea>
                            </div>

                            <div>
                                <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                <input type="text" name="tags" id="tags" value="{{ old('tags', is_array($auction->tags) ? implode(', ', $auction->tags) : '') }}"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                       placeholder="vintage, automotive, rare">
                            </div>

                            <div>
                                <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea name="notes" id="notes" rows="3"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">{{ old('notes', $auction->notes) }}</textarea>
                            </div>

                            <div class="flex items-center">
                                <input type="checkbox" name="recalculate" id="recalculate" value="1" {{ old('recalculate') ? 'checked' : '' }}
                                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                                <label for="recalculate" class="ml-2 block text-sm text-gray-900">
                                    Recalculate profitability and refresh eBay data
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <a href="{{ route('admin.auctions.show', $auction) }}" class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        Update Listing
                    </button>
                </div>
            </form>
        </div>
    </main>
</x-admin-layout>
