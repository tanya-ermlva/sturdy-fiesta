# Texture Playground — Design Spec

**Date:** 2026-04-03  
**Status:** Approved for implementation  
**Reviewed by:** Architecture review `2026-04-03-texture-playground-architecture-review.md`

---

## Context

Tatiana works at Granola, where textures are used as 3D object surface maps. These textures are often composed of geometric patterns and can be animated by looping between 2–5 frames at slightly different scales or positions. Currently there's no fast way to compose, preview, and export these textures in a branded way.

This tool lets her build layered geometric textures using Granola brand colours, preview them live, assemble a short frame-by-frame animation, and export to WebM (for motion tools) and PNG (per frame, for static use). It lives in the portfolio for now but is written to be extracted into a standalone repo.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | Existing portfolio |
| Language | TypeScript | Existing |
| Styling | Tailwind CSS 4 + inline styles for tool chrome | Existing; tool UI uses Geist + Geist Mono |
| Fonts | Geist + Geist Mono (Google Fonts) | Clean, tool-like — distinct from portfolio's Plain Medium |
| Rendering | **PixiJS v8** | WebGL GPU acceleration; noise/displacement/pixelation are built-in filters; layer compositing is a first-class concept |
| Extended filters | **@pixi/filters** | Adds noise, pixelate, glow, halftone, displacement for Phase 2 |
| Export — video (preview) | `canvas.captureStream()` → `MediaRecorder` | Fast path, runtime-timing based |
| Export — video (deterministic) | **WebCodecs API** + **`webm-muxer`** (~10KB) | Frame-perfect loop export; renders exact frame sequence at fixed timesteps |
| Export — image | `renderer.extract.canvas()` → `toBlob()` → PNG | Per-frame static export |

---

## Route

`/texture-playground` — standalone page, no nav link, no `/learn` index entry, `noindex` meta. Self-contained under `app/texture-playground/` so it can be lifted into its own repo.

---

## Layout

```
┌─ TopBar ──────────────────────────────────────────────────────────────┐
│  TEXTURE   |  512  [1024]  2048  |  ···  Export frame  [Export WebM]  │
├─ LeftPanel ──────┬─ CanvasPreview ────────────────────────────────────┤
│  COMPOSITION     │                                                     │
│  [Dot grid] ...  │             <canvas>                                │
│                  │          live texture preview                        │
│  LAYERS          │                                                     │
│  ● Dot grid      │                              editing F1 ┐           │
│  ● Background    │                                                     │
│  + Add layer     │                                                     │
│                  │                                                     │
│  PARAMETERS      │                                                     │
│  Spacing  18px   │                                                     │
│  ████░░░░        │                                                     │
│  Dot size  3px   │                                                     │
│  ██░░░░░░        │                                                     │
│  Opacity  100%   │                                                     │
│  ████████        │                                                     │
│                  │                                                     │
│ [Add to timeline →]                                                    │
├─ Timeline ───────┴────────────────────────────────────────────────────┤
│  TIMELINE  [F1▪] [F2▪]  +      ···      fps 30  (▶)                   │
└───────────────────────────────────────────────────────────────────────┘
```

- **LeftPanel** is the full editor: composition picker → layer stack → layer parameters → CTA
- **CanvasPreview** always shows the live texture as you adjust controls; same canvas plays animation on Play
- **Timeline** shows frame thumbnails with per-frame duration inputs (in frames)

---

## Composition Types

All compositions draw with line/dot colour fixed at `#1E1E1E` (black). Background colour is a Granola palette swatch.

| ID | Name | Parameters |
|---|---|---|
| `dot-grid` | Dot grid | spacing, dot size, opacity, scale |
| `regular-grid` | Regular grid | spacing, thickness, opacity, scale |
| `variable-grid` | Variable grid | spacing, thick weight, thin weight, rhythm, opacity |
| `linear` | Linear / striped | direction (H/V), spacing, thick weight, thin weight, rhythm, opacity |
| `layered` | Layered / offset | coarse spacing, fine spacing, coarse opacity, fine opacity, offset |
| `checkered` | Checkered | cell size, opacity, scale |

---

## Data Model

### Layer types

```ts
type CompositionType =
  | 'dot-grid' | 'regular-grid' | 'variable-grid'
  | 'linear' | 'layered' | 'checkered'

type Layer =
  | { id: string; kind: 'background'; color: string }
  | {
      id: string; kind: 'grid'
      composition: CompositionType
      spacing: number; thickness: number; dotSize?: number
      opacity: number; scale: number
    }
  | {
      id: string; kind: 'image'
      file: File; objectUrl: string
      scale: number; x: number; y: number; opacity: number
    }
```

### Frame model — base + per-frame overrides

Each frame stores only the parameters that differ from the base composition. A `resolveFrame()` utility merges base + overrides into a `FrameSnapshot` for rendering. This avoids duplicating full layer arrays across frames that share most parameters.

