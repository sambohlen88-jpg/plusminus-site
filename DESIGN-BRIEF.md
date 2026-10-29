# PlusMinus Studios — Website Design Brief

Oct 29, 2026 · @Sam Bohlen

## Overview & objectives

The new PlusMinus Studios site must win Perth small and medium businesses that need a new website or a redesign, and it must look good enough to be considered by Awwwards. It replaces the current Webflow site, which is clean but reads as a template.

**The site has three jobs:**

1. **Prove the craft.** The site itself is the portfolio piece. A prospect should feel the quality within 3 seconds.
2. **Earn trust without a client list yet.** Lead with honesty, process, concept work and a free review rather than borrowed stats.
3. **Generate qualified enquiries.** Primary conversion: Free Website Review requests. Secondary: price builder submissions and contact form.

**Success measures (first 6 months after launch):**

- First 3 Perth clients signed, at least one with a published case study
- Free Website Review requests as the main lead source
- Lighthouse performance 90+ on mobile, despite the motion
- An Awwwards Honorable Mention submission (and CSSDA / Godly as easier first targets)

**Also a system:** this build becomes the PlusMinus component and animation toolkit reused on client sites through the Figma → Claude Code → Webflow workflow.

## Pre-launch fixes

Credibility comes before any animation. Fix these on the current site now, and carry the rules into the new one.

| Issue | Why it matters | Fix |
| --- | --- | --- |
| "100+ Projects Completed" and "+40% Lead Conversion" | Not true yet; risks misleading-claims issues under Australian Consumer Law and kills trust when a prospect asks for references | Remove. Replace with true statements: "Perth-based", "Fixed-price quotes", "Reply within 1 business day" |
| All four case studies are UK businesses (£ pricing, Derby, Birmingham) | Undercuts a Perth-first pitch | Label any spec work as "Concept". Add Perth concept projects (see Work page) |
| Email shown as .com, placeholder as .com.au | Looks careless | Pick one domain and use it everywhere |
| Generic stock photos (laptops, phones) | Signals template | Replace with real Perth photography, product screenshots, and motion |
| Generic headline "Perth Web Design That Drives Growth" | Identical to competitors | Use the + / − concept copy (see Copy direction) |

## Brand concept: Add what matters. Remove what doesn't.

Every design and motion decision expresses one idea: **+ is what we add, − is what we take away.**

| + We add | − We remove |
| --- | --- |
| Enquiries and bookings | Bloat, plugins, clutter |
| Speed (sub-2s loads) | Jargon and hidden fees |
| Clarity and hierarchy | Slow, confusing journeys |
| Local search visibility | Lock-in contracts |
| Ownership (you can edit it yourself) | Agency runaround |

**Rules for applying it**

- The ± mark is the hero of the brand, not decoration. It appears as the cursor, the loader, the page transition, list bullets and buttons.
- Every animation must either *add* (build, reveal, grow) or *subtract* (strip, collapse, fade out). No motion without meaning.
- Copy is written in pairs where it helps: a plus and a minus.
- Restraint is part of the message. Motion is bold in 4 or 5 signature moments and quiet everywhere else.

## Audience & Perth positioning

The core buyer is a Perth business owner with an outdated or DIY site who feels ignored or overcharged by big agencies.

| Segment | What they need to hear | Likely package |
| --- | --- | --- |
| Trades & services (builders, electricians, landscapers) | More calls and quote requests, found on Google in their suburbs | Brochure |
| Hospitality (cafés, bars, restaurants, venues) | Bookings, menus that work on mobile, a site that matches the venue's vibe | Brochure / CMS |
| Health & wellness (physios, clinics, gyms, studios) | Online booking, trust, local SEO | Brochure / CMS |
| Retail & product brands | Online sales, Shopify-quality ecommerce | Ecommerce / CMS |
| Professional services (accountants, real estate, consultants) | Credibility and a premium first impression | Brochure / Custom |

**Positioning line:** a Perth studio that builds websites at the level of the best east coast agencies, with fixed prices and someone you can actually meet for a coffee.

