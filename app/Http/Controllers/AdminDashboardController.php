<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Post;
use App\Models\Project;
use App\Models\PuzzleScore;
use App\Models\PuzzleSession;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $fourteenDaysAgo = $now->copy()->subDays(14);

        $sessionsLast30 = PuzzleSession::where('created_at', '>=', $thirtyDaysAgo);
        $todaySessions = PuzzleSession::whereDate('created_at', $now->toDateString());

        $visitorSummary = [
            'total_last_30_days' => (clone $sessionsLast30)->count(),
            'external_last_30_days' => (clone $sessionsLast30)->where('is_internal', false)->count(),
            'today' => (clone $todaySessions)->count(),
            'external_today' => (clone $todaySessions)->where('is_internal', false)->count(),
            'lifetime_external' => PuzzleSession::where('is_internal', false)->count(),
        ];

        $recentSessions = PuzzleSession::where('created_at', '>=', $fourteenDaysAgo)->get();
        $visitorTrend = $recentSessions
            ->groupBy(fn ($session) => $session->created_at->format('Y-m-d'))
            ->sortKeys()
            ->map(function ($group, $date) {
                return [
                    'date' => Carbon::parse($date)->format('M j'),
                    'total' => $group->count(),
                    'external' => $group->where('is_internal', false)->count(),
                ];
            })
            ->values();

        $puzzleScoresLast30 = PuzzleScore::where('created_at', '>=', $thirtyDaysAgo);

        $puzzleSummary = [
            'solves_last_30_days' => (clone $puzzleScoresLast30)->count(),
            'external_solves_last_30_days' => (clone $puzzleScoresLast30)
                ->whereHas('puzzle', fn ($query) => $query->where('is_internal', false))
                ->count(),
            'lifetime_external_solves' => PuzzleScore::whereHas('puzzle', fn ($query) => $query->where('is_internal', false))->count(),
        ];

        $topExternalScores = PuzzleScore::with(['puzzle.puzzleType'])
            ->whereHas('puzzle', fn ($query) => $query->where('is_internal', false))
            ->orderByDesc('score')
            ->orderBy('hint_count')
            ->orderBy('solve_time_in_seconds')
            ->orderBy('created_at')
            ->limit(5)
            ->get();

        $projects = Project::select('status', 'is_featured', 'published_at')->get();
        $projectSummary = [
            'total' => $projects->count(),
            'featured' => $projects->where('is_featured', true)->count(),
            'live' => $projects->where('status', 'live')->count(),
            'drafts' => $projects->whereNull('published_at')->count(),
        ];

        $posts = Post::select('title', 'published_at', 'created_at')->latest()->limit(4)->get();
        $postSummary = [
            'published' => Post::whereNotNull('published_at')->count(),
            'drafts' => Post::whereNull('published_at')->count(),
            'recent' => $posts,
        ];

        $jobListings = JobListing::select('status', 'updated_at')->get();
        $jobStatusLabels = [
            JobListing::STATUS_NEW => 'New',
            JobListing::STATUS_INTERESTED => 'Interested',
            JobListing::STATUS_APPLIED => 'Applied',
            JobListing::STATUS_INTERVIEWING => 'Interviewing',
            JobListing::STATUS_DENIED => 'Denied',
            JobListing::STATUS_ACCEPTED => 'Accepted',
            JobListing::STATUS_ARCHIVED => 'Archived',
        ];
        $jobSummary = [
            'total' => $jobListings->count(),
            'active_pipeline' => $jobListings->whereIn('status', [
                JobListing::STATUS_NEW,
                JobListing::STATUS_INTERESTED,
                JobListing::STATUS_APPLIED,
                JobListing::STATUS_INTERVIEWING,
            ])->count(),
            'recent_activity' => $jobListings->where('updated_at', '>=', $now->copy()->subDays(7))->count(),
            'status_counts' => collect($jobStatusLabels)->map(function ($label, $status) use ($jobListings) {
                $count = $jobListings->where('status', $status)->count();

                return [
                    'status' => $status,
                    'label' => $label,
                    'count' => $count,
                ];
            })->values(),
        ];

        return view('admin.dashboard', compact(
            'visitorSummary',
            'visitorTrend',
            'puzzleSummary',
            'topExternalScores',
            'projectSummary',
            'postSummary',
            'jobSummary'
        ));
    }
}
