# Advertising, analytics, and privacy activation

## Current behavior

Ads are disabled by default. `AdSlot.astro` emits nothing unless all public ad settings are structurally valid and enabled. Even with settings supplied, no ad requests are made: a real consent/eligibility adapter must call the gated `activateEligibleAds()` function. No fake ads or banner are displayed. The optional slot is located between the educational guide and related tools, away from calculator actions.

Analytics sends no network requests. When configured, `track()` dispatches a local `student-hub:analytics` CustomEvent with **only** an event name and calculator slug. A reviewed provider adapter can subscribe after the provider is configured and any applicable consent decision is satisfied. Never add marks, course names, attendance, deadlines, identifiers, or other form values to payloads.

## AdSense activation sequence

1. Complete real owner, contact, domain, and legal details. Review the site for usefulness and publisher policies. Submit it for AdSense review; approval is not guaranteed.
2. Obtain a genuine approved publisher ID and slot ID. Use `PUBLIC_ADSENSE_PUBLISHER_ID` and `PUBLIC_ADSENSE_SLOT_ID`, and keep `PUBLIC_ENABLE_ADS=false` during integration work.
3. Select and implement a real Google-certified CMP where required. Google's EEA, UK, and Switzerland requirements apply to personalized ads; other regions and ad modes can have their own consent and disclosure obligations. Do not assume non-personalized or limited ads remove every legal or platform requirement.
4. Connect the CMP's documented completed eligibility decision to `activateEligibleAds({adRequestsAllowed: true})` **only when the adapter determines the specific requests are permitted**. A boolean passed by a developer is not consent, and no sample consent UI is supplied as a substitute for the real integration.
5. Review policy/CSP changes for the CMP and ad network. The default CSP blocks external script, frame, and network requests intentionally. Use current official provider documentation rather than a broad wildcard allowlist. Implement and test withdrawal/revocation behavior in the real CMP adapter before activation; the bundled loader alone does not handle a consent lifecycle.
6. Update the Privacy Policy with truthful purposes, vendors, storage/cookies, applicable rights, retention, and contact procedures. Add the publisher-provided `ads.txt` content only when you have the correct details; no invented file is present.
7. Test eligible and ineligible users, unavailable CMP responses, withdrawal, network failures, keyboard interaction, layout stability, and placement on mobile. Verify no ad request happens before the applicable eligibility decision.
8. Enable `PUBLIC_ENABLE_ADS=true` and rebuild only after review and approval.

A certified CMP does not, by itself, establish compliance with every law. The legal pages in this project have not received professional legal review.

Official source: [Google publisher CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en).

## Browser storage and data handling

Only `student-hub-theme` is persisted. Privacy Policy includes a control to clear it. Inputs and scenarios live in React state and clear on reset/reload. Copy commands use the local clipboard on user action. Hosting request processing is separate from application calculation data and must be disclosed accurately by the deployed operator.
