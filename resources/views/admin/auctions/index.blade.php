@php
    use App\Models\AuctionListing;
    use Illuminate\Support\Str;

    $currentSort = $filters['sort'];
    $currentDirection = $filters['direction'];

    $toggleSortDirection = function (string $column) use ($currentSort, $currentDirection) {
        if ($currentSort === $column) {
            return $currentDirection === 'asc' ? 'desc' : 'asc';
        }
        return 'asc';
    };

    $sortIndicator = function (string $column) use ($currentSort, $currentDirection) {
        if ($currentSort !== $column) {
            return '';
        }
        return $currentDirection === 'asc' ? '↑' : '↓';
    };

    $statusStyles = [
        AuctionListing::STATUS_NEW => 'bg-gray-100 text-gray-800',
        AuctionListing::STATUS_ANALYZING => 'bg-blue-100 text-blue-800',
        AuctionListing::STATUS_WATCHING => 'bg-sky-100 text-sky-800',
        AuctionListing::STATUS_BIDDING => 'bg-amber-100 text-amber-800',
        AuctionListing::STATUS_WON => 'bg-emerald-100 text-emerald-800',
        AuctionListing::STATUS_LOST => 'bg-red-100 text-red-800',
        AuctionListing::STATUS_PASSED => 'bg-gray-200 text-gray-600',
        AuctionListing::STATUS_ARCHIVED => 'bg-gray-200 text-gray-600',
    ];
