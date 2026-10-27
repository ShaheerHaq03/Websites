# Advertising preparation

Analytics and advertising are disabled in `src/config/site.ts`. The reusable `AdSlot.astro` renders nothing until explicitly enabled with a real publisher and slot identifier. It makes no ad requests and displays no fake impressions or placeholder ad rectangles. Placement is after educational content/FAQs, away from image settings, processing and download controls. The site remains functional with ads absent or blocked.

Before activation, complete AdSense site approval, supply real publisher/slot IDs, confirm operator contact details and domain, and review the legal pages for actual jurisdiction and service practices. Ad readiness does not guarantee approval.

Integrate an appropriate consent management provider before adding advertising code. Google's rules require a **Google-certified CMP integrated with IAB TCF for personalized ads in the EEA, UK and Switzerland**. Assess nonpersonalized/limited ad behavior and legal requirements separately. A generic cookie banner is not by itself a compliance solution.

Map the selected CMP's actual consent/withdrawal callbacks to provider initialization. No ad request should precede the required consent decision. This project does not invent consent or guess which real CMP the owner will choose. Add actual ad loading only behind the tested adapter, update privacy disclosures, and revise CSP to narrow actual script/frame/image/connection origins rather than broad wildcard exceptions. Add ads.txt only with the approved account's real entry.

Never attach user-selected images, filenames, EXIF/GPS, output or clipboard data to ad or analytics events. Do not insert ads inside editors/previews or near primary download buttons. Reserve space only for genuinely enabled slots to avoid unnecessary layout shifts. Re-run Lighthouse, accessibility and privacy network tests after third-party scripts are enabled. Do not generate fake impressions/clicks as tests.

Sources checked during development: [Google CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en), [AdSense program policies](https://support.google.com/adsense/answer/48182), [Google publisher policies](https://support.google.com/publisherpolicies/answer/10502938).
