"""Generate Webflow-ready (whtml) HTML + CSS chunks for the v2 Styleguide.

Webflow classes can't use descendant/sibling selectors, ::before or inline styles,
so this version uses combo classes instead. Variables are referenced by their
Webflow CSS names.
"""
import json, re, pathlib

V = {
    "color-ink": "--_colour---color--ink", "color-graphite": "--_colour---color--graphite",
    "color-line": "--_colour---color--line", "color-bone": "--_colour---color--bone",
    "color-mid": "--_colour---color--mid", "color-signal": "--_colour---color--signal",
    "font-display": "--_typography---font--display", "font-body": "--_typography---font--body",
    "font-mono": "--_typography---font--mono",
    **{f"text-{n}": f"--_typography---text--{n}" for n in (12, 14, 16, 20, 28, 40, 64, 96, 160)},
    "text-hero": "--_typography---text--hero",
    **{f"space-{n}": f"--_spacing---space--{n}" for n in (8, 16, 24, 32, 48, 64, 96, 160, 200)},
    "radius-8": "--_radius---radius--8", "radius-12": "--_radius---radius--12",
}
WORDMARK = "https://s3.amazonaws.com/webflow-prod-assets/6972414552ea3ed0d1385f71/69735acda0139c2ecbb65d17_plusminus_logo.svg"
EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)"

def v(css):
    return re.sub(r"var\(--([a-z0-9-]+)\)", lambda m: f"var({V[m.group(1)]})", css)

def btn(label, icon="+", mods=""):
    cls = ("pm-button " + mods).strip()
    return f'<a href="#" class="{cls}"><span class="pm-button_icon" aria-hidden="true">{icon}</span><span>{label}</span></a>'

CSS_BASE = """
.page-wrapper { background-color: var(--color-ink); color: var(--color-bone); font-family: var(--font-body); font-size: var(--text-16); line-height: 1.5; overflow-x: clip; }
.main-wrapper { position: relative; }
.padding-global { padding-left: 2.5rem; padding-right: 2.5rem; }
.container-large { width: 100%; max-width: 90rem; margin-left: auto; margin-right: auto; }
.padding-section-large { padding-top: var(--space-160); padding-bottom: var(--space-160); }
.padding-section-medium { padding-top: var(--space-96); padding-bottom: var(--space-96); }
.heading-style-display { font-family: var(--font-display); font-size: clamp(4rem, 15.3vw, var(--text-hero)); font-weight: 400; line-height: 0.88; letter-spacing: -0.04em; margin-top: 0; margin-bottom: 0; }
.heading-style-h1 { font-family: var(--font-display); font-weight: 400; font-size: clamp(3rem, 6.7vw, var(--text-96)); line-height: 0.95; letter-spacing: -0.03em; margin-top: 0; margin-bottom: 0; }
.heading-style-h2 { font-family: var(--font-display); font-weight: 400; font-size: clamp(2.5rem, 4.5vw, var(--text-64)); line-height: 1.02; letter-spacing: -0.02em; margin-top: 0; margin-bottom: 0; }
.heading-style-h3 { font-family: var(--font-display); font-weight: 400; font-size: clamp(1.75rem, 2.8vw, var(--text-40)); line-height: 1.05; letter-spacing: -0.02em; margin-top: 0; margin-bottom: 0; }
.heading-style-h4 { font-family: var(--font-display); font-weight: 400; font-size: var(--text-28); line-height: 1.1; letter-spacing: -0.01em; margin-top: 0; margin-bottom: 0; }
.text-size-large { font-size: var(--text-20); line-height: 1.45; }
.text-size-medium { font-size: 1.125rem; line-height: 1.5; }
.text-size-regular { font-size: var(--text-16); line-height: 1.5; }
.text-size-small { font-size: var(--text-14); line-height: 1.5; }
.text-style-mono { font-family: var(--font-mono); font-size: var(--text-12); line-height: 1.4; letter-spacing: 0.04em; text-transform: uppercase; }
.text-color-mid { color: var(--color-mid); }
.text-color-signal { color: var(--color-signal); }
.max-width-medium { max-width: 36rem; }
.margin-0 { margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0; }
.pm-mark { display: inline-block; color: var(--color-signal); font-family: var(--font-mono); font-weight: 400; }
.pm-button { display: inline-flex; align-items: center; column-gap: 0.75rem; padding-top: 0.875rem; padding-right: 1.25rem; padding-bottom: 0.875rem; padding-left: 1rem; border: 1px solid var(--color-signal); border-radius: var(--radius-8); background-color: var(--color-signal); color: var(--color-ink); font-family: var(--font-body); font-size: var(--text-16); font-weight: 500; line-height: 1; text-decoration: none; transition: background-color 0.4s EASE, color 0.4s EASE, border-color 0.4s EASE, background-size 0.4s EASE; }
.pm-button:hover { background-color: var(--color-bone); border-color: var(--color-bone); }
.pm-button_icon { display: inline-flex; width: 1.25rem; height: 1.25rem; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 1.125rem; line-height: 1; }
.pm-button.is-secondary { background-color: transparent; border-color: var(--color-line); color: var(--color-bone); }
.pm-button.is-secondary:hover { background-color: transparent; border-color: var(--color-bone); }
.pm-button.is-text { padding-top: 0; padding-right: 0; padding-bottom: 0.25rem; padding-left: 0; border-width: 0; border-radius: 0; background-color: transparent; color: var(--color-bone); background-image: linear-gradient(var(--color-bone), var(--color-bone)); background-size: 0% 1px; background-position: 0% 100%; background-repeat: no-repeat; }
.pm-button.is-text:hover { background-color: transparent; background-size: 100% 1px; }
.pm-button.is-small { padding-top: 0.625rem; padding-right: 1rem; padding-bottom: 0.625rem; padding-left: 0.75rem; font-size: var(--text-14); column-gap: 0.5rem; }
@media screen and (max-width: 991px) { .padding-section-large { padding-top: 7.5rem; padding-bottom: 7.5rem; } }
@media screen and (max-width: 767px) { .padding-global { padding-left: 1.5rem; padding-right: 1.5rem; } .padding-section-large { padding-top: 5rem; padding-bottom: 5rem; } }
@media screen and (max-width: 479px) { .padding-global { padding-left: 1rem; padding-right: 1rem; } .heading-style-display { font-size: 5.5rem; } }
"""

