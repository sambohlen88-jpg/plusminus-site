"""Webflow-ready HTML/CSS for the two Checkpoint 2 hero variants (v2 Home, v2 Home B)."""
import json, pathlib, re

TILE = "https://cdn.prod.website-files.com/6972414552ea3ed0d1385f71/6ae417d0a4c3504619e4171c_pm_plus_tile.svg"
BUNDLE = "https://cdn.jsdelivr.net/gh/sambohlen88-jpg/plusminus-site@31c97edb6310b27d302d238f03c9952d3508fded/dist/pm.js"
BUNDLE_SRI = "sha384-NnSPctFNQPUYz9th4X506QFwL0xMg0cUzQfgQoZCQrn9HfsUqr383lW5XXPa3xyT"
COLS12 = " ".join(["1fr"] * 12)

CSS = f"""
.section_hero {{ position: relative; display: flex; flex-direction: column; min-height: calc(100svh - 4.5rem); overflow: hidden; border-bottom: 1px solid var(--_colour---color--line); }}
.hero_field {{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; color: var(--_colour---color--line); background-image: url("{TILE}"); background-position: 50% 0; background-size: 40px 40px; }}
.hero_padding {{ position: relative; z-index: 1; display: flex; flex-grow: 1; flex-shrink: 1; flex-basis: 0%; }}
.hero_container {{ display: flex; flex-direction: column; justify-content: space-between; row-gap: 4rem; padding-top: var(--_spacing---space--32); padding-bottom: var(--_spacing---space--48); }}
.hero_container.is-split {{ justify-content: center; }}
.hero_promise {{ display: flex; flex-wrap: wrap; column-gap: var(--_spacing---space--32); row-gap: 0.5rem; color: var(--_colour---color--bone); }}
.hero_promise.is-rule {{ padding-top: var(--_spacing---space--24); border-top: 1px solid var(--_colour---color--line); }}
.hero_bottom {{ display: grid; grid-template-columns: {COLS12}; grid-template-rows: auto; column-gap: var(--_spacing---space--24); row-gap: 2rem; align-items: end; }}
.hero_heading {{ grid-column-start: span 8; grid-column-end: span 8; }}
.hero_aside {{ grid-column-start: 9; grid-column-end: 13; display: flex; flex-direction: column; row-gap: 2rem; }}
.hero_ctas {{ display: flex; flex-wrap: wrap; column-gap: var(--_spacing---space--16); row-gap: 1rem; }}
.hero_split {{ display: grid; grid-template-columns: {COLS12}; grid-template-rows: auto; column-gap: var(--_spacing---space--24); align-items: center; flex-grow: 1; flex-shrink: 1; flex-basis: 0%; }}
.hero_copy {{ grid-column-start: span 7; grid-column-end: span 7; display: flex; flex-direction: column; row-gap: 2rem; }}
.hero_eyebrow {{ color: var(--_colour---color--mid); }}
@media screen and (max-width: 991px) {{ .hero_heading {{ grid-column-start: span 12; grid-column-end: span 12; }} .hero_aside {{ grid-column-start: 1; grid-column-end: 9; }} .hero_copy {{ grid-column-start: span 8; grid-column-end: span 8; }} }}
@media screen and (max-width: 767px) {{ .hero_aside {{ grid-column-start: 1; grid-column-end: 13; }} .hero_copy {{ grid-column-start: span 12; grid-column-end: span 12; }} .hero_split {{ align-items: end; padding-top: 52svh; }} }}
"""

H1 = 'Websites for Perth businesses. <span class="text-color-mid">Less fluff, more phone calls.</span>'
SUB = "Perth web design studio. Fixed prices, fast sites, and someone you can meet for a coffee."
PROMISE = ('<div><span class="pm-mark">+</span> Fixed price</div><div><span class="pm-mark">−</span> Lock-in contracts</div>'
           '<div><span class="pm-mark">+</span> You own it</div>')
CTAS = ('<div class="hero_ctas" data-pm-reveal="fade" data-pm-reveal-after="field" data-pm-reveal-delay="0.45">'
        '<a href="/contact" class="pm-button"><span class="pm-button_icon" aria-hidden="true">+</span><span>Get a free website review</span></a>'
        '<a href="/projects" class="pm-button is-secondary"><span class="pm-button_icon" aria-hidden="true">→</span><span>See the work</span></a></div>')

A = f"""<div class="page-wrapper"><main class="main-wrapper"><section class="section_hero">
<div class="hero_field" data-pm-field="" data-pm-field-logo="intro"></div>
<div class="padding-global hero_padding"><div class="container-large hero_container">
<div class="hero_promise text-style-mono" data-pm-reveal="fade" data-pm-reveal-after="field" data-pm-reveal-delay="0.6">{PROMISE}</div>
<div class="hero_bottom">
<h1 class="hero_heading heading-style-h1" data-pm-reveal="lines" data-pm-reveal-after="field">{H1}</h1>
<div class="hero_aside"><p class="text-size-large margin-0" data-pm-reveal="fade" data-pm-reveal-after="field" data-pm-reveal-delay="0.3">{SUB}</p>{CTAS}</div>
</div></div></div></section></main></div>"""

B = f"""<div class="page-wrapper"><main class="main-wrapper"><section class="section_hero">
<div class="hero_field" data-pm-field="" data-pm-field-logo="hold" data-pm-field-align="right"></div>
<div class="padding-global hero_padding"><div class="container-large hero_container is-split">
<div class="hero_split"><div class="hero_copy">
<div class="hero_eyebrow text-style-mono" data-pm-reveal="fade" data-pm-reveal-after="field">PlusMinus Studios · Boorloo / Perth</div>
<h1 class="heading-style-h1" data-pm-reveal="lines" data-pm-reveal-after="field" data-pm-reveal-delay="0.1">{H1}</h1>
<p class="text-size-large margin-0 max-width-medium" data-pm-reveal="fade" data-pm-reveal-after="field" data-pm-reveal-delay="0.35">{SUB}</p>
{CTAS}</div></div>
<div class="hero_promise is-rule text-style-mono" data-pm-reveal="fade" data-pm-reveal-after="field" data-pm-reveal-delay="0.6">{PROMISE}</div>
</div></div></section></main></div>"""

HEAD_EMBED = ("<style>@media (prefers-reduced-motion: no-preference){html.pm-js [data-pm-reveal]{visibility:hidden}}"
              ".pm-line{padding-bottom:.06em}</style>"
              "<script>document.documentElement.classList.add('pm-js');"
              "setTimeout(function(){if(!window.PM)document.documentElement.classList.remove('pm-js')},4000);</script>")
BUNDLE_EMBED = f'<script src="{BUNDLE}" integrity="{BUNDLE_SRI}" crossorigin="anonymous" defer></script>'

clean = lambda h: re.sub(r">\s*\n\s*<", "><", h.strip())
out = {"a": clean(A), "b": clean(B), "css": " ".join(CSS.split()), "head_embed": HEAD_EMBED, "bundle_embed": BUNDLE_EMBED}
pathlib.Path(__file__).with_name("hero.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
for k, v in out.items():
    print(k, len(v))
