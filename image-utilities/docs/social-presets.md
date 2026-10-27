# Social canvas presets

Configuration: `src/data/social-presets.ts`. Version **2026-10-27.1**. Last reviewed **October 27, 2026**.

Each entry carries a platform, named placement, dimensions, verification flag and optional official source. The UI displays its review date and verification status. A starting canvas is not a guarantee of acceptance, safe area, circular mask, display cropping, account eligibility, or upload byte limits. Do not infer a universal size from one placement.

| Placement                               | Pixels                                  | Status/source                                                                                                                                                       |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| YouTube video thumbnail                 | 3840 × 2160                             | Verified current recommendation from [YouTube Help](https://support.google.com/youtube/answer/72431?hl=en)                                                          |
| YouTube Short thumbnail                 | 2160 × 3840                             | Verified current recommendation from the same official source                                                                                                       |
| X profile photo                         | 400 × 400                               | Verified recommendation from [X Help](https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo)                                       |
| X header                                | 1500 × 500                              | Verified recommendation from the same official source                                                                                                               |
| Instagram square / portrait / story     | 1080 × 1080 / 1080 × 1350 / 1080 × 1920 | General-purpose starting canvases; current official placement requirements were not established                                                                     |
| Facebook square / landscape / profile   | 1080 × 1080 / 1200 × 630 / 400 × 400    | General-purpose starting canvases                                                                                                                                   |
| LinkedIn landscape post / profile cover | 1200 × 627 / 1584 × 396                 | General-purpose starting canvases; reviewed [LinkedIn cover guidance](https://www.linkedin.com/help/linkedin/answer/a568217), but not marked as verified dimensions |
| Pinterest portrait / square             | 1000 × 1500 / 1000 × 1000               | General-purpose starting canvases                                                                                                                                   |
| YouTube channel banner                  | 2560 × 1440                             | General-purpose starting canvas; thumbnail guidance is not evidence for banner requirements                                                                         |

The YouTube source observed during development recommends larger thumbnail dimensions than older 1280 × 720 tutorials. This configuration records the observed current recommendation rather than silently copying older values. Byte limits depend on placement/device and are not guaranteed by selecting a canvas. Use the compressor if the destination also requires a size limit, and inspect the actual final bytes.

Before updating, consult official placement-specific documentation, set a new version/review date, retain a direct source, distinguish recommended from minimum/required sizes, and test resulting canvas dimensions. Leave the verification flag false when an official recommendation cannot be established.
