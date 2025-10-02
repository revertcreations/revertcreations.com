<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Opportunity;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $overviewStats = [
            'totalOpen' => Opportunity::active()->count(),
            'favorites' => Opportunity::active()->where('is_favorite', true)->count(),
            'remindersToday' => Opportunity::active()->whereDate('next_action_at', today())->count(),
            'asyncHigh' => Opportunity::active()->where('async_level', '>=', 4)->count(),
        ];

        $recentFavorites = Opportunity::active()
            ->where('is_favorite', true)
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get();

        $upcomingActions = Opportunity::active()
            ->whereNotNull('next_action_at')
            ->orderBy('next_action_at')
            ->limit(5)
            ->get();

        $recentActivity = Activity::orderByDesc('occurred_at')->limit(5)->get();

        $staleLeads = Opportunity::active()
            ->where(function ($query) {
                $query->whereNull('last_action_at')
                    ->orWhere('last_action_at', '<', Carbon::now()->subDays(7));
            })
            ->orderBy('last_action_at')
            ->limit(5)
            ->get();

        return view('admin.dashboard', [
            'overviewStats' => $overviewStats,
            'recentFavorites' => $recentFavorites,
            'upcomingActions' => $upcomingActions,
            'recentActivity' => $recentActivity,
            'staleLeads' => $staleLeads,
        ]);
    }
}
