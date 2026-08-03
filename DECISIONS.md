# DECISIONS

Deviations from `azhar-products-dev-prompt.md`, and why.

---

## Phase 1 — Foundation

### D1. Design tokens live in `globals.css`, not `tailwind.config.ts`

**Brief:** "design tokens in `tailwind.config.ts`, no arbitrary hex values scattered in JSX".

**Done:** tokens are in an `@theme` block at the top of `src/app/globals.css`.

Tailwind v4 (what `create-next-app` ships) is CSS-first — `tailwind.config.ts` is a
legacy compatibility path, and a project that uses it opts out of the v4 pipeline.
The `@theme` block is the same thing in the supported location: it generates
`bg-cream`, `text-teal-deep`, `font-display`, `ease-brand` and so on. The intent of
the rule — one source of truth, no loose hex in JSX — holds.

### D2. `--teal-mid` fails AA for body text; added `--teal-body`

**Brief:** "Verify cream/teal contrast ratios and adjust `--teal-mid` if it fails on
body text."

Measured against `--cream #E9E4C4`:

| Token | Hex | Ratio | Verdict |
| --- | --- | --- | --- |
| `--ink` | `#1C2B2C` | 21.0:1 | ✓ |
| `--teal-deep` | `#375E61` | 5.6:1 | ✓ AA |
| `--teal-mid` | `#5A8285` | **3.3:1** | ✗ body text |
| `--accent` | `#C9622F` | **3.1:1** | ✗ text |

Rather than move `--teal-mid` and lose the border/hover tone the palette wants, it
is kept for **non-text UI only** (borders, rules, hairlines — 3:1 is the bar there)
and a new `--teal-body #456A6D` (4.6:1) carries secondary body text.

### D3. Two accent values

`--accent #C9622F` is 3.1:1 on cream and 4.0:1 against white — under AA either way.
CTA buttons and accent-coloured text therefore use `--accent-strong #A34A1F`
(4.6:1 on cream, 5.9:1 with `--off-white` on it). `--accent` survives for large
decorative use only. The "<5% of surface area" rule is unchanged.

### D4. Next.js 15 pinned, though 16 is current

The brief calls Next 15 non-negotiable, so `next@15.5.22` is pinned even though
`create-next-app` now scaffolds 16. Nothing in the codebase depends on 15-only
behaviour; the upgrade is a version bump.

Related: `npm audit` reports 3 high findings, all inside Next 15's own pinned
`postcss`/`sharp`. They are not reachable from application code and are not
fixable without moving to Next 16. Re-check at Phase 5.

### D5. Content lives under `src/content/`, not `/content/`

The scaffold uses `src/`, and the `@/*` import alias points there. Keeping content
outside `src/` would mean a second alias for no benefit. Structure and typing are
exactly as specified.

### D6. The supplied images are not phone photos

The brief anticipated "inconsistent phone photos on varied backgrounds" needing
rescue. `images/` actually holds 17 studio product renders — consistent lighting,
clean white sweep, product-centred. So `scripts/process-images.mjs` (Phase 3)
becomes a normalise-and-encode step (white → `--off-white` plate, crop, resize,
WebP + AVIF, blur placeholder) rather than a salvage step.

Until those run, every image slot renders `PlaceholderImage` — a flat `--off-white`
block printing the exact filename it expects. No stock photography anywhere.

### D7. `LocaleSwitcher` reads the query string on click, not via `useSearchParams`

`useSearchParams()` opts the entire page out of static rendering. The query string
is only needed in response to a click, so it is read from `window.location.search`
at that moment. All four routes stay statically prerendered per locale.

### D8. Page-transition wipe is opt-in per link

`TransitionLink` plays the wipe then pushes. Modified clicks (⌘/ctrl/shift/middle)
fall through to the browser, and the real `href` stays on the anchor — the link is
still crawlable and right-clickable. Under reduced motion `navigate()` degrades to
a plain router push and the panel never renders a frame.

---

## Phase 2 — Home

### D9. No certification is named anywhere

The brief's capability list includes "hygiene standards". Naming a scheme —
HACCP, BRCGS, ISO 22000, FSSC — would be a verifiable claim about your business,
so the copy describes *practice* ("documented food-contact handling procedures")
and stops short of certification. Send the certificates you actually hold and the
capability card becomes considerably stronger.

### D10. Trust numbers render an em dash, not a number

`TRUST_STATS` in `src/content/company.ts` holds `value: null` for all three
figures. `Counter` renders the `pending` string when the value is null and skips
the count-up entirely. Fill the three values in and the animation switches itself
on — no component changes needed.

Same pattern for `skuCount` on the four category tiles: the tile shows
"— references" until the Phase 3 product data exists.

### D11. The pinned section's fallback is the default rendering

"What we make" is authored as a plain stacked list with an image per item. The
desktop pin, the cross-fading pane and the active-item highlight are added on top
via `gsap.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')`.

This is deliberate: the brief asks for a mobile fallback rather than a disabled
section, and building the fallback as the base means there is no state in which
the section can be pinned but broken. The cross-fade pane is `aria-hidden` — it
duplicates images already present in the list.

### D12. Marquee spacing is trailing padding, not a flex gap

With a flex `gap`, N duplicated items produce 2N−1 gaps and the −50% loop point
lands half a gap off the seam. Each item carries its own `pr-12` instead, so every
slot is identical width and the loop is exact.

---

## Open items

- **First Load JS on `/` is 167 kB**, over the 150 kB landing budget. GSAP +
  ScrollTrigger + Lenis account for nearly all of it. Phase 5 should confirm
  whether `optimizePackageImports` is pulling its weight and consider deferring
  the cursor/transition layer behind an idle import.
- **Every value in `src/content/company.ts` is `TODO_CONFIRM`** — founding year,
  output capacity, mould count, address, phone, socials. Nothing is invented, and
  the trust-number section will render a dash until the real figures arrive.
