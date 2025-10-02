<?php

namespace App\Console;

use App\Console\Commands\CaptureOpportunity;
use App\Console\Commands\ImportOpportunitySources;
use App\Console\Commands\RefreshJournalMetrics;
use App\Console\Commands\ResetAdminPassword;
use App\Console\Commands\ScoreOpportunities;
use App\Console\Commands\SyncBuildLogs;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ResetAdminPassword::class,
        ImportOpportunitySources::class,
        RefreshJournalMetrics::class,
        ScoreOpportunities::class,
        CaptureOpportunity::class,
        SyncBuildLogs::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
