<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\BuildLog;
use App\Models\Opportunity;
use App\Models\Project;
use App\Models\SiteStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SkillSeeder::class,
            PuzzleTypeSeeder::class,
        ]);

        Opportunity::truncate();
        Activity::truncate();
        BuildLog::truncate();

        $opportunities = [
            [
                'slug' => 'atlas-ai-product-engineer',
                'company_name' => 'Atlas Robotics',
                'industry' => 'Industrial Automation',
                'role_title' => 'AI Product Engineer',
                'status' => 'in_progress',
                'stage' => 'Interview Loop',
                'priority' => 'high',
                'source' => 'agent-scraped',
                'source_channel' => 'LinkedIn alert + custom scraper',
                'public_visibility' => true,
                'summary' => 'Scaling a robotics control room with agent-based QA and remote diagnostics.',
                'next_action_at' => Carbon::now()->addDays(2),
                'notes' => 'Preparing demo walkthrough with agent review clips.',
                'links' => [
                    'brief' => 'https://example.com/atlas-brief',
                ],
            ],
            [
                'slug' => 'helios-labs-agent-orchestrator',
                'company_name' => 'Helios Labs',
                'industry' => 'Climate Tech',
                'role_title' => 'Agent Orchestrator',
                'status' => 'open',
                'stage' => 'Case Study Sent',
                'priority' => 'medium',
                'source' => 'referral',
                'source_channel' => 'Founder warm intro',
                'public_visibility' => true,
                'summary' => 'Designing a pilot for emissions insights with researcher + analyst agent pairs.',
                'next_action_at' => Carbon::now()->addDays(5),
                'notes' => 'Awaiting feedback on agent guardrail proposal.',
                'links' => [
                    'deck' => 'https://example.com/helios-deck',
                ],
            ],
            [
                'slug' => 'northwind-ai-enablement-lead',
                'company_name' => 'Northwind Systems',
                'industry' => 'Enterprise SaaS',
                'role_title' => 'AI Enablement Lead',
                'status' => 'open',
                'stage' => 'Intro Scheduled',
                'priority' => 'high',
                'source' => 'agent-scraped',
                'source_channel' => 'Wellfound API automation',
                'public_visibility' => false,
                'summary' => 'Operationalizing cross-team prompts and review cadences for SaaS workflows.',
                'next_action_at' => Carbon::now()->addDay(),
                'notes' => 'Confidential until NDA is finalized.',
                'links' => [
                    'ops_playbook' => 'docs/launch/ops-infrastructure.md',
                ],
            ],
            [
                'slug' => 'vectorlab-partner-pilot',
                'company_name' => 'VectorLab',
                'industry' => 'Developer Tools',
                'role_title' => 'AI Product Engineer',
                'status' => 'open',
                'stage' => 'Applied',
                'priority' => 'medium',
                'source' => 'newsletter',
                'source_channel' => 'Ben Tossell AI Jobs digest',
                'public_visibility' => true,
                'summary' => 'Pitching an agent-assisted release planner with automated risk surfacing.',
                'next_action_at' => Carbon::now()->addDays(3),
                'notes' => 'Need to assemble architecture snapshot for follow-up.',
                'links' => [
                    'catalog_plan' => 'docs/vehicle_data_expansion.md',
                ],
            ],
            [
                'slug' => 'apollo-studio-launch',
                'company_name' => 'Apollo Studio',
                'industry' => 'Media Tech',
                'role_title' => 'Head of AI Enablement',
                'status' => 'paused',
                'stage' => 'Applied',
                'priority' => 'low',
                'source' => 'manual',
                'source_channel' => 'Inbound email',
                'public_visibility' => true,
                'summary' => 'Asynchronous content QA pipeline with reviewer-in-the-loop for launch day coverage.',
                'next_action_at' => Carbon::now()->addWeeks(1),
                'notes' => 'Paused while internal hiring plan shifts.',
                'links' => [
                    'typesafe_notes' => 'docs/qa/mobile-regression-plan.md',
                ],
            ],
        ];

        foreach ($opportunities as $opportunity) {
            Opportunity::create($opportunity);
        }

        $activities = [
            [
                'occurred_at' => Carbon::parse('2025-09-04 19:30:00', 'America/New_York'),
                'category' => 'build',
                'project' => 'junkyard-watchdog',
                'headline' => 'Hardening the first UPullAndPay ingest + auth cleanup',
                'body' => 'Replaced debug dd() calls, secured admin sync routes, aligned auth responses, and shipped the first stable ingest + inventory API.',
                'link' => 'docs/launch/ops-infrastructure.md',
                'tags' => ['backend', 'ingest'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-05 20:30:00', 'America/New_York'),
                'category' => 'build',
                'project' => 'junkyard-watchdog',
                'headline' => 'Catalog aliases merged for cleaner search',
                'body' => 'Unified make/model aliases (Chevy→Chevrolet, etc.) so watchlist and inventory search stay consistent across sources.',
                'link' => null,
                'tags' => ['backend', 'catalog'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-06 17:20:00', 'America/New_York'),
                'category' => 'qa',
                'project' => 'junkyard-watchdog',
                'headline' => 'Type-safe inventory list after TanStack Query v5',
                'body' => 'Fixed the Expo app’s TypeScript errors, smoothed FlashList rendering, and kept the UI on React Native Paper after Tamagui trial.',
                'link' => null,
                'tags' => ['mobile', 'typescript'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-07 18:10:00', 'America/New_York'),
                'category' => 'product',
                'project' => 'junkyard-watchdog',
                'headline' => 'Garage feed and unread badges shipped',
                'body' => 'Polished Garage and Home cards, added FlashList fixes, and wired Expo notifications to store delivery receipts.',
                'link' => null,
                'tags' => ['mobile', 'notifications'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-10 16:45:00', 'America/New_York'),
                'category' => 'ops',
                'project' => 'junkyard-watchdog',
                'headline' => 'Staging droplet provisioned with automated health checks',
                'body' => 'Terraform + GitHub workflows now spin up droplets, issue certs, and run diagnostics from one command.',
                'link' => 'docs/launch/infra-provisioning-checklist.md',
                'tags' => ['infra', 'ci'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-17 13:00:00', 'America/New_York'),
                'category' => 'product',
                'project' => 'junkyard-watchdog',
                'headline' => 'Admin UI refresh and lifecycle emails queued',
                'body' => 'Restyled admin dashboard/views and added welcome + 7-day lifecycle drip, ready once Mailgun creds are live.',
                'link' => null,
                'tags' => ['admin', 'email'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-22 21:15:00', 'America/New_York'),
                'category' => 'product',
                'project' => 'junkyard-watchdog',
                'headline' => 'Watchlists sync unread badges across devices',
                'body' => 'Mobile unread micro-interactions now stay in sync with the API; Stripe webhook proxy keeps billing portal callbacks secure.',
                'link' => null,
                'tags' => ['watchlist', 'stripe'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-29 18:45:00', 'America/New_York'),
                'category' => 'ops',
                'project' => 'junkyard-watchdog',
                'headline' => 'Production droplet hardened with backups and DNS cutover',
                'body' => 'Provisioned jw-prod-01, ran MySQL hardening, issued Let’s Encrypt certs, and captured encrypted backups to Spaces.',
                'link' => 'docs/launch/backup-restore-verification.md',
                'tags' => ['infra', 'launch'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::parse('2025-09-30 11:05:00', 'America/New_York'),
                'category' => 'qa',
                'project' => 'junkyard-watchdog',
                'headline' => 'Regression suite cleared for launch',
                'body' => 'Backend, frontend, and Playwright smoke all green; documented manual device findings ahead of App Store submission.',
                'link' => 'docs/qa/regression-2025-09-30.md',
                'tags' => ['qa', 'launch'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::now()->subHours(4),
                'category' => 'design',
                'project' => 'site-relaunch',
                'headline' => 'Homepage restyled with mission control theme',
                'body' => 'Swapped the old monospaced hero for the new Inter/Playfair palette, refreshed nav/footer, and introduced reusable card components.',
                'link' => null,
                'tags' => ['ui', 'site'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::now()->subHours(2),
                'category' => 'content',
                'project' => 'site-relaunch',
                'headline' => 'Build logs backfilled from Junkyard Watchdog history',
                'body' => 'Imported the project timeline into the public feed and set up seeds so the homepage reflects the real shipping cadence.',
                'link' => null,
                'tags' => ['content', 'journal'],
                'public_visibility' => true,
            ],
            [
                'occurred_at' => Carbon::now()->subHour(),
                'category' => 'ops',
                'project' => 'site-relaunch',
                'headline' => 'Opportunity importer wired for live leads',
                'body' => 'Added an Artisan command that pulls JSON opportunity sources into the pipeline so the public view stays fresh.',
                'link' => null,
                'tags' => ['pipeline', 'automation'],
                'public_visibility' => true,
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }

        $buildLogs = [
            [
                'logged_at' => Carbon::parse('2025-09-04 20:15:00', 'America/New_York'),
                'phase' => 'Build',
                'category' => 'ingest',
                'project' => 'junkyard-watchdog',
                'title' => 'Secured admin ingest and delivered first UPullAndPay sync',
                'description' => 'Moved the scraper trigger into a controller with auth, swapped file_get_contents for Laravel Http, and aligned the Expo login flow with Sanctum tokens.',
                'agent_contribution' => 'Agents mapped priority hardening tasks and generated the initial Makefile + Sail script list.',
                'review_notes' => 'Keep admin routes behind auth and use the HTTP client for all new scrapers.',
                'links' => [
                    'ops_playbook' => 'docs/launch/ops-infrastructure.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-05 21:00:00', 'America/New_York'),
                'phase' => 'Build',
                'category' => 'catalog',
                'project' => 'junkyard-watchdog',
                'title' => 'Normalized inventory catalog for lightning-fast search',
                'description' => 'Built the automotive catalog builder, merged alias mappings, and indexed make/model queries so watchlists and typeahead stay consistent.',
                'agent_contribution' => 'Agents proposed the initial alias list and surfaced missing indexes from query logs.',
                'review_notes' => 'Spot-check catalog builds whenever new sources land; keep alias tests updated.',
                'links' => [
                    'catalog_plan' => 'docs/vehicle_data_expansion.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-06 18:00:00', 'America/New_York'),
                'phase' => 'QA',
                'category' => 'mobile',
                'project' => 'junkyard-watchdog',
                'title' => 'Tamed TypeScript after TanStack Query upgrade',
                'description' => 'Resolved inventory screen type errors, stabilized FlashList rendering, and confirmed the RN Paper theme stays in place for dark mode.',
                'agent_contribution' => 'Agents flagged the `placeholderData` change and lint failures before they hit CI.',
                'review_notes' => 'When upgrading Query again, budget time for the Expo type surface.',
                'links' => [
                    'typesafe_notes' => 'docs/qa/mobile-regression-plan.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-07 19:30:00', 'America/New_York'),
                'phase' => 'Build',
                'category' => 'product',
                'project' => 'junkyard-watchdog',
                'title' => 'Garage feed, unread badges, and notification receipts',
                'description' => 'Refined Garage/Home cards, fixed FlashList rendering, and stored Expo push tickets with receipt polling so notifications stay reliable.',
                'agent_contribution' => 'Agents exercised Expo smoke tests and highlighted the distance query fix pending backend join updates.',
                'review_notes' => 'Re-run mobile smoke after UI tweaks to ensure unread transitions still feel snappy.',
                'links' => [
                    'notification_plan' => 'docs/qa/manual-regression-checklist.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-10 17:00:00', 'America/New_York'),
                'phase' => 'Ops',
                'category' => 'infra',
                'project' => 'junkyard-watchdog',
                'title' => 'Provisioned staging droplet with one-click diagnostics',
                'description' => 'Terraform workflows now create DigitalOcean droplets, harden them, issue TLS certs, and run Supervisor/nginx health checks automatically.',
                'agent_contribution' => 'Agents drafted GitHub workflow scaffolding; human pass hardened certbot flags and restart order.',
                'review_notes' => 'Keep diagnostics workflow green before every deploy; it doubles as the smoke checklist.',
                'links' => [
                    'decision_log' => 'docs/launch/decision-log.md',
                    'infra_checklist' => 'docs/launch/infra-provisioning-checklist.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-17 14:00:00', 'America/New_York'),
                'phase' => 'Build',
                'category' => 'admin',
                'project' => 'junkyard-watchdog',
                'title' => 'Admin dashboard facelift and lifecycle drip',
                'description' => 'Unified the admin UI components and scheduled welcome/7-day lifecycle emails pending SMTP creds so onboarding feels polished.',
                'agent_contribution' => 'Agents proposed the admin layout grid and ensured Pint formatting stayed consistent.',
                'review_notes' => 'Once Mailgun is live, run smoke tests to verify drip sends from staging.',
                'links' => [
                    'admin_briefing' => 'docs/launch/pod-briefings.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-22 22:00:00', 'America/New_York'),
                'phase' => 'Build',
                'category' => 'experience',
                'project' => 'junkyard-watchdog',
                'title' => 'Watchlists, billing, and alias cleanup in sync',
                'description' => 'Shipped unread badges across devices, added Stripe return proxy + webhook hardening, and refreshed the mobile shell with coral branding.',
                'agent_contribution' => 'Agents verified webhook recordings and generated Stripe curl replay scripts.',
                'review_notes' => 'Monitor unread badge sync on the next TestFlight run to catch any Expo state regressions.',
                'links' => [
                    'billing_plan' => 'docs/monetization.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-26 14:30:00', 'America/New_York'),
                'phase' => 'Polish',
                'category' => 'ux',
                'project' => 'junkyard-watchdog',
                'title' => 'UI polish pass before launch freeze',
                'description' => 'Dialed in watchlist/garage surfaces, locked Pint formatting, and locked down typography hierarchy ahead of feature freeze.',
                'agent_contribution' => 'Agents compared dark-mode contrasts and flagged components that still bled brand tints.',
                'review_notes' => 'Treat Pint as mandatory pre-commit; keeps CI calm while we sprint to launch.',
                'links' => [
                    'ui_notes' => 'docs/notes/push-notification-resume-investigation.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-29 19:00:00', 'America/New_York'),
                'phase' => 'Ops',
                'category' => 'infra',
                'project' => 'junkyard-watchdog',
                'title' => 'Production droplet hardened and backups rehearsed',
                'description' => 'Provisioned jw-prod-01, rotated secrets, issued Let’s Encrypt certs, and verified encrypted MySQL backups + restore path.',
                'agent_contribution' => 'Agents drafted the cron + Spaces upload script; human pass validated restore on a throwaway DB.',
                'review_notes' => 'Keep nightly backup logs in decision log; offsite sync is critical before launch traffic.',
                'links' => [
                    'decision_log' => 'docs/launch/decision-log.md',
                    'backup_plan' => 'docs/launch/backup-restore-verification.md',
                    'secret_rotation' => 'docs/launch/secret-rotation-plan.md',
                    'dns_cutover' => 'docs/launch/dns-cutover-plan.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => Carbon::parse('2025-09-30 12:00:00', 'America/New_York'),
                'phase' => 'Launch',
                'category' => 'qa',
                'project' => 'junkyard-watchdog',
                'title' => 'Launch regression suite + App Store readiness',
                'description' => 'Ran backend/frontend suites, Playwright smoke on staging & prod, documented manual findings, and packaged the iOS binary for App Store review.',
                'agent_contribution' => 'Agents compiled regression results into the QA log and pre-filled App Store prep checklist items.',
                'review_notes' => 'Manual device findings still in progress—finish iOS/Android pass before the launch window opens.',
                'links' => [
                    'regression_log' => 'docs/qa/regression-2025-09-30.md',
                    'app_store_prep' => 'docs/launch/app-store-prep.md',
                    'screenshot_plan' => 'docs/launch/screenshot-fixture.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subHours(5),
                'phase' => 'Build',
                'category' => 'ux',
                'project' => 'site-relaunch',
                'title' => 'Mission control homepage redesign shipped',
                'description' => 'Implemented Inter/Playfair typography, refreshed nav/footer, and introduced card surfaces for status, pipeline, and activity feeds.',
                'agent_contribution' => 'Agents supplied initial layout wireframes; human pass tuned copy and responsive spacing.',
                'review_notes' => 'Monitor performance after mixing gradients and shadows; tweak Tailwind config if needed.',
                'links' => null,
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subHours(3),
                'phase' => 'Content',
                'category' => 'journal',
                'project' => 'site-relaunch',
                'title' => 'Backfilled Junkyard Watchdog build history',
                'description' => 'Seeded the activity/build log timeline with real milestones from the Junkyard Watchdog repo and prepped notes for a public journal page.',
                'agent_contribution' => 'Agents summarized .codex session logs and decision docs to derive milestone descriptions.',
                'review_notes' => 'Add dedicated journal pages per project so visitors can dive deeper than the homepage teasers.',
                'links' => null,
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subHour(),
                'phase' => 'Build',
                'category' => 'pipeline',
                'project' => 'site-relaunch',
                'title' => 'Opportunity importer for live pipeline data',
                'description' => 'Created an Artisan command that ingests JSON opportunity feeds so the pipeline can pull in scrapes, newsletters, or spreadsheet exports quickly.',
                'agent_contribution' => 'Agents drafted the JSON schema and suggested slug/merge rules for updateOrCreate.',
                'review_notes' => 'Next step: connect to a real scraping workflow or manual export so the pipeline fills automatically.',
                'links' => null,
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subMinutes(20),
                'phase' => 'Build',
                'category' => 'admin',
                'project' => 'site-relaunch',
                'title' => 'Control room styling + public pipeline filters',
                'description' => 'Unified admin tables with Gruvbox zebra styling, added instant visibility toggles, and grouped the public opportunities page by workflow stage.',
                'agent_contribution' => 'Agents drafted Blade refactors and suggested component extraction for headers/flash notices.',
                'review_notes' => 'Monitor real data in prod—confirm toggling visibility updates the public page without cache issues.',
                'links' => null,
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subMinutes(5),
                'phase' => 'Plan',
                'category' => 'pipeline',
                'project' => 'site-relaunch',
                'title' => 'Opportunity ingestion automation blueprint',
                'description' => 'Captured the plan to turn a single job URL + pasted HTML into a structured opportunity via queued ingestion, LLM extraction, and scoring hooks.',
                'agent_contribution' => 'Agents outlined the capture flow, ingestion job responsibilities, and data model updates.',
                'review_notes' => 'Next milestone: scaffold migrations + capture UI, then trial with the Tivly role.',
                'links' => [
                    'ingestion_plan' => 'docs/opportunity-ingestion-plan.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => now()->subMinutes(1),
                'phase' => 'Build',
                'category' => 'pipeline',
                'project' => 'site-relaunch',
                'title' => 'Capture UI + CLI command wired to ingestion queue',
                'description' => 'Added opportunity capture form, CLI entry point, staging tables, and a placeholder queue job ahead of the full ingestion pipeline.',
                'agent_contribution' => 'Agents scaffolded the job + validation flow and ensured new records log ingestion status.',
                'review_notes' => 'Implement the real fetch/parse pipeline next and flip the job out of placeholder mode.',
                'links' => [
                    'plan' => 'docs/opportunity-ingestion-plan.md',
                ],
                'public_visibility' => true,
            ],
            [
                'logged_at' => now(),
                'phase' => 'Polish',
                'category' => 'pipeline',
                'project' => 'site-relaunch',
                'title' => 'Ingest status badges and queue alerts in admin',
                'description' => 'Show ingest state per opportunity plus dashboard banners for queued/failed captures so the control room surfaces automation health.',
                'agent_contribution' => 'Agents implemented the status badge component and aggregate flash notices.',
                'review_notes' => 'Next iteration: wire Slack notifications on failures.',
                'links' => [
                    'plan' => 'docs/opportunity-ingestion-plan.md',
                ],
                'public_visibility' => true,
            ],
        ];

        foreach ($buildLogs as $buildLog) {
            BuildLog::create($buildLog);
        }

        Project::updateOrCreate(
            ['slug' => 'junkyard-watchdog'],
            [
                'title' => 'Junkyard Watchdog',
                'subtitle' => 'Shipping the salvage yard companion app from ingest hardening to App Store review.',
                'summary' => 'A research-to-review workflow that flags salvage yard listings for parts hunters.',
                'status_label' => 'Submitted to App Store review (September 2025)',
                'how_it_works' => 'Agents scan new listings, flag matches, and draft notifications before human review.',
                'contribution' => 'Product direction, SwiftUI app architecture, CoreData sync, agent guardrails, release QA.',
                'cta_label' => 'Open journal',
                'cta_url' => '/build/junkyard-watchdog',
                'is_featured' => true,
            ]
        );

        Project::updateOrCreate(
            ['slug' => 'site-relaunch'],
            [
                'title' => 'Revert Creations Relaunch',
                'subtitle' => 'Turning this site into a transparent build journal and opportunity tracker.',
                'summary' => 'Building a public control room that tracks agents, human review, and live opportunities.',
                'status_label' => 'In active development',
                'how_it_works' => 'Laravel backend + build journals expose the work while agents assist with sourcing and automation.',
                'contribution' => 'Design, copy, data models, pipeline automation, and ongoing oversight.',
                'cta_label' => 'Read the relaunch PRD',
                'cta_url' => '/docs/ai-product-studio-prd',
                'is_featured' => false,
            ]
        );

        SiteStatus::updateOrCreate(
            ['id' => 1],
            [
                'availability' => 'Open to freelance and full-time conversations',
                'current_focus' => 'Junkyard Watchdog (iOS watchdog alerts)',
                'next_in_queue' => 'Personal site relaunch (this project)',
            ]
        );
    }
}
