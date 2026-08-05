<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class CommercialReferralController extends Controller
{
    private const BENCHCUE = 'https://maker-card.revertcreations.com/';

    public function benchcue(Request $request): RedirectResponse
    {
        $source = $this->source($request);
        $this->record($request, 'benchcue', $source);

        return redirect()->away(self::BENCHCUE.'?'.http_build_query([
            'utm_source' => 'revertcreations',
            'utm_medium' => 'owned_content',
            'utm_campaign' => 'benchcue_launch',
            'utm_content' => $source,
        ]));
    }

    public function evidence(): JsonResponse
    {
        try {
            $rows = DB::table('commercial_referral_metrics')
                ->selectRaw('destination, source, SUM(count) AS total')
                ->groupBy('destination', 'source')
                ->get();

            return response()->json([
                'aggregateOnly' => true,
                'measurement' => 'outbound referral request counts, not unique people',
                'benchcueClicks' => (int) $rows->where('destination', 'benchcue')->sum('total'),
                'sources' => $rows->where('destination', 'benchcue')
                    ->pluck('total', 'source')
                    ->map(fn ($total) => (int) $total),
            ]);
        } catch (Throwable) {
            return response()->json([
                'aggregateOnly' => true,
                'measurementUnavailable' => true,
            ], 503);
        }
    }

    private function record(Request $request, string $destination, string $source): void
    {
        $userAgent = (string) $request->userAgent();
        if (str_contains($userAgent, 'RevertInternal') || str_contains($userAgent, 'HeadlessChrome')) {
            return;
        }

        try {
            $day = now()->toDateString();
            DB::table('commercial_referral_metrics')->insertOrIgnore([
                'day' => $day,
                'destination' => $destination,
                'source' => $source,
                'count' => 0,
            ]);
            DB::table('commercial_referral_metrics')
                ->where('day', $day)
                ->where('destination', $destination)
                ->where('source', $source)
                ->increment('count');
        } catch (Throwable) {
            // Measurement must never block a merchant from reaching the product.
        }
    }

    private function source(Request $request): string
    {
        $source = strtolower((string) $request->query('source', 'unknown'));
        $source = substr((string) preg_replace('/[^a-z0-9_-]/', '', $source), 0, 64);

        return $source !== '' ? $source : 'unknown';
    }
}