CSS_NAV = """
.nav_component { position: sticky; top: 0; z-index: 100; background-color: var(--color-ink); border-bottom: 1px solid var(--color-line); }
.nav_container { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: var(--space-24); height: 4.5rem; }
.nav_brand { display: inline-flex; align-items: center; justify-self: start; }
.nav_logo { display: block; height: 1.5rem; width: auto; }
.nav_menu { display: flex; align-items: center; column-gap: var(--space-32); }
.nav_link { color: var(--color-bone); font-size: var(--text-14); text-decoration: none; padding-bottom: 0.125rem; background-image: linear-gradient(var(--color-bone), var(--color-bone)); background-size: 0% 1px; background-position: 0% 100%; background-repeat: no-repeat; transition: background-size 0.4s EASE; }
.nav_link:hover { background-size: 100% 1px; }
.nav_right { display: flex; align-items: center; justify-content: flex-end; column-gap: var(--space-24); }
.nav_clock { display: flex; align-items: center; column-gap: 0.5rem; color: var(--color-mid); white-space: nowrap; }
.nav_clock-dot { width: 0.375rem; height: 0.375rem; border-radius: 50%; background-color: var(--color-signal); }
.nav_menu-button { display: none; color: var(--color-bone); text-decoration: none; border: 1px solid var(--color-line); border-radius: var(--radius-8); padding-top: 0.5rem; padding-right: 0.75rem; padding-bottom: 0.5rem; padding-left: 0.75rem; }
.pm-button.is-small.is-nav { position: relative; }
@media screen and (max-width: 991px) { .nav_menu { display: none; } .nav_container { grid-template-columns: 1fr auto; } .nav_menu-button { display: inline-flex; } }
@media screen and (max-width: 767px) { .nav_clock { display: none; } }
@media screen and (max-width: 479px) { .pm-button.is-small.is-nav { display: none; } }
"""

