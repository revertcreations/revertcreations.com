<?php

namespace App\Console\Commands;

use App\Jobs\ProcessOpportunityIngest;
use App\Models\OpportunityIngest;
use Illuminate\Console\Command;

class CaptureOpportunity extends Command
{
    protected $signature = 'opportunity:capture {url : URL of the job posting}
        {--html= : Path to a file containing raw HTML}
        {--text= : Path to a file containing plain text}
        {--note= : Personal note to attach}
        {--generate-note : Ask AI to draft a quick-fit summary (processed later)}';

    protected $description = 'Queue an opportunity ingestion request from a posting URL.';

    public function handle(): int
    {
        $url = $this->argument('url');

        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            $this->error('The provided URL is not valid.');
            return self::FAILURE;
        }

        $rawHtml = $this->readOptionalFile($this->option('html'));
        $rawText = $this->readOptionalFile($this->option('text'));

        $ingest = OpportunityIngest::create([
            'source_url' => $url,
            'raw_html' => $rawHtml,
            'raw_text' => $rawText,
            'note' => $this->option('note'),
            'generate_note' => (bool) $this->option('generate-note'),
            'status' => 'queued',
        ]);

        ProcessOpportunityIngest::dispatch($ingest->id);

        $this->info("Queued capture #{$ingest->id} for {$url}");

        return self::SUCCESS;
    }

    private function readOptionalFile(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (! file_exists($path)) {
            $this->warn("File not found: {$path}");
            return null;
        }

        return file_get_contents($path) ?: null;
    }
}
