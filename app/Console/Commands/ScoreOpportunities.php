<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;
use App\Services\OpportunityScoringService;

class ScoreOpportunities extends Command
{
    protected OpportunityScoringService $scoringService;

    protected $signature = 'opportunity:score';

    protected $description = 'Recalculate fit scores for existing opportunities.';

    public function __construct(OpportunityScoringService $scoringService)
    {
        parent::__construct();
        $this->scoringService = $scoringService;
    }

    public function handle(): int
    {
        $opportunities = Opportunity::all();
        $updated = 0;
        $fitFloor = (int) config('opportunity_prefs.fit_score_floor', 0);
        $autoHidden = 0;

        foreach ($opportunities as $opportunity) {
            $original = $opportunity->fit_score;
            $wasDirty = $this->scoringService->apply($opportunity);

            if ($opportunity->fit_score < $fitFloor && ($opportunity->public_visibility ?? false)) {
                $autoHidden++;
            }

            if ($wasDirty) {
                $updated++;
            }
        }

        $message = "Updated {$updated} opportunities.";
        if ($autoHidden > 0) {
            $message .= " Auto-hidden {$autoHidden} below fit score floor of {$fitFloor}.";
        }

        $this->info($message);

        return self::SUCCESS;
    }

}