NAV = f"""<header class="nav_component" data-pm-nav=""><div class="padding-global"><div class="container-large"><nav class="nav_container" aria-label="Main">
<a href="/" class="nav_brand" aria-label="PlusMinus Studios home"><img src="{WORDMARK}" alt="PlusMinus Studios" class="nav_logo" width="75" height="24"></a>
<div class="nav_menu"><a href="/projects" class="nav_link">Work</a><a href="/services" class="nav_link">Services</a><a href="/pricing" class="nav_link">Pricing</a><a href="#" class="nav_link">Process</a><a href="/insights-resources" class="nav_link">Journal</a></div>
<div class="nav_right"><div class="nav_clock text-style-mono"><div class="nav_clock-dot"></div><div>Perth <span data-pm-clock="">12:45pm</span></div></div>
<a href="/contact" class="pm-button is-small is-nav"><span class="pm-button_icon" aria-hidden="true">+</span><span>Free Website Review</span></a>
<a href="#" class="nav_menu-button text-style-mono">Menu</a></div>
</nav></div></div></header>"""

CSS_SG = """
.section_styleguide { border-bottom: 1px solid var(--color-line); }
.styleguide_header { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-24); margin-bottom: var(--space-96); }
.styleguide_index { grid-column: span 3; color: var(--color-mid); }
.styleguide_title { grid-column: span 9; }
.styleguide_hero { padding-top: var(--space-160); padding-bottom: var(--space-96); }
.styleguide_hero-meta { display: flex; justify-content: space-between; column-gap: var(--space-24); color: var(--color-mid); margin-bottom: var(--space-64); }
.styleguide_hero-sub { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-24); margin-top: var(--space-64); align-items: end; }
.styleguide_hero-sub-text { grid-column: 7 / span 4; }
.styleguide_hero-ctas { grid-column: 7 / span 6; display: flex; flex-wrap: wrap; column-gap: var(--space-16); row-gap: var(--space-16); margin-top: var(--space-32); }
@media screen and (max-width: 991px) { .styleguide_hero-sub-text { grid-column: 1 / span 8; } .styleguide_hero-ctas { grid-column: 1 / span 12; } .styleguide_index { grid-column: span 12; margin-bottom: var(--space-16); } .styleguide_title { grid-column: span 12; } }
@media screen and (max-width: 767px) { .styleguide_hero-meta { flex-direction: column; row-gap: var(--space-8); } }
@media screen and (max-width: 479px) { .styleguide_hero-sub-text { grid-column: 1 / span 12; } }
"""

HERO = f"""<section class="section_styleguide"><div class="padding-global"><div class="container-large styleguide_hero">
<div class="styleguide_hero-meta text-style-mono"><div>v2 Styleguide</div><div>Checkpoint 01 · Foundations</div><div>Boorloo / Perth, WA</div></div>
<h1 class="heading-style-display"><span class="pm-mark">+</span>Enquiries<br><span class="pm-mark">−</span>Excuses.</h1>
<div class="styleguide_hero-sub"><p class="styleguide_hero-sub-text text-size-large margin-0">Perth web design studio. Fixed prices, fast sites, and someone you can meet for a coffee.</p>
<div class="styleguide_hero-ctas">{btn("Get a free website review")}{btn("See the work", "→", "is-secondary")}</div></div>
</div></div></section>"""

def header(idx, title):
    return f'<div class="styleguide_header"><div class="styleguide_index text-style-mono">{idx}</div><h2 class="styleguide_title heading-style-h2">{title}</h2></div>'

