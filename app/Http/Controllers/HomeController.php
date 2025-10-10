<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use App\Models\PuzzleSession;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    public function index(Request $request) {

        $session_id = $request->session()->getId();
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        $isInternal = $this->isInternalVisitor($ipAddress, $userAgent);

        try {
            $analytics_treasure = PuzzleSession::where('session_id', $session_id)
                ->where('puzzle_type_id', 1)
                ->first();

            if (!$analytics_treasure) {
                PuzzleSession::create([
                    'session_id' => $session_id,
                    'puzzle_type_id' => 1,
                    'ip_address' => $ipAddress,
                    'user_agent' => $this->truncateUserAgent($userAgent),
                    'is_internal' => $isInternal,
                ]);
            } else {
                $analytics_treasure->fill([
                    'ip_address' => $ipAddress,
                    'user_agent' => $this->truncateUserAgent($userAgent),
                    'is_internal' => $isInternal,
                ]);

                if ($analytics_treasure->isDirty()) {
                    $analytics_treasure->save();
                }
            }
        } catch (QueryException $exception) {
            Log::warning('Failed to initialize puzzle session', [
                'session_id' => $session_id,
                'puzzle_type_id' => 1,
                'error' => $exception->getMessage(),
            ]);
        }

        return view('home');
    }

    protected function truncateUserAgent(?string $userAgent): ?string
    {
        if (!$userAgent) {
            return null;
        }

        return Str::limit($userAgent, 255, '');
    }

    protected function isInternalVisitor(?string $ipAddress, ?string $userAgent): bool
    {
        $internalIps = config('analytics.internal_ips', []);
        if ($ipAddress && in_array($ipAddress, $internalIps, true)) {
            return true;
        }

        $internalUserAgents = config('analytics.internal_user_agents', []);

        if ($userAgent && !empty($internalUserAgents)) {
            $lowerAgent = strtolower($userAgent);
            foreach ($internalUserAgents as $fragment) {
                $fragment = strtolower($fragment);
                if ($fragment !== '' && str_contains($lowerAgent, $fragment)) {
                    return true;
                }
            }
        }

        return false;
    }
}
