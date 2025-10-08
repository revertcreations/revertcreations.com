<?php

namespace App\Jobs;

use App\Models\JobApplication;
use App\Models\Opportunity;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SubmitBatchApplications implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @param array<int, int> $opportunityIds
     * @param array<string, mixed> $payload
     */
    public function __construct(
        protected array $opportunityIds,
        protected array $payload = []
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = Carbon::now();
        $targetStatus = $this->payload['target_status'] ?? JobApplication::STATUS_QUEUED;

        Opportunity::whereIn('id', $this->opportunityIds)
            ->with('applications')
            ->each(function (Opportunity $opportunity) use ($targetStatus, $now) {
                $application = $opportunity->applications()
                    ->firstOrNew([]);

                if (! $application->exists) {
                    $application->status = $targetStatus;
                    $application->applied_at = null;
                    $application->automation_payload = $this->payload;
                }

                $application->status = $targetStatus;
                $application->follow_up_at = $this->payload['follow_up_at'] ?? $application->follow_up_at;
                $application->notes = trim(($application->notes ? $application->notes."\n\n" : '').($this->payload['notes'] ?? ''));
                $application->automation_payload = array_merge($application->automation_payload ?? [], $this->payload);
                $application->save();

                if ($targetStatus === JobApplication::STATUS_SUBMITTED && ! $application->applied_at) {
                    $application->update(['applied_at' => $now]);
                }
            });

        Log::info('Queued batch applications', [
            'opportunity_ids' => $this->opportunityIds,
            'payload' => $this->payload,
        ]);
    }
}

