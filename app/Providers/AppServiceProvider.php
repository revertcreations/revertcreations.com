<?php

namespace App\Providers;

use App\Models\OpportunityIngest;
use App\Observers\OpportunityIngestObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        OpportunityIngest::observe(OpportunityIngestObserver::class);
    }
}
