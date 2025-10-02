<?php

namespace App\Jobs;

use App\Models\OpportunityIngest;
use App\Services\OpportunityIngestionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessOpportunityIngest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $ingestId;

    public string $queueName;

    /**
     * Create a new job instance.
     */
    public function __construct(int $ingestId)
    {
        $this->ingestId = $ingestId;
        $this->queueName = config('opportunity.ingest.queue', 'opportunity-ingest');
        $this->onQueue($this->queueName);
    }

    /**
     * Execute the job.
     */
    public function handle(OpportunityIngestionService $service): void
    {
        $ingest = OpportunityIngest::find($this->ingestId);

        if (! $ingest) {
            Log::warning('Opportunity ingest missing', ['ingestId' => $this->ingestId]);
            return;
        }

        $ingest->update(['status' => 'processing']);

        try {
            $result = $service->process($ingest);

            Log::info('Opportunity ingest drafted', [
                'ingest_id' => $ingest->id,
                'opportunity_id' => $result['opportunity']->id ?? null,
                'source_url' => $ingest->source_url,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Opportunity ingest failed', [
                'ingest_id' => $ingest->id,
                'source_url' => $ingest->source_url,
                'message' => $exception->getMessage(),
            ]);

            $ingest->update([
                'status' => 'failed',
                'errors' => ['message' => $exception->getMessage()],
            ]);
        }
    }
}
