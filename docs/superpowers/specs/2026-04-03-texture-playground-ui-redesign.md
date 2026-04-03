# Texture Playground UI Redesign — Design Spec

> **Reference:** Figma node 66:3265 in file HqPeHIvfHbC2LAGZyBkbBg

---

## Goal

Replicate the Figma design: replace the dark-chrome UI with a warm beige light theme, restructure the left panel as accordion sections, move exports to a top-right pill, and replace the full-width timeline bar with a small centered floating pill.

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f2f2ec` | Page background |
| `--surface` | `#f7f7f2` | Swatch containers, image containers |
| `--tint` | `rgba(98,90,34,0.06)` | Accordion section backgrounds |
| `--tint-hover` | `rgba(98,90,34,0.10)` | Hover state on sections |
| `--ink-primary` | `#292929` | All primary text |
| `--ink-secondary` | `#72726e` | Secondary/muted text |
| `--border-hairline` | `rgba(71,67,42,0.2)` | Swatch borders, dividers |
| `--green-300` | `#b2c248` | Export video button, play button |
| `--green-200` | `#d1e043` | Selected state border |
| Font | Geist (existing) | All labels |

---

## Layout

```
┌─────────────────────────────────────────────────┐  ← #f2f2ec full screen
│                              [sz · Export png · Export video]  ← top-right pill
│  ┌──────────────────┐   ┌───────────────────────┐
│  │  Left Panel 300px│   │     Canvas (flex 1)    │
│  │  accordion       │   │     rounded-[32px]     │
│  │                  │   │     white bg           │
│  └──────────────────┘   └───────────────────────┘
│                  [  frame pill  ▶  ]  ← bottom center float
└─────────────────────────────────────────────────┘
```

- No TopBar component — its content moves to the export pill and left panel
- Left panel: `width: 300px`, `padding: 8px`, `display: flex, flex-direction: column, gap: 4px`, no background of its own (page bg shows through), `overflow-y: auto`
- Canvas area: `flex: 1`, `padding: 8px 8px 8px 0`, canvas element itself has `border-radius: 32px`, white background
- Export pill: `position: absolute, top: 8px, right: 8px`
- Frame pill: `position: absolute, bottom: 18px, left: 50%` (offset to account for left panel: `left: calc(50% + 150px)`)

---

## Left Panel — Accordion

Each section is a `div` with background `rgba(98,90,34,0.06)`, `border-radius: 12px`, `padding: 0`.

### Section anatomy

```
┌─ Section ──────────────────────────────────┐
│  Header: [Label]              [+ or –]     │  ← always visible, click to toggle
│  Body: (collapsed by default)              │  ← shown when expanded
└────────────────────────────────────────────┘
```

- Header: `padding: 12px 16px`, `display: flex, justify-content: space-between, align-items: center`
- Label: 18px, `--ink-primary`, Geist Regular
- Toggle: 22px, `--ink-primary` — shows `+` when collapsed, `–` when expanded
- Body: `padding: 0 16px 24px`, shown/hidden via `useState` per section

### Sections (top to bottom, matching Figma order: Filters → Texture → Midground Texture → Colour bg)

#### 1. Filters (default: collapsed)

Body contains the existing `FilterStack` UI (add filter dropdown, per-filter controls). No structural change to filter logic — just restyled to match light theme.

#### 2. Texture (default: collapsed)

This section controls the **active grid layer**. It contains:
- A `CompositionPicker` for selecting composition type (dot-grid, lines, cross-hatch, etc.)
- Sliders for Spacing, Thickness/Dot size (conditional on composition), Scale, Opacity
- An "+ Add texture layer" button if no grid layer exists yet; once added, controls appear

Only one grid layer is exposed in this panel at a time (the topmost/only grid layer). Multiple grid layers are a future concern — for now the panel controls the first grid layer found, or prompts to add one.

#### 3. Midground Texture (default: expanded)

Body contains the existing `MidgroundPicker` thumbnail grid (11 PNGs, 50×50px thumbnails). Below the grid, when a texture is selected, show sliders: Scale, Opacity, X offset, Y offset (existing `Slider` components, carried over).

