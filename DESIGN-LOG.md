# Design log

Design decisions the brief didn't specify. Newest first.

| Date | Decision | Why | Owner OK? |
| --- | --- | --- | --- |
| 2026-10-29 | The v2 button class is `pm-button` (combos `is-secondary`, `is-text`, `is-small`), not `button`. | `button` already exists on the old site with combos. Reusing it would restyle live pages. | Pending |
| 2026-10-29 | The 1440 container is `container-large` at 90rem, not Client-First's default 80rem. | The brief sets a 1440px max content width. | Pending |
| 2026-10-29 | Section padding is 160px desktop, 120px tablet, 80px mobile (`padding-section-large`). | The brief says 160–200 on desktop. 160 is used as the base and 200 is kept for hero-level breaks. | Pending |
| 2026-10-29 | Heading tracking: display −4% (brief), H1 −3%, H2 −2%, H3 −2%, H4 −1%. | The brief only sets the display size. Tighter tracking than this crushes word spaces in Cal Sans at H2 size. | Pending |
| 2026-10-29 | Large type is fluid: `clamp(min, vw, var(--text/…))`. The variables hold the desktop size. | Webflow variables reject `clamp()`, so the fluid part lives on the class. | Pending |
| 2026-10-29 | Mobile hero is 88px (5.5rem) below 479px. | It keeps "+Enquiries" filling the 390px width instead of shrinking to 64px. | Pending |
| 2026-10-29 | `font/mono` is set to `monospace` until JetBrains Mono is added to the site. | The Webflow API can't add Google Fonts. Owner step: Site settings → Fonts → add JetBrains Mono, then update the variable. | Pending |
| 2026-10-29 | `row-gap` values are raw `var(--…)`, not linked variables. | Webflow rejects variables on `row-gap`. They still render from the same tokens. | n/a |
| 2026-10-29 | The two accent options use a variable mode. The Colour collection has a "Sun" mode where `color/signal` is #FF4D1F. | Choosing the accent later is a one-value change. Option B on the styleguide is the same component in Sun mode. | Pending |
| 2026-10-29 | The nav CTA hides below 479px; it will live in the mobile menu. | At 390px the logo, CTA and Menu button don't fit with comfortable tap targets. | Pending |
| 2026-10-29 | Nav and footer links point at the existing pages (`/projects`, `/insights-resources`, `/contact`) until v2 pages exist. Process is `#`. | It avoids broken links. They will be re-pointed when Work, Journal and Process are built. | Pending |
| 2026-10-29 | Acknowledgement of Country wording: "PlusMinus Studios acknowledges the Whadjuk Noongar people, the Traditional Custodians of Boorloo (Perth), where we live and work. We pay our respects to Elders past and present." | The brief names the Whadjuk Noongar people and Boorloo but gives no wording. | Pending |
| 2026-10-29 | The footer wordmark uses the existing logo SVG. A tighter version without the built-in left padding is in `design/assets/plusminus-wordmark-tight.svg`. | It needs uploading to Webflow so the giant wordmark aligns with the grid. | Pending |
| 2026-10-29 | The custom code bundle is pinned to a commit SHA on jsDelivr, not a tag. | Pushing git tags is blocked from the build environment. A SHA is equally immutable. Tags can be added from GitHub later. | n/a |
| 2026-10-29 | GSAP stays out of `pm.js`. It loads from Webflow's built-in GSAP and is read from `window.gsap`. | Keeps the custom bundle well under the 150KB gzipped budget. | Pending |
