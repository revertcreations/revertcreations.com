<?php

namespace App\Console\Commands;

use App\Models\BuildLog;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class RefreshJournalMetrics extends Command
{
    protected $signature = 'journal:refresh-metrics {--since=}';

    protected $description = 'Compute build journal metrics such as commit counts and lines added.';

    public function handle(): int
    {
        $projects = config('journals.projects', []);

        if (empty($projects)) {
            $this->warn('No projects configured in config/journals.php.');
            return self::SUCCESS;
        }

        $sinceOverride = $this->option('since');
        $dbAvailable = $this->databaseAvailable();
        if (! $dbAvailable) {
            $this->warn('Database unavailable; build log counts will be reported as zero.');
        }
        $metrics = [];

        foreach ($projects as $slug => $options) {
            $path = Arr::get($options, 'path');

            if (! $path || ! is_dir($path)) {
                $this->warn("Skipping {$slug}: path {$path} not found.");
                continue;
            }

            $since = $sinceOverride ?: Arr::get($options, 'since', '2024-01-01');

            $metrics[$slug] = $this->gatherMetrics($slug, $path, $since, $dbAvailable);
        }

        Storage::disk('local')->put('journal-metrics.json', json_encode($metrics, JSON_PRETTY_PRINT));

        $this->info('Journal metrics refreshed.');

        return self::SUCCESS;
    }

    protected function gatherMetrics(string $slug, string $path, string $since, bool $dbAvailable): array
    {
        $commitCount = (int) $this->runGitCommand(['git', 'rev-list', '--count', 'HEAD'], $path);
        $additions = $this->calculateAdditions($path, $since);
        $firstCommitDate = $this->runGitCommand(['git', 'log', '--reverse', '--format=%cs', 'HEAD'], $path, true);
        $latestCommitDate = $this->runGitCommand(['git', 'log', '-1', '--format=%cs', 'HEAD'], $path, true);

        $daysActive = null;
        if ($firstCommitDate && $latestCommitDate) {
            $daysActive = Carbon::parse($firstCommitDate)->diffInDays(Carbon::parse($latestCommitDate)) + 1;
        }

        $buildLogCount = 0;
        if ($dbAvailable) {
            $buildLogCount = BuildLog::public()->forProject($slug)->count();
        }

        return [
            'commit_count' => $commitCount,
            'lines_added_since' => $additions,
            'days_active' => $daysActive,
            'build_logs' => $buildLogCount,
            'generated_at' => now()->toIso8601String(),
        ];
    }

    protected function databaseAvailable(): bool
    {
        try {
            BuildLog::query()->limit(1)->count();
            return true;
        } catch (\Throwable $throwable) {
            return false;
        }
    }

    protected function calculateAdditions(string $path, string $since): int
    {
        $process = Process::fromShellCommandline(
            sprintf('git log --since="%s" --shortstat --pretty=format:%%H', $since),
            $path
        );
        $process->run();

        if (! $process->isSuccessful()) {
            return 0;
        }

        $output = $process->getOutput();
        $additions = 0;

        foreach (explode("\n", $output) as $line) {
            if (str_contains($line, 'insertion')) {
                if (preg_match('/(\d+) insertions?/', $line, $matches)) {
                    $additions += (int) ($matches[1] ?? 0);
                }
            }
        }

        return $additions;
    }

    protected function runGitCommand(array $command, string $path, bool $firstLine = false): string
    {
        $process = new Process($command, $path);
        $process->run();

        if (! $process->isSuccessful()) {
            return '';
        }

        $output = trim($process->getOutput());

        if ($firstLine) {
            return strtok($output, "\n");
        }

        return $output;
    }
}
