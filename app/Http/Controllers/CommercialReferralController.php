<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class CommercialReferralController extends Controller
{
    private const BENCHCUE = 'https://maker-card.revertcreations.com/';
    private const PACKING_SLIP_SETUP_CHECKOUT = 'https://buy.stripe.com/3cIfZhcjhgonePO2A187K02';
    private const SHOPIFY_STOREFRONT_AUDIT_CHECKOUT = 'https://buy.stripe.com/14A6oH3MLfkj6ji8Yp87K03';

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

    public function template(Request $request): View
    {
        $source = $this->source($request);
        $this->record($request, 'benchcue_template', $source);

        return view('shopify-production-sheet-template', ['acquisitionSource' => $source]);
    }

    public function packingSlipGuide(Request $request): View
    {
        $source = $this->source($request);
        $this->record($request, 'packing_slip_guide', $source);

        return view('shopify-packing-slip-properties-guide', ['acquisitionSource' => $source]);
    }

    public function packingSlipSetup(Request $request): View
    {
        $source = $this->source($request);
        $this->record($request, 'packing_slip_setup_offer', $source);

        return view('shopify-packing-slip-setup', ['acquisitionSource' => $source]);
    }

    public function packingSlipSetupCheckout(Request $request): RedirectResponse
    {
        $source = $this->source($request);
        $this->record($request, 'packing_slip_setup_checkout', $source);

        return redirect()->away(self::PACKING_SLIP_SETUP_CHECKOUT.'?'.http_build_query([
            'client_reference_id' => $source,
        ]));
    }

    public function storefrontAudit(Request $request): View
    {
        $source = $this->source($request);
        $this->record($request, 'shopify_storefront_audit_offer', $source);

        return view('shopify-storefront-audit', ['acquisitionSource' => $source]);
    }

    public function storefrontAuditSample(Request $request): View
    {
        $source = $this->source($request);
        $this->record($request, 'shopify_storefront_audit_sample', $source);

        return view('shopify-storefront-audit-sample', ['acquisitionSource' => $source]);
    }

    public function storefrontAuditCheckout(Request $request): RedirectResponse
    {
        $source = $this->source($request);
        $this->record($request, 'shopify_storefront_audit_checkout', $source);

        return redirect()->away(self::SHOPIFY_STOREFRONT_AUDIT_CHECKOUT.'?'.http_build_query([
            'client_reference_id' => $source,
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
                'templateViews' => (int) $rows->where('destination', 'benchcue_template')->sum('total'),
                'templateSources' => $rows->where('destination', 'benchcue_template')
                    ->pluck('total', 'source')
                    ->map(fn ($total) => (int) $total),
                'packingSlipGuideViews' => (int) $rows->where('destination', 'packing_slip_guide')->sum('total'),
                'packingSlipGuideSources' => $rows->where('destination', 'packing_slip_guide')
                    ->pluck('total', 'source')
                    ->map(fn ($total) => (int) $total),
                'packingSlipSetupOfferViews' => (int) $rows->where('destination', 'packing_slip_setup_offer')->sum('total'),
                'packingSlipSetupCheckoutClicks' => (int) $rows->where('destination', 'packing_slip_setup_checkout')->sum('total'),
                'packingSlipSetupSources' => $rows->whereIn('destination', ['packing_slip_setup_offer', 'packing_slip_setup_checkout'])
                    ->groupBy('source')
                    ->map(fn ($sourceRows) => $sourceRows->mapWithKeys(fn ($row) => [
                        $row->destination === 'packing_slip_setup_offer' ? 'offer_view' : 'checkout_click' => (int) $row->total,
                    ])),
                'storefrontAuditOfferViews' => (int) $rows->where('destination', 'shopify_storefront_audit_offer')->sum('total'),
                'storefrontAuditCheckoutClicks' => (int) $rows->where('destination', 'shopify_storefront_audit_checkout')->sum('total'),
                'storefrontAuditSampleViews' => (int) $rows->where('destination', 'shopify_storefront_audit_sample')->sum('total'),
                'storefrontAuditSampleSources' => $rows->where('destination', 'shopify_storefront_audit_sample')
                    ->pluck('total', 'source')
                    ->map(fn ($total) => (int) $total),
                'storefrontAuditSources' => $rows->whereIn('destination', ['shopify_storefront_audit_offer', 'shopify_storefront_audit_checkout'])
                    ->groupBy('source')
                    ->map(fn ($sourceRows) => $sourceRows->mapWithKeys(fn ($row) => [
                        $row->destination === 'shopify_storefront_audit_offer' ? 'offer_view' : 'checkout_click' => (int) $row->total,
                    ])),
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
        if (
            str_contains($userAgent, 'RevertInternal')
            || str_contains($userAgent, 'HeadlessChrome')
            || preg_match('/bot|spider|crawler|slurp|bingpreview/i', $userAgent)
        ) {
            return;
        }
        if ($request->cookie('revert_internal') !== null) {
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
