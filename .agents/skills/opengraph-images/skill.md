---
name: opengraph-images
description: Create dynamic OpenGraph and Twitter share images using Next.js ImageResponse. Use when adding social images to new pages, updating an existing share card, or debugging OG image rendering.
allowed-tools: Read, Edit, Write, Grep, Glob
---

# OpenGraph Images Skill

Share images are generated from the Next.js file conventions `opengraph-image.tsx` (1200×630)
and `twitter-image.tsx` (1200×600). A page's own `openGraph`/`twitter` metadata block replaces
the parent's wholesale, including file-based images, so **every segment whose page sets
`openGraph` needs its own pair**. Copy the nearest pair and change the card if needed.

## When to Use This Skill

- Giving a new page or section its own share card
- Changing the copy or data on an existing card
- Adding a new card design from the "Social Images" Claude Design comp
- Debugging Satori rendering issues

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/src/lib/og/config.ts` | `OG_SIZE`, `TWITTER_SIZE`, `OG_CONTENT_TYPE`, `OG_HEADERS` |
| `apps/web/src/lib/og/colours.ts` | Card palette from the design comp |
| `apps/web/src/lib/og/fonts.ts` | `getOGFonts()` — Urbanist 500/600/700/800 |
| `apps/web/src/lib/og/templates/` | `Frame` (background + footer), `Pill`, `DeltaChip`, `StatTile` |
| `apps/web/src/lib/og/cards/` | The eight card components, one per page type |
| `apps/web/src/lib/og/data.ts` | `load*()` composers over the cached queries |
| `apps/web/src/lib/og/sparkline.ts` | Series → SVG path strings |
| `apps/web/assets/fonts/` | Urbanist TTFs |

## Card → route map

| Card | Component | Routes |
|------|-----------|--------|
| 01 Site default | `SiteDefault` | `app/` root, `(dashboard)/` home, `about`, `advertise`, `blog`, `contact`, `learn` |
| 02 COE bidding results | `CoeResults` | `coe/results`, `coe/premiums` |
| 03 COE premiums (Cat A + B) | `CoePremiums` | `coe/` hub, `coe/pqp` |
| 04 Car registrations | `Registrations` | `cars/` hub, `cars/registrations`, `cars/annual`, `cars/deregistrations`, `cars/makes`, `cars/vehicle-types`, `cars/vehicle-types/[type]` |
| 05 Make | `Make` | `cars/makes/[make]` |
| 06 Fuel mix | `FuelMix` | `cars/fuel-types`, `cars/fuel-types/[type]`, `cars/electric-vehicles`, `cars/electric-vehicles/charging` |
| 07 Article | `Article` | `blog/[slug]`, `learn/[slug]` |
| 08 PARF | `Parf` | `cars/parf` |

## Route file shape

Both files in a segment are identical apart from the size constant. Never add
`openGraph.images` or `twitter.images` to a page's metadata — a page-level `images` key
replaces the file-based image entirely.

```tsx
// opengraph-image.tsx (twitter-image.tsx swaps OG_SIZE for TWITTER_SIZE)
import { CoeResults } from "@web/lib/og/cards/coe-results";
import { OG_CONTENT_TYPE, OG_HEADERS, OG_SIZE } from "@web/lib/og/config";
import { loadCoeResults } from "@web/lib/og/data";
import { getOGFonts } from "@web/lib/og/fonts";
import { ImageResponse } from "next/og";

export const alt = "Latest COE bidding results - MotorMetrics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const [data, fonts] = await Promise.all([loadCoeResults(), getOGFonts()]);

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(<CoeResults height={size.height} {...data} />, {
    ...size,
    fonts,
    headers: OG_HEADERS,
  });
}
```

Dynamic segments also export `generateStaticParams` (see `cars/makes/[make]`), returning at
least one param under Cache Components.

## Card anatomy

Every card is `({ height, ...data }) => <Frame height={height}>…</Frame>`. `Frame` draws the
cream background, `54px 60px` padding and the footer (accent circle, wordmark, right-hand
label). Put a `<div style={{ flex: 1 }} />` spacer before the last block so the footer
stays pinned.

Data comes from `lib/og/data.ts`, which composes the existing `"use cache"` queries, so
cards revalidate on the same tags as the pages. Format numbers there, not in the card.

## Colour Palette

| Token | Value | Use |
|-------|-------|-----|
| `background` | `#F7F5EF` | Card background |
| `ink` | `#232A2E` | Headlines and values |
| `muted` | `#5A6A70` | Body copy |
| `subtle` | `#7B888D` | Labels |
| `faint` | `#96A2A7` | Axis labels |
| `accent` | `#4E7C9B` | Highlights, wordmark, icon |
| `accentSoft` / `accentDeep` | `#DCE7EC` / `#2C5670` | Soft pill |
| `rule` | `#E5E1D5` | Dividers, bar tracks |
| `up*` / `down*` | `#FBEBD3/#96601C` · `#DFF1DF/#2F6B3A` | Delta chips |
| `fuel.*` | `#C3CFD5 #4E7C9B #7FAAC4 #16323F` | Petrol, electric, hybrid, diesel |

## Satori constraints

- Inline `style` objects only; flexbox only (no `grid`), no `conic-gradient`, no `text-wrap`
- A `div` with several children must be `display: flex`
- Draw charts as inline `<svg>`: paths for sparklines, stroked `<circle>` arcs with
  `strokeDasharray` for donuts
- Fonts must be static `.ttf` files; the whole route including fonts must stay under 500 KB

## Testing

1. Run `pnpm dev` and open `/opengraph-image`, `/coe/results/twitter-image`,
   `/cars/makes/toyota/opengraph-image`, `/blog/<slug>/opengraph-image` directly.
2. `curl -sI` an image and confirm `content-type: image/png` and the immutable cache header.
3. View source of the page and confirm `og:image` and `twitter:image` point at the generated
   routes.
4. Social debuggers: Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector.

## Validation Checklist

- [ ] Both `opengraph-image.tsx` and `twitter-image.tsx` exist, each exporting `alt`, `size`, `contentType`
- [ ] Card is rendered through `Frame` with `height={size.height}`
- [ ] Data is loaded via `lib/og/data.ts` from cached queries
- [ ] No `images` key in the page's `generateMetadata`
- [ ] Rendered at both sizes without clipping
