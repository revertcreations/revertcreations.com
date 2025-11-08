<x-admin-layout>
    <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="md:flex md:items-center md:justify-between">
                <div class="min-w-0 flex-1">
                    <h1 class="text-2xl font-bold text-gray-900">{{ $auction->title }}</h1>
                    <p class="mt-1 text-sm text-gray-500">
                        {{ $auction->auctionSource?->name ?? 'Unknown Source' }}
                        @if($auction->lot_number) • Lot {{ $auction->lot_number }} @endif
                    </p>
                </div>
                <div class="mt-4 flex gap-3 md:ml-4 md:mt-0">
                    <a href="{{ route('admin.auctions.index') }}" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        Back to List
                    </a>
                    <a href="{{ route('admin.auctions.edit', $auction) }}" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                        Edit
                    </a>
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

            @if(session('status'))
                <div class="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            @if(session('error'))
                <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                    {{ session('error') }}
                </div>
            @endif

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Left column: Images and Details -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Images -->
                    @if($auction->images && count($auction->images) > 0)
                        <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <img src="{{ $auction->primary_image }}" alt="{{ $auction->title }}" class="w-full h-96 object-contain rounded">
                                @if(count($auction->images) > 1)
                                    <div class="mt-4 grid grid-cols-4 gap-2">
                                        @foreach(array_slice($auction->images, 1, 4) as $image)
                                            <img src="{{ $image }}" alt="" class="h-20 w-full object-cover rounded cursor-pointer hover:opacity-75">
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endif

                    <!-- Description -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
                            <div class="prose prose-sm max-w-none text-gray-700">
                                {{ $auction->description ?? 'No description available.' }}
                            </div>
                        </div>
                    </div>

                    <!-- Auction Details -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Auction Details</h3>
                            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Current Bid</dt>
                                    <dd class="mt-1 text-sm font-semibold text-gray-900">${{ number_format($auction->current_bid ?? 0, 2) }}</dd>
                                </div>
                                @if($auction->buy_now_price)
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Buy Now Price</dt>
                                        <dd class="mt-1 text-sm font-semibold text-gray-900">${{ number_format($auction->buy_now_price, 2) }}</dd>
                                    </div>
                                @endif
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Buyer Premium</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ number_format($auction->buyer_premium_percent, 2) }}%</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Tax Rate</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ number_format($auction->tax_rate_percent, 2) }}%</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Shipping Cost</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        @if($auction->local_pickup_only)
                                            <span class="text-amber-600">Local Pickup Only</span>
                                        @else
                                            {{ $auction->shipping_cost ? '$' . number_format($auction->shipping_cost, 2) : 'Unknown' }}
                                        @endif
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Condition</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $auction->condition ?? 'Not specified' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Location</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $auction->location ?? 'Unknown' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Seller</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $auction->seller ?? 'Unknown' }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Auction Ends</dt>
                                    <dd class="mt-1 text-sm font-semibold {{ $auction->isEndingSoon() ? 'text-red-600' : 'text-gray-900' }}">
                                        {{ $auction->time_remaining ?? 'Unknown' }}
                                    </dd>
                                </div>
                                @if($auction->source_url)
                                    <div class="sm:col-span-2">
                                        <dt class="text-sm font-medium text-gray-500">Source Link</dt>
                                        <dd class="mt-1 text-sm">
                                            <a href="{{ $auction->source_url }}" target="_blank" class="text-indigo-600 hover:text-indigo-900">
                                                View on {{ $auction->auctionSource?->name }}
                                            </a>
                                        </dd>
                                    </div>
                                @endif
                            </dl>
                        </div>
                    </div>

                    <!-- eBay Market Data -->
                    @if($auction->ebay_sold_count)
                        <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-medium text-gray-900">eBay Market Data</h3>
                                    <form method="POST" action="{{ route('admin.auctions.refresh-ebay', $auction) }}" class="inline">
                                        @csrf
                                        <button type="submit" class="text-sm text-indigo-600 hover:text-indigo-900">
                                            Refresh
                                        </button>
                                    </form>
                                </div>
                                <dl class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Sold (90d)</dt>
                                        <dd class="mt-1 text-2xl font-semibold text-gray-900">{{ $auction->ebay_sold_count }}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Active</dt>
                                        <dd class="mt-1 text-2xl font-semibold text-gray-900">{{ $auction->ebay_active_count }}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Sell-Through</dt>
                                        <dd class="mt-1 text-2xl font-semibold {{ $auction->ebay_sell_through_rate >= 0.6 ? 'text-green-600' : 'text-gray-900' }}">
                                            {{ number_format($auction->ebay_sell_through_rate * 100, 1) }}%
                                        </dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Median Price</dt>
                                        <dd class="mt-1 text-2xl font-semibold text-gray-900">${{ number_format($auction->ebay_median_price, 0) }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    @endif

                    <!-- Notes -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ $auction->notes ?? 'No notes yet.' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Right column: Profitability & Actions -->
                <div class="space-y-6">
                    <!-- Status Card -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Status</h3>
                            <div class="space-y-4">
                                <div>
                                    <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-{{ $auction->status_color }}-100 text-{{ $auction->status_color }}-800">
                                        {{ ucfirst($auction->status) }}
                                    </span>
                                </div>

                                <div class="flex gap-2">
                                    @if($auction->status !== App\Models\AuctionListing::STATUS_WATCHING)
                                        <form method="POST" action="{{ route('admin.auctions.watch', $auction) }}" class="flex-1">
                                            @csrf
                                            <button type="submit" class="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">
                                                Watch
                                            </button>
                                        </form>
                                    @else
                                        <form method="POST" action="{{ route('admin.auctions.unwatch', $auction) }}" class="flex-1">
                                            @csrf
                                            <button type="submit" class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                Unwatch
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Profitability Card -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Profitability</h3>

                            <dl class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <dt class="text-sm font-medium text-gray-500">Match Score</dt>
                                    <dd class="text-2xl font-bold text-gray-900">
                                        {{ !is_null($auction->match_score) ? number_format($auction->match_score, 1) : '—' }}
                                        <span class="text-sm font-normal text-gray-500">/100</span>
                                    </dd>
                                </div>

                                <div class="flex items-center justify-between border-t pt-4">
                                    <dt class="text-sm font-medium text-gray-500">ROI</dt>
                                    <dd class="text-2xl font-bold {{ $auction->roi_percent >= 40 ? 'text-green-600' : 'text-gray-900' }}">
                                        {{ !is_null($auction->roi_percent) ? number_format($auction->roi_percent, 1) . '%' : '—' }}
                                    </dd>
                                </div>

                                <div class="flex items-center justify-between">
                                    <dt class="text-sm font-medium text-gray-500">Total Cost</dt>
                                    <dd class="text-lg font-semibold text-gray-900">
                                        ${{ number_format($auction->calculateTotalCost(), 2) }}
                                    </dd>
                                </div>

                                <div class="flex items-center justify-between">
                                    <dt class="text-sm font-medium text-gray-500">Expected Profit</dt>
                                    <dd class="text-lg font-semibold text-green-600">
                                        {{ !is_null($auction->expected_profit) ? '$' . number_format($auction->expected_profit, 0) : '—' }}
                                    </dd>
                                </div>
                            </dl>

                            @if($auction->max_bid)
                                <div class="mt-4 rounded-md bg-amber-50 p-3">
                                    <div class="text-sm">
                                        <p class="font-medium text-amber-800">Max Bid Set</p>
                                        <p class="mt-1 text-2xl font-bold text-amber-900">${{ number_format($auction->max_bid, 2) }}</p>
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                @if($auction->source_url)
                                    <a href="{{ $auction->source_url }}" target="_blank" class="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700">
                                        Open Auction Site
                                    </a>
                                @endif

                                <form method="POST" action="{{ route('admin.auctions.destroy', $auction) }}">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" onclick="return confirm('Archive this auction?')" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                        Archive
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</x-admin-layout>
