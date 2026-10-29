# design/

- `styleguide.html` + `pm.css`: local, framework-free version of the v2 styleguide. This is the design source for Checkpoint 1. Open it in a browser to check layout at any width.
- `webflow/build.py`: turns the same design into Webflow-ready HTML/CSS chunks (combo classes instead of descendant selectors, Webflow variable names). Run `python3 design/webflow/build.py` to regenerate `chunks.json`.
- `assets/`: the existing wordmark and ± icon (white SVGs), plus a tightly cropped wordmark for the footer.
- `fonts/`: local copies for previewing only (Cal Sans, DM Sans, JetBrains Mono, all OFL). Webflow uses its own uploaded fonts.