```ts
// Stored in React state
type BaseComposition = {
  layers: Layer[]  // the canonical layer stack
}

type LayerOverride = Partial<Omit<Layer, 'id' | 'kind'>>

type Frame = {
  id: string
  layerOverrides: Record<string, LayerOverride>  // keyed by layer id
  durationFrames: number  // e.g. 5fr @ 30fps = 167ms
}

type Project = {
  base: BaseComposition
  frames: Frame[]   // 1–5 frames
  outputSize: 512 | 1024 | 2048
  fps: number       // default 30
  activeFrameId: string
}

// Derived for rendering — never stored
type FrameSnapshot = {
  layers: Layer[]
  durationFrames: number
}

function resolveFrame(base: BaseComposition, frame: Frame): FrameSnapshot
```

All project state lives in React `useState` in `TexturePlaygroundClient`. No external store needed for this phase.

---

## Granola Colour Palette

Available as swatches in the colour picker. Line colour is always `#1E1E1E` and is not user-selectable.

**Neutrals (light):** `#EBEBE4` `#F2F2EC` `#F8F8F3` `#FCFCF9` `#FFFFFF`  
**Neutrals (dark):** `#1E1E1E` `#333332` `#686865` `#898985` `#A9A9A5` `#D9D9D9`  
**Primary (greens):** `#434625` `#5B6F00` `#788C15` `#B2C248` `#D1E043` `#E5EACD`  
**Secondary blues:** `#3E49B8` `#4691E2` `#B8D5FF` `#D2E4F8`  
**Secondary purples:** `#564391` `#A191CE` `#CEBEF8` `#E8E4F3`  
**Secondary pinks:** `#A42962` `#FF91E0` `#FFBCEF` `#FFDEF6`  
**Secondary reds:** `#BD4A30` `#E95D3D` `#F29E8B` `#F8CEC5`  
**Secondary ambers:** `#8B4E23` `#ED9212` `#FFB567` `#FFEAA6`  
**Secondary khakis:** `#40351A` `#BB9F56` `#E5CD75` `#EDE1A1`

---

## PixiJS Rendering Architecture

### RendererAdapter — UI/engine boundary

All PixiJS access goes through a `RendererAdapter` interface. React never touches Pixi objects directly. This decouples the UI state flow from the rendering engine, making the code easier to extract and the engine easier to swap or test.

```ts
interface RendererAdapter {
  init(host: HTMLElement, size: number): Promise<void>
  renderFrame(snapshot: FrameSnapshot): void  // called on each state change
  setSize(size: number): void
  exportPng(): Promise<Blob>                  // current frame
  destroy(): void
}
```

`PixiRenderer` implements this interface. `CanvasPreview.tsx` holds the adapter instance via `useRef` and calls it; React state flows in one direction only.

### Internal Pixi structure

```
PIXI.Application
  └── stage (PIXI.Container)
        ├── backgroundLayer   (PIXI.Graphics — filled rect)
        ├── gridLayer1        (PIXI.Graphics — composition)
        ├── gridLayer2?       (PIXI.Graphics — optional second grid)
        └── imageLayer?       (PIXI.Sprite  — uploaded image)
```

### Dirty-layer updates

Layers are **not rebuilt from scratch on every parameter change**. Instead, each `PIXI.Graphics` object is kept alive; `renderFrame()` calls `.clear()` and redraws only the geometry that changed. Layer identity is tracked by `layer.id`. A new layer object is only created when a layer is added or its `kind` changes.

### Composition draw functions (in `lib/draw.ts`)

```ts
function drawDotGrid(g: PIXI.Graphics, params: DotGridParams): void
function drawRegularGrid(g: PIXI.Graphics, params: RegularGridParams): void
function drawVariableGrid(g: PIXI.Graphics, params: VariableGridParams): void
function drawLinear(g: PIXI.Graphics, params: LinearParams): void
function drawLayered(g: PIXI.Graphics, params: LayeredParams): void
function drawCheckered(g: PIXI.Graphics, params: CheckeredParams): void
```

Each is a pure function — takes a Graphics object and params, returns nothing. No React, no Pixi app — easy to unit test and portable.

### Filters (Phase 2)

```ts
// Phase 1 — none (clean geometric output)
// Phase 2 — attach to individual layers or stage:
layer.filters = [new PIXI.NoiseFilter({ noise: 0.3 })]
layer.filters = [new filters.PixelateFilter(8)]
layer.filters = [new filters.DisplacementFilter(displacementSprite)]
```

---

## Playback & Export

### Playback (preview in editor)

`usePlayback(adapter, project)` hook drives a `requestAnimationFrame` loop:

```
for each frame in project.frames:
  adapter.renderFrame(resolveFrame(base, frame))
  hold for frame.durationFrames / project.fps seconds
→ loop
```