CSS_COLOUR = """
.styleguide_swatches { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); column-gap: var(--space-24); row-gap: var(--space-24); }
.styleguide_swatch { display: flex; flex-direction: column; row-gap: var(--space-16); }
.styleguide_chip { aspect-ratio: 4 / 3; border-radius: var(--radius-8); border: 1px solid var(--color-line); }
.styleguide_chip.is-ink { background-color: var(--color-ink); }
.styleguide_chip.is-graphite { background-color: var(--color-graphite); }
.styleguide_chip.is-line { background-color: var(--color-line); }
.styleguide_chip.is-bone { background-color: var(--color-bone); }
.styleguide_chip.is-mid { background-color: var(--color-mid); }
.styleguide_accents { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--space-24); row-gap: var(--space-24); margin-top: var(--space-48); }
.styleguide_accent { display: flex; flex-direction: column; row-gap: var(--space-32); padding: var(--space-32); border: 1px solid var(--color-line); border-radius: var(--radius-12); background-color: var(--color-graphite); }
.styleguide_accent.styleguide_variant-b { position: relative; }
.styleguide_accent-chip { height: 10rem; border-radius: var(--radius-8); background-color: var(--color-signal); }
.styleguide_accent-row { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--space-16); row-gap: var(--space-16); }
@media screen and (max-width: 991px) { .styleguide_swatches { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media screen and (max-width: 767px) { .styleguide_accents { grid-template-columns: minmax(0, 1fr); } }
@media screen and (max-width: 479px) { .styleguide_swatches { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
"""

def swatch(mod, name, hexv, use):
    return f'<div class="styleguide_swatch"><div class="styleguide_chip {mod}"></div><div class="text-style-mono">{name} · {hexv}</div><div class="text-size-small text-color-mid">{use}</div></div>'

def accent(label, extra=""):
    return (f'<div class="styleguide_accent{extra}"><div class="text-style-mono">{label}</div><div class="styleguide_accent-chip"></div>'
            f'<div class="heading-style-h3"><span class="pm-mark">+</span> Fixed price <span class="pm-mark">−</span> Surprise invoices</div>'
            f'<div class="styleguide_accent-row">{btn("Build your price")}{btn("See the work", "→", "is-secondary")}</div></div>')

COLOUR = ('<section class="section_styleguide"><div class="padding-global"><div class="container-large padding-section-large">'
    + header("01 / Colour", 'Five neutrals. One signal, used only on <span class="pm-mark">+</span> <span class="pm-mark">−</span> and the main action.')
    + '<div class="styleguide_swatches">'
    + swatch("is-ink", "Ink", "#0E0E0E", "Main background") + swatch("is-graphite", "Graphite", "#1A1A1A", "Cards, nav, surfaces")
    + swatch("is-line", "Line", "#2E2E2E", "Borders, grid lines") + swatch("is-bone", "Bone", "#F2F0EB", "Text, light sections")
    + swatch("is-mid", "Mid", "#8A8A8A", "Secondary text") + '</div>'
    + '<div class="styleguide_accents">' + accent("Option A · Acid lime · #D4FF3A") + accent("Option B · Perth-sun orange · #FF4D1F", " styleguide_variant-b") + '</div>'
    + '</div></div></section>')

CSS_TYPE = """
.styleguide_type-row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-24); align-items: baseline; padding-top: var(--space-32); padding-bottom: var(--space-32); border-top: 1px solid var(--color-line); }
.styleguide_type-spec { grid-column: span 3; color: var(--color-mid); }
.styleguide_type-sample { grid-column: span 9; min-width: 0; }
@media screen and (max-width: 991px) { .styleguide_type-spec { grid-column: span 12; margin-bottom: var(--space-16); } .styleguide_type-sample { grid-column: span 12; } }
"""
ROWS = [
    ("Display · Cal Sans<br>220 / 0.88 / −4%", "heading-style-display", "Add. Remove."),
    ("H1 · 96 / 0.95", "heading-style-h1", "Websites for Perth businesses."),
    ("H2 · 64 / 1.0", "heading-style-h2", "Less fluff, more phone calls."),
    ("H3 · 40 / 1.05", "heading-style-h3", "We take things away for a living."),
    ("H4 · 28 / 1.1", "heading-style-h4", "Quote in 48 hours, not 48 emails."),
    ("Large · DM Sans 20 / 1.45", "text-size-large max-width-medium", "A Perth studio that builds websites at the level of the best east coast agencies, with fixed prices."),
    ("Body · DM Sans 16 / 1.5", "text-size-regular max-width-medium", "Every site is custom-built with usability, speed and conversion in mind, so visitors can find what they need and take action. You own it, and you can edit it yourself."),
    ("Small · DM Sans 14", "text-size-small text-color-mid", "Prices are AUD, ex GST. Fixed-price quotes. Reply within 1 business day."),
    ("Mono · 12 / +4%", "text-style-mono", "Perth 12:45pm · Concept project · 01 / Discover"),
]
TYPE = ('<section class="section_styleguide"><div class="padding-global"><div class="container-large padding-section-large">'
    + header("02 / Type", "Cal Sans, set big and tight. DM Sans for reading. Mono for labels and numbers.")
    + "".join(f'<div class="styleguide_type-row"><div class="styleguide_type-spec text-style-mono">{s}</div><div class="styleguide_type-sample {c}">{t}</div></div>' for s, c, t in ROWS)
    + '</div></div></section>')

