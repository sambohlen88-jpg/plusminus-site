"""Webflow-ready (whtml) chunks for v2 Pricing (Checkpoint 5).

Source of truth: design/pricing-v2.html + design/pm.css. The package and add-on
rows are removed here because Webflow renders them from the Price items CMS
collection; the JS-state and rich-text rules (which Webflow classes can't
express) go to the page's top embed instead.
"""
import contextlib, io, json, pathlib, re
with contextlib.redirect_stdout(io.StringIO()):
    from home import to_webflow

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "pricing-v2.html").read_text()
css = (ROOT / "pm.css").read_text()

block = css[css.index("/* ---------- Pricing page ---------- */"):css.index("/* JS states and rich text.")]
state = css[css.index("/* JS states and rich text."):css.index("/* ---------- Styleguide page only ---------- */")]
base = [l for l in block.splitlines() if l.startswith(".")]
PREFIXES = (".pricing-hero", ".hero_promise.is-wide", ".section_builder", ".builder_", ".faq_", ".form_input.is-quote", ".hide")
media = {}
for bp in ("991", "767", "479"):
    body = css.split(f"@media screen and (max-width: {bp}px) {{\n", 1)[1].split("\n}", 1)[0]
    media[bp] = [l.strip() for l in body.splitlines() if l.strip().startswith(PREFIXES)]

def section(name):
    h = re.search(rf'\n    <section class="section_{name}".*?\n    </section>', html, re.S).group(0)
    # CMS lists replace the static rows
    h = re.sub(r'\n              <div class="builder_(bases|items)" data-pm-price-group="\w+">.*?\n              </div>(?=\n              <p class="builder_note|\n            </div>)', "", h, flags=re.S)
    return re.sub(r">\s+<", "><", h.strip())

GROUPS = {"pricing-hero": (".pricing-hero", ".hero_promise.is-wide"), "builder": (".section_builder", ".builder_", ".hide"),
          "faq": (".faq_",), "quote": (".form_input.is-quote",)}
out = []
for name, prefixes in GROUPS.items():
    own = lambda r: r.split("{")[0].strip().startswith(prefixes)
    rules = [to_webflow(r) for r in base if own(r)]
    for bp, lines in media.items():
        mine = [to_webflow(l) for l in lines if own(l)]
        if mine:
            rules.append(f"@media screen and (max-width: {bp}px) {{ {' '.join(mine)} }}")
    if not any(r.startswith(f".section_{name} ") for r in rules):
        rules.insert(0, f".section_{name} {{ position: relative; }}")
    out.append({"name": name, "html": section(name), "css": " ".join(" ".join(rules).split())})

embed_css = " ".join(to_webflow(l) for l in state.splitlines() if l and not l.startswith(("/*", "   ")))
out.append({"name": "embed-css", "css": " ".join(embed_css.split())})
pathlib.Path(__file__).with_name("pricing.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
for c in out:
    print(c["name"], len(c.get("html", "")), len(c["css"]))
