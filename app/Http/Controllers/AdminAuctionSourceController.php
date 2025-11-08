<?php

namespace App\Http\Controllers;

use App\Models\AuctionSource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;
use App\Jobs\CollectAuctionListingsJob;

class AdminAuctionSourceController extends Controller
{
    /**
     * Display a listing of auction sources.
     */
    public function index(): View
    {
        $sources = AuctionSource::withCount('auctionListings')
            ->orderBy('enabled', 'desc')
            ->orderBy('name')
            ->get();

        return view('admin.auction-sources.index', compact('sources'));
    }

    /**
     * Show the form for creating a new auction source.
     */
    public function create(): View
    {
        $drivers = config('auction.drivers');

        return view('admin.auction-sources.create', compact('drivers'));
    }

    /**
     * Store a newly created auction source.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver' => 'required|string',
            'base_url' => 'nullable|url',
            'enabled' => 'boolean',
            'frequency_minutes' => 'required|integer|min:1',
            'buyer_premium_percent' => 'nullable|numeric|min:0|max:100',
            'tax_rate_percent' => 'nullable|numeric|min:0|max:100',
            'filters' => 'nullable|json',
            'meta' => 'nullable|json',
        ]);

        // Auto-generate slug if not provided
        if (!isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Default enabled to true if not set
        $validated['enabled'] = $request->boolean('enabled', true);

        // Parse JSON fields
        if (isset($validated['filters'])) {
            $validated['filters'] = json_decode($validated['filters'], true);
        }
        if (isset($validated['meta'])) {
            $validated['meta'] = json_decode($validated['meta'], true);
        }

        AuctionSource::create($validated);

        return redirect()
            ->route('admin.auction-sources.index')
            ->with('status', 'Auction source created successfully.');
    }

    /**
     * Show the form for editing an auction source.
     */
    public function edit(AuctionSource $auctionSource): View
    {
        $drivers = config('auction.drivers');

        return view('admin.auction-sources.edit', compact('auctionSource', 'drivers'));
    }

    /**
     * Update the specified auction source.
     */
    public function update(Request $request, AuctionSource $auctionSource): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver' => 'required|string',
            'base_url' => 'nullable|url',
            'enabled' => 'boolean',
            'frequency_minutes' => 'required|integer|min:1',
            'buyer_premium_percent' => 'nullable|numeric|min:0|max:100',
            'tax_rate_percent' => 'nullable|numeric|min:0|max:100',
            'filters' => 'nullable|json',
            'meta' => 'nullable|json',
        ]);

        $validated['enabled'] = $request->boolean('enabled', true);

        // Parse JSON fields
        if (isset($validated['filters'])) {
            $validated['filters'] = json_decode($validated['filters'], true);
        }
        if (isset($validated['meta'])) {
            $validated['meta'] = json_decode($validated['meta'], true);
        }

        $auctionSource->update($validated);

        return redirect()
            ->route('admin.auction-sources.index')
            ->with('status', 'Auction source updated successfully.');
    }

    /**
     * Remove the specified auction source.
     */
    public function destroy(AuctionSource $auctionSource): RedirectResponse
    {
        $auctionSource->delete();

        return redirect()
            ->route('admin.auction-sources.index')
            ->with('status', 'Auction source deleted successfully.');
    }

    /**
     * Trigger manual collection for an auction source.
     */
    public function collect(AuctionSource $auctionSource): RedirectResponse
    {
        // update the status
        $auctionSource->markCollectionStarted();

        // dispatch to the queue
        CollectAuctionListingsJob::dispatch($auctionSource);

        return redirect()
            ->route('admin.auction-sources.index')
            ->with('status', 'Collection started for ' . $auctionSource->name);
    }
}
