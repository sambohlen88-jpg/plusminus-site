# Design log

Design decisions the brief didn't specify. Newest first.

| Date | Decision | Why | Owner OK? |
| --- | --- | --- | --- |
| 2026-10-29 | GSAP stays out of `pm.js`. It loads from Webflow's built-in GSAP and is read from `window.gsap`. | Keeps the custom bundle well under the 150KB gzipped budget | Pending |
