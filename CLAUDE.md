# PlusMinus Studios — Claude Code Build Spec

Oct 29, 2026 · @Sam Bohlen

## Context, goal and inputs

You (Claude Code) are redesigning and rebuilding the PlusMinus Studios website directly in the owner's existing Webflow project. There is no Figma file: you design in Webflow, starting from the current site and the Design Brief, and the owner reviews and requests revisions at set checkpoints.

PlusMinus is a new Perth web design studio. The site must win Perth business clients (new sites and redesigns) and be strong enough to submit to Awwwards. It also becomes the reusable component and animation toolkit for future PlusMinus client builds.

**Inputs, in order of authority**

| # | Input | What it decides |
| --- | --- | --- |
| 1 | The owner's feedback in chat | Overrides everything below |
| 2 | PlusMinus Studios — Website Design Brief | Concept, visual direction, motion, page structure, copy direction |
| 3 | This build spec | Technical structure, naming, code, build order, review process |
| 4 | The live Webflow project | Existing styles, components, CMS, content and the brand base to evolve |
| 5 | Screenshots of the current site (Home, Services, Projects, 2 case studies, Pricing, Insights, an article, Contact) | Reference for what exists today |

When the brief is silent, extend the current site's look rather than inventing a new direction, and note the decision in the design log (see Designing without Figma).

## Working rules

You are editing the owner's live project, so protect what exists.

- **Back up first.** Before any change, ask the owner to create a Webflow site backup (or confirm one exists). Note its date in your first report.
- **Build new pages alongside the old ones.** Create new pages with a `v2-` prefix in the page name (e.g. `v2 Home`, slug `/v2`), set to noindex, until launch. Don't delete or overwrite existing pages, styles in use, or CMS items.
- **Never publish to the custom domain** without the owner's explicit approval in chat. Publishing to the webflow.io staging domain for review is fine; tell the owner each time.
- **Work in checkpoints** (see Build order). Stop at each one and wait for feedback before continuing.
- **No invented content.** Use existing copy, the brief's copy direction, or a marked placeholder `[COPY NEEDED: …]`.
- **No fake stats, testimonials or client logos.** Concept projects carry a visible "Concept" label.
- **Keep custom code in a repo**, versioned, not only pasted into Webflow.
- **Ask before** adding paid services, third-party scripts, or anything needing an account or API key.
- **Keep a design log** (`DESIGN-LOG.md` in the repo) of every design decision the brief didn't specify.

## Designing without Figma

You are the designer as well as the developer. Aim for Awwwards-level editorial design, not a polished template: a safe, generic layout is a failure even if it's bug-free.

**How to make design decisions**

1. **Start from what exists.** Keep the current wordmark, ± icon, dark palette and display typeface. Evolve them using the brief's Visual direction (bigger type, stricter grid, one accent colour).
2. **Design the hard parts first.** Before building a whole page, build the hero and one signature section, review, then extend the system to the rest.
3. **Offer options where the brief is open.** For the accent colour, headline and hero composition, build 2 variants (e.g. on `v2 Home` and `v2 Home B`) for the owner to choose from.
4. **Make bold layout choices:** oversized type (hero 160–220px desktop), asymmetric compositions on the 12-column grid, generous whitespace (160–200px between sections), type and image overlapping where it adds tension.
5. **One idea everywhere:** every section should express + (add) or − (remove). If a section doesn't, question whether it needs to exist.
6. **Reuse, don't redesign.** Once a component is approved, use it everywhere it fits.

**Check your own work visually**

You can't judge a design you haven't seen. After building each section, view the staging page in a browser (via a browser or screenshot tool, if available) at 1440px and 390px, compare against the brief, and fix obvious issues before reporting. If you can't take screenshots, say so and ask the owner to send them.

**The review loop**

At each checkpoint, send the owner:

- The staging link and which pages or sections changed
- Screenshots at desktop and mobile, if you can take them
- Design decisions made since the last checkpoint (from the design log)
- Any choices you want the owner to make (with your recommendation)

Then apply feedback before moving on. Expect 2–3 revision rounds on the Home page; later pages should need fewer because they reuse approved components.

## Tech stack & constraints

