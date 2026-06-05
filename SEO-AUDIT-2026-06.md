# SEO Audit — Paragliding Ölüdeniz

**Date:** 1 June 2026 · **Domain:** paragliding-oludeniz.com · **Stack:** Next.js 14 (App Router) + Supabase
**Scope:** 104 public pages (120 routes incl. /admin, /api), full codebase analysis.

---

## Overall verdict

The site is in strong technical shape. URL architecture, metadata coverage, canonicals, a dynamic Supabase-fed sitemap, breadcrumbs and keyword-targeted titles are all in place across 100+ pages. This is well above the typical small-business site.

The gains now are about **closing consistency gaps**: structured data on most pages, a working Open Graph image, homepage LocalBusiness schema, image optimisation, and removing duplicate-sitemap / legacy-URL risk. None are emergencies; together they meaningfully lift rich-result eligibility and local ranking.

**Health score: ~78/100.** Foundations are excellent; the open items are mostly "missing on N pages" rather than "broken everywhere."

---

## What's working well

- **Metadata coverage:** every public page has a `title` + `description` + canonical (`alternates.canonical`). Only the homepage relies on the inherited default (acceptable).
- **Title templates:** `%s | Paragliding Oludeniz` set in `layout.tsx` with sensible `metadataBase`.
- **Robots & sitemap:** `app/robots.ts` correctly disallows `/admin/` and `/api/`; `app/sitemap.ts` is dynamic, prioritised, and pulls published blog articles from Supabase with graceful fallback.
- **Domain consistency:** hardcoded `paragliding-oludeniz.com` matches `NEXT_PUBLIC_SITE_URL`. No mismatch.
- **Information architecture:** clean, keyword-rich, logically nested URLs (`/tandem-paragliding/sunset-flight`, `/babadag-guide/takeoff-1900m`, etc.). H1 present on every page via the shared `PageHero` / `Hero` components.
- **Some structured data already live:** FAQ + TouristAttraction on landing pages, LocalBusiness on `/about-us`, Product/Offer/AggregateRating on `/prices`, `/reviews`, `/tandem-paragliding`; Article + canonical via `generateMetadata` on `/blog/[slug]`.

---

## Priority issues

### HIGH

**1. Open Graph image is a 404.**
`layout.tsx` sets `openGraph.images: ['/og-image.jpg']`, but `public/` is empty — the file does not exist. Every social/WhatsApp/Slack share currently renders with a broken or blank preview. The site *does* have a dynamic `app/opengraph-image.tsx`, which Next.js would otherwise use automatically.
**Fix:** either delete the static `images` line in `layout.tsx` (let the dynamic route handle it) **or** add a real `public/og-image.jpg` (1200×630). Pick one.

**2. No LocalBusiness schema on the homepage.**
For a location-based booking business, homepage `LocalBusiness` / `TouristAttraction` JSON-LD (with `geo`, `address`, `priceRange`, `aggregateRating`, opening hours) is the single highest-value structured-data win for local/maps visibility. Currently it only exists on `/about-us`.
**Fix:** add a `LocalBusiness` JSON-LD block to `app/page.tsx`.

**3. ~78 pages have no JSON-LD structured data.**
Most guide/service/transfer pages (weather-guide, thermals-guide, training, transfers, pilot-services, paramotor, cross-country, groups, etc.) ship no schema, so they're ineligible for FAQ / Article / Service / Breadcrumb rich results.
**Fix:** add `BreadcrumbList` sitewide (cheap, high coverage) + `FAQPage` on any page with a Q&A section + `Service` on service pages.

**4. Image SEO / performance gaps.**
6 of 14 image tags have no `alt`; 9 of 14 are raw `<img>` instead of `next/image` — meaning no automatic lazy-loading, responsive sizing, or modern formats. This hurts both accessibility and LCP / Core Web Vitals.
**Fix:** convert raw `<img>` to `next/image`; add descriptive, keyword-aware `alt` text everywhere.

### MEDIUM

**5. 60 page titles exceed ~60 characters** (up to 72). Google truncates these in results, cutting off the trailing keyword/location. Tighten to ≤60 chars where the brand suffix pushes them over.

**6. Two competing sitemap systems.** Both `app/sitemap.ts` (the live, dynamic one) and `next-sitemap.config.js` exist. The latter can generate a conflicting static `sitemap.xml` / `robots.txt` at build. Keep `app/sitemap.ts` and remove `next-sitemap` (config + postbuild script) to avoid duplicate/contradictory directives.

**7. Legacy duplicate URLs.** `/babadag-road-guide` duplicates `/babadag-guide/babadag-road-guide`, and `/babadag-teleferik` duplicates `/babadag-guide/babadag-teleferik`. Both legacy versions are still in the sitemap. This risks duplicate-content dilution.
**Fix:** 301-redirect the legacy paths to the canonical nested versions (in `next.config.js`), and drop them from the sitemap.

**8. `public/` is empty.** No favicon variants, `apple-touch-icon`, or static OG/social assets (only `app/icon.svg`). Add a full favicon set and the OG image.

### LOW

- Homepage has no explicit `metadata` export — add one with its own canonical (`https://paragliding-oludeniz.com/`) and a tailored description rather than inheriting silently.
- Internal linking is healthy (breadcrumbs + contextual links). Consider adding a few cross-cluster links (e.g. weather-guide → tandem booking CTA) to push link equity toward money pages.

---

## Recommended action order

1. Fix the OG image (delete static ref or add file) — 5 min, stops broken social previews today.
2. Add homepage `LocalBusiness` schema — biggest local-SEO lever.
3. Add sitewide `BreadcrumbList` + `FAQPage` schema to the ~78 bare pages.
4. Convert raw `<img>` → `next/image` and add all `alt` text.
5. Remove `next-sitemap`; 301-redirect the two legacy URLs.
6. Trim the 60 over-length titles.

---

*Method: static analysis of all 104 public `page.tsx` files plus `layout.tsx`, `robots.ts`, `sitemap.ts`, `next-sitemap.config.js`, shared components, and `public/`. No live crawl / PageSpeed run — recommend a follow-up Lighthouse + Search Console check once the above ship.*
