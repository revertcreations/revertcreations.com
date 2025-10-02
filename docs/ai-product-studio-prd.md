# AI Product Studio PRD

## Document Info
- Owner: Trever Hillis
- Contributors: Codex AI Agent
- Last Updated: 2025-10-01
- Status: Draft v1

## 1. Vision & Strategy
Create a transparent, plain-spoken home base that showcases Trever’s ability to orchestrate autonomous agents across product strategy, UX, architecture, and engineering. The site should function as both a living portfolio and an inbound funnel for leaders exploring AI-assisted delivery.

### 1.3 Core Outcomes (Plain Language)
- **Show the work:** spotlight active builds like Junkyard Watchdog (and this site) with clear problem → plan → build → result storytelling that anyone can follow quickly.
- **Explain how you operate:** describe the project cadence, the moments agents help, where Trever steps in, and how quality gets kept high—no jargon required.
- **Make it easy to engage:** keep calls-to-action simple (chat, hire, follow progress) and back them with social proof (testimonials, metrics, community highlights).
- **Surface open opportunities:** publish the roles Trever is targeting, including how they were discovered and how outreach gets automated end-to-end.

### 1.1 Mission Statement
Demonstrate how an experienced AI product engineer orchestrates multi-agent builds end-to-end, earning paid engagements or roles such as AI Product Engineer, AI Enablement Lead, or Agent Orchestrator.

### 1.2 Success Criteria
- 2+ qualified intro calls per week from companies evaluating AI-led product delivery.
- ≥50% of case-study visitors click a CTA (subscribe, book intro, download toolkit).
- At least one paid pilot or job offer within 60 days of relaunch.

## 2. Background & Context
Trever brings 14 years of full-stack engineering across startups and enterprise environments but is pivoting to product/AI orchestration rather than manual coding. Current site blends several legacy experiments (photography, puzzles, traditional dev portfolio) and does not communicate the new value proposition. This PRD reframes the site around AI-led product builds and job search transparency while underlining the technical rigor he applies when guiding agent teams.

## 3. Target Personas
1. **Product/Engineering Leaders** at AI-curious startups wanting rapid prototypes without building a full in-house team.
2. **Recruiters** sourcing hybrid product/technical roles centered on AI agents.
3. **Founders/Agencies** needing a part-time orchestrator to spin up agent-driven delivery workflows.

## 4. Goals & Non-Goals
| Category | Goals | Non-Goals |
| --- | --- | --- |
| Business | Secure interviews and pilot engagements aligned with AI product orchestration; grow inbound demand. | Compete as a traditional freelance developer or photographer. |
| User | Help visitors quickly grasp Trever’s process, see live proof of execution, and start a conversation. | Offer anonymous job board-style listings or finished SaaS without context. |
| Product | Ship reusable tooling (templates, trackers, dashboards) that highlight orchestration skills. | Maintain legacy mini-apps unless they reinforce the AI studio narrative. |

## 5. Core Experience Overview
1. **Mission Control Dashboard** (Home)
   - Hero with explicit positioning (“AI Product Studio: Senior engineer-led agent teams”).
   - Current focus/availability, high-level metrics, and real-time activity feed of agent work.
   - Quick CTAs: “Run a Pilot”, “Book Intro”, “Subscribe to Build Dispatches”.
2. **AI Build Journals** (Case Studies)
   - Structured storytelling: problem, strategy, agent prompt snippets, design artifacts, architecture, reviewed code diffs, outcomes.
   - Embedded media (Loom/Runway, Figma links, screenshots).
   - Highlights of Trever’s interventions: bug catches, design pivots, data schema decisions.
3. **AI Ops Toolkit**
   - Downloadable templates (agent briefs, acceptance criteria, QA checklists, prompt libraries).
   - Narrative explaining workflow: briefing, guardrails, review cadence, escalation.
4. **Opportunity Pipeline**
   - Transparent tracker summarizing active applications/opportunities (with redaction controls).
   - Public view lists company type, role, stage, Trever’s decision notes.
   - Private admin interface for full CRUD, reminders, file attachments.
5. **Working Style & Preferences**
   - Defines ideal responsibilities, engagement models, collaboration tools, compensation expectations.
   - Sets expectations for AI-first delivery and Trever’s oversight role.
6. **CTA & Intake Flow**
   - Form capturing role/project context, budget, timeline, success metrics.
   - Auto-response email summarizing next steps and linking to toolkit/case studies.
7. **Build-in-Public Showcase**
   - Treat the site revamp as a live case study with its own build diary, sprint board snapshots, and release notes.
   - Prominently display deployment cadence, latest feature shipped, and Trever’s review highlights to prove fast iteration with quality control.
   - Offer subscription hooks (email/RSS/social) so followers receive “Control Room Dispatch” updates as work ships.

## 6. Feature Breakdown & Requirements

### 6.1 MVP Scope
1. **Content & Messaging Refresh**
   - Rewrite homepage and nav around AI Product Studio positioning.
   - Produce two detailed AI build journals (current mobile app + historical project).
   - Convert existing blog posts into “Build Dispatches”.
2. **Opportunity Tracker v1**
   - Data model: `opportunities` table with fields (slug, company_name, industry, role_title, status, stage, priority, public_visibility, summary, next_action_at, notes, links).
   - Admin UI for CRUD (leveraging Laravel resource patterns).
   - Public component showing redacted list (hide company name when `public_visibility = false`).
