# Oludeniz Paragliding – Project Context for Claude

## Owner
- **Name:** Ceyhun
- **Role:** Tandem paragliding pilot based in Ölüdeniz, Turkey
- **Email:** mrtandempilot@gmail.com

## Project Goal
Build a **paragliding booking webapp** for Ölüdeniz that **ranks #1 on Google** for relevant search terms (e.g. "paragliding Oludeniz", "tandem paragliding Fethiye", etc.). SEO is the primary success metric.

## What This App Is
A full-stack Next.js web application that allows tourists and customers to:
- Learn about tandem paragliding flights from Babadağ mountain in Ölüdeniz
- Book flights online
- See photos and reviews

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + tailwind-merge + clsx
- **Database/Auth:** Supabase
- **AI/Agents:** Anthropic SDK (@anthropic-ai/sdk) — used for SEO, photo, and admin agents
- **Email:** Resend + Nodemailer
- **Sitemap:** next-sitemap
- **Icons:** Lucide React

## Project Structure
```
app/           → Next.js App Router pages
components/
  home/        → Homepage sections (Hero, WhyOludeniz, FlightTypesGrid, BabadagIntro, ReviewsSection)
  shared/      → Reusable components (BreadcrumbNav, PageHero)
lib/
  utils.ts     → Utility functions
```

## Key Features
- **Booking system** — customers can book tandem flights
- **Admin dashboard** — Ceyhun manages bookings, content, etc.
- **AI Agents** — automated agents handling SEO optimization, photo management, and other tasks
- **SEO-first architecture** — sitemap auto-generation, structured data, optimized metadata

## SEO Priority Keywords (to rank #1)
- paragliding Oludeniz
- tandem paragliding Oludeniz
- paragliding Fethiye
- Babadağ paragliding
- Oludeniz paragliding booking
- (expand this list as more are identified)

## Important Notes for Claude
- **SEO is always the top priority** — every page, component, and content decision should consider Google ranking impact
- Ceyhun is not a developer — keep explanations clear and avoid unnecessary jargon
- The project has multiple AI agents already integrated via Anthropic SDK
- Always save important decisions to this file so context is never lost between sessions
- When in doubt about direction, ask Ceyhun — he knows the business deeply

## Session History / Decisions Made
- Stack chosen: Next.js 14 + Supabase + Anthropic SDK
- Homepage components built: Hero, WhyOludeniz, FlightTypesGrid, BabadagIntro, ReviewsSection
- Admin dashboard planned/in progress
- AI agent system planned for SEO + photo management