CSS_ACTIONS = """
.styleguide_buttons { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--space-24); row-gap: var(--space-24); }
.styleguide_note { margin-top: var(--space-32); }
.styleguide_pairs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--color-line); }
.styleguide_pair-col { display: flex; flex-direction: column; padding-top: var(--space-32); }
.styleguide_pair-col.is-right { border-left: 1px solid var(--color-line); padding-left: var(--space-32); }
.styleguide_pair-item { display: flex; align-items: baseline; column-gap: var(--space-16); padding-top: var(--space-16); padding-bottom: var(--space-16); border-bottom: 1px solid var(--color-line); }
.pm-mark.is-list { width: 1.5rem; flex: none; font-size: var(--text-28); line-height: 1; }
@media screen and (max-width: 767px) { .styleguide_pairs { grid-template-columns: minmax(0, 1fr); } .styleguide_pair-col.is-right { border-left-width: 0; padding-left: 0; } }
"""
ACTIONS = ('<section class="section_styleguide"><div class="padding-global"><div class="container-large padding-section-large">'
    + header("03 / Actions", "One primary action per screen. Everything else steps back.")
    + '<div class="styleguide_buttons">' + btn("Get a free website review") + btn("Build your price", "+", "is-secondary") + btn("See the work", "→", "is-text") + btn("Small", "+", "is-small") + '</div>'
    + '<p class="styleguide_note text-size-small text-color-mid">Primary · Secondary · Text · Small. On hover the + swaps to → (added in the motion milestone).</p>'
    + '</div></div></section>')

ADD = ["Enquiries and bookings", "Speed (sub-2s loads)", "Clarity and hierarchy", "Local search visibility", "Ownership: you can edit it yourself"]
REM = ["Bloat, plugins, clutter", "Jargon and hidden fees", "Slow, confusing journeys", "Lock-in contracts", "Agency runaround"]
def col(label, items, mark, extra=""):
    return (f'<div class="styleguide_pair-col{extra}"><div class="text-style-mono text-color-mid">{label}</div>'
            + "".join(f'<div class="styleguide_pair-item text-size-large"><span class="pm-mark is-list">{mark}</span><span>{i}</span></div>' for i in items) + '</div>')
LISTS = ('<section class="section_styleguide"><div class="padding-global"><div class="container-large padding-section-large">'
    + header("04 / Lists", "Add what matters. Remove what doesn't.")
    + '<div class="styleguide_pairs">' + col("We add", ADD, "+") + col("We remove", REM, "−", " is-right") + '</div>'
    + '</div></div></section>')

CSS_GRID = """
.styleguide_grid-demo { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-24); height: 12rem; }
.styleguide_grid-col { position: relative; border-left: 1px solid var(--color-line); border-right: 1px solid var(--color-line); }
.styleguide_grid-plus { position: absolute; top: -0.6rem; left: -0.35rem; font-family: var(--font-mono); font-size: var(--text-12); line-height: 1; color: var(--color-mid); }
.styleguide_grid-col.is-desktop { position: relative; }
@media screen and (max-width: 767px) { .styleguide_grid-demo { grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: var(--space-16); } .styleguide_grid-col.is-desktop { display: none; } }
"""
GRID = ('<section class="section_styleguide"><div class="padding-global"><div class="container-large padding-section-large">'
    + header("05 / Grid", "12 columns, 1440 max, 24 gutters. Hairlines where the + crosshair helps.")
    + '<div class="styleguide_grid-demo" aria-hidden="true">'
    + "".join(f'<div class="styleguide_grid-col{" is-desktop" if i >= 4 else ""}"><div class="styleguide_grid-plus">+</div></div>' for i in range(12))
    + '</div></div></div></section>')