**Perth signals to build into the site**

- Live AWST clock in the nav ("Perth, 12:45pm") with an "In your timezone" note
- A suburb marquee: Fremantle, Subiaco, Joondalup, Leederville, Mount Lawley, Scarborough, Osborne Park, Midland, Rockingham, Cottesloe
- Acknowledgement of Country in the footer: Whadjuk Noongar people, Boorloo
- Real Perth photography in the work and about sections (local light, coastline, streetscapes) instead of stock
- Local SEO landing pages per service and region (see SEO section)
- Avoid clichés: no quokkas, no Swan River sunsets as hero images

## Visual direction

Keep the existing dark, monochrome base and the wordmark, then push it further: bigger type, a stricter grid, one accent colour used sparingly.

**Colour**

| Token | Value | Use |
| --- | --- | --- |
| Ink | #0E0E0E | Main background |
| Graphite | #1A1A1A | Cards, nav, secondary surfaces |
| Line | #2E2E2E | Borders, dividers, grid lines |
| Bone | #F2F0EB | Light sections, text on dark |
| Mid grey | #8A8A8A | Secondary text |
| Signal (accent) | Choose one: #D4FF3A acid lime, or #FF4D1F Perth-sun orange | + marks, hover states, active filters, one CTA |

The accent appears only on + / − marks and the single primary action per screen.

**Typography**

- Display: keep the current tight geometric grotesk, set much larger (hero 160–220px on desktop, letter-spacing −4%). Alternatives to test: Neue Montreal, PP Neue Machina, General Sans.
- Body: a neutral grotesk at 16–18px, line-height 1.5.
- Mono: for labels, the clock, numbers and metadata (e.g. JetBrains Mono or PP Supply Mono).
- Type scale: 12 / 14 / 16 / 20 / 28 / 40 / 64 / 96 / 160.

**Grid & layout**

- 12-column grid, 1440px max content width, 24px gutters, 40px outer margin (16px on mobile).
- Visible hairline grid lines in some sections, echoing the + crosshair.
- Generous vertical rhythm: 160–200px between major sections on desktop.

**Imagery**

- Real Perth photography, slightly desaturated with deep blacks.
- Website work shown as full-bleed screen recordings and device-free mockups, not stock laptops.
- Rounded corners kept small (8–12px) for a sharper, more editorial look than the current site.

## Motion & interaction

Five signature moments carry the site; everything else uses a small, consistent set of reveals. Built with GSAP (ScrollTrigger, SplitText, Flip) and Lenis smooth scroll.

**Signature moments**

| # | Moment | Where | What happens |
| --- | --- | --- | --- |
| 1 | ± field hero | Home | Full-screen grid of small + marks. Near the cursor they rotate 90° into −, then settle back. On load they converge into the ± logo, then disperse as the headline types in with SplitText. |
| 2 | The Subtraction | Home, Services | Pinned scroll section. A cluttered fake website (pop-ups, 6 fonts, a spinner, stock photos) gets stripped piece by piece, each removal marked with a − and a counter ("−3.2s load time"). Then the clean version builds in with + marks. |
| 3 | +/− price builder | Pricing, Home teaser | Features added and removed with + and − buttons. The total counts up and down; a summary list animates with Flip. |
| 4 | ± page transition | All pages | The + mark scales from the click point to fill the screen, the next page loads beneath, and the mark collapses into a − line that wipes away. |
| 5 | Work gallery | Home, Work | Horizontal pinned scroll on desktop; images unmask with a clip-path reveal; project names in a large marquee. |

**Supporting system**

- **Cursor:** a small + that grows over interactive elements, flips to − over images ("view"), rotates 45° into × on close buttons. Hidden on touch devices.
- **Loader:** + and − mark draws in, under 1.2s, first visit only.
- **Text reveals:** lines rise from a mask, 0.8s, ease `power3.out`, stagger 0.08s.
- **Hover:** buttons swap their + icon for → ; links get an underline that draws from left.
- **Numbers:** count-up on scroll for any real stats.

**Motion rules**

