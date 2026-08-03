# Images

What the site expects, where it goes, and how to produce it.

---

## Before anything else — a permissions question

The 17 files currently in `images/` are studio renders of **filled, customer-branded
packaging**: RAiB, Activia (Danone), Yopolis and GADO. Those are your customers'
trade dress, not Azhar's.

Nothing in the site references them yet, and nothing will until you confirm one of:

- **(a) Cleared reference work.** You have permission to show these as "produced
  for". The catalogue then gains a client/sector axis and these files map straight
  into `scripts/image-map.json`.
- **(b) Not cleared.** The catalogue needs **unbranded** cup photography — blank
  or plain-printed formats — which does not appear to exist yet. Every image slot
  stays a placeholder block until it does.

The build currently assumes **(b)**.

---

## Naming contract

```
/public/products/{category}/{slug}-{n}.webp
/public/products/{category}/{slug}-{n}.avif
```

- `{category}` — one of `dairy`, `clear`, `foodservice`, `carton`
- `{slug}` — the product's `slug` in `src/content/products.ts`
- `{n}` — 1-based. `-1` is the card image and the gallery default; `-2` is the
  hover swap on the product card.

Category tiles on the home page:

```
/public/products/{category}/category.webp
```

Facility photography for the manufacturing section and About page:

```
/public/facility/{name}.webp
```

---

## Specification per slot

| Slot | Path | Ratio | Pixels (long edge) |
| --- | --- | --- | --- |
| Hero product | `/products/dairy/hero-cup.webp` | 3:4 | 2000 |
| Category tile | `/products/{category}/category.webp` | 4:3 | 1600 |
| Product card / gallery | `/products/{category}/{slug}-{n}.webp` | 4:5 | 1600 |
| Facility | `/facility/{name}.webp` | 4:3 | 1600 |

Every slot also wants an `.avif` sibling. `scripts/process-images.mjs` writes both.

---

## Why the plate is white, not cream

The site background is `--cream #E9E4C4`, so the instinct is to pad product shots
out to cream. Do not.

The products are **white cups on a white sweep**. Any threshold that separates
"background" from "product" separates white from white — it eats the rim, the
lid seat and the stacking ribs along with the backdrop. Cutting these out properly
is retouching work, not a script.

So the pipeline pads to **white**, and the UI presents product images on an
`--off-white #F7F5EC` surface. The narrow white-on-off-white edge reads as a
studio plate, which is a deliberate editorial choice rather than a defect.

If you later supply **cut-out PNGs with real transparency**, say so — the script
gets a branch that composites onto cream and the plates disappear.

---

## Running the pipeline

Sources live in `images/` at the repo root. Outputs go to `public/`.

```bash
# See what would be written, change nothing
node scripts/process-images.mjs --dry

# Process everything into /public/products/_unsorted/
node scripts/process-images.mjs

# Process with explicit destinations
node scripts/process-images.mjs --map scripts/image-map.json
```

`scripts/image-map.json` is a flat object from source filename to output path:

```json
{
  "WhatsApp Image 2026-07-17 at 11.01.22 AM.jpeg": "/products/dairy/dairy-format-a-1.webp",
  "WhatsApp Image 2026-07-17 at 11.01.23 AM.jpeg": "/products/dairy/dairy-format-a-2.webp"
}
```

Anything without a mapping is slugified into `/products/_unsorted/` rather than
skipped, so no source goes missing quietly.

### What the script does per file

1. `trim()` the flat border around the subject (threshold 6).
2. Re-pad to an exact 4:5 frame on white, keeping the subject centred and
   its proportions intact.
3. Resize to 1600px wide, never enlarging past the source.
4. Encode WebP (q82) and AVIF (q60).
5. Write a 16px base64 blur placeholder into `public/products/blur-map.json`.

### After processing

1. Point each entry's `images` array in `src/content/products.ts` at the new paths.
2. Write real `alt` text per locale. Alt describes the **format** — "480 ml white
   PP cup with a 95 mm rim" — not the brand printed on it.
3. Delete the `PlaceholderImage` fallbacks that are no longer reached.

---

## Alt text rules

- Every image needs alt text in all three locales. `TODO_TRANSLATE` is acceptable
  in `fr`/`de` until the real translations land; an empty string is not.
- Describe the packaging, not the decoration.
- The card's hover image is decorative — it carries `alt=""` and `aria-hidden`,
  because the primary image already named the product.
