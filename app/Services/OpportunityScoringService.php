<?php

namespace App\Services;

use App\Models\Opportunity;

class OpportunityScoringService
{
    public function calculate(Opportunity $opportunity): int
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
        if ($currency === strtoupper($prefs['salary_currency'] ?? 'USD') && $salaryMin >= ($prefs['minimum_salary'] ?? 0)) {
            $score += 3;
        }

        $domainTags = collect($opportunity->domain_tags ?? [])->map(fn ($tag) => strtolower($tag));
        $preferred = collect($prefs['preferred_domains'] ?? []);
        $matches = $preferred->intersect($domainTags)->count();
        $score += min(3, $matches * 2);

        return min(10, $score);
    }

    public function apply(Opportunity $opportunity, bool $save = true): bool
    {
        $original = [
            'fit_score' => $opportunity->fit_score,
            'public_visibility' => $opportunity->public_visibility,
        ];

        $opportunity->fit_score = $this->calculate($opportunity);

        $fitFloor = (int) config('opportunity_prefs.fit_score_floor', 0);
        if ($opportunity->fit_score < $fitFloor && ($opportunity->public_visibility ?? false)) {
            $opportunity->public_visibility = false;
        }

        if ($opportunity->fit_score >= $fitFloor && is_null($original['public_visibility'])) {
            $opportunity->public_visibility = true;
        }

        $dirty = $opportunity->isDirty();

        if ($save && $dirty) {
            $opportunity->save();
        }

        return $dirty;
    }
}
