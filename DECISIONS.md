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

## Phase 3 — Catalogue

### D13. Built against the conservative reading of the imagery question

`images/` holds customer-branded packaging — RAiB, Activia/Danone, Yopolis, GADO.
Whether Azhar may publish those is a question only you can answer, so Phase 3 was
built assuming **it may not**: no client imagery is referenced anywhere, and every
image slot renders a placeholder block naming the file it wants.

Switching to "cleared reference work" is a content edit — fill in
`scripts/image-map.json`, run the pipeline, point `images` arrays at the output.
No component changes. The full question is written up at the top of `IMAGES.md`.

### D14. The catalogue is scaffold data, and says so

`PRODUCTS` holds eight positional entries (`dairy-format-a` …) with **every spec
null**. The brief forbids inventing specs, and a catalogue is nothing but specs,
so the alternative was an empty array that makes the whole feature unreviewable.

The machinery is real: filtering, URL state, stagger animation, spec table,
related products, JSON-LD and 24 statically-generated detail pages all work. Only
the values are pending. Replace the entries and everything lights up.

### D15. Filter facets are derived from data, never hardcoded

`deriveFacets()` reads the available values out of `PRODUCTS`. A filter group with
no values does not render — which is why the bar currently shows only Category.
As materials, capacities and applications get filled in, their groups appear on
their own. This also means the bar can never offer a filter that returns nothing.

### D16. Filter state syncs to the URL without `useSearchParams`

Same reasoning as D7: `useSearchParams()` would deopt `/products` out of static
rendering. Instead the hook reads `window.location.search` once on mount and
writes back with `history.replaceState`. Filtered URLs stay shareable and the page
stays statically served.

### D17. JSON-LD omits unconfirmed fields rather than emitting placeholders

`ProductJsonLd` only writes `material` and `image` when real values exist. Feeding
an em dash or a guessed capacity into structured data would publish a claim to
search engines that nobody can stand behind.

### D18. The image pipeline pads to white, not cream

The brief's instinct — pad product shots out to the cream background — cannot work
here. These are white cups on a white sweep; any threshold separating background
from product also eats the rim, lid seat and stacking ribs. Proper cut-outs are
retouching, not scripting.

So `process-images.mjs` trims, re-pads to 4:5 **on white**, resizes to 1600px,
writes WebP + AVIF and a blur placeholder — and the UI presents product images on
an `--off-white` surface so the plate reads as an editorial choice. Supply cut-out
PNGs with real transparency and the script gets a cream branch instead.

---

## Phase 4 — About + Contact

### D19. An unconfigured quote endpoint returns 503, it does not fake success

`getEmailProvider()` returns an `UnconfiguredProvider` that **throws** until
`RESEND_API_KEY` and `QUOTE_INBOX` are set. The route maps that to `503` and the
form shows "the quote inbox is not connected yet — email or call us directly".

The tempting alternative — return 200 and log the payload — produces a site that
looks like it is collecting enquiries while silently dropping them. A visible
error is recoverable; a lost quote request is not.

To enable: `npm install resend`, set both env vars, and fill in the client call in
`src/lib/email.ts`. Nothing else changes; the route only knows `EmailProvider`.

### D20. The honeypot is permissive in the schema on purpose

First cut used `z.string().max(0)`, which made a filled honeypot fail validation —
and the 422 response named the `website` field, telling a bot exactly which field
caught it. The field now accepts input, and the **route** checks it after parsing
and returns a silent `202`. Caught by the API smoke test, not by review.

### D21. Required-field messages need the error on the constructor too

Also caught by the smoke test: `z.string().min(2, msg)` only covers a value that
is present but too short. A missing field raises `invalid_type` and fell back to
zod's default "Invalid input", so an untouched form showed seven generic errors.
Each field now passes the message to `z.string({ error })` **and** to `.min()`.

### D22. Timeline: horizontal scroller first, pinning second

The base rendering is a real horizontally scrollable, keyboard-focusable track
that works on every viewport. The desktop pin is layered on via `gsap.matchMedia`.
Same reasoning as D11 — the brief asks for a deliberate mobile fallback, and
building the fallback as the base means there is no broken intermediate state.

### D23. The contact panel hides what it cannot confirm

`isConfirmed()` checks for the `TODO_CONFIRM` marker. Phone, WhatsApp, address and
each social link render only once real. The map is omitted entirely rather than
pointed at a guessed location — which also avoids loading a third-party frame to
show the wrong place.

### D24. Rate limiting is in-process and will not survive multi-region

`src/lib/rateLimit.ts` is a fixed window, 5 requests per minute per IP, held in
module memory. Verified working (6th request returns 429). It is enough for a
single-instance marketing site and stops a script hammering the endpoint — but it
is per-instance. If this deploys to more than one Vercel region, move it to
Upstash or Vercel KV.

---

## Phase 5 (partial) — Performance

### D25. GSAP and Lenis load lazily; motion is progressive enhancement

The landing route was 170 kB against a 150 kB budget, and GSAP + ScrollTrigger
was roughly 65 kB of it. Nothing needs an animation engine before hydration.

`src/lib/gsap.ts` is now a lazy loader — `loadGsap()` dynamic-imports GSAP and
ScrollTrigger once per session and registers the plugin; `peekGsap()` returns the
bundle only if it has already arrived, for synchronous paths like a link click.
Timing constants moved to `src/lib/motionTokens.ts` so components can reference
the motion language without pulling in the engine.

`useGsapEffect(setup, deps, enabled)` wraps the pattern: it awaits the bundle,
discards the result if the component unmounted meanwhile, and skips the import
entirely when `enabled` is false — so a reduced-motion visitor never downloads
GSAP at all.

Result:

| Route | Before | After |
| --- | --- | --- |
| `/` | 170 kB | **126 kB** |
| `/products` | 174 kB | **130 kB** |
| `/products/[slug]` | 173 kB | **128 kB** |
| `/about` | 168 kB | **125 kB** |
| `/contact` | 188 kB | **144 kB** |

All five now sit under the 150 kB landing budget.

The constraint this imposes, and the reason it is safe: **every animated element
must already be correct before GSAP arrives, and must stay correct if it never
does.** Headings are readable un-split, image wrappers are unclipped at rest,
counters render their final value server-side, and `navigate()` falls through to
a plain router push when the bundle is not ready — a link click is never delayed
waiting on an animation library.

---

## Open items

- ~~First Load JS on `/` is over budget~~ — resolved in D25; `/` is now 126 kB.
- **Not yet verified in a real browser.** Everything so far is type-checked,
  built, and smoke-tested over HTTP. The reduced-motion audit, Lighthouse run and
  cross-browser pass still need an actual browser — the Playwright bridge was not
  available in this environment.
- **Every value in `src/content/company.ts` is `TODO_CONFIRM`** — founding year,
  output capacity, mould count, address, phone, socials. Nothing is invented, and
  the trust-number section will render a dash until the real figures arrive.