3. **Activity Feed**
   - `activities` table with fields (id, timestamp, category, headline, body, link, visibility).
   - Surface recent entries on home page; allow tagging (#design, #AI, #QA).
4. **Contact & CTA Flow**
   - New intake form storing submissions, sending templated email response, optionally pushing to CRM/spreadsheet.
   - Option to include Calendly link after submission.
5. **Design Pass**
   - Apply consistent visual identity aligned with “studio/control room” motif.
   - Ensure responsive layout, fast load, clear CTAs.
6. **Build Log & Public Sprint View**
   - Data model: `build_logs` table capturing (timestamp, category, title, description, agent_contribution, review_notes, links, visibility).
   - Public timeline component showing latest deployments, tagged by phase (Discovery, Build, QA, Launch).
   - Optional webhooks/manual cron to post highlights to social platforms or email digest list.

### 6.2 Iteration Scope
1. **Automation Hooks**
   - Manual CSV/Web import for job listings → convert into opportunities.
   - Generate draft outreach emails using stored preferences and job metadata.
2. **Agent Observatory Dashboard**
   - Real-time visualization of active agent tasks and Trever reviews (API or manual updates).
   - Code diff viewer highlighting Trever’s review comments.
3. **Subscription & Updates**
   - Email list with automated digests pulled from activity feed + case updates.
4. **Recruiter Workspace**
   - Gated view (password or magic link) containing resume, references, availability grid.
5. **Build Dispatch Automation**
   - Scheduled digest compiling recent build log entries, shipped features, and upcoming experiments for subscribers.

### 6.3 Future Bets
- Recruiter/partner chat bot answering FAQs using published content.
- Paid “AI Playbook” offering with premium templates.
- Client testimonials/case metrics hub.

## 7. MVP User Stories
- As a hiring manager, I want to understand Trever’s orchestration workflow within 2 minutes so I can decide if a pilot makes sense.
- As Trever, I want to log a new opportunity with stage + notes in under 30 seconds so I keep my job search organized.
- As a recruiter, I want to know Trever’s working style and availability without scheduling a call first.
- As an interested founder, I want to review recent builds with concrete evidence (prompts, designs, code) to assess quality.

## 8. UX & IA Notes
- Navigation: Home (Mission Control), Case Studies, Process Library, Opportunities, Contact.
- Use consistent components for cards, badges, timeline entries.
- Dark-mode friendly visuals with accent colors for activity categories.
- Ensure important content is accessible without heavy animations (progressive enhancement).

## 9. Technical Considerations
- Retain Laravel backend; leverage existing Blade layouts/components where useful.
- Introduce new migrations for opportunities and activities tables.
- Remove or archive legacy routes/views (photography, puzzles) into a “Labs Archive” if needed to avoid broken links.
- Document content models in README or `/docs` to aid AI agents and collaborators.
- Plan for seeding sample data to demo activity feed and pipeline.

## 10. Analytics & Metrics
- Track page views, scroll depth, CTA clicks via Google Analytics or lightweight alternative.
- Monitor conversion funnel: case study → CTA → intro booked.
- Opportunity pipeline stats (applications submitted, interviews scheduled, offers) captured in-app.
- Build log analytics: deployment frequency, average cycle time from log entry to ship, subscriber growth for Control Room Dispatch.

## 11. Launch Plan
1. Finalize copy & publish initial AI build journals.
2. Implement opportunity tracker and public pipeline view.
3. Refresh homepage with mission control layout + activity feed.
4. Add CTA flow and autoresponder.
5. QA, deploy, announce across chosen communities (X, Indie Hackers, AI builder circles).

## 12. Risks & Mitigations
- **Market clarity**: Emphasize 14 years of engineering experience and agent oversight to differentiate from prompt-only builders; pair messaging with recognizable titles (AI Product Engineer). Add glossary.
- **Privacy**: Some opportunities need masking → implement visibility flags and anonymize sensitive data.
- **Maintenance**: Document content update workflow; set reminders to log activities and opportunities weekly.
- **Transparency balance**: Ensure build-in-public updates omit proprietary client details and provide redaction guidelines before future engagements.

## 13. Open Questions
1. Which legacy features (photography gallery, puzzle game) should remain accessible as part of “Labs”?
   1. Answer: Archive under a separate “Labs Archive” page linked in the footer to avoid distracting from the main AI Product Studio narrative.
2. What tooling (Calendly, Notion, CRM) should contact form integrate with?  
   1. Answer: I'm not sure yet, let's see what the most common tools are being used by the target personas and go from there.
3. How much of the AI agent transcript/code review is safe to publish publicly?
   1. Answer: Focus on high-level strategy, key prompts, and reviewed code snippets that showcase Trever’s interventions without exposing sensitive data.
4. Do we need authentication for the internal tracker or is admin firewall sufficient?
   - Answer: Admin firewall should suffice for MVP.


## 14. Next Steps
1. Approve this PRD and adjust based on feedback.
2. Define content outline for first two AI build journals (including the site revamp log).
3. Draft data models & migrations for opportunities, activities, and build logs.
4. Plan copy/design sprint for homepage + navigation overhaul plus build-in-public surfaces (timeline, dispatch CTA).
5. Outline cadence and tooling for Control Room Dispatch (email provider, social scheduling).

## 15. Recent Progress (2025-10-01)
- Admin control room received a full Gruvbox refresh, reusable layout components, and zebra tables for all resource listings.
- Public opportunity pipeline now segments by workflow stage and respects visibility toggles so sourced leads stay private until vetted.
- Build journal plumbing is live: projects seed their latest logs, and we added quick toggles in admin to keep public snapshots current.
