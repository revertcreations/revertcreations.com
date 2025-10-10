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
        $updates = [
            [
                'name' => 'README.md',
                'experience' => 100,
                'excerpt' => "Over the past decade I’ve shipped ticketing platforms, mobile scanners, and product experiments that touch millions of fans. This skill matrix is the living README for that journey—equal parts battle-tested muscle memory and the tools I’m sharpening right now."
            ],
            [
                'name' => 'hire me',
                'experience' => 101,
                'excerpt' => "If you need someone who can slide between product strategy, infrastructure, and the tiniest UI micro-interaction—let’s talk. I love teaming up with folks who want to ship ambitious ideas."
            ],
            [
                'name' => 'reset();',
                'experience' => 102,
                'excerpt' => "A friendly reminder that even the wildest production outage can be solved with a calm breath, a tail of the logs, and a fresh deploy."
            ],
            [
                'name' => 'CSS',
                'experience' => 92,
                'excerpt' => "Styling is where I get to obsess over the details—ticketing dashboards, marketing landing pages, and the new Revert Creations projects hub all lean on custom CSS systems. Tailwind is in the mix, but I’m just as confident hand-rolling layouts when the component library runs out of answers."
            ],
            [
                'name' => 'HTML',
                'experience' => 98,
                'excerpt' => "Years of building highly trafficked ticketing flows means semantic markup, progressive enhancement, and accessibility are instinct. From Cordova webviews to Nuxt front ends, HTML is still the glue that keeps the experience fast and resilient."
            ],
            [
                'name' => 'Javascript',
                'experience' => 92,
                'excerpt' => "JavaScript is home base: Riot.js powers HoldMyTicket’s customer portals, Vue drives MotorsportReg’s modern login experience, and React (with Expo) powers Junkyard Watchdog. I keep a tight grip on vanilla JS, but I’m equally comfortable in modern tooling when the product calls for it."
            ],
            [
                'name' => 'PHP',
                'experience' => 96,
                'excerpt' => "From tuning legacy CodeIgniter 2 APIs to building fresh Laravel features, PHP is my daily driver. I’ve modernized old ticketing endpoints, designed new admin experiences, and now run the entire Revert Creations portfolio off a Laravel backend."
            ],
            [
                'name' => 'Linux',
                'experience' => 80,
                'excerpt' => "Every server I’ve managed runs Linux—DigitalOcean droplets, AWS autoscaling groups, Heroku dynos under the hood. I’m equally at home wiring up systemd services as I am debugging a runaway process on a production VM."
            ],
            [
                'name' => 'Laravel',
                'experience' => 82,
                'excerpt' => "Revert Creations, Junkyard Watchdog’s content pipeline, and the new projects admin all lean on Laravel. I lean into feature tests, queues, policies, and modern artisan tooling to keep the developer ergonomics (and ops) smooth."
            ],
            [
                'name' => 'CodeIgniter',
                'experience' => 88,
                'excerpt' => "Five years of extending a massive CodeIgniter ticketing backend burned the framework into my muscle memory. I untangled legacy controllers, introduced safer patterns, and kept millions of tickets flowing without downtime."
            ],
            [
                'name' => 'Docker',
                'experience' => 85,
                'excerpt' => "I containerized sprawling PHP stacks, helped the team move local dev from Vagrant to Docker, and keep Laravel Sail images humming. It’s my default for consistent local setups and staging parity."
            ],
            [
                'name' => 'Vagrant',
                'experience' => 80,
                'excerpt' => "Before Docker took over, Vagrant + VirtualBox powered every HoldMyTicket dev machine I touched. Years of crafting reproducible boxes taught me the value of automation and keeping environments in lockstep."
            ],
            [
                'name' => 'Kubernetes',
                'experience' => 84,
                'excerpt' => "K8s came into play as we explored scaling ticketing services and background workers. I’ve orchestrated PHP and Node workloads, tuned manifests, and wired in health checks to keep clusters steady under load."
            ],
            [
                'name' => 'Digital Ocean',
                'experience' => 95,
                'excerpt' => "Most of my personal and client projects live on DigitalOcean—droplets, load balancers, managed databases, Spaces, you name it. I’ve hardened boxes, automated backups, and tuned traffic bursts without breaking a sweat."
            ],
            [
                'name' => 'Networking',
                'experience' => 78,
                'excerpt' => "From configuring AWS ALBs to tuning NGINX/Apache proxy chains, I keep data flowing safely. SSL management, DNS failover, queueing providers—ticketing platforms demand rock-solid uptime and I treat networking as part of the craft."
            ],
            [
                'name' => 'Redis',
                'experience' => 88,
                'excerpt' => "Caching event queries, running queues, storing session data—Redis is in almost every stack I ship. I’ve designed key strategies for ticketing search, real-time dashboards, and now the Revert Creations project index."
            ],
            [
                'name' => 'SQL',
                'experience' => 86,
                'excerpt' => "MySQL has powered every production system I’ve owned. I design normalized schemas, squeeze slow queries, and still enjoy sketching ERDs before writing a line of code."
            ],
            [
                'name' => 'tailwindcss',
                'experience' => 68,
                'excerpt' => "The new Revert Creations experience and Junkyard Watchdog marketing pages are Tailwind-first. I love the velocity it unlocks, but I don’t let utility classes stop me from extracting thoughtful design primitives."
            ],
            [
                'name' => 'Vim',
                'experience' => 80,
                'excerpt' => "My dotfiles are versioned, my TMUX panes are choreographed, and most of my day happens inside Vim. It keeps me lightning fast whether I’m editing Riot tags or Laravel controllers."
            ],
            [
                'name' => 'Bash',
                'experience' => 78,
                'excerpt' => "Deployment scripts, log spelunking, and quick data migrations happen in Bash. I lean on it to glue CI pipelines together and automate the repetitive stuff so the team can focus on features."
            ],
            [
                'name' => 'Heroku',
                'experience' => 70,
                'excerpt' => "HoldMyTicket’s hybrid web + mobile stack ran through Heroku: multiple apps, worker dynos, staging pipelines, and zero-downtime deploys. It’s still my shortcut for prototypes that need a hardened runtime quickly."
            ],
            [
                'name' => 'NodeJS',
                'experience' => 50,
                'excerpt' => "I reach for Node when I’m scripting build tooling, pushing realtime features, or wiring up lightweight APIs. Most of my production time leans on PHP, but Node stays in the tool belt for the right job."
            ],
            [
                'name' => 'GoLang',
                'experience' => 30,
                'excerpt' => "Go is the systems language I tinker with when I want to think differently. I’ve built CLI experiments and web server prototypes—enough to appreciate the ergonomics, and I keep looping back for more reps."
            ],
            [
                'name' => 'Python',
                'experience' => 35,
                'excerpt' => "Python shows up for data wrangling, quick scripting, and collaborating with analytics teams. It’s not my primary language, but the readability lets me drop in and contribute when needed."
            ],
            [
                'name' => 'riot.js.org',
                'experience' => 90,
                'excerpt' => "Riot.js powers the front door for HoldMyTicket and the Swarm mobile app. I’ve built ticket purchase flows, scanning dashboards, and offline-first Cordova experiences with it since Riot v2."
            ],
            [
                'name' => 'NGINX',
                'experience' => 90,
                'excerpt' => "NGINX sits in front of nearly every environment I manage—acting as load balancer, cache, and SSL terminator. I’ve tuned it for high-traffic on ticket releases and kept static assets screaming fast."
            ],
            [
                'name' => 'APACHE',
                'experience' => 78,
                'excerpt' => "Plenty of legacy ColdFusion and PHP apps I inherited still run on Apache. I’ve modernized configs, introduced sane rewrite rules, and kept old workhorses healthy while we architected the future."
            ],
            [
                'name' => 'Git',
                'experience' => 97,
                'excerpt' => "Feature branches, long-lived refactors, hotfixes at 2AM—I’ve done it all. I coach teams on clean history, stack PRs for faster reviews, and wire Git hooks into deploy pipelines so every change is traceable."
            ],
            [
                'name' => 'GitHub',
                'experience' => 70,
                'excerpt' => "Actions, protected branches, CODEOWNERS, project boards—I live in GitHub all day. The open repos under /revertcreations and our private orgs tell the story better than I can."
            ],
            [
                'name' => 'Vue',
                'experience' => 68,
                'excerpt' => "MotorsportReg’s Nuxt stack pulled me deep into Vue. I rebuilt the login and registration flows, paired with their design system team, and shipped SSR-powered marketing pages with A/B testing baked in."
            ],
            [
                'name' => 'React',
                'experience' => 62,
                'excerpt' => "Junkyard Watchdog’s React + Expo client is where I sweat the mobile UX details. I’ve built inventory watchers, watchlist management, and push notification flows that mirror the production backend."
            ],
            [
                'name' => 'Bootstrap',
                'experience' => 55,
                'excerpt' => "Legacy admin panels at HoldMyTicket and MotorsportReg still run on Bootstrap. I’ve extended their component kits, wrangled responsive tables, and shipped many internal tools without overhauling the entire stack."
            ],
            [
                'name' => 'JQuery',
                'experience' => 80,
                'excerpt' => "jQuery still powers mission-critical admin tools across the ticketing platform. I’ve refactored spaghetti widgets, introduced modern build steps, and kept the UI stable while we gradually move to component frameworks."
            ],
            [
                'name' => 'npm',
                'experience' => 89,
                'excerpt' => "npm scripts run everything from Riot builds to Nuxt deployments. I manage monorepos, pin dependencies, and keep build pipelines healthy whether we’re targeting Cordova, Expo, or plain web."
            ],
            [
                'name' => 'webpack',
                'experience' => 63,
                'excerpt' => "I’ve maintained webpack configs for Riot, Vue, and traditional JS bundles—splitting vendor code, optimizing for Cordova, and gradually migrating projects toward modern bundlers when the economics make sense."
            ],
            [
                'name' => 'Cloudinary',
                'experience' => 90,
                'excerpt' => "Cloudinary runs through everything: HoldMyTicket’s asset pipeline, Junkyard Watchdog’s galleries, and now Revert Creations. I automate uploads, chain transformations, and build admin workflows that make media handling painless."
            ],
            [
                'name' => 'Photoshop',
                'experience' => 95,
                'excerpt' => "My photography background keeps Photoshop in daily rotation—event posters, marketing campaigns, and product hero shots all flow through my PSDs before they ship."
            ],
            [
                'name' => 'Illustrator',
                'experience' => 92,
                'excerpt' => "Every vector asset I ship starts in Illustrator—from the Junkyard Watchdog logo to icon systems for admin tools. It’s the fastest way for me to get crisp SVGs into the pipeline."
            ],
            [
                'name' => 'Figma',
                'experience' => 40,
                'excerpt' => "Most teams I collaborate with live in Figma. I review product specs, tweak components, and hand back implementation notes—even if I still jump into Illustrator or code when the design gets real."
            ],
        ];

        foreach ($updates as $data) {
            Skill::where('name', $data['name'])->update([
                'experience' => $data['experience'],
                'excerpt' => $data['excerpt'],
            ]);
        }
    }
}
