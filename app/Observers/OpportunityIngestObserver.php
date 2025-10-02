<?php

namespace App\Observers;

use App\Jobs\ProcessOpportunityIngest;
use App\Models\OpportunityIngest;

class OpportunityIngestObserver
{
    public function created(OpportunityIngest $ingest): void
    {
        if ($ingest->status !== 'queued') {
            return;
        }

        ProcessOpportunityIngest::dispatch($ingest->id)
            ->onQueue(config('opportunity.ingest.queue', 'opportunity-ingest'))
            ->afterCommit();
    }
}