#### 4. Colour bg (default: expanded)

Body contains 8 circular colour swatches in a 4-column CSS grid.

Each swatch:
- Outer container: `background: #f7f7f2`, `border-radius: 50%`, `padding: 1px`
- Default border: `0.5px solid rgba(71,67,42,0.2)`
- Selected border: `2px solid #d1e043`
- Inner circle: `width: 50px, height: 50px, border-radius: 50%`
- Click → `onChange({ color: value })` on the background layer

Colours (in order): `#444625`, `#788d16`, `#b2c349`, `#e5eacd`, `#ee9212`, `#4791e2`, `#ff92e0`, `#a291ce`

Replaces `ColorPicker.tsx` entirely — the hex input picker is removed.

---

## Export Pill (top right)

```
┌────────────────────────────────────────────────────┐
│  [512] [1024] [2048]  │  Export png  │ Export video │
└────────────────────────────────────────────────────┘
```

- Outer container: `background: rgba(98,90,34,0.06)`, `border-radius: 32px`, `padding: 8px`, `display: flex, gap: 4px, align-items: center`
- Size buttons: `background: rgba(98,90,34,0.06)`, `border-radius: 40px`, `padding: 12px 16px`, active size gets slightly darker tint or ink-primary text vs ink-secondary
- "Export png": same tint background, `border-radius: 40px`, `padding: 12px 16px`
- "Export video": `background: #b2c248`, `border-radius: 40px`, `padding: 12px 16px`, `color: #292929`
- All text: 18px Geist Regular, `color: #292929`

---

## Frame Pill (bottom center)

A small floating container, `border-radius: 20px`, `background: rgba(98,90,34,0.06)`, `padding: 18px 18px 8px 24px`.

Contents (horizontal row):
- Frame thumbnails: each is `54px × 54px`, `border-radius: 12px`, `background: #f7f7f2`, active frame gets `border: 1px solid #d1e043`. Shows the background color of that frame (or just a filled square). Click → select frame. Hover shows × delete button.
- `+` button: `36px × 36px`, `background: #f7f7f2`, `border-radius: 12px`, icon `+` — adds a new frame
- Frame duration stepper: `– [N] +` below the active frame thumbnail (or inline). Small text, `#72726e`.
- Play/stop button: `64px × 64px` circle, `background: #b2c248`, `color: #292929`, shows ▶ / ■

---

## Files to create/modify

| File | Change |
|---|---|
| `TexturePlaygroundClient.tsx` | New layout shell (no TopBar, absolute-position pill + frame pill) |
| `components/TopBar.tsx` | **Delete** — replaced by ExportPill |
| `components/ExportPill.tsx` | **New** — top-right export + size selector |
| `components/FramePill.tsx` | **New** — replaces Timeline.tsx |
| `components/Timeline.tsx` | **Delete** — replaced by FramePill |
| `components/LeftPanel.tsx` | Rewrite — accordion structure, new tokens |
| `components/controls/ColorPicker.tsx` | Rewrite — circle swatches, remove hex input |
| `components/controls/FilterStack.tsx` | Restyle only — light theme tokens |
| `components/controls/FilterControls.tsx` | Restyle only — light theme tokens |
| `components/controls/MidgroundPicker.tsx` | Restyle only — light theme containers |
| `components/controls/LayerControls.tsx` | Remove — logic absorbed into LeftPanel accordion |
| `components/controls/LayerStack.tsx` | Remove — no longer needed (accordion replaces it) |
| `components/controls/CompositionIcon.tsx` | Keep — still used in CompositionPicker |
| `components/CanvasPreview.tsx` | Minor: remove size label overlay if present |

---

## Behaviour unchanged

- All layer state, renderer, filter logic, export logic — no changes
- `TexturePlaygroundClient.tsx` handler functions stay identical
- `resolveFrame`, `playback`, `export` modules untouched
- `renderer.ts` untouched

---

## Out of scope

- Drag-to-reorder layers (deferred)
- Multiple grid layers exposed simultaneously (deferred)
- Image upload layer (hidden for now — can re-add later)
- ABC Diatype font (using Geist as-is)
