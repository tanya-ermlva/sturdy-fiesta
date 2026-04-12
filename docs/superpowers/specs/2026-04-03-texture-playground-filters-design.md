# Texture Playground — Phase 2: Filters Design Spec

**Date:** 2026-04-03
**Status:** Approved for implementation

---

## Goal

Add a non-destructive adjustment layer to the texture playground. The adjustment layer sits permanently at the top of the layer stack and composites a stack of GPU filters over the entire rendered frame. Filters are per-frame (frames are already fully independent). The architecture is designed to extend to positional adjustment layers (Option B) later without a renderer rewrite.

---

## Filter Set

| ID | Label | Package | Key params |
|---|---|---|---|
| `noise` | Noise / Grain | `pixi.js` built-in | intensity 0–1 |
| `blur` | Blur | `pixi.js` built-in | strength 0–20 |
| `pixelate` | Pixelate | `pixi-filters` | size 1–50px |
| `displacement` | Displacement | `pixi.js` built-in | scale 0–100 |
| `rgbsplit` | RGB Split | `pixi-filters` | amount 0–30 |
| `colormatrix` | Colour Adjust | `pixi.js` built-in | brightness, contrast, saturation (all 0–2), hue –180–180, invert toggle |
| `halftone` | Halftone | `pixi-filters` | scale 1–20, angle 0–180 |
| `glow` | Glow | `pixi-filters` | distance 1–30, strength 0–10, color hex |

---

## Data Model

```ts
type FilterEntry =
  | { type: 'noise';        enabled: boolean; intensity: number }
  | { type: 'blur';         enabled: boolean; strength: number }
  | { type: 'pixelate';     enabled: boolean; size: number }
  | { type: 'displacement'; enabled: boolean; scale: number }
  | { type: 'rgbsplit';     enabled: boolean; amount: number }
  | { type: 'colormatrix';  enabled: boolean; brightness: number; contrast: number; saturation: number; hue: number; invert: boolean }
  | { type: 'halftone';     enabled: boolean; scale: number; angle: number }
  | { type: 'glow';         enabled: boolean; distance: number; strength: number; color: string }

type AdjustmentLayer = {
  id: string
  kind: 'adjustment'
  filters: FilterEntry[]
}

// Layer union extends to include AdjustmentLayer
type Layer = BackgroundLayer | GridLayer | ImageLayer | AdjustmentLayer
```

One `AdjustmentLayer` exists in every frame's `layers` array, always at the last index (top of visual stack). The ID is stable across the session (`'adj'`). It is not deletable and has no drag handle in Phase 2.

---

## Renderer Architecture (extensible)

Currently the renderer adds all layer Graphics/Sprites directly to `app.stage`. Phase 2 introduces a `layersContainer: Container` that holds all content layers. The adjustment layer's enabled filters are applied to `layersContainer.filters`.

```
app.stage
  └── layersContainer  ← filters[] from AdjustmentLayer applied here
        ├── bg (Graphics)
        ├── g1 (Graphics)
        └── image? (Sprite)
```

**Why this is extensible to Option B:** In Option B, `renderFrame` scans the layers array for the position of adjustment layers and creates multiple containers (one per group of content layers below each adjustment layer). The per-container filter application logic is identical — only the grouping changes.

The displacement filter requires a sprite as input (displacement map). A 256×256 white noise canvas texture is generated once at `init()` time and reused across all frames.

---

## UI

The `AdjustmentLayer` row in `LayerStack` always appears at the top, uses a ✦ icon, has no delete button. Selecting it shows `FilterStack` in the parameters section instead of `LayerControls`. `FilterStack` renders:

- A card per active filter: toggle (enabled/disabled), filter name, delete ×, expanded sliders
- An "+ Add filter" button that opens a picker of the 8 filter types (already-active ones greyed out)
- Invert renders as a toggle switch, not a slider

---

## File Structure

**New files:**
- `lib/filters.ts` — `buildFilters(entries, displacementSprite): Filter[]` pure function
- `components/controls/FilterStack.tsx` — adjustment layer UI
- `components/controls/FilterControls.tsx` — per-filter parameter sliders

**Modified files:**
- `lib/types.ts` — add FilterEntry, AdjustmentLayer, extend Layer union
- `lib/renderer.ts` — layersContainer, displacementSprite, apply filters
- `TexturePlaygroundClient.tsx` — DEFAULT_LAYERS, filter handlers, updated LeftPanel props
- `components/LeftPanel.tsx` — new filter handler props threaded through
- `components/controls/LayerControls.tsx` — adjustment case → FilterStack
- `components/controls/LayerStack.tsx` — adjustment layer display (✦, no delete)
- `components/controls/CompositionIcon.tsx` — 'adjustment' icon type

**Package:** `pixi-filters` v6
