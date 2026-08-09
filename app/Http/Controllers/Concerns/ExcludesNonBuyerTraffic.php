<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

/**
 * Funnel counters are only useful if a merchant is on the other end of them.
 *
 * Two things were quietly inflating them. Crawlers were counted on the
 * character-pass funnel, which had no crawler filter at all — the source most
 * likely behind the phantom `finderslist` views that four sessions read as
 * outside interest for a listing that was never published. And our own probes
 * were counted everywhere: the 2026-08-08 checkout diagnosis reached both the
 * offer and the checkout route with `curl`, which sends no cookie and so slips
 * past the `revert_internal` exclusion.
 */
trait ExcludesNonBuyerTraffic
{
    /**
     * Command-line and library HTTP clients. A merchant buying a $250 audit is
     * in a browser; anything here is a script, and ours more often than not.
     */
    private const NON_BROWSER_AGENTS = '/curl|wget|python-requests|python-urllib|libwww|go-http-client|node-fetch|undici|okhttp|httpie|axios|postman|insomnia|java\/|guzzle/i';

    private const AUTOMATION_AGENTS = '/bot|spider|crawler|slurp|bingpreview|headlesschrome|revertinternal|preview|monitor|uptime|pingdom/i';

    private function isCountableVisit(Request $request): bool
    {
        $userAgent = (string) $request->userAgent();

        if ($userAgent === '') {
            return false;
        }

        if (preg_match(self::AUTOMATION_AGENTS, $userAgent)) {
            return false;
        }

        if (preg_match(self::NON_BROWSER_AGENTS, $userAgent)) {
            return false;
        }

        // Set in the operator's browser profile so owner and agent sessions
        // browsing the live site do not register as merchant interest.
        return $request->cookie('revert_internal') === null;
    }
}