CSS_FOOTER = """
.footer_component { border-top: 1px solid var(--color-line); }
.footer_top { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--space-24); row-gap: var(--space-48); padding-top: var(--space-96); padding-bottom: var(--space-96); }
.footer_col { display: flex; flex-direction: column; row-gap: var(--space-16); grid-column: span 3; }
.footer_col.is-wide { grid-column: span 6; }
.footer_heading { color: var(--color-mid); margin-bottom: var(--space-8); }
.footer_link { color: var(--color-bone); text-decoration: none; font-size: var(--text-16); transition: color 0.4s EASE; }
.footer_link:hover { color: var(--color-signal); }
.footer_link.is-large { font-family: var(--font-display); font-size: clamp(1.75rem, 2.8vw, var(--text-40)); letter-spacing: -0.02em; line-height: 1.1; overflow-wrap: anywhere; }
.footer_acknowledgement { color: var(--color-mid); max-width: 30rem; }
.footer_wordmark { display: block; width: 100%; height: auto; }
.footer_bottom { display: flex; justify-content: space-between; align-items: center; column-gap: var(--space-24); row-gap: var(--space-8); padding-top: var(--space-24); padding-bottom: var(--space-32); color: var(--color-mid); }
@media screen and (max-width: 991px) { .footer_col { grid-column: span 6; } .footer_col.is-wide { grid-column: span 12; } }
@media screen and (max-width: 767px) { .footer_bottom { flex-direction: column; align-items: flex-start; } }
@media screen and (max-width: 479px) { .footer_col { grid-column: span 12; } .footer_link.is-large { font-size: 1.5rem; } }
"""
FOOTER = f"""<footer class="footer_component"><div class="padding-global"><div class="container-large">
<div class="footer_top">
<div class="footer_col is-wide"><div class="footer_heading text-style-mono">Say hello</div><a href="mailto:hello@plusminusstudios.com" class="footer_link is-large">hello@plusminusstudios.com</a><a href="https://www.instagram.com/plusminus__studio" class="footer_link">Instagram @plusminus__studio</a></div>
<div class="footer_col"><div class="footer_heading text-style-mono">Sitemap</div><a href="/projects" class="footer_link">Work</a><a href="/services" class="footer_link">Services</a><a href="/pricing" class="footer_link">Pricing</a><a href="#" class="footer_link">Process</a><a href="/insights-resources" class="footer_link">Journal</a><a href="/contact" class="footer_link">Contact</a></div>
<div class="footer_col"><div class="footer_heading text-style-mono">Studio</div><div class="text-size-regular">Perth, Western Australia</div><div class="text-style-mono text-color-mid">Perth <span data-pm-clock="">12:45pm</span></div><a href="/contact" class="footer_link">Free Website Review</a></div>
<div class="footer_col is-wide"><p class="footer_acknowledgement text-size-small margin-0">PlusMinus Studios acknowledges the Whadjuk Noongar people, the Traditional Custodians of Boorloo (Perth), where we live and work. We pay our respects to Elders past and present.</p></div>
</div>
<img src="{WORDMARK}" alt="" class="footer_wordmark" width="1440" height="280">
<div class="footer_bottom text-style-mono"><div>© 2026 PlusMinus Studios</div><div>Add what matters. Remove what doesn't.</div></div>
</div></div></footer>"""

SHELL = '<div class="page-wrapper">' + NAV + '<main class="main-wrapper"></main>' + FOOTER + '</div>'

chunks = {
    "shell": (SHELL, CSS_BASE + CSS_NAV + CSS_FOOTER),
    "hero": (HERO, CSS_SG), "colour": (COLOUR, CSS_COLOUR), "type": (TYPE, CSS_TYPE),
    "actions": (ACTIONS, CSS_ACTIONS), "lists": (LISTS, ""), "grid": (GRID, CSS_GRID),
}
out = {k: {"html": re.sub(r">\s*\n\s*<", "><", h.strip()), "css": " ".join(v(c).replace("EASE", EASE).split())} for k, (h, c) in chunks.items()}
pathlib.Path(__file__).with_name("chunks.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
for k, x in out.items():
    print(k, len(x["html"]), len(x["css"]))