Renders into the same canvas as the editor. The "editing F1" badge switches to a play indicator.

### Export — fast preview (WebM via MediaRecorder)

```
1. app.canvas.captureStream(project.fps) → MediaStream
2. new MediaRecorder(stream, { mimeType: 'video/webm' })
3. Run playback loop once (one full cycle)
4. recorder.stop() → Blob chunks → download
```

Quick to produce, timing is runtime-dependent. Suitable for visual review.

### Export — deterministic (WebM via WebCodecs + webm-muxer)

Frame-perfect loop. No runtime timing drift.

```
1. For each frame in project.frames:
   a. adapter.renderFrame(resolveFrame(base, frame))
   b. canvas.transferToImageBitmap() → exact pixel snapshot
   c. new VideoFrame(bitmap, { timestamp, duration })  // duration = durationFrames / fps
   d. encoder.encode(videoFrame); videoFrame.close()
   e. Repeat frame for durationFrames ticks
2. await encoder.flush()
3. webm-muxer finalises container → Blob → download
```

`timestamp` and `duration` are computed from `durationFrames / fps` — no wall-clock dependency.

### Export — PNG (current frame)

```
app.renderer.extract.canvas(app.stage) → .toBlob('image/png') → download
```

---

## Resource Cleanup

Explicit rules — enforced in `CanvasPreview.tsx` and the image upload handler:

| Event | Action |
|---|---|
| Image layer replaced or deleted | `URL.revokeObjectURL(layer.objectUrl)` |
| Component unmounts | `adapter.destroy()` → `app.destroy(true)` (destroys all Pixi resources) |
| Playback mode exits | Cancel active RAF loop via `cancelAnimationFrame` |
| Size changes | `adapter.setSize(size)` → resize renderer; do not recreate Pixi app |

---

## File Structure

```
app/texture-playground/
  page.tsx                          — server component, noindex meta
  TexturePlaygroundClient.tsx       — 'use client', project state, layout shell
  components/
    TopBar.tsx                      — size selector, export buttons
    LeftPanel.tsx                   — section layout wrapper
    CanvasPreview.tsx               — holds RendererAdapter ref, mounts canvas
    Timeline.tsx                    — frame strip, duration inputs, fps, play btn
    controls/
      CompositionPicker.tsx         — 6-chip grid
      LayerStack.tsx                — layer rows + add button
      LayerControls.tsx             — sliders/inputs for selected layer params
      ColorPicker.tsx               — Granola palette swatch grid
  lib/
    types.ts                        — all shared TypeScript types
    draw.ts                         — per-composition draw functions (pure, no React)
    renderer.ts                     — PixiRenderer implements RendererAdapter
    playback.ts                     — usePlayback(adapter, project) hook
    export.ts                       — exportWebMFast(), exportWebMDeterministic(), exportFramePng()
    resolve.ts                      — resolveFrame(base, frame): FrameSnapshot
```

**Reuse from existing portfolio:** `SliderControl` and `SelectControl` props API adapted from the gradient playground; visual style updated to match Geist + dark tool chrome.

---

## Colour & Typography (Tool Chrome)

- Background: `#0a0a0a` (app bg), `#111` (panels), `#0c0c0c` (canvas area)
- Borders: `#1e1e1e`, `#222`
- Text: `#e8e8e8` (primary), `#888` (secondary), `#444` (labels), `#333` (disabled)
- Accent: `#D1E043` (Granola lime — CTAs, active states, indicators)
- Font: `Geist` (UI labels, buttons), `Geist Mono` (section labels, values, monospace readouts)

---

## Out of Scope (this phase)

- Noise, distortion, pixelation, bloom filters (Phase 2 via `@pixi/filters`)
- Image preset library (upload-your-own covers Phase 1)
- Layer reordering via drag-and-drop
- Undo/redo
- Saving/loading projects
- MP4 export (`webm-muxer` can be swapped for `mp4-muxer` later with no other changes)

---

## Verification

1. `npm run dev` → navigate to `/texture-playground` — page loads, no console errors
2. Pick a composition, adjust sliders → canvas updates live without full layer rebuild
3. Switch composition type → old layer object replaced cleanly
4. Upload image layer → layer appears; delete it → `revokeObjectURL` called (check DevTools memory)
5. Add to timeline → frame thumbnail appears; build second frame → Add to timeline
6. Hit Play → animation loops at correct timing
7. Export frame → PNG downloads at selected resolution (verify dimensions)
8. Export WebM (fast) → file plays as looped video in browser
9. Export WebM (deterministic) → identical frame count and loop duration across two exports
10. Resize to 2048 with 5 frames + 3 layers → playback and export remain stable
11. Navigate away → no Pixi memory leak (DevTools heap snapshot)
12. `npm run build` → no TypeScript errors