- Durations 0.4–1.2s; one easing family (`power3` / `expo`).
- Respect `prefers-reduced-motion`: replace all scroll-driven motion with simple fades.
- Mobile: keep the hero and transitions, simplify the pinned sections to vertical sequences.
- No animation may delay content: text is in the HTML and readable without JavaScript.

## Sitemap

&#91;embedded content: sitemap · 8 top-level pages, 3 CMS collections\]

Nav order: Work, Services, Pricing, Process, Journal, with Free Website Review as the nav button. Contact and the review page are linked from every footer and CTA block.

## Page-by-page structure

### Home

1. **Nav:** wordmark, links (Work, Services, Pricing, Process, Journal), live Perth clock, primary CTA "Free Website Review".
2. **Hero:** ± field animation. Headline: "+ Enquiries − Excuses." Sub: Perth web design studio, fixed prices. CTAs: Free Website Review / See the work.
3. **Suburb marquee** (thin band).
4. **The Subtraction** pinned scroll story.
5. **Selected work:** horizontal gallery, concept work labelled.
6. **Services:** four rows (Websites, Ecommerce, Branding, SEO & Social) that expand on hover with a short list and a link.
7. **Price builder teaser:** three toggles and a live total, link to full builder.
8. **Process:** Discover → Design → Build → Grow, each with a timeframe.
9. **Values / promises:** four short pairs (e.g. "+ Fixed price − Surprise invoices").
10. **Journal:** latest 3 articles.
11. **Big CTA:** "What should we add? What should we remove?" → Free Website Review form.
12. **Footer:** giant ± wordmark, contact, Instagram, Acknowledgement of Country, sitemap.

### Work (index)

- Filterable grid (All / Hospitality / Trades / Retail / Health / Concept).
- Hover: video preview plays. Click: ± transition into case study.

### Case study template (CMS)

Hero (client, industry, services, year, live link) → The brief → What we removed (− list) → What we added (+ list) → Design gallery (full-bleed screens, mobile + desktop) → Results (real numbers only, or omitted) → Next project.

The +/− lists are a CMS field pair so every case study carries the concept.

### Services

One overview page plus a page per service (Web Design, Ecommerce, Branding, SEO, Social, Hosting & Care). Each: problem → what's included → process → price from → FAQs → CTA.

### Pricing

Full +/− price builder (see Lead generation), the three base packages as starting points, care plans (monthly hosting and support), FAQs.

### Process / About

Who's behind PlusMinus (founder photo, Perth story), the four steps with timelines, what you can expect (communication, ownership, handover), tools used.

### Journal (CMS)

Keep the existing articles. Index with category filter; article template with reading progress bar, table of contents, related posts, CTA block.

### Free Website Review

Dedicated landing page: what you get (a 5-minute video teardown + 1-page report within 2 business days), a sample teardown, the form (URL, name, email, business type, biggest frustration).

### Contact

Form, email, Instagram, "Coffee in Perth?" booking link, Perth clock, response promise.

### 404

"− Page. + Way home." with an interactive ± toy.

## Copy direction & tone

The voice is confident, plain-spoken and a little cheeky: a Perth local who knows the craft, not a corporate agency.

**Voice rules**

- Short sentences. Australian spelling (optimise, colour).
- Concrete promises over adjectives ("Quote in 48 hours" beats "seamless experience").
- No unverifiable claims. No "leading", "world-class", or invented stats.
- Use the +/− pairing in headlines and microcopy, but not in every sentence.

**Headline options (to test)**

- "+ Enquiries − Excuses."
- "Add what matters. Remove what doesn't."
- "Websites for Perth businesses. Less fluff, more phone calls."
- "We take things away for a living."

**Microcopy examples**

| Element | Copy |
| --- | --- |
| Primary CTA | Get a free website review |
| Secondary CTA | Build your price |
| Promise strip | + Fixed price · − Lock-in contracts · + You own it |
| Form success | Sorted. We'll be in touch within one business day. |
| Concept label | Concept project: self-initiated work to show what's possible |

