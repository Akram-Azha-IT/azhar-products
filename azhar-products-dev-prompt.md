# Development Prompt — Azhar Products Website

> Copy everything below the line into your coding agent (Claude Code, Cursor, v0, etc.) as the opening prompt.
> Product images will be supplied separately — the prompt tells the agent how to handle that.

---

## ROLE

You are a senior front-end engineer and motion designer. You build award-winning, production-grade marketing sites (Awwwards / FWA calibre). You write clean, typed, accessible, performant code. You do not ship placeholder lorem ipsum in final sections, and you do not over-engineer.

## PROJECT

Build a marketing website for **Azhar Products**, a manufacturer of high-quality **thermoformed plastic food packaging** — food-grade cups and containers for yogurt, cream cheese, dairy, desserts, and food-service applications. The company also supplies clear cups & containers, carton packaging, and PPR/PE/PVC pipes & fittings.

The audience is **B2B**: procurement managers, dairy plant operations leads, food-service distributors, and packaging buyers. They are evaluating suppliers. The site's job is to make Azhar look like a serious, capable, modern manufacturer and to drive **quote requests** — not online sales.

Existing (to be replaced): a free Wix one-pager at `amaloublkho1.wixsite.com/azhar-product-4`. Its problems: Wix ad banner, `noindex`, no real value proposition above the fold, product galleries that are just unlabelled image carousels, no filtering, no clear CTA, no specs. Do not replicate its structure.

## DESIGN REFERENCE

The visual and motion direction is **oxypac.com.au** (Awwwards Honorable Mention, Nov 2023, by shtudio). Study that reference and match its *feel*, not its content:

- **Editorial minimalism.** Very generous whitespace, large-scale typography, few elements per viewport, strong left-aligned grid with intentional asymmetry.
- **Big background imagery.** Full-bleed product/factory photography that anchors each section, often with text overlaid or set against a flat colour block.
- **Long scroll narrative.** The page reads as a continuous story with distinct chapters, not a stack of generic "cards" sections.
- **Smooth, restrained motion.** Transitions carry the experience; nothing bounces or spins gratuitously.

### Colour palette

Base on the Oxypac palette, adapted for a plastics manufacturer (drop the eco-green connotation, keep the calm industrial tone):

```
--cream      #E9E4C4   /* primary background — warm, non-white */
--teal-deep  #375E61   /* primary text + dark sections */
--off-white  #F7F5EC   /* secondary background, card surfaces */
--teal-mid   #5A8285   /* hover states, borders, secondary text */
--ink        #1C2B2C   /* max-contrast text on cream */
--accent     #C9622F   /* sparing — CTA buttons, active states only */
```

Dark sections invert: `--teal-deep` background with `--cream` text. Use the accent on **less than 5%** of the surface area.

### Typography

- Display / headings: a modern grotesk with tight tracking — **Neue Haas Grotesk Display**, or free alternatives **Satoshi**, **General Sans**, or **Inter Tight**.
- Body: same family at lighter weight, or **Inter**.
- Headline sizes are large and confident: hero `clamp(3.5rem, 9vw, 10rem)`, section headings `clamp(2.5rem, 5vw, 5rem)`. Line-height 0.95–1.05 on display sizes, tracking `-0.03em`.
- Small caps / uppercase micro-labels at `0.75rem`, tracking `0.12em` for section eyebrows ("01 — Products").

## TECH STACK (non-negotiable)

