# Webflow audit (Milestone 1)

Read-only audit of the **Plusminus Studio** Webflow site, 29 Oct 2026. Nothing in Webflow was changed.

- Site ID `6972414552ea3ed0d1385f71`, short name `plusminus-studio-a7d432`, timezone Australia/Perth
- Last published 29 Oct 2026 05:22 UTC
- **No custom domain.** The only live address is `plusminus-studio-a7d432.webflow.io`, so "staging" and "live" are currently the same site
- One locale (English). A second site in the workspace, *Albatross Lounge*, is untouched

## MCP access

| Works without the Designer open | Needs the MCP Bridge App open in the Designer |
| --- | --- |
| Sites, pages and page SEO, publish | Selecting elements, switching pages or canvases |
| CMS collections, fields and items | Element snapshots (visual checks of a section) |
| Variables, styles, components, forms, fonts, assets | |
| Reading and editing page elements | |
| Custom code (register and apply scripts) | |
| Webflow interactions (IX3) | |

Not available on this site's plan: sitemap indexing controls (API returned "Site plan doesn't support sitemap indexing controls"). Page branching is untested; it needs an Enterprise plan.

The Designer connection was not running during the audit.

## Pages

| Page | Path | Notes |
| --- | --- | --- |
| Home | `/` | Navbar, 9 sections, footer |
| Services | `/services` | Static content |
| Projects | `/projects` | Static page with a collection list |
| Pricing | `/pricing` | Static; packages are hard-coded |
| Insights & Resources | `/insights-resources` | |
| Contact | `/contact` | Enquiry form |
| Projects template | `/project/{slug}` | Collection slug is `project` (singular) |
| Insights template | `/insights-resources/{slug}` | |
| Proposals template | `/proposals/{slug}` | Not in the build spec, see Risks |
| 404, Password (401) | utility | |

Every main page has an SEO title, description and Open Graph image. The OG image is the same asset (`698181f5…`) on every page.

## CMS

### Projects (`project`): 4 items, all published

| Existing field (slug) | Maps to spec | Action |
| --- | --- | --- |
| Project Title (`name`), Slug | Name, Slug | Keep slugs |
| Client (`client`) | Client | Keep |
| Industry (`industry`, plain text) | Industry (Option) | Field types can't be changed. Either add a new Option field and migrate, or keep plain text. Current values: Construction, Real Estate, Ecommerce, Premium Dining. The last two aren't in the spec's list |
| Project Description (`project-description`) | Summary | Keep; rename the label only |
| Main Project Image (`main-project-image`) | Hero image | Keep |
| Project Subheading (`project-summary`) | (case study headline) | Keep |
| Project Brief (`project-details`) | Brief | Keep |
| Image One, Image 2–5 | Gallery (multi-image) | Add Gallery, copy images in, keep the old fields until launch |
| Project Outcome (`services-rendered`) | (outcome narrative) | Keep. It isn't Results, which needs real numbers |
| Featured Project? (`featured-project`) | Featured | Keep. All 4 are currently off |
| Client Logo, Color | — | Keep |
| — | Is concept, Services, Year, Live URL, Hero video, What we removed, What we added, Results, Order | Add |

The item content says Midlands Concrete was built on WordPress and Verso on YOOtheme/ZOO, so those read as real client work. Each item's "Is concept" status still needs confirming.

Item slugs: `midlands-concrete`, `verso-properties`, `the-middle-green-website-redesign`, `varanasi-indian-restaurant`.

### Insights & Resources (`insights-resources`): 3 items

| Existing field | Maps to spec |
| --- | --- |
| Blog Title, Slug | Name, Slug |
| Category (plain text: Social Media / SEO / Web Design) | Category ✓ |
| Read Time (`read-time-2`) | Read time ✓ |
| Blog Excerpt (`post-summary`) | Summary ✓ |
| Thumbnail image, Main Image | Thumbnail ✓ |
| Post Body | Body ✓ |
| Featured?, Color, Date Created, Multiple Images | Keep |
| — | Related articles (multi-reference): add |

The Instagram article is marked **Draft** in the CMS even though it shows on the live Home page. Check that it stays published.

### Proposals (`proposals`): 1 item

A client proposal template with a quote, hosting price and next steps. It is not in the build spec and will not be touched.

### Missing (to create in Milestone 6)

Services and Price items.

## Design system

- **Fonts:** Cal Sans 400 (display) and DM Sans Variable plus italic (body), all uploaded as `.ttf`. Converting them to `.woff2` will help load speed.
- **Variables:** One collection ("Variable collection") with 5 colours: Black `hsl(0 0% 9.8%)` ≈ #191919, Dark Grey ≈ #373737, Mid Grey #8B8B8B, Light Grey #EEEEEE and White. A second collection ("Base collection") is empty. There are no type, spacing or radius variables, and no accent colour.
- **Classes:** 398 in total, made up of 290 global, 106 combo and 2 tag classes.
  - 203 are auto-named (`Div Block 45`, `Collection List 3` …).
  - The rest are a mix of kebab-case, snake_case and camelCase (`btn-primary`, `projects_grid`, `projectCard`, `;eft`).
  - No Client-First structure exists yet. Leave them all in place; v2 uses new Client-First classes.
- **Components:** `navbar` (8 instances), `footer` (9) and `contact_form` (2, on Home and Contact). None have props.
- **Interactions:** none. **Custom code:** none, neither site-wide nor registered scripts. The site is a clean base for the bundle.
- **Breakpoints:** not read; that needs the Designer.

## Forms

There is one `Enquiry Form` inside the `contact_form` component, used on Home and Contact. Its fields are Name, Email, Company, an unnamed "dropdown" (project type) and Message.

- The Email placeholder says `hello@plusminusstudios.com.au`
- Message is a single-line text input rather than a textarea
- There is no redirect after submitting, and no confirmation email
- The notification address isn't readable through the API

## Keep / change / remove

**Keep:** wordmark and ± icon, Cal Sans + DM Sans, the dark palette, all CMS items and slugs, page SEO copy as a starting point, the Proposals collection.

**Change:**
- Rebuild nav and footer as new components with props: clock slot, Acknowledgement of Country, Contact link
- Rebuild the form as a component, with a named project-type field and a textarea
- Industry becomes an Option field
- Image fields become a Gallery
- Move pricing and services into the CMS
- Make the email domain consistent
- Use a separate OG image per page

**Remove (at launch, not before):** the "100+ Projects / +40% Lead Conversion" stats, stock images, old classes and old components.

## Risks / decisions for the owner

1. **The live site is the staging site.** With no custom domain, anything published to webflow.io is public. v2 pages must stay draft or noindex, and every publish needs care.
2. **A client proposal is public.** `/proposals/awmn-girls-torque` is published and includes the quote. Consider password-protecting the Proposals template or moving proposals off the public site.
3. **Plan.** The plan can't be read through the API. Custom code (for the animation bundle) and 301 redirects both need a paid Site plan.
4. **Backup.** None was confirmed before this audit. One is needed before any change.
5. **URL scheme.** Moving `/project/*` to `/work/*` or `/insights-resources/*` to `/journal/*` needs 301 redirects, which need a paid plan.