**Content to rewrite from the current site:** hero, services intros, values (keep the four themes, tighten the wording), pricing intro, contact intro. Journal articles carry over as-is.

## Lead generation & conversion

The Free Website Review is the main offer: low effort for the prospect, and it shows your expertise on their own site.

**Free Website Review flow**

1. Prospect submits their URL and biggest frustration.
2. Within 2 business days you send a 5-minute screen-recorded teardown (Loom or similar) plus a one-page PDF: 3 things to remove, 3 things to add, a speed score.
3. Follow up with a price builder link pre-filled for their needs.

**+/− price builder** (based on current pricing; adjust as needed)

| Item | Type | Price (AUD, ex GST) |
| --- | --- | --- |
| Brochure base (up to 5 pages) | Base | $1,800 |
| Ecommerce / CMS base | Base | $4,000 |
| Custom application | Base | From $6,000 |
| Extra page | +/− quantity | Open question: set price |
| Copywriting | Toggle | Open question |
| Booking or enquiry integration | Toggle | Open question |
| Local SEO setup | Toggle | Open question |
| Brand identity / logo | Toggle | Open question |
| Hosting & care plan | Monthly toggle | Open question |

Output: a live estimate range, a summary list, and a "Send me this quote" button that submits the selections with the contact form.

**Other conversion points**

- First Perth case study: offer a discounted build to a local business you know (e.g. a venue you have a relationship with) in exchange for a full case study and testimonial.
- Sticky "Free review" CTA after 50% scroll on long pages.
- Every case study and article ends in a CTA block.
- Track form submissions and builder use with GA4 events and Webflow form notifications.

## SEO & performance

The site must rank for Perth web design searches and stay fast despite the motion; a slow animated site would contradict the brand.

**SEO**

- Target terms: web design Perth, website redesign Perth, Webflow developer Perth, ecommerce website Perth, small business website Perth.
- One landing page per service, plus suburb/region pages only where there is real content (e.g. Fremantle, Joondalup, Northern suburbs).
- Google Business Profile set up and linked; LocalBusiness and Service schema on relevant pages.
- Clean heading hierarchy (one H1 per page), descriptive alt text, unique meta titles and descriptions.
- Keep publishing Journal articles monthly (Perth pricing, redesign checklists, local SEO).

**Performance budget**

| Metric | Target (mobile) |
| --- | --- |
| Lighthouse performance | 90+ |
| Largest Contentful Paint | under 2.5s |
| Cumulative Layout Shift | under 0.1 |
| JS added on top of Webflow | under 150KB gzipped |
| Hero video / images | WebP/AVIF, lazy-loaded below the fold |

- Hero ± field drawn on canvas, not hundreds of DOM nodes.
- GSAP loaded once, plugins registered only where used.
- Accessible: WCAG 2.2 AA contrast, keyboard navigation, focus states, reduced-motion support.

## Figma deliverables & next steps

The Figma file should be organised so Claude Code can build from it without guessing.

**Figma file structure**

1. **Cover & brief:** link to this doc.
2. **Foundations:** colour, type and spacing as Figma variables named to match Webflow variables (e.g. `color/ink`, `space/24`).
3. **Components:** buttons, nav, cards, form fields, ± marks, marquee, CTA blocks, with variants and auto layout.
4. **Pages:** desktop 1440 and mobile 390 frames for every page and the case study template.
5. **Motion notes:** a frame per signature moment with start and end states, plus written timing (or a short Loom / prototype).
6. **Assets:** exported SVGs of the ± mark and wordmark, image placeholders named by page.

**Next steps**

- [ ] Fix the pre-launch issues on the current site
- [ ] Choose the accent colour and display typeface
- [ ] Confirm price builder add-on prices
- [ ] Approach one Perth business for a discounted first case study
- [ ] Design 2–3 Perth concept projects (café, trade, clinic)
- [ ] Design Home in Figma first, then the system, then remaining pages
- [ ] Hand the Figma file and the Claude Code build spec to Claude Code
- [ ] Launch, submit to CSSDA / Godly, then Awwwards
