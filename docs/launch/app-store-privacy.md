# App Store Privacy Questionnaire

Use this sheet to populate the "App Privacy" section in App Store Connect. Answers reflect the 1.0.0 build that ships without third-party analytics or advertising SDKs.

## Data Collection Summary
- **Tracking**: No data is used for tracking or ad-targeting. No third-party tracking SDKs are included.
- **Sharing**: Data is not shared with third parties outside of core processors (Stripe for billing when a user upgrades via the web; not triggered from the iOS app).
- **Retention**: Data persists until the user deletes their account or requests removal per the DSR playbook.

| Apple Category | Data Type | What We Collect | Linked to User? | Used for Tracking? | Purpose | Optional? |
| --- | --- | --- | --- | --- | --- | --- |
| Contact Info | Email Address | Account login & alerts | Yes | No | App functionality (auth, digests, support) | Required to create account |
| Contact Info | Name (Username) | Chosen handle shown in-watchlist/garage | Yes | No | App functionality & personalization | Required |
| Location | Precise Location | Device GPS when user enables device-based radar | Yes | No | App functionality (radar proximity, radius defaults) | Optional (can disable in Account) |
| User Content | Other User Content | Watchlists, garage notes, part requests, observations | Yes | No | App functionality & personalization | Required for core flows |
| User Content | Photos or Videos | Vehicle/part photos uploaded via camera/library | Yes | No | App functionality (document observations, projects) | Optional |
| Identifiers | Device ID | Expo/Push token + internal device ID for notifications | Yes | No | App functionality (push alerts) | Optional (only when push enabled) |
| Diagnostics | Crash Data & Performance Data | Client logs (error stacks, slow API metadata) | Yes | No | App functionality & diagnostics | Automatic |

## Platform Notes
- **Location**: Prompt appears on first launch; users can toggle device GPS usage under Account → Location. If they opt out, we fall back to manual ZIP/radius.
- **Push Tokens**: We only register a device after the user explicitly enables notifications. Removing the toggle deletes the token.
- **Photos**: Stored via Cloudinary on the server; deleting a note/request removes the attachment.
- **Diagnostics**: `reportClientLog` posts to our backend with stack traces, HTTP route, and user agent so Ops can triage issues. Logs inherit the auth token so they are linked to the user account.

## App Store Connect Inputs
1. In **Data Collection**, mark all items above as "Collected" with the purposes listed. Set "Linked to the user" to Yes, "Tracking" to No for each entry.
2. Under **Data Not Collected**, leave every other category toggled off (Financial Info, Health, etc.).
3. In **Privacy Policy**, point to `https://junkyardwatchdog.com/privacy` (already set in version metadata).
4. Save changes and ensure the blue banner disappears before attempting submission.

Maintain this doc as flows evolve (e.g., if we add Mixpanel or Stripe in-app purchases we’ll need to expand the matrix).
