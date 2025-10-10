<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class UpdateSkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            [
                'name' => 'README.md',
                'experience' => 100,
                'excerpt' => <<<'HTML'
My first real taste of the web was a middle-school HTML class in 2000. I ignored the homework, hand-coded dropdown menus, and fell in love with bending markup to my will. Ever since, I’ve been building products that span ticketing platforms, mobile scanners, and now my own studio. This matrix is the living README of that path—equal parts battle-tested muscle memory and the tools I’m still sharpening.
HTML,
            ],
            [
                'name' => 'hire me',
                'experience' => 101,
                'excerpt' => <<<'HTML'
Need someone who can slide between infrastructure, UI polish, product strategy, and shipping the thing? That’s my happy place. Tell me what you’re building and I’ll bring years of high-stakes ticketing, marketplace, and startup experience to the table.
HTML,
            ],
            [
                'name' => 'reset();',
                'experience' => 102,
                'excerpt' => 'refreshing!',
            ],
            [
                'name' => 'CSS',
                'experience' => 94,
                'excerpt' => <<<'HTML'
Ticketing dashboards, marketing landing pages, and the new Revert Creations projects hub all lean on handcrafted CSS. Tailwind gives me speed, but I’m just as comfortable writing maintainable styles from scratch when component libraries run out of steam.
HTML,
            ],
            [
                'name' => 'HTML',
                'experience' => 98,
                'excerpt' => <<<'HTML'
Semantics, accessibility, and resilience are instinct after years of shipping high-traffic flows. Whether it’s a Cordova webview, a Nuxt SSR page, or classic PHP templates, clean HTML is still the glue that keeps the experience fast.
HTML,
            ],
            [
                'name' => 'Javascript',
                'experience' => 94,
                'excerpt' => <<<'HTML'
Riot.js still powers HoldMyTicket’s storefronts, Vue drives MotorsportReg’s Nuxt front end, and React (with Expo) runs Junkyard Watchdog. Sprinkle in plenty of vanilla JS, service workers, and admin widgets—I live in this ecosystem daily.
HTML,
            ],
            [
                'name' => 'PHP',
                'experience' => 97,
                'excerpt' => <<<'HTML'
From wrangling a heavily customized CodeIgniter 2 monolith to building fresh Laravel services, PHP remains my daily driver. I’ve modernized legacy ticketing APIs, designed new project admin tools, and keep the Revert Creations portfolio humming on Laravel 10.
HTML,
            ],
            [
                'name' => 'Linux',
                'experience' => 82,
                'excerpt' => <<<'HTML'
Every server I manage—DigitalOcean droplets, AWS autoscaling groups, Heroku dynos under the hood—runs Linux. I’m comfortable wiring systemd services, debugging runaway processes, and scripting the boring parts so releases stay calm.
HTML,
            ],
            [
                'name' => 'Laravel',
                'experience' => 90,
                'excerpt' => <<<'HTML'
Laravel backs the new Revert Creations projects, powers Junkyard Watchdog’s content ingestion, and handles internal tooling. I lean into feature tests, queues, policies, and artisan workflows to keep developer ergonomics and ops dialed in.
HTML,
            ],
            [
                'name' => 'CodeIgniter',
                'experience' => 89,
                'excerpt' => <<<'HTML'
I spent five years extending a massive CodeIgniter 2 backend—untangling controllers, adding safer patterns, and keeping millions of tickets flowing. It taught me how to evolve legacy PHP without burning it down.
HTML,
            ],
            [
                'name' => 'Docker',
                'experience' => 88,
                'excerpt' => <<<'HTML'
I helped containerize sprawling PHP stacks, moved teams from Vagrant, and keep Laravel Sail images humming. Docker is my baseline for consistent local setups, staging parity, and scripted deploys.
HTML,
            ],
            [
                'name' => 'Vagrant',
                'experience' => 82,
                'excerpt' => <<<'HTML'
Before Docker took over, every HoldMyTicket dev machine I touched ran on Vagrant + VirtualBox. Years of crafting reproducible boxes taught me to automate environments and keep teams in sync.
HTML,
            ],
            [
                'name' => 'Kubernetes',
                'experience' => 85,
                'excerpt' => <<<'HTML'
K8s came into play as we scaled ticketing services and background workers. I’ve orchestrated PHP and Node workloads, tuned manifests, and wired health checks so clusters stay steady during high-demand onsales.
HTML,
            ],
            [
                'name' => 'Digital Ocean',
                'experience' => 95,
                'excerpt' => <<<'HTML'
Almost every personal and client build lives on DigitalOcean—droplets, load balancers, managed DBs, Spaces, and cron automation. I’ve hardened boxes, scripted backups, and tuned bursts of traffic without breaking a sweat.
HTML,
            ],
            [
                'name' => 'Networking',
                'experience' => 80,
                'excerpt' => <<<'HTML'
From AWS ALBs and NGINX proxy chains to ad-hoc Wi-Fi bridges powering RFID scanners in the Costa Rican jungle, I’ve kept data flowing in hostile environments. Uptime and latency matter when money is on the line.
HTML,
            ],
            [
                'name' => 'Redis',
                'experience' => 90,
                'excerpt' => <<<'HTML'
Redis handles caching, queues, rate limiting, and real-time dashboards across every stack I own. I’ve designed key strategies for ticket search, inventory alerts, and the new project showcase metadata.
HTML,
            ],
            [
                'name' => 'SQL',
                'experience' => 88,
                'excerpt' => <<<'HTML'
MySQL has powered every production system I’ve shipped. I design normalized schemas, squeeze slow queries, and still enjoy sketching ERDs before writing the first migration.
HTML,
            ],
            [
                'name' => 'tailwindcss',
                'experience' => 75,
                'excerpt' => <<<'HTML'
Tailwind powers the latest Revert Creations UI and Junkyard Watchdog marketing. I love the velocity and small bundles, but I still extract design primitives to keep things maintainable.
HTML,
            ],
            [
                'name' => 'Vim',
                'experience' => 80,
                'excerpt' => <<<'HTML'
My dotfiles are versioned, TMUX panes choreographed, and most of my day happens in Vim. It keeps me fast whether I’m editing Riot tags or Laravel controllers.
HTML,
            ],
            [
                'name' => 'Bash',
                'experience' => 78,
                'excerpt' => <<<'HTML'
Deploy scripts, log spelunking, and quick data migrations happen in Bash. I glue CI pipelines together and script the repetitive chores so the team can stay focused on product work.
HTML,
            ],
            [
                'name' => 'Heroku',
                'experience' => 70,
                'excerpt' => <<<'HTML'
HoldMyTicket’s hybrid web + mobile stack ran through Heroku: multiple apps, worker dynos, staging pipelines, zero-downtime deploys. It’s still my shortcut for prototypes that need a hardened runtime quickly.
HTML,
            ],
            [
                'name' => 'NodeJS',
                'experience' => 55,
                'excerpt' => <<<'HTML'
Node powers build tooling, realtime features, and lightweight services when PHP isn’t the right fit. I keep the ecosystem in rotation through monorepo scripts, Expo tooling, and small API helpers.
HTML,
            ],
            [
                'name' => 'GoLang',
                'experience' => 35,
                'excerpt' => <<<'HTML'
Go is the systems language I tinker with when I want to think differently. I’ve built CLI experiments and web-server prototypes—enough to appreciate the ergonomics and keep coming back during research spikes.
HTML,
            ],
            [
                'name' => 'Python',
                'experience' => 35,
                'excerpt' => <<<'HTML'
Python shows up for data wrangling, quick scripting, and collaborating with analytics teams. It’s not my daily driver, but readability lets me drop in, contribute, and move fast.
HTML,
            ],
            [
                'name' => 'riot.js.org',
                'experience' => 92,
                'excerpt' => <<<'HTML'
Riot.js powers HoldMyTicket’s storefronts and the Swarm mobile app. I’ve built ticket purchase flows, scanning dashboards, and offline-first Cordova experiences with it since Riot v2.
HTML,
            ],
            [
                'name' => 'NGINX',
                'experience' => 90,
                'excerpt' => <<<'HTML'
NGINX fronts nearly every environment I manage—acting as load balancer, cache, and SSL terminator. Ticket drops demand fast responses, and this is the layer I trust to keep things smooth.
HTML,
            ],
            [
                'name' => 'Apache',
                'experience' => 78,
                'excerpt' => <<<'HTML'
Plenty of legacy ColdFusion and PHP apps still run on Apache. I’ve modernized configs, introduced sane rewrite rules, and kept the old workhorses healthy while we architected the future.
HTML,
            ],
            [
                'name' => 'Git',
                'experience' => 97,
                'excerpt' => <<<'HTML'
Feature branches, stacked PRs, and hotfixes at 2 AM—I’ve done it all. I coach teams on clean history, wire hooks into deploy pipelines, and never go a day without living in Git.
HTML,
            ],
            [
                'name' => 'GitHub',
                'experience' => 75,
                'excerpt' => <<<'HTML'
Actions, protected branches, CODEOWNERS, project boards—I live in GitHub all day. The /revertcreations org and my open repos tell the story better than any certification ever could.
HTML,
            ],
            [
                'name' => 'Vue.js',
                'experience' => 78,
                'excerpt' => <<<'HTML'
MotorsportReg’s Nuxt stack pulled me deep into Vue. I rebuilt the login and registration flows, paired with their design team, and shipped SSR-powered marketing pages with A/B testing wired in.
HTML,
            ],
            [
                'name' => 'React',
                'experience' => 72,
                'excerpt' => <<<'HTML'
Junkyard Watchdog’s React + Expo client is where I sweat mobile UX details—inventory watchers, garage management, push notifications, all talking to the Laravel backend in real time.
HTML,
            ],
            [
                'name' => 'Bootstrap',
                'experience' => 58,
                'excerpt' => <<<'HTML'
Legacy admin panels at HoldMyTicket and MotorsportReg still run on Bootstrap. I’ve extended their component kits, wrangled responsive tables, and delivered many internal tools without rewriting the world.
HTML,
            ],
            [
                'name' => 'jQuery',
                'experience' => 82,
                'excerpt' => <<<'HTML'
jQuery still powers mission-critical admin flows across the ticketing platform. I’ve refactored spaghetti widgets, added modern build steps, and kept interfaces stable while we incrementally move to component frameworks.
HTML,
            ],
            [
                'name' => 'npm',
                'experience' => 90,
                'excerpt' => <<<'HTML'
npm scripts run everything from Riot builds to Nuxt deployments. I manage monorepos, pin dependencies, and keep build pipelines healthy whether we’re targeting Cordova, Expo, or plain web.
HTML,
            ],
            [
                'name' => 'webpack',
                'experience' => 70,
                'excerpt' => <<<'HTML'
I’ve maintained webpack configs for Riot, Vue, and classic JS bundles—splitting vendor code, optimizing Cordova targets, and gradually migrating projects toward modern bundlers when it makes sense.
HTML,
            ],
            [
                'name' => 'Cloudinary',
                'experience' => 92,
                'excerpt' => <<<'HTML'
Cloudinary runs through everything: HoldMyTicket’s asset pipeline, Junkyard Watchdog galleries, and the Revert Creations portfolio. I automate uploads, chain transformations, and build admin workflows that make media painless.
HTML,
            ],
            [
                'name' => 'Photoshop',
                'experience' => 90,
                'excerpt' => <<<'HTML'
Years of photography and product design keep Photoshop in daily rotation—event posters, marketing campaigns, and hero imagery all flow through my PSDs before they ship.
HTML,
            ],
            [
                'name' => 'Illustrator',
                'experience' => 92,
                'excerpt' => <<<'HTML'
Every vector asset I ship starts in Illustrator—from the Junkyard Watchdog logo to icon systems and even my resume. Precision control over anchors and paths lets me keep assets crisp wherever they land.
HTML,
            ],
            [
                'name' => 'Figma',
                'experience' => 60,
                'excerpt' => <<<'HTML'
Most teams I collaborate with live in Figma. I review specs, tweak components, and hand back implementation notes—even if I still drop into code or Illustrator when the design needs to get real.
HTML,
            ],
        ];

        foreach ($skills as $data) {
            Skill::where('name', $data['name'])->update([
                'experience' => $data['experience'],
                'excerpt' => $data['excerpt'],
            ]);
        }
    }
}
