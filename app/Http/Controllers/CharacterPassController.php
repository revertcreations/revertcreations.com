<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ExcludesNonBuyerTraffic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class CharacterPassController extends Controller
{
    use ExcludesNonBuyerTraffic;

    private const DAILY_WINDOW_DAYS = 90;

    public function show(Request $request): View
    {
        $attribution = $this->attribution($request);
        $this->record($request, 'offer_view', $attribution);

        return view('character-pass-retired');
    }

    public function sample(Request $request): View
    {
        $this->record($request, 'sample_view');

        return view('character-pass-sample');
    }

    public function guide(Request $request): View
    {
        $this->record($request, 'guide_view');

        return view('landing-page-critique-guide');
    }

    public function checkout(Request $request): RedirectResponse
    {
        return redirect()->route('character-pass');
    }

    public function evidence(): JsonResponse
    {
        try {
            $totals = DB::table('character_pass_metrics')
                ->selectRaw('event, SUM(count) AS total')
                ->groupBy('event')
                ->pluck('total', 'event');

            $sources = DB::table('character_pass_attribution')
                ->selectRaw('source, event, SUM(count) AS total')
                ->groupBy('source', 'event')
                ->get()
                ->groupBy('source')
                ->map(fn ($rows) => $rows->pluck('total', 'event')->map(fn ($total) => (int) $total));

            // The day is stored but was summed away, so no reader could tell a
            // burst of real arrivals from a crawler's steady one-a-day creep.
            $since = now()->subDays(self::DAILY_WINDOW_DAYS)->toDateString();

            $dailyTotals = DB::table('character_pass_metrics')
                ->select('day', 'event', 'count')
                ->where('day', '>=', $since)
                ->orderBy('day')
                ->orderBy('event')
                ->get()
                ->map(fn ($row) => [
                    'day' => substr((string) $row->day, 0, 10),
                    'event' => $row->event,
                    'count' => (int) $row->count,
                ])
                ->values();

            $dailySources = DB::table('character_pass_attribution')
                ->select('day', 'source', 'event', 'count')
                ->where('day', '>=', $since)
                ->orderBy('day')
                ->orderBy('source')
                ->orderBy('event')
                ->get()
                ->map(fn ($row) => [
                    'day' => substr((string) $row->day, 0, 10),
                    'source' => $row->source,
                    'event' => $row->event,
                    'count' => (int) $row->count,
                ])
                ->values();

            return response()->json([
                'aggregateOnly' => true,
                'measurement' => 'request counts, not unique people',
                'offerViews' => (int) ($totals['offer_view'] ?? 0),
                'sampleViews' => (int) ($totals['sample_view'] ?? 0),
                'guideViews' => (int) ($totals['guide_view'] ?? 0),
                'checkoutClicks' => (int) ($totals['checkout_click'] ?? 0),
                'sources' => $sources,
                'dailyWindowDays' => self::DAILY_WINDOW_DAYS,
                'daily' => [
                    'totals' => $dailyTotals,
                    'sources' => $dailySources,
                ],
            ]);
        } catch (Throwable) {
            return response()->json([
                'aggregateOnly' => true,
                'measurementUnavailable' => true,
            ], 503);
        }
    }

    /** @param array{utm_source?: string, utm_medium?: string, utm_campaign?: string} $attribution */
    private function record(Request $request, string $event, array $attribution = []): void
    {
        if (! $this->isCountableVisit($request)) {
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

            if (isset($attribution['utm_source'])) {
                DB::table('character_pass_attribution')->insertOrIgnore([
                    'day' => $day,
                    'source' => $attribution['utm_source'],
                    'event' => $event,
                    'count' => 0,
                ]);
                DB::table('character_pass_attribution')
                    ->where('day', $day)
                    ->where('source', $attribution['utm_source'])
                    ->where('event', $event)
                    ->increment('count');
            }
        } catch (Throwable) {
            // Measurement must never block the sales, sample, or checkout path.
        }
    }

    /** @return array{utm_source?: string, utm_medium?: string, utm_campaign?: string} */
    private function attribution(Request $request): array
    {
        $clean = [];
        foreach (['utm_source', 'utm_medium', 'utm_campaign'] as $key) {
            $value = strtolower((string) $request->query($key, ''));
            $value = substr((string) preg_replace('/[^a-z0-9_-]/', '', $value), 0, 64);
            if ($value !== '') {
                $clean[$key] = $value;
            }
        }

        return $clean;
    }
}