- **Next.js 15** (App Router), **TypeScript**, strict mode
- **Tailwind CSS** — design tokens in `tailwind.config.ts`, no arbitrary hex values scattered in JSX
- **GSAP 3 + ScrollTrigger** for scroll-driven animation
- **Lenis** for smooth scrolling (must be wired to GSAP's ticker, not fighting it)
- **next-intl** for i18n — three locales: **`en` (default), `fr`, `de`**, routed as `/en`, `/fr`, `/de`
- **next/image** for every image, with `sizes` set correctly
- Deploy target: **Vercel**
- No CMS in v1. All copy and product data lives in typed JSON/TS files under `/content/{locale}/`.

## INTERNATIONALISATION

- All user-facing strings come from `messages/en.json`, `messages/fr.json`, `messages/de.json`. Zero hardcoded copy in components.
- Product data (`/content/products.ts`) holds locale-keyed `name` and `description` fields, with shared language-agnostic fields (`sku`, `capacityMl`, `diameterMm`, `material`, `images`).
- Language switcher in the header: a minimal `EN / FR / DE` inline group, current locale in `--accent`, preserving the current path on switch.
- Write **English copy first** and mark FR/DE as `TODO_TRANSLATE` placeholders — do not machine-translate technical packaging terminology. I will supply the real translations.
- `hreflang` alternates + per-locale metadata in `generateMetadata`.

## PAGE STRUCTURE

Multi-page, but each page reads as a long editorial scroll.

### `/` — Home

1. **Hero.** Full viewport. Cream background. Oversized headline: "Thermoformed packaging, built for food." Sub-line stating the specifics that matter to a buyer — food-grade, dairy, desserts, custom volumes. One primary CTA (`Request a quote`) and one ghost secondary (`View products`). Full-bleed product photograph occupying the right 45% or bleeding off the bottom edge. Subtle scroll-cue at the bottom.
2. **Marquee credibility strip.** Slow infinite horizontal scroll of capability keywords or client/sector names, in `--teal-deep` on cream, thin rules above and below. Speed reacts to scroll velocity.
3. **What we make.** Four category tiles — Dairy Packaging, Clear Cups & Containers, Food Packaging Solutions, Carton Packaging. Large imagery, category name, one-line descriptor, count of SKUs. Hover reveals a subtle image scale + arrow slide.
4. **Manufacturing / About.** Dark section (`--teal-deep`). Factory or line photography. Two or three hard numbers that build trust — years in operation, monthly output capacity, number of moulds/formats. Short paragraph, link to `/about`.
5. **Capability grid.** Six short capability statements — food-grade materials, custom moulds, in-house tooling, volume runs, hygiene standards, lead times. Text-forward, minimal iconography.
6. **CTA band.** Full-width `--teal-deep`, oversized "Let's talk about your packaging", single button to `/contact`.

### `/products` — Catalogue

- **Filter bar**, sticky on scroll: category, material (PP / PS / PET / PVC), capacity range, application (yogurt / cream cheese / dessert / food service). Filtering is client-side, instant, and animates items in/out with a staggered fade+lift — **never** a hard re-render jump.
- **Product grid**, 3-up desktop / 2-up tablet / 1-up mobile. Each card: image on a soft cream surface, name, capacity, material tag. Hover swaps to a second image if one exists.
- **Product detail** at `/products/[slug]`: large image with thumbnail strip, spec table (capacity, diameter, height, material, lid compatibility, units per carton, MOQ), a "Request a quote for this item" CTA that pre-fills the product in the contact form, and a "Related products" row.

### `/about` — Company

Editorial scroll: origin, facility, quality & food-safety approach, equipment, a horizontal-scroll timeline of milestones, team or facility imagery.

### `/contact` — Quote request

- Split layout: left = form, right = a sticky panel with address, phone, WhatsApp link, email, Instagram / Facebook / LinkedIn, and an embedded map.
- Form fields: name, company, email, phone, country, product interest (multi-select, pre-fillable via query param), estimated monthly volume, message.
- Client-side validation with **react-hook-form + zod**. Inline errors, no alerts.
- Submit via a Next.js Route Handler. Stub the email send behind an interface (Resend-ready) so it is trivial to wire later.
- Success state animates in place — do not navigate away.

## MOTION SPECIFICATION

This is what separates the result from a template. Be deliberate.

**Global**
- Lenis smooth scroll, `lerp: 0.08`, synced to `gsap.ticker`. Disable on touch devices where it degrades.
- Custom cursor on desktop: a small circle that scales up and inverts over interactive elements. Hide on touch.
- Page transitions: a full-screen `--teal-deep` panel wipes up on exit and down on enter, ~0.6s, `power3.inOut`, with the new page content fading in behind it.

**Scroll-driven**
- **Text reveal:** headings split into lines (use GSAP SplitText or a small custom line-splitter), each line masked by `overflow: hidden` and translating up from 100% with a 0.06s stagger, triggered at 80% viewport.
- **Image reveal:** clip-path wipe (`inset(100% 0 0 0)` → `inset(0 0 0 0)`) plus an inner `scale(1.15) → scale(1)`, 1.2s, `power3.out`.
- **Parallax:** background imagery moves at 0.85× scroll speed; foreground product shots at 1.1×. Keep it subtle — no more than ~80px of total travel.
- **Sticky pinned section:** pin the "What we make" section and cross-fade the four category images as the user scrolls through, with the text list highlighting in sync.
- **Horizontal scroll:** the About timeline scrolls horizontally while pinned vertically.
- **Counters:** the trust numbers count up once on entry.
- **Marquee:** infinite loop whose speed and direction are modulated by scroll velocity.

**Micro-interactions**
- Buttons: background fills from bottom to top on hover, label colour crossfades, 0.4s `power2.out`.
- Links: underline draws left→right on hover, right→left on exit.
- Product cards: image `scale(1.04)`, arrow icon translates 4px right, card surface lightens.
- Nav: transparent over hero, then a cream bar with a hairline bottom border slides down once the user scrolls past the hero — hide on scroll-down, reveal on scroll-up.

**Easing & timing**
- Default ease `power3.out`; transitions `power3.inOut`. Durations 0.4–0.8s for UI, 1.0–1.4s for reveals. Nothing over 1.5s.
- **Respect `prefers-reduced-motion`:** when set, disable Lenis, parallax, pinning and page-transition wipes; replace reveals with a plain 0.2s opacity fade. This is a hard requirement, not an optional extra.

## PRODUCT IMAGES

I will supply product photographs. Until then:

- Define the image contract up front: every product entry takes `images: { src: string; alt: Record<Locale, string>; }[]`, and files live in `/public/products/{category}/{slug}-{n}.webp`.
- Scaffold with clearly-labelled placeholder blocks — a flat `--off-white` rectangle with the intended filename printed on it. **Never** pull stock photos from the internet.
- Write a short `IMAGES.md` at the repo root listing, for each product, the exact filename expected, the recommended aspect ratio, and the recommended pixel dimensions. I will match it when I hand over the photos.
- Assume the source images are inconsistent phone photos on varied backgrounds. Include a Node script (`scripts/process-images.mjs`, using `sharp`) that normalises them: square or 4:5 crop, consistent cream background padding, resize to 1600px, convert to WebP + AVIF, and generate a blur placeholder. Document how to run it.

## QUALITY BAR

- **Performance:** Lighthouse ≥ 90 on Performance / Accessibility / Best Practices / SEO on mobile. LCP < 2.5s. Lazy-load below-fold images and kill layout shift with explicit dimensions. Import only the GSAP plugins actually used.
- **Accessibility:** WCAG 2.1 AA. Verify cream/teal contrast ratios and adjust `--teal-mid` if it fails on body text. Full keyboard navigation with visible focus rings. Semantic landmarks. Alt text on every image. Animations must never trap focus or hide content from screen readers.
- **SEO:** per-page metadata, OpenGraph images, JSON-LD `Organization` + `Product` schema, `sitemap.xml`, `robots.txt` that **allows** indexing.
- **Responsive:** 375 / 768 / 1024 / 1440 / 1920. Mobile is not an afterthought — pinned and horizontal-scroll sections need deliberate mobile fallbacks, not just disabling.
- **Code:** typed props everywhere, animation logic isolated in reusable hooks (`useRevealText`, `useParallax`, `useSmoothScroll`), all GSAP contexts cleaned up on unmount via `gsap.context()`. No `any`.

## BUILD ORDER

Work in phases and stop for review after each one. Do not build everything then ask.

1. **Phase 1 — Foundation.** Next.js + TS + Tailwind scaffold, design tokens, fonts, i18n routing with all three locales, Lenis + GSAP provider, layout shell (nav + footer), page transition system. Deliver a working skeleton with placeholder sections.
2. **Phase 2 — Home.** Every home section with real English copy and placeholder image blocks, full motion spec applied.
3. **Phase 3 — Catalogue.** Product data model, filter logic, grid, detail template, `IMAGES.md` and the image-processing script.
4. **Phase 4 — About + Contact.** Timeline, form with validation, route handler.
5. **Phase 5 — Polish.** Real images once I supply them, reduced-motion audit, Lighthouse pass, cross-browser check, FR/DE translation slots filled.

## HOW TO WORK

- Before Phase 1, restate your understanding of the design direction in five bullets and flag anything you think is a mistake. Push back if something in this brief will hurt the result.
- Ask me for the real content — company founding year, output capacity, certifications, actual product specs — rather than inventing plausible-sounding numbers. Trust claims that turn out to be false are worse than no claims.
- Commit per phase with clear messages.
- Keep a running `DECISIONS.md` noting any deviation from this brief and why.

---

**Start with Phase 1.**
