# Redirects plan

Every current URL keeps working at launch. Where a URL changes, a 301 goes in
Webflow → Site settings → Publishing → 301 redirects. Nothing here is live yet:
redirects are added on launch day (Milestone 11), after the v2 pages take over
the live slugs.

Webflow redirect rules support wildcards: `(.*)` in the old path and `%1` in the
new one.

## Proposed URL structure

The brief's nav is Work, Services, Pricing, Process, Journal. The current URLs
are Projects and Insights & Resources. The owner approved matching the nav (30 Oct 2026).

| Page | Current URL | New URL | Redirect |
| --- | --- | --- | --- |
| Home | `/` | `/` | none (v2 replaces it at launch) |
| Work index | `/projects` | `/work` | `/projects` → `/work` |
| Case study | `/project/{slug}` | `/work/{slug}` | `/project/(.*)` → `/work/%1` |
| Services index | `/services` | `/services` | none |
| Service page | (new) | `/services/{slug}` | none |
| Pricing | `/pricing` | `/pricing` | none (v2 currently previews at `/pricingv2`) |
| Process / About | (new) | `/process` | none |
| Journal index | `/insights-resources` | `/journal` | `/insights-resources` → `/journal` |
| Article | `/insights-resources/{slug}` | `/journal/{slug}` | `/insights-resources/(.*)` → `/journal/%1` |
| Free Website Review | (new) | `/free-website-review` | none |
| Contact | `/contact` | `/contact` | none |
| 404 | `/404` | `/404` | none |
| Proposals | `/proposals/{slug}` | unchanged | none (owner to decide on password protection) |
| Price items (unwanted template pages) | `/price-items/{slug}` | none | `/price-items/(.*)` → `/pricing` |

Item slugs (`midlands-concrete`, `perth-web-design-pricing-…` etc.) do not change.

## Launch-day steps (manual, in Webflow)

1. Rename the collection URLs: Projects `project` → `work`, Insights & Resources
   `insights-resources` → `journal` (CMS → collection settings → Collection URL).
   This can't be done through the API.
2. Rename the static pages: Projects slug `projects` → `work` (or retire it for
   v2 Work), Insights & Resources slug → `journal`.
3. Add the four redirects from the table.
4. Publish, then check each old URL returns a 301 to the new one, including one
   article and one case study.
5. Update internal links on v2 pages that point to the old paths (`/projects`,
   `/insights-resources`). Collection links update automatically.

## Housekeeping

- The new Services and Price items collections each get a template page
  (`/services/{slug}`, `/price-items/{slug}`). Services pages are wanted. Price
  items pages are not: before launch, set the Price items template to noindex,
  or add a redirect `/price-items/(.*)` → `/pricing`.
- If the owner prefers to keep `/projects` and `/insights-resources`, skip steps
  1–3. The nav labels can still say Work and Journal.
