<?php

namespace App\Console\Commands;

use App\Models\JobSource;
use App\Services\JobIngestion\JobIngestionService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class CollectRemoteJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jobs:collect {source? : Optional source slug} {--force : Ignore frequency checks}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Collect remote job listings from configured sources.';

    public function __construct(
        private readonly JobIngestionService $ingestionService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sourceSlug = $this->argument('source');
        $force = (bool) $this->option('force');

        $query = JobSource::query()->enabled();

        if ($sourceSlug) {
            $query->where('slug', $sourceSlug);
        }

        $sources = $query->get();

        if ($sources->isEmpty()) {
            $this->info('No job sources available for collection.');

            return self::SUCCESS;
        }

        foreach ($sources as $source) {
            if (!$force && $this->shouldSkipSource($source)) {
                $this->line("Skipping {$source->name} — collected recently.");
                continue;
            }

            $this->info("Collecting jobs from {$source->name} ({$source->driver})...");

            try {
                $result = $this->ingestionService->ingest($source);

                $source->forceFill([
                    'last_ran_at' => Carbon::now(),
                    'last_status' => Str::limit("ok: {$result['created']} created, {$result['updated']} updated", 255),
                ])->save();

                $this->line("✓ Finished {$source->name}");
            } catch (Throwable $exception) {
                $source->forceFill([
                    'last_ran_at' => Carbon::now(),
                    'last_status' => Str::limit('failed: '.$exception->getMessage(), 255),
                ])->save();

                Log::error('Failed to collect remote jobs', [
                    'source_id' => $source->id,
                    'source_slug' => $source->slug,
                    'message' => $exception->getMessage(),
                    'trace' => $exception->getTraceAsString(),
                ]);

                $this->error("✗ Failed {$source->name}: {$exception->getMessage()}");
            }
        }

        return self::SUCCESS;
    }

    private function shouldSkipSource(JobSource $source): bool
    {
        if (is_null($source->last_ran_at)) {
            return false;
        }

        return $source->last_ran_at->diffInMinutes(now()) < $source->frequency_minutes;
    }
}