@endphp
<x-admin-layout>
    <header class="bg-white shadow">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Auction Listings</h1>
                <p class="mt-1 text-sm text-gray-500">
                    Discover profitable items from online auctions for eBay resale
                </p>
            </div>
            <div class="flex gap-3">
                <a class="text-gray-300 bg-gray-900 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    href="{{ route('admin.auction-sources.index') }}">
                    Manage Sources
                </a>
                <a class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    href="{{ route('admin.auctions.create') }}">
                    Add Manually
                </a>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            @if(session('status'))
                <div class="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800">
                    {{ session('status') }}
                </div>
            @endif

            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <form method="GET" action="{{ route('admin.auctions.index') }}" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                name="search"
                                value="{{ $filters['search'] }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Title, lot #, description…"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                @foreach($statusOptions as $value => $label)
                                    <option value="{{ $value }}" @selected($filters['status'] === $value)>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Source</label>
                            <select
                                name="source"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All sources</option>
                                @foreach($sources as $source)
                                    <option value="{{ $source->slug }}" @selected($filters['source'] === $source->slug)>
                                        {{ $source->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                class="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All categories</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category }}" @selected($filters['category'] === $category)>
                                        {{ ucfirst($category) }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Min ROI (%)</label>
                            <input
                                type="number"
                                name="min_roi"
                                min="0"
                                step="0.1"
                                value="{{ $filters['min_roi'] }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g. 40"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Min Sell-Through</label>
                            <input
                                type="number"
                                name="min_sell_through"
                                min="0"
                                max="1"
                                step="0.01"
                                value="{{ $filters['min_sell_through'] }}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g. 0.6"
                            >
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" name="ending_soon" id="ending_soon" value="1" @checked($filters['ending_soon'])
                                   class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <label for="ending_soon" class="text-sm text-gray-700">Ending in 24hrs</label>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" name="archived" id="archived" value="1" @checked($filters['archived'])
                                   class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <label for="archived" class="text-sm text-gray-700">Show archived</label>
                        </div>

                        <div class="lg:col-span-4 flex items-center justify-end gap-3 border-t pt-4">
                            <a href="{{ route('admin.auctions.index') }}" class="text-sm text-gray-500 hover:text-gray-700">
                                Reset filters
                            </a>
                            <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Apply filters
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="mt-6">
                <!-- Mobile cards -->
                <div class="space-y-4 sm:hidden">
                    @forelse($auctions as $auction)
                        <article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex-1">
                                    <h2 class="text-base font-semibold text-gray-900">
                                        <a href="{{ route('admin.auctions.show', $auction) }}" class="hover:underline">
                                            {{ $auction->title }}
                                        </a>
                                    </h2>
                                    @if($auction->lot_number)
                                        <p class="text-xs text-gray-500">Lot {{ $auction->lot_number }}</p>
                                    @endif
                                </div>
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $statusStyles[$auction->status] ?? 'bg-gray-100 text-gray-800' }}">
                                    {{ ucfirst($auction->status) }}
                                </span>
                            </div>

                            @if($auction->primary_image)
                                <div class="mt-3">
                                    <img src="{{ $auction->primary_image }}" alt="{{ $auction->title }}" class="h-32 w-full object-cover rounded">
                                </div>
                            @endif

                            <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Match Score</span>
                                    <p class="mt-1 text-base font-semibold text-gray-900">
                                        {{ !is_null($auction->match_score) ? number_format($auction->match_score, 1) : '—' }}
                                    </p>
                                </div>
                                <div>
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">ROI</span>
                                    <p class="mt-1 text-base font-semibold {{ $auction->roi_percent >= 40 ? 'text-green-600' : 'text-gray-900' }}">
                                        {{ !is_null($auction->roi_percent) ? number_format($auction->roi_percent, 1) . '%' : '—' }}
                                    </p>
                                </div>
                                <div>
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Current Bid</span>
                                    <p class="mt-1 text-base text-gray-900">
                                        ${{ number_format($auction->current_bid ?? 0, 2) }}
                                    </p>
                                </div>
                                <div>
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Est. Profit</span>
                                    <p class="mt-1 text-base font-semibold text-gray-900">
                                        {{ !is_null($auction->expected_profit) ? '$' . number_format($auction->expected_profit, 0) : '—' }}
                                    </p>
                                </div>
                                <div class="col-span-2">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Ends</span>
                                    <p class="mt-1 text-sm text-gray-900">
                                        {{ $auction->time_remaining ?? 'Unknown' }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-4 flex gap-2">
                                <a href="{{ route('admin.auctions.show', $auction) }}" class="flex-1 text-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    View
                                </a>
                                @if($auction->source_url)
                                    <a href="{{ $auction->source_url }}" target="_blank" class="flex-1 text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                                        Open Auction
                                    </a>
                                @endif
                            </div>
                        </article>
                    @empty
                        <div class="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                            <p class="text-sm text-gray-500">No auction listings found.</p>
                            <p class="mt-2">
                                <a href="{{ route('admin.auctions.create') }}" class="text-sm text-indigo-600 hover:text-indigo-900">Add one manually</a>
                                or
                                <a href="{{ route('admin.auction-sources.index') }}" class="text-sm text-indigo-600 hover:text-indigo-900">configure sources</a>
                            </p>
                        </div>
                    @endforelse
                </div>

                <!-- Desktop table -->
                <div class="hidden sm:block overflow-hidden bg-white shadow sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'title', 'direction' => $toggleSortDirection('title')]) }}" class="group inline-flex items-center gap-1">
                                        Item
                                        <span class="text-gray-400">{{ $sortIndicator('title') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'match_score', 'direction' => $toggleSortDirection('match_score')]) }}" class="group inline-flex items-center gap-1">
                                        Match
                                        <span class="text-gray-400">{{ $sortIndicator('match_score') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'roi_percent', 'direction' => $toggleSortDirection('roi_percent')]) }}" class="group inline-flex items-center gap-1">
                                        ROI
                                        <span class="text-gray-400">{{ $sortIndicator('roi_percent') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'current_bid', 'direction' => $toggleSortDirection('current_bid')]) }}" class="group inline-flex items-center gap-1">
                                        Bid
                                        <span class="text-gray-400">{{ $sortIndicator('current_bid') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'expected_profit', 'direction' => $toggleSortDirection('expected_profit')]) }}" class="group inline-flex items-center gap-1">
                                        Est. Profit
                                        <span class="text-gray-400">{{ $sortIndicator('expected_profit') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <a href="{{ request()->fullUrlWithQuery(['sort' => 'auction_end', 'direction' => $toggleSortDirection('auction_end')]) }}" class="group inline-flex items-center gap-1">
                                        Ends
                                        <span class="text-gray-400">{{ $sortIndicator('auction_end') }}</span>
                                    </a>
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            @forelse($auctions as $auction)
                                <tr class="hover:bg-gray-50">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div class="flex items-center gap-3">
                                            @if($auction->primary_image)
                                                <img src="{{ $auction->primary_image }}" alt="" class="h-10 w-10 rounded object-cover">
                                            @endif
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    <a href="{{ route('admin.auctions.show', $auction) }}" class="hover:text-indigo-600">
                                                        {{ Str::limit($auction->title, 50) }}
                                                    </a>
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    {{ $auction->auctionSource?->name ?? 'Unknown' }}
                                                    @if($auction->lot_number) • Lot {{ $auction->lot_number }} @endif
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ !is_null($auction->match_score) ? number_format($auction->match_score, 1) : '—' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span class="font-semibold {{ $auction->roi_percent >= 40 ? 'text-green-600' : 'text-gray-900' }}">
                                            {{ !is_null($auction->roi_percent) ? number_format($auction->roi_percent, 1) . '%' : '—' }}
                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                        ${{ number_format($auction->current_bid ?? 0, 2) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                                        {{ !is_null($auction->expected_profit) ? '$' . number_format($auction->expected_profit, 0) : '—' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ $auction->time_remaining ?? 'Unknown' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {{ $statusStyles[$auction->status] ?? 'bg-gray-100 text-gray-800' }}">
                                            {{ ucfirst($auction->status) }}
                                        </span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="{{ route('admin.auctions.show', $auction) }}" class="text-indigo-600 hover:text-indigo-900 mr-4">
                                            View
                                        </a>
                                        @if($auction->source_url)
                                            <a href="{{ $auction->source_url }}" target="_blank" class="text-indigo-600 hover:text-indigo-900">
                                                Auction
                                            </a>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="8" class="px-3 py-8 text-center text-sm text-gray-500">
                                        No auction listings found. <a href="{{ route('admin.auctions.create') }}" class="text-indigo-600 hover:text-indigo-900">Add one manually</a> or <a href="{{ route('admin.auction-sources.index') }}" class="text-indigo-600 hover:text-indigo-900">configure sources</a>.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                @if($auctions->hasPages())
                    <div class="mt-6">
                        {{ $auctions->links() }}
                    </div>
                @endif
            </div>
        </div>
    </main>
</x-admin-layout>
