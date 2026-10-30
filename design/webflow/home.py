"""Webflow-ready (whtml) chunks for the rest of v2 Home (Checkpoint 3).

Source of truth is design/home-v2.html + design/pm.css. This script pulls each
section out, swaps inline badge positions for combo classes, and rewrites the
CSS into what Webflow accepts: longhand grid placement, Webflow variable names,
literal clamps for fluid sizes, and only the 991/767/479 breakpoints.
Work and Journal lose their static cards: those become CMS collection lists.
"""
import json, re, pathlib
import contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from build import V

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "home-v2.html").read_text()
css = (ROOT / "pm.css").read_text()

FLUID = {"text-40": "clamp(1.75rem, 2.8vw, 2.5rem)", "text-64": "clamp(2.5rem, 4.5vw, 4rem)"}
PREFIXES = ("section-head_", "section_marquee", "marquee_", "subtraction_", "mock-", "work_", "services_",
            "price_", "process_", "values_", "journal_", "cta_", "form_")

def to_webflow(rule):
    for k, val in FLUID.items():
        rule = rule.replace(f"var(--{k})", val)
    rule = re.sub(r"var\(--([a-z0-9-]+)\)", lambda m: f"var({V[m.group(1)]})", rule)
    def grid(m):
        a, b = m.group(1).split("/")
        return f"grid-column-start: {a.strip()}; grid-column-end: {b.strip()};"
    return re.sub(r"grid-column: ([^;]+);", grid, rule)

# Base rules: the Home block in pm.css
block = css[css.index("/* ---------- Home sections ---------- */"):css.index("/* ---------- Styleguide page only ---------- */")]
base = [l for l in block.splitlines() if l.startswith(".")]
# Badge positions (inline styles locally)
BADGES = {"is-banner": "top: 5%; right: 3%;", "is-popup": "top: 30%; left: 28%;", "is-stock": "top: 52%; right: 6%;",
          "is-spinner": "top: 70%; left: 3%;", "is-headline": "top: 20%; left: 4%;", "is-action": "top: 69%; left: 44%;",
          "is-booking": "top: 15%; right: 4%;"}
base += [f".subtraction_badge.{k} {{ {v} }}" for k, v in BADGES.items()]

# Breakpoint rules for these sections only
media = {}
for bp in ("991", "767", "479"):
    body = css.split(f"@media screen and (max-width: {bp}px) {{\n", 1)[1].split("\n}", 1)[0]
    media[bp] = [l.strip() for l in body.splitlines() if l.strip().startswith(tuple("." + p for p in PREFIXES))]

pos = {re.escape(f'style="{v.strip()}"'.replace("; ", ";").rstrip(";")) : k for k, v in BADGES.items()}
def badges(h):
    def sub(m):
        style = m.group(1).replace(" ", "")
        for k, v in BADGES.items():
            if v.replace(" ", "").rstrip(";") == style.rstrip(";"):
                return f'class="subtraction_badge {k}"'
        raise SystemExit("unmapped badge " + style)
    return re.sub(r'class="subtraction_badge" style="([^"]+)"', sub, h)

def section(name):
    m = re.search(rf'\n    <section class="section_{name}".*?\n    </section>', html, re.S)
    h = m.group(0)
    h = badges(h)
    h = re.sub(r'\n\s*<div class="(work_track|journal_list)".*?\n          </div>', "", h, flags=re.S)
    h = h.replace('src="assets/', 'src="#')
    return re.sub(r">\s+<", "><", h.strip())

ORDER = ["marquee", "subtraction", "work", "services", "price", "process", "values", "journal", "cta"]
sections = {n: section(n) for n in ORDER}
def owns(rule, name):
    first = rule.split("{")[0]
    groups = {"marquee": ("section_marquee", "marquee_"), "subtraction": ("subtraction_", "mock-"),
              "work": ("work_",), "services": ("services_",), "price": ("price_",), "process": ("process_",),
              "values": ("values_",), "journal": ("journal_",), "cta": ("cta_", "form_"), "head": ("section-head_",)}
    return any("." + p in first for p in groups[name])

chunks = []
for n in ["head"] + ORDER:
    rules = [to_webflow(r) for r in base if owns(r, n)]
    for bp, lines in media.items():
        mine = [to_webflow(l) for l in lines if owns(l, n)]
        if mine:
            rules.append(f"@media screen and (max-width: {bp}px) {{ {' '.join(mine)} }}")
    if n != "head":
        # Webflow drops classes that carry no styles, so every section class gets a base rule.
        rules.insert(0, f".section_{n} {{ position: relative; }}")
    chunks.append({"name": n, "css": " ".join(" ".join(rules).split()), "html": sections.get(n, "")})

out = pathlib.Path(__file__).with_name("home.json")
out.write_text(json.dumps(chunks, ensure_ascii=False, indent=1))
for c in chunks:
    print(c["name"], len(c["css"]), len(c["html"]))
