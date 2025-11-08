<?php

namespace App\Console\Commands;

use App\Jobs\CollectAuctionListingsJob;
use App\Models\AuctionSource;
use Illuminate\Console\Command;

class CollectAuctionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auctions:collect
                            {--source= : Specific source slug to collect from}
                            {--force : Force collection even if not due}
                            {--sync : Run synchronously instead of dispatching jobs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Collect auction listings from configured sources';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting auction collection...');

        // Get sources to collect from
        $query = AuctionSource::query()->where('enabled', true);

        if ($sourceSlug = $this->option('source')) {
            $query->where('slug', $sourceSlug);
        } else if (!$this->option('force')) {
            // Only collect from sources that are due
            $query->whereRaw('
                last_ran_at IS NULL
                OR last_ran_at < DATE_SUB(NOW(), INTERVAL frequency_minutes MINUTE)
            ');
        }

        $sources = $query->get();

        if ($sources->isEmpty()) {
            $this->warn('No sources found to collect from.');
            return Command::SUCCESS;
        }

        $this->info("Found {$sources->count()} source(s) to collect from:");

        foreach ($sources as $source) {
            $this->line("  - {$source->name} ({$source->slug})");
        }

        if (!$this->confirm('Proceed with collection?', true)) {
            $this->info('Collection cancelled.');
            return Command::SUCCESS;
        }

        $this->newLine();

        foreach ($sources as $source) {
            $this->info("Collecting from: {$source->name}");

            try {
                if ($this->option('sync')) {
                    // Run synchronously for debugging
                    $job = new CollectAuctionListingsJob($source);
                    $job->handle();
                    $this->info("✓ Collection completed for {$source->name}");
                } else {
                    // Dispatch to queue
                    CollectAuctionListingsJob::dispatch($source);
                    $this->info("✓ Collection job dispatched for {$source->name}");
                }
            } catch (\Exception $e) {
                $this->error("✗ Failed to collect from {$source->name}: {$e->getMessage()}");
            }

            $this->newLine();
        }

        $this->info('Collection process completed!');

        if (!$this->option('sync')) {
            $this->line('Jobs have been dispatched to the queue.');
            $this->line('Run "sail artisan queue:work" to process them.');
        }

        return Command::SUCCESS;
    }
}
