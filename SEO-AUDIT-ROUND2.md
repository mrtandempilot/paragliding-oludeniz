# SEO Audit — Round 2 (Post-Fix) · Paragliding Ölüdeniz

**Date:** 1 June 2026 · **Domain:** paragliding-oludeniz.com · 104 public pages
Follow-up to `SEO-AUDIT-2026-06.md`, after the first round of fixes shipped.

---

## Round 1 fixes — verified ✅

- **Titles:** 0 pages now exceed 60 characters (was 60). Root `title.template` no longer double-appends the brand.
- **Metadata:** every public page has a title, description, and self-canonical. None missing.
- **Schema:** every public page now emits structured data (breadcrumb/FAQ via shared components, or inline). Homepage has `LocalBusiness`; `/live-weather` now has `BreadcrumbList`.
- **OG image:** broken static `/og-image.jpg` reference removed; dynamic `opengraph-image.tsx` is the source.
- **Sitemap:** single source of truth (`app/sitemap.ts`); `next-sitemap` postbuild removed. Legacy URLs dropped.
- **Redirects:** `/babadag-road-guide` and `/babadag-teleferik` 301 → nested canonical pages.

**Health score: ~88/100** (was ~78). The remaining items are refinements, not defects.

---

## Remaining opportunities (next tier)

### MEDIUM

**1. ~11 meta descriptions exceed 160 characters** and will be truncated in results. Trim to 150–160:
`/babadag-guide/takeoff-1800m` (166), `/groups` (166), `/groups/schools` (166), `/groups/tour-operators` (176), `/blue-lagoon-paragliding` (161), `/pilot-services/gopro-video` (163), `/thermals-guide/thermal-triggers` (161), `/training/instructor-info` (161), `/training/licence-recognition` (162), `/weather-guide/summer-thermals` (162), `/weather-guide/wind-directions` (163).

**2. No internationalisation (hreflang / multi-language).** The site is English-only, but Ölüdeniz's paragliding market is dominated by Russian, German, Turkish, and Polish visitors. This is the single biggest *growth* lever left: localised pages with `hreflang` could open large, lower-competition search markets. Strategic decision rather than a bug — worth scoping a phased rollout (start with Russian + German for the highest-intent booking traffic).

**3. No `Service` / `Offer` schema on commercial pages.** Service, transfer, training, and pilot-services pages currently only get breadcrumb schema. Adding `Service` (with `areaServed`, `provider`, and `Offer`/price) would make them eligible for richer results and reinforce entity relationships to the homepage `LocalBusiness`.

### LOW

**4. No custom 404 page** (`app/not-found.tsx`). A branded 404 with links to top pages (book-now, prices, popular guides) recovers otherwise-lost sessions and keeps crawlers moving through the site.

**5. No `loading.tsx` / `error.tsx`** route states. Minor UX/CWV polish, especially for the Supabase-backed `/blog` and `/live-weather`.

**6. Three CSS `background-image` heroes** (incl. `/live-weather`) load the hero via CSS rather than `next/image`, so the LCP image isn't preloaded/optimised. Converting to a prioritised `next/image` improves Largest Contentful Paint.

**7. Legacy page files remain on disk** (`app/babadag-road-guide/page.tsx`, `app/babadag-teleferik/page.tsx`). Redirects override them so there's no SEO impact, but deleting them removes dead code.

---

## Not issues (verified clean)

- No duplicate/double `<h1>` on any page (PageHero supplies the single H1).
- All public-page images use `next/image` with `alt` text.
- robots.ts correctly blocks `/admin/` and `/api/` and points to the sitemap.
- Per-page canonicals are all absolute and correct.

---

## Suggested next actions, in order

1. Trim the 11 long meta descriptions (quick, mechanical).
2. Add `Service`/`Offer` schema to service, transfer, and training pages.
3. Add `app/not-found.tsx` (branded 404).
4. Scope a Russian + German localisation pilot with hreflang — highest upside.
5. Convert the 3 background-image heroes to prioritised `next/image`.

*Method: static analysis of all 104 public page files + config. A live Lighthouse + Search Console pass is still recommended for real Core Web Vitals and indexation data once these ship.*
