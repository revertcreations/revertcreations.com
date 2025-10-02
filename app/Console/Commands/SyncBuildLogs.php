<?php

namespace App\Console\Commands;

use App\Models\BuildLog;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SyncBuildLogs extends Command
{
    protected $signature = 'build-log:sync {project? : Project key from config/journals.php}'
        . ' {--since= : Only import entries logged on or after this ISO-8601 timestamp}'
        . ' {--dry-run : Show planned changes without writing to the database}'
        . ' {--refresh : Refresh journal metrics after syncing}';

    protected $description = 'Synchronise build log entries from external docs into the database.';

    public function handle(): int
    {
        $projectsConfig = config('journals.projects', []);

        if (empty($projectsConfig)) {
            $this->error('No projects configured in config/journals.php.');

            return self::FAILURE;
        }

        $targetProject = $this->argument('project');

        if ($targetProject) {
            if (! isset($projectsConfig[$targetProject])) {
                $this->error("Project [{$targetProject}] not found in config/journals.php.");

                return self::FAILURE;
            }

            $projectsConfig = [$targetProject => $projectsConfig[$targetProject]];
        }

        $sinceOption = $this->option('since');
        $since = $sinceOption ? Carbon::parse($sinceOption) : null;
        $dryRun = (bool) $this->option('dry-run');

        $overrides = array_filter([
            'host' => env('DB_HOST_CLI'),
            'port' => env('DB_PORT_CLI'),
            'username' => env('DB_USERNAME_CLI'),
            'password' => env('DB_PASSWORD_CLI'),
        ], static fn ($value) => ! is_null($value) && $value !== '');

        if ($overrides) {
            $connection = config('database.default');
            $configKey = 'database.connections.' . $connection;
            $existingConfig = config($configKey);

            if ($existingConfig) {
                config([$configKey => array_merge($existingConfig, $overrides)]);
            } else {
                $this->warn('Database connection override requested but connection config could not be resolved.');
            }
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($projectsConfig as $slug => $config) {
            $sources = $config['build_log_sources'] ?? null;

            if (! $sources) {
                $this->warn("{$slug}: no build_log_sources configured; skipping.");
                continue;
            }

            if (is_string($sources)) {
                $sources = [
                    ['pattern' => $sources],
                ];
            }

            $sources = array_map(function ($source): array {
                if (is_string($source)) {
                    return ['pattern' => $source];
                }

                return $source;
            }, $sources);

            $basePath = $config['path'] ?? base_path();
            $resolvedBasePath = realpath($basePath);

            if (! $resolvedBasePath) {
                $this->warn("{$slug}: base path [{$basePath}] could not be resolved; skipping.");
                continue;
            }

            foreach ($sources as $sourceConfig) {
                $pattern = $sourceConfig['pattern'] ?? $sourceConfig['glob'] ?? null;

                if (! $pattern) {
                    $this->warn("{$slug}: skipping a source without a pattern definition.");
                    continue;
                }

                $fullPattern = rtrim($resolvedBasePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim($pattern, DIRECTORY_SEPARATOR);
                $files = glob($fullPattern) ?: [];
                sort($files);

                if (empty($files)) {
                    $this->warn("{$slug}: no files matched [{$pattern}].");
                    continue;
                }

                foreach ($files as $filePath) {
                    if (! is_file($filePath)) {
                        continue;
                    }

                    $metadata = $this->parseBuildLogMetadata($filePath);

                    if (! $metadata) {
                        $this->warn("{$slug}: {$this->relativeTo($filePath, $resolvedBasePath)} missing build-log metadata; skipping.");
                        $skipped++;
                        continue;
                    }

                    $metadata['project'] = $metadata['project'] ?? $slug;


$allowedProjects = Arr::wrap($sourceConfig['projects'] ?? [$slug]);

if (! in_array('*', $allowedProjects, true)) {
    if (! in_array($metadata['project'], $allowedProjects, true)) {
        $this->warn("{$slug}: {$this->relativeTo($filePath, $resolvedBasePath)} project [{$metadata['project']}] not in allowed set; skipping.");
        $skipped++;
        continue;
    }
}

                    if (empty($metadata['logged_at']) || empty($metadata['title'])) {
                        $this->warn("{$slug}: {$this->relativeTo($filePath, $resolvedBasePath)} missing required fields; skipping.");
                        $skipped++;
                        continue;
                    }

                    $loggedAt = Carbon::parse($metadata['logged_at']);

                    if ($since && $loggedAt->lt($since)) {
                        $skipped++;
                        continue;
                    }

                    $metadata['logged_at'] = $loggedAt;

                    $links = [];

                    if (! empty($metadata['links']) && is_array($metadata['links'])) {
                        $links = $metadata['links'];
                    }

                    if (! empty($metadata['slug'])) {
                        $links['slug'] = $metadata['slug'];
                    }

                    $relativeSource = $this->relativeTo($filePath, $resolvedBasePath);
                    $links['source'] = $links['source'] ?? $relativeSource;
                    $metadata['links'] = $links;
                    $metadata['public_visibility'] = Arr::get($metadata, 'public_visibility', true);

                    $payload = Arr::only($metadata, [
                        'logged_at',
                        'phase',
                        'category',
                        'project',
                        'title',
                        'description',
                        'agent_contribution',
                        'review_notes',
                        'links',
                        'public_visibility',
                    ]);

                    if ($dryRun) {
                        $this->line(sprintf('Would sync %s :: %s (%s)', $payload['project'], $payload['title'], $relativeSource));
                        continue;
                    }

                    $existing = BuildLog::query()
                        ->where('project', $payload['project'])
                        ->where('links->source', $relativeSource)
                        ->first();

                    if ($existing) {
                        $existing->fill($payload);
                        $existing->save();
                        $updated++;
                        $this->info(sprintf('Updated %s :: %s (%s)', $payload['project'], $payload['title'], $relativeSource));
                    } else {
                        BuildLog::create($payload);
                        $created++;
                        $this->info(sprintf('Created %s :: %s (%s)', $payload['project'], $payload['title'], $relativeSource));
                    }
                }
            }
        }

        if ($dryRun) {
            return self::SUCCESS;
        }

        if ($this->option('refresh')) {
            Artisan::call('journal:refresh-metrics');
            $this->info('Refreshed journal metrics.');
        }

        $this->line(sprintf('Sync complete. %d created, %d updated, %d skipped.', $created, $updated, $skipped));

        return self::SUCCESS;
    }

    protected function parseBuildLogMetadata(string $path): ?array
    {
        $contents = File::get($path);

        if (! preg_match('/<!--\s*build-log(?::)?\s*(\{.*?\})\s*-->/s', $contents, $matches)) {
            return null;
        }

        $json = trim($matches[1]);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error(sprintf('Failed to decode build-log metadata in %s: %s', $path, json_last_error_msg()));

            return null;
        }

        return $data;
    }

    protected function relativeTo(string $path, string $basePath): string
    {
        $normalisedPath = Str::replace('\\', '/', $path);
        $normalisedBase = rtrim(Str::replace('\\', '/', $basePath), '/');

        if (Str::startsWith($normalisedPath, $normalisedBase)) {
            return ltrim(Str::replaceFirst($normalisedBase, '', $normalisedPath), '/');
        }

        return $normalisedPath;
    }
}
