# Theme: Orange and Blue

Custom theme for Local Boost FL, built on the client's request for "orange and blue
like the Florida Gators colors." None of the theme-factory presets carry a two-color
brand where both colors have to stay legible on light and dark grounds, so this is a
new theme built via the "Create your Own Theme" path.

This replaces an earlier green estuary theme ("Tidal Marsh"), which is gone.

## Identity

Two colors, two different jobs. The audience is Northeast Florida, where orange and
blue already read as local before they read as brand, so the pairing does recognition
work for free. The discipline is that they are not treated as equals.

- **Blue is structural.** It builds the ground: the near-black text has a blue
  undertone, the closing band is a full-bleed deep blue, the map water is blue, and
  dark mode is a blue-black rather than a neutral one.
- **Orange is the single accent.** CTAs, the highlighted result row, the rank grid,
  the process numerals, the icon strokes. Nothing else competes for it.

This keeps the "one locked accent" rule intact while still delivering both colors.

## Color

| Token | Hex | Role |
|---|---|---|
| Paper | `#F5F6FA` | Page background. Cool white with a blue cast, not cream. |
| Band | `#E7EBF4` | Alternating section band, mockup chrome. |
| Navy | `#0B1330` | Primary text. Near-black with a blue undertone. |
| Deep | `#0B2A80` | Structural blue. Closing CTA band, Boost Pro accents. |
| Slate | `#4B5573` | Secondary text, captions. |
| Orange | `#B8390A` | The single accent. Used on every section. |
| Gold | `#C8891F` | Functional only: star-rating fills. Never brand. |

Dark mode keeps the same identity. Navy becomes the ground at `#08112E`, and orange
lifts to `#FF7A33` so it still carries at low luminance.

### `--acc-on-dark`

`#FF7A33` is also exposed as `--acc-on-dark` in light mode. The base orange is tuned
for contrast on paper and drops to roughly 3:1 on a dark ground, which is not enough
for the Boost Pro card or a focus ring on the deep blue band. Both scopes swap to the
lifted orange locally rather than weakening the page-wide accent.

### Contrast (WCAG)

Light:
- Navy on Paper: 15.6:1 (AAA)
- Slate on Paper: 7.1:1 (AAA)
- Orange on Paper: 5.4:1 (AA)
- White on Deep: 12.7:1 (AAA)
- Navy on 62% orange rank cell: 6.0:1 (AA)

Dark:
- Lifted orange on Navy ground: 7.9:1 (AAA)
- Lifted orange on Boost Pro card: 7.0:1 (AAA)
- Lifted orange focus ring on Deep band: 4.9:1 (clears the 3:1 non-text minimum)
- White on Deep: 9.9:1 (AAA)

## Type

- **Display:** Bricolage Grotesque. Variable optical-size and width axes, odd
  humanist details in the `g` and `a`. Set at weight 700-800, tracking -0.03em,
  leading 0.95-1.05.
- **Body:** Inter Tight. Understated, narrow enough to sit under a wide display
  face without competing. 400/500, leading 1.6.
- Scale is explicit and fluid via `clamp()`, defined in `styles.css` under
  `--fs-*`. Note that `clamp()` needs whitespace around its `+` operator or the
  whole declaration is dropped silently.

## Shape

One radius system, documented and enforced:
- Interactive (buttons, chips): full pill
- Surfaces (panels, mockups, cards): 14px
- Inner elements (map, rank badges, grid cells): 8px

The one apparent exception is the geo-grid legend swatch at 4px. It is
proportional, not inconsistent: the swatch is 13px and the grid cell is roughly
34px, so 4/13 matches 8/34. Setting the swatch to a literal 8px would make a 13px
square read as a blob next to the cells it is labelling.

## Depth

Three layered shadow tokens, `--sh-1/2/3`. Each is two shadows: a 1-2px contact
edge that anchors the element, plus a wide ambient with heavy negative spread.
Both layers are tinted with `--navy` rather than black, so shadow stays inside the
palette. Dark mode swaps to near-black, because a navy shadow on a navy ground is
invisible.

- `--sh-1` small raised elements
- `--sh-2` pricing cards
- `--sh-3` the SERP and geo-grid mockups

## Alignment

The layout is deliberately squared rather than editorial-asymmetric:

- Every section shares one container: `--wrap` 1240px with `--gut` gutters. At
  1440 every section wrap measures identically and every H2 sits on one left edge.
- The stats row is three equal columns on a shared baseline. It previously
  staggered them 0 / 44 / 88px, which reads as a mistake rather than as rhythm.
- Both pricing tiers share a top, a height, and a button baseline. The Pro card
  previously lifted 14px, which reads as a rendering glitch.
- Hover states never animate a layout property. The service rows tint via an
  absolutely positioned pseudo-element, so hovering cannot reflow the row.

## Iconography

Hand-built line art on a single theme: upward momentum. Stroke 1.6, round caps and
joins, 24x24 viewBox, defined once as an inline `<symbol>` sprite. Every `<use>` site
must set `fill:none;stroke:currentColor` on the referencing `<svg>` element itself.
Styling the `<symbol>` does not cascade into the shadow tree, so an icon that misses
this renders as a solid black blob.

The star glyph is the one exception: it is filled, not stroked, and takes `--gold`.
