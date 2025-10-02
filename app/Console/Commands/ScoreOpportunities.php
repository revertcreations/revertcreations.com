<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;

class ScoreOpportunities extends Command
{
    protected $signature = 'opportunity:score';

    protected $description = 'Recalculate fit scores for existing opportunities.';

    public function handle(): int
    {
        $opportunities = Opportunity::all();
        $updated = 0;
        $fitFloor = (int) config('opportunity_prefs.fit_score_floor', 0);
        $autoHidden = 0;

        foreach ($opportunities as $opportunity) {
            $original = $opportunity->fit_score;
            $opportunity->fit_score = $this->score($opportunity);

            if ($opportunity->fit_score < $fitFloor && ($opportunity->public_visibility ?? false)) {
                $opportunity->public_visibility = false;
                $autoHidden++;
            }

            if ($opportunity->fit_score >= $fitFloor && is_null($opportunity->public_visibility)) {
                $opportunity->public_visibility = true;
            }

            if ($opportunity->isDirty()) {
                $opportunity->save();
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

    protected function score(Opportunity $opportunity): int
    {
        $score = 0;

        if ($opportunity->is_remote) {
            $score += 2;
        }

        $async = $opportunity->async_level ?? 0;
        if ($async >= 4) {
            $score += 2;
        } elseif ($async >= 2) {
            $score += 1;
        }

        $prefs = config('opportunity_prefs');
        $salaryMin = $opportunity->salary_min ?? 0;
        $currency = strtoupper($opportunity->salary_currency ?? 'USD');
        if ($currency === strtoupper($prefs['salary_currency']) && $salaryMin >= ($prefs['minimum_salary'] ?? 0)) {
            $score += 3;
        }

        $domainTags = collect($opportunity->domain_tags ?? [])->map(fn ($tag) => strtolower($tag));
        $preferred = collect($prefs['preferred_domains'] ?? []);
        $matches = $preferred->intersect($domainTags)->count();
        $score += min(3, $matches * 2);

        return min(10, $score);
    }
}
