<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportJunkyardWatchdogProject extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'projects:import-junkyard-watchdog {--path= : Override the path to the junkyardwatchdog repo}';

    /**
     * The console command description.
     */
    protected $description = 'Sync the Junkyard Watchdog project metadata and project updates from the monorepo docs';

    public function handle(): int
    {
        $project = Project::firstOrCreate([
            'slug' => 'junkyard-watchdog',
        ], [
            'name' => 'Junkyard Watchdog',
        ]);

        $this->info('Syncing project metadata…');

        $project->fill([
            'name' => 'Junkyard Watchdog',
            'tagline' => 'Smart alerts for salvage-yard treasure hunters.',
            'summary' => 'A full-stack companion that monitors self-service junkyards, powers watchlists, and keeps gearheads in the loop with timely digests.',
            'body' => implode("\n\n", [
                '## Why',
                'Junkyard Watchdog keeps a pulse on U-Pull-&-Pay and other self-service yards so you never miss the donor you have been chasing. It ingests inventory on a tight cadence, normalises the data, and delivers actionable alerts when something hitting your watchlists lands on the yard.',
                '## What\'s inside',
                '- Laravel 12 + MySQL backend with Sanctum auth, notification scheduling, and real-time ingest health dashboards\n- Expo/React Native client (iOS + web) with garage management, watchlist creation, and digest controls\n- Admin tooling for sources, locations, digests, and operational telemetry\n- Stripe-powered monetisation, Mailgun email, and push notifications wired through Expo',
                '## Launch track',
                'Targeting a public launch in October 2025 after clearing the production checklist (ops, QA, analytics, mobile release, payments).',
            ]),
            'status' => Project::STATUS_IN_PROGRESS,
            'hero_image_url' => $project->hero_image_url ?: 'https://res.cloudinary.com/junkyardwatchdog/image/upload/v1760038634/projects/assets/yo93rzbn96tkfez3n1vh.png',
            'primary_link_label' => 'Visit junkyardwatchdog.com',
            'primary_link_url' => 'https://junkyardwatchdog.com',
            'links' => [
                ['label' => 'Monorepo', 'url' => 'https://github.com/revertcreations/junkyardwatchdog'],
                ['label' => 'Launch plan', 'url' => 'https://github.com/revertcreations/junkyardwatchdog/blob/main/PROJECT_PLAN.md'],
            ],
            'tech_stack' => [
                'Laravel 12',
                'MySQL',
                'Expo / React Native',
                'Tailwind CSS',
                'Stripe',
                'Mailgun',
                'Cloudinary',
            ],
            'display_order' => 1,
            'is_featured' => true,
            'published_at' => $project->published_at ?? now(),
        ]);

        $project->save();

        $blogPath = $this->blogPath();

        if (! $blogPath || ! File::isDirectory($blogPath)) {
            $this->error('Unable to locate junkyardwatchdog blog directory.');

            return self::FAILURE;
        }

        $files = collect(File::files($blogPath))
            ->filter(fn ($file) => Str::endsWith($file->getFilename(), '.md'))
            ->sortBy(fn ($file) => $file->getFilename());

        $imported = 0;
        $updated = 0;

        foreach ($files as $file) {
            $filename = pathinfo($file->getFilename(), PATHINFO_FILENAME);

            if (! preg_match('/^(\d{4}-\d{2}-\d{2})-(.+)$/', $filename, $matches)) {
                $this->warn("Skipping {$file->getFilename()} (unrecognised filename format).");
                continue;
            }

            [$full, $datePart, $slugPart] = $matches;
            $publishedAt = Carbon::createFromFormat('Y-m-d', $datePart)->startOfDay();

            $contents = File::get($file->getRealPath());
            $headingMatch = [];
            preg_match('/^#\s*(.+)$/m', $contents, $headingMatch);
            $rawTitle = $headingMatch[1] ?? Str::title(str_replace('-', ' ', $slugPart));
            $title = trim(Str::of($rawTitle)->replace('–', '-')); // normalise en dash

            $slug = Str::slug($slugPart ?: $title);

            $body = trim(preg_replace('/^#\s.+\R+/', '', $contents, 1));
            $rendered = Str::markdown($body);
            $excerpt = Str::of(strip_tags($rendered))->squish()->limit(220);

            $payload = [
                'title' => $title,
                'excerpt' => $excerpt,
                'body' => $body,
                'rendered_body' => $rendered,
                'status' => 'published',
                'is_pinned' => false,
                'author' => 'Trever Hillis',
                'meta' => [
                    'source_file' => 'docs/blog/'.$file->getFilename(),
                ],
                'published_at' => $publishedAt,
            ];

            /** @var \App\Models\ProjectUpdate $update */
            $update = ProjectUpdate::query()
                ->where('project_id', $project->id)
                ->where('slug', $slug)
                ->first();

            if ($update) {
                $update->fill($payload);
                $update->save();
                $updated++;
            } else {
                $project->updates()->create(array_merge($payload, [
                    'slug' => $slug,
                ]));
                $imported++;
            }
        }

        $this->info("Project synced. Imported {$imported} updates, refreshed {$updated}.");

        return self::SUCCESS;
    }

    private function blogPath(): ?string
    {
        $override = $this->option('path');

        if ($override) {
            return realpath($override);
        }

        return realpath(base_path('../junkyardwatchdog/docs/blog')) ?: null;
    }
}
