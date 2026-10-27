# AdSense preparation

Advertising and analytics are **disabled by default** in `src/config/site.ts`. No imaginary publisher identifier, fake impression, placeholder ad rectangle, or generic cookie banner is included. The default CSP denies third-party scripts and connections. `AdSlot.astro` renders nothing unless advertising is enabled and both real publisher and slot identifiers pass format checks. Its placement is after the tool guide/FAQ, away from editor actions and copy/download buttons.

This is prepared infrastructure, not a claim of AdSense approval or legal compliance. Operator details, contact method, policy review, a real domain or approved hosting origin, Google account approval, real IDs, and consent integration are required before activation.

## Activation process

1. Review current Google publisher and AdSense policies and complete site approval. Add the real operator contact information and review all legal pages for the operating jurisdiction.
2. Select a consent-management integration appropriate to the actual audience and ad configuration. Google's policy requires a **Google-certified CMP integrated with IAB TCF** for personalized ads to visitors in the EEA, UK, and Switzerland. Nonpersonalized/limited ad behavior and legal requirements must be assessed separately; selecting a generic cookie-banner package does not establish compliance.
3. Implement and test the selected CMP's adapter. No ad request should occur before the required consent decision. Map withdrawal and later page views correctly. The base AdSlot deliberately makes no external request; it does not guess whether consent exists.
4. Add the real `PUBLIC_ADSENSE_PUBLISHER_ID`, set `site.adsense.enabled` explicitly, and pass the real slot ID to the AdSlot invocation. Add the approved ad script/request code behind the CMP's consent callback. Use actual publisher account instructions for the integration; no fake traffic or clicks should be generated for testing.
5. Revise the build-generated CSP to allow only the actual required script, frame, image, and connection origins for that integration. Google's delivery origins and consent configuration can vary, so validate in report-only/staging and narrow the allowlist. Do not weaken script policy globally or add editor payloads to any event.
6. Keep slots away from tool controls. Reserve dimensions only for genuinely enabled/consented slots to prevent layout shift. Update the privacy policy with providers, purposes, retention, and choices. Add the real ads.txt entry only if provided by the approved account; none is fabricated here.
7. Test consent required / granted / denied / withdrawn across relevant regions, without making fake impressions or clicks. Rerun accessibility and Lighthouse after ads, since third-party scripts change performance and privacy properties.

Optional analytics also requires explicit implementation, owner configuration, policy review, and CSP changes. Only coarse page/tool identifiers and nonsensitive aggregate actions may be considered. Inputs, token contents, output, clipboard values, and local file data must never be sent.

Primary references, checked October 27, 2026: [Google consent-management requirements](https://support.google.com/adsense/answer/13554116?hl=en), [Google publisher policies](https://support.google.com/publisherpolicies/answer/10502938), [AdSense program policies](https://support.google.com/adsense/answer/48182).
