Monetization Strategy – Junkyard Watchdog
=========================================

Goals
-----
- Cover ongoing infrastructure (DO droplet, CDN, email, push) while funding new yard ingest work.
- Keep a generous free tier for hobbyists so growth and data crowdsourcing continue.
- Offer obvious upgrade moments tied to high-value workflows (alerts and Garage automation).

Target Persona Segments
-----------------------
1. **Casual Enthusiast (Free)** – 1–2 watchlists, occasional yard trips, values alerts but cost sensitive.
2. **Active Builder (Pro)** – Multiple projects, wants higher alert volume, historical data, email digests.
3. **Shop / Club (Pro+)** – Small businesses or communities monitoring fleets, needs shared access and exports.

Pricing Model
-------------
| Tier  | Price (USD) | Key Limits | Core Benefits |
|-------|-------------|------------|----------------|
| Free  | $0          | Up to 3 watchlists, weekly digests | Real-time push + weekly digest, Garage management, basic admin alerts |
| Pro   | $7/mo or $70/yr | Up to 25 watchlists, daily or weekly digests, CSV exports | Priority ingest window, CSV export per watchlist, deeper engagement campaigns |
| Pro+  | $15/mo or $150/yr | Up to 75 watchlists, daily or weekly digests, CSV exports | Teams and clubs, larger watchlist pools, roadmap: shared Garage & integrations |

Billing Stack
-------------
- **Stripe** for subscriptions (Billing Portal + Customer Portal). Expo web and native apps can embed Stripe Checkout via hosted pages.
- Laravel Cashier or direct Stripe SDK for recurring payments and webhook handling.
- Entitlement storage in `users` table (`plan`, `plan_ends_at`, `seats_used`) with feature gates in API.

Upgrade Surfaces
----------------
- In-app modals when a free user hits watchlist or alert limits.
- Digest footer call-to-action (“Upgrade for daily digests and more alerts”).
- Garage → Link Watchlist dialog banner when multiple projects detected.
- Admin/operator flows: highlight data freshness & API access for Pro+ prospects.

Rollout Phases
--------------
1. **Telemetry & Tracking (Week 0)**
   - Instrument current watchlist counts, alert send volume per user.
   - Add basic funnel events (create watchlist, turn on digest).
2. **Foundations (Week 1)**
   - Implement plan columns and middleware for feature flags.
   - Integrate Stripe checkout + customer portal in Account screen.
   - Seed Free vs Pro feature toggles in config.
3. **MVP Marketing (Week 2)**
   - In-app upsell copy & email sequences (existing lifecycle job can branch on plan).
   - Update website landing copy with pricing table.
4. **Pro+ / Teams (Stretch)**
   - Add shared Garage access, exports, and API keys.
   - Evaluate B2B outreach (shops, clubs).

KPIs & Evaluation
-----------------
- Conversion rate Free → Paid (target 3% first 90 days).
- Monthly recurring revenue (MRR) vs infrastructure spend (aim for 3× coverage).
- Churn and downgrade analytics (track reasons via exit survey in account cancel flow).
- Alert engagement (open rate, push taps) segmented by tier.

Dependencies & Risks
--------------------
- Need reliable email delivery (already planned via Mailgun) and push stability.
- Stripe requires PCI-compliant handling → use hosted Checkout/Portal to minimize scope.
- App Store rules: digital goods may require in-app purchases on iOS; evaluate hybrid (web checkout + restore for mobile) or defer native builds until web revenue proves model.
- Support load: ensure cancellation/refund flows are self-serve to reduce manual ops.

Next Actions
------------
1. Add telemetry to capture active watchlists, alerts sent, digests per user (for tier enforcement).
2. Prototype plan gating in API and hide Pro features until purchase.
3. Draft marketing copy & FAQ updates for pricing page.
4. Schedule beta with existing power users to validate price points.