| Layer | Choice | Notes |
| --- | --- | --- |
| Site builder & CMS | Webflow (owner's existing project) | Structure, styles, CMS, forms, hosting |
| Webflow access | Webflow's official MCP server (OAuth) + the MCP Bridge App open in the Designer | Owner authorises the site; the Bridge App must be running in the Designer for canvas edits |
| Visual checks | A browser or screenshot tool, if available | Used to view staging at 1440px and 390px |
| Animation | GSAP 3 core + ScrollTrigger, SplitText, Flip | GSAP and its plugins are free; use Webflow's built-in GSAP where possible, else a pinned CDN version |
| Smooth scroll | Lenis | Synced with ScrollTrigger; off for reduced motion |
| Hero field | Canvas 2D | Not DOM nodes; device-pixel-ratio aware |
| Page transitions | Barba.js or a lightweight fetch-and-swap | Must re-init Webflow interactions and forms after swap |
| Custom code | GitHub repo, Vite build to one bundle, served from jsDelivr (pinned to a tagged release) | Webflow custom code fields only hold script tags and config |
| Analytics | GA4 with events for form submits and price builder use | Owner provides the measurement ID |

**Constraints**

- Custom code requires a paid Webflow Site plan; confirm the plan before starting.
- The MCP server can't do every Webflow action. When a step must be done by hand, give the owner short, exact instructions.
- Webflow custom code fields have character limits, so ship JS as an external bundle.
- All content lives in the Webflow DOM (SEO and editability). JS only enhances.
- JS budget: under 150KB gzipped of custom code.
- Guard code so it doesn't run inside the Webflow Designer or Editor.

## Webflow structure

Audit the current project's classes and styles first, then move to the Client-First naming convention for all new work so every PlusMinus build shares one system. Leave old classes in place until the v2 pages replace the old ones; clean up unused styles at launch.

**Page skeleton**

`page-wrapper` → `main-wrapper` → `section_[name]` → `padding-global` → `container-large` → `padding-section-large` → content.

**Variables** (create in Webflow Variables, based on the brief's Visual direction and the current site's colours and fonts)

| Collection | Examples |
| --- | --- |
| Colour | `color/ink`, `color/graphite`, `color/line`, `color/bone`, `color/mid`, `color/signal` |
| Typography | `font/display`, `font/body`, `font/mono`; sizes `text/12` … `text/160` |
| Spacing | `space/8`, `16`, `24`, `32`, `48`, `64`, `96`, `160`, `200` |
| Radius | `radius/8`, `radius/12` |

**Components** (Webflow Components with props)

Nav (with Perth clock slot), Footer (with Acknowledgement of Country), Button (primary / secondary / text, with ± icon), Section heading, Service row, Work card, Case study +/− list, Price builder, CTA block, Marquee, Article card, Form field set.

**Animation hooks:** attach JS with `data-pm-*` attributes, never class names. Examples: `data-pm-reveal="lines"`, `data-pm-marquee`, `data-pm-cursor="view"`, `data-pm-pin="subtraction"`, `data-pm-price-item`. Adding an attribute is then enough to reuse an animation on any element.

## CMS collections

Inspect the existing collections first. Add fields to them rather than creating duplicates, and list any field you'd rename for the owner to approve.

**Projects** (case studies; extend the existing collection)

| Field | Type | Notes |
| --- | --- | --- |
| Name, Slug | Plain text | Keep existing slugs |
| Client | Plain text |  |
| Industry | Option | Hospitality, Trades, Retail, Health, Professional, Real Estate, Construction |
| Is concept | Switch | Shows the "Concept" label |
| Services | Multi-reference → Services |  |
| Year | Number |  |
| Live URL | Link |  |
| Summary | Plain text | Card and meta description |
| Hero image, Hero video | Image, Video link |  |
| Brief | Rich text |  |
| What we removed | Rich text (bulleted) | Rendered with − bullets |
| What we added | Rich text (bulleted) | Rendered with + bullets |
| Gallery | Multi-image |  |
| Results | Rich text | Real numbers only; hidden if empty |
| Featured, Order | Switch, Number | Home gallery control |

**Services:** Name, Slug, Short description, Icon, Intro, Included (rich text), Process notes, Price from (number), FAQs (rich text), SEO title, SEO description.

**Articles** (Insights / Journal; keep existing): confirm Category (Web Design, SEO, Social Media), Read time, Summary, Thumbnail, Body; add Related articles (multi-reference).

**Price items** (new; feeds the price builder): Name, Group (Base / Add-on / Monthly), Type (Toggle / Quantity), Price, Price max (optional), Description, Order.

## Existing content to keep or change

The current project has: Home, Services, Projects, Pricing, Insights, Contact, 4 case studies and 3 articles.

| Content | Action |
| --- | --- |
| Wordmark "plusminus ±" and ± icon | Keep; reuse existing assets |
| Contact: hello@plusminusstudios.com, Instagram @plusminus\_\_studio, Perth WA | Keep; make the email domain consistent (form placeholder says .com.au) |
| Values: Clarity Over Complexity, Performance First, Honest Pricing, Long-Term Thinking | Keep themes; tighten copy per the brief's Copy direction |
| Process: Discover, Design & Build, Launch & Grow (+ 2–3 week lead time, 1:1 communication, clear milestones, SEO from day 1) | Expand into the brief's 4-step process |
| Pricing: Brochure $1,800, Ecommerce/CMS $4,000, Custom $6,000+ with feature lists | Move into Price items collection |
| Services: Websites, Branding & Strategy, SEO, Social Marketing, Hosting & Support | Move into Services collection |
| Case studies: Midlands Concrete, Verso Properties, The Middle Green, Varanasi | Keep in Projects; set "Is concept" as the owner confirms; add removed/added lists |
| Articles: Instagram Business Account 2026; Top 5 Free SEO Tips 2026; Perth Web Design Pricing 2026 | Keep as-is, keep slugs |
| Headline "Perth Web Design That Drives Growth" | Replace with options from the brief |
| Stats "100+ Projects" and "+40% Lead Conversion" | **Remove** |
| Stock images (laptops, phones, analytics screens) | Replace; use marked placeholders until the owner supplies photography |

Keep all existing URLs working: if a slug changes (e.g. `/projects/*` → `/work/*`), add a 301 redirect in Webflow hosting settings.

## Animation code architecture

One repo, one bundle, modules that start from `data-pm-*` attributes on each page load and clean up on page transition.

```
plusminus-site/
  src/
    main.js            // boot: reduced-motion check, Lenis, register plugins, router
    core/
      lenis.js
      transitions.js   // ± wipe, re-init after swap
      cursor.js
      loader.js
    modules/
      pm-field.js      // hero canvas
      subtraction.js   // pinned story
      price-builder.js
      reveal.js        // lines / fade / clip
      marquee.js
      work-gallery.js
      clock.js         // AWST
    utils/ (mm.js, dom.js, analytics.js)
  vite.config.js
  CLAUDE.md            // this spec
  DESIGN-LOG.md        // design decisions
```

Every module exports `init(root)` and returns `destroy()`; use `gsap.context()` and `gsap.matchMedia()` for cleanup and breakpoints.

**Module specs**

| Module | Hook | Behaviour | Reduced motion / mobile |
| --- | --- | --- | --- |
| pm-field | `data-pm-field` | Canvas grid of + marks (\~40px spacing). Within \~140px of the pointer, marks rotate toward − (90°) and scale; ease back over 0.6s. Intro: marks converge into the ± logo, then disperse as the headline reveals. Pauses off-screen. | Static grid; on touch, a slow ambient wave |
| subtraction | `data-pm-pin="subtraction"` | Pinned \~300vh. Removes cluttered layers of a fake bad website one by one, each with a − badge and a counter (load time, word count), then builds clean layers in with + badges. | Before/after images side by side |
| price-builder | `data-pm-price-item` | Reads Price items from CMS markup. +/− buttons toggle items or change quantity; total tweens; summary list uses Flip. "Send me this quote" fills a hidden form field and submits. GA4 event per change. | Same logic, no tweens |
| transitions | global | On internal link click: + scales from the click point to cover the screen (0.6s), swap content, collapse into a − line that wipes off (0.5s). Re-init modules and Webflow IX/forms. | Instant swap or quick fade |
| cursor | global, `data-pm-cursor` | Small + follows the pointer with lag. States: link (grow), `view` (− with label), `close` (rotate to ×). | Off on touch and reduced motion |
| reveal | \`data-pm-reveal="lines | fade | clip"\` |
| work-gallery | `data-pm-gallery` | Horizontal pinned scroll on desktop; hover plays a muted preview video. | Vertical stack |
| marquee | `data-pm-marquee` | Infinite loop; speed reacts to scroll velocity. | Static row |
| clock | `data-pm-clock` | Perth time (Australia/Perth), updates each minute. | Same |
| loader | global | ± draws in under 1.2s, first visit per session only. | Skipped |

## Build order & review checkpoints

Each ★ is a checkpoint: stop, send the review package (see Designing without Figma) and wait for the owner's feedback.

1. **Setup:** confirm Webflow plan and MCP access, confirm a backup exists, audit the current project (pages, classes, variables, CMS), create the repo, Vite build, jsDelivr release, boot script loading on staging.
2. **Foundations:** variables, Client-First base classes, type scale, buttons, Nav and Footer. ★ *Checkpoint 1: style tile page (`v2 Styleguide`) showing colours (2 accent options), type, buttons, nav, footer.*
3. **Home hero:** ± field hero with 2 headline/composition variants. ★ *Checkpoint 2: choose the hero direction.* This sets the visual tone for everything else.
4. **Rest of Home (static):** all sections from the brief, desktop and mobile, no scroll animation yet. ★ *Checkpoint 3: layout and copy review.*
5. **Home motion:** Lenis, reveals, cursor, loader, marquee, clock, subtraction story, work gallery. ★ *Checkpoint 4: motion review* (screen recording if possible).
6. **CMS:** extend Projects, Services, Articles; create Price items; enter content; redirects plan.
7. **Pricing + price builder**, wired to forms and GA4. ★ *Checkpoint 5.*
8. **Templates and remaining pages:** case study, Work, Services + service pages, Process/About, Journal + article, Free Website Review, Contact, 404, plus page transitions. ★ *Checkpoint 6.*
9. **SEO pass:** meta titles and descriptions, Open Graph images, schema (LocalBusiness, Service, Article), sitemap, alt text, noindex removed from v2 pages only at launch.
10. **QA and performance** (next section). ★ *Checkpoint 7: launch approval.*
11. **Launch:** with the owner's approval, swap v2 pages into the live slugs, set redirects, archive old pages, publish.

## QA & acceptance criteria

The build is done when every box is ticked on staging.

- [ ] Every page approved by the owner at its checkpoint
- [ ] Layout holds at 1440, 1280, 991, 768, 390 and 360px (no horizontal scroll)
- [ ] Chrome, Safari (macOS and iOS), Firefox, Edge tested
- [ ] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100
- [ ] LCP under 2.5s, CLS under 0.1 on mobile
- [ ] Custom JS under 150KB gzipped
- [ ] `prefers-reduced-motion` turns off scroll-driven and cursor motion
- [ ] Keyboard navigation works everywhere, including the price builder; visible focus states
- [ ] All text readable with JavaScript disabled
- [ ] No console errors; modules clean up on page transitions
- [ ] Forms submit and notify the owner; GA4 events fire
- [ ] Old URLs redirect correctly; no broken links
- [ ] No fake stats or testimonials; concept projects labelled
- [ ] Owner can edit copy and CMS items in the Webflow Editor without touching code
- [ ] Old pages and unused styles archived or removed only after launch

## Open questions

The owner answers these during Setup; Claude Code asks for any that are still open.

- [ ] Which Webflow Site plan is the project on (custom code needs a paid plan)?
- [ ] Has the Webflow MCP server been authorised for this site, and is the Bridge App installed?
- [ ] Is a GitHub account available for the code repo?
- [ ] Final email domain: .com or .com.au?
- [ ] Accent colour (decided at Checkpoint 1) and whether to keep the current display typeface
- [ ] Prices for price builder add-ons and care plans
- [ ] Which of the four case studies are real clients and which are concepts?
- [ ] GA4 measurement ID and where form notifications should go
- [ ] Photography: when real Perth photos and a founder photo will be available

## First prompt to paste into Claude Code

Save this spec as `CLAUDE.md` and the brief as `DESIGN-BRIEF.md` in an empty project folder, add the screenshots to a `screenshots/` folder, connect the Webflow MCP server, then paste:

```
You're redesigning and rebuilding my agency website, PlusMinus Studios, directly in my Webflow project.

Read CLAUDE.md (build spec) and DESIGN-BRIEF.md (design brief) fully, and look at every image in screenshots/ to understand the current site.

Then do Milestone 1 (Setup) only:
1. Confirm you can access my Webflow site through the MCP server, and tell me what you can and can't do with it.
2. Audit the current project: pages, classes, variables, components and CMS collections. Summarise what to keep, change and remove.
3. List any open questions from CLAUDE.md you need me to answer.
4. Propose the repo setup for the custom code.

Don't change anything in Webflow yet. Stop and report back when Setup is done.
```

After that, approve each checkpoint with a short prompt such as: "Checkpoint 1 approved, go with the lime accent. Continue to the Home hero."
