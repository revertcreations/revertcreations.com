<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class CharacterPassController extends Controller
{
    private const CHECKOUT = 'https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01';

    public function show(Request $request): View
    {
        $this->record($request, 'offer_view');

        return view('character-pass');
    }

    public function sample(Request $request): View
    {
        $this->record($request, 'sample_view');

        return view('character-pass-sample');
    }

    public function checkout(Request $request): RedirectResponse
    {
        $this->record($request, 'checkout_click');

        return redirect()->away(self::CHECKOUT);
    }

    public function evidence(): JsonResponse
    {
        try {
            $totals = DB::table('character_pass_metrics')
                ->selectRaw('event, SUM(count) AS total')
                ->groupBy('event')
                ->pluck('total', 'event');

            return response()->json([
                'aggregateOnly' => true,
                'measurement' => 'request counts, not unique people',
                'offerViews' => (int) ($totals['offer_view'] ?? 0),
                'sampleViews' => (int) ($totals['sample_view'] ?? 0),
                'checkoutClicks' => (int) ($totals['checkout_click'] ?? 0),
            ]);
        } catch (Throwable) {
            return response()->json([
                'aggregateOnly' => true,
                'measurementUnavailable' => true,
            ], 503);
        }
    }

    private function record(Request $request, string $event): void
    {
        if (str_contains((string) $request->userAgent(), 'RevertInternal')) {
            return;
        }

        try {
            $day = now()->toDateString();
            DB::table('character_pass_metrics')->insertOrIgnore([
                'day' => $day,
                'event' => $event,
                'count' => 0,
            ]);
            DB::table('character_pass_metrics')
                ->where('day', $day)
                ->where('event', $event)
                ->increment('count');
        } catch (Throwable) {
            // Measurement must never block the sales, sample, or checkout path.
        }
    }
}
