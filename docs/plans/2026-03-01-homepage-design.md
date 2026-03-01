# Homepage Design

Date: 2026-03-01
Branch: feat/portfolio-homepage
Status: approved — ready to build

---

## Overview

Single-screen portfolio homepage. No scroll. Clean, white, typographically led.
Personality lives in the footnote interactions, not the layout.

---

## Layout

Full viewport, no scroll. Three zones:

```
┌─────────────────────────────────────────────────────┐
│  [Logo mark]                    Email               │
│                                 LinkedIn            │
│                                 Instagram           │
│                                 Twitter             │
│                                                     │
│                                                     │
│  Tanya Ermolaeva                                    │
│                                                     │
│  Moscow-born product & visual designer  (1)         │
│  Based in London since 2023             (2)         │
│  Currently designing at Granola         (3)         │
│  Previously at Intercom, ...            (4)         │
│  Generalist background: ...             (5)         │
│  Increasingly building as well...       (6)         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Top-left: SVG logo mark (three icons from Figma)
- Top-right: Social links, stacked, plain text
- Centre-left: Name + bio block, vertically centred

---

## Typography

| Element           | Font              | Size  | Tracking | Color     |
|-------------------|-------------------|-------|----------|-----------|
| Name              | Plain Medium      | 48px  | -0.96px  | #1c1b1b   |
| Bio lines         | Plain Medium      | 32px  | -0.64px  | #706e6e   |
| Footnote numbers  | Pinyon Script     | 32px  | —        | #706e6e   |
| Social links      | Plain Regular     | 16px  | —        | #706e6e   |

Plain is loaded from /public/fonts/.
Pinyon Script loaded from Google Fonts (next/font/google).

---

## Interactions

### Footnote hover
- Hovering a bio line: background highlight appears behind the line (#f0f0f0, border-radius 16px)
- A popover card appears to the right of the text block
- Popover: white, border 0.5px rgba(0,0,0,0.1), border-radius 24px, shadow 0 1px 20px rgba(0,0,0,0.06)
- Popover contains the footnote text
- Footnote numbers styled in Pinyon Script (italic/script contrast)
- Future: each popover becomes a contextual widget (map, live time, product card, etc.)

---

## Content

See: docs/content/homepage.md

Bio lines and all 6 footnotes finalised.
Social URLs still need filling in.

---

## Components to build

1. `app/page.tsx` — rebuilt with actual content, replaces tutorial scaffold
2. `app/components/ui/FootnotePopover.tsx` — hover trigger + popover card
3. `app/data/footnotes.ts` — footnote content array
4. Load Pinyon Script via next/font/google in layout.tsx

---

## Out of scope (for now)

- Project pages
- Right-column project thumbnails
- Dock-effect image interactions
- Widget-based footnotes (map, live time, product cards)
- Mobile layout
