# Texture Playground Phase 2 — Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a permanent adjustment layer at the top of each frame's layer stack that applies up to 8 stackable GPU filters (noise, blur, pixelate, displacement, rgbsplit, colormatrix, halftone, glow) over the composited frame.

**Architecture:** A `layersContainer: Container` wraps all content layers in the PixiJS renderer; the adjustment layer's enabled filters are applied to `layersContainer.filters`. This is extensible to positional adjustment layers (Option B) by splitting into multiple containers later. One `AdjustmentLayer` exists permanently in every frame at the top of the stack.

**Tech Stack:** PixiJS v8 (already installed), `pixi-filters` v6 (new), Next.js App Router, TypeScript, React state.

---

## File Map

| File | Change |
|---|---|
| `lib/types.ts` | Add FilterEntry union, AdjustmentLayer, extend Layer union |
| `lib/filters.ts` | NEW — buildFilters() pure function |
| `lib/renderer.ts` | layersContainer, displacementSprite, filter application |
| `TexturePlaygroundClient.tsx` | DEFAULT_LAYERS update, 3 new handlers, LeftPanel props |
| `components/LeftPanel.tsx` | 3 new filter handler props |
| `components/controls/LayerControls.tsx` | adjustment case → FilterStack |
| `components/controls/FilterStack.tsx` | NEW — adjustment layer UI |
| `components/controls/FilterControls.tsx` | NEW — per-filter sliders |
| `components/controls/LayerStack.tsx` | adjustment layer row (✦, no delete) |
| `components/controls/CompositionIcon.tsx` | 'adjustment' icon |

---

### Task 1: Install pixi-filters

**Files:** `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install pixi-filters
```

- [ ] **Step 2: Verify installation**

```bash
cat package.json | grep pixi-filters
# Expected: "pixi-filters": "^6.x.x"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pixi-filters v6"
```

---

### Task 2: Extend types.ts

**Files:**
- Modify: `app/texture-playground/lib/types.ts`

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/lib/types.ts`. Currently Layer = BackgroundLayer | GridLayer | ImageLayer.

- [ ] **Step 2: Add FilterEntry types and AdjustmentLayer**

Replace the `LayerOverride` line and everything below it with:

```ts
// Used by LayerControls onChange callbacks — partial properties to apply to a layer
export type LayerOverride = Partial<Omit<GridLayer | BackgroundLayer | ImageLayer, 'id' | 'kind' | 'file'>>

// ── Filter types ──────────────────────────────────────────────────────────────

export type FilterType =
  | 'noise' | 'blur' | 'pixelate' | 'displacement'
  | 'rgbsplit' | 'colormatrix' | 'halftone' | 'glow'

export type FilterEntry =
  | { type: 'noise';        enabled: boolean; intensity: number }
  | { type: 'blur';         enabled: boolean; strength: number }
  | { type: 'pixelate';     enabled: boolean; size: number }
  | { type: 'displacement'; enabled: boolean; scale: number }
  | { type: 'rgbsplit';     enabled: boolean; amount: number }
  | { type: 'colormatrix';  enabled: boolean; brightness: number; contrast: number; saturation: number; hue: number; invert: boolean }
  | { type: 'halftone';     enabled: boolean; scale: number; angle: number }
  | { type: 'glow';         enabled: boolean; distance: number; strength: number; color: string }

export type AdjustmentLayer = {
  id: string
  kind: 'adjustment'
  filters: FilterEntry[]
}

export type Layer = BackgroundLayer | GridLayer | ImageLayer | AdjustmentLayer

export type Frame = {
  id: string
  layers: Layer[]
  durationFrames: number
}

export type Project = {
  frames: Frame[]
  outputSize: 512 | 1024 | 2048
  fps: number
  activeFrameId: string
}

export type FrameSnapshot = {
  layers: Layer[]
  durationFrames: number
}

export interface RendererAdapter {
  init(host: HTMLElement, size: number): Promise<void>
  renderFrame(snapshot: FrameSnapshot): void
  setSize(size: number): void
  exportPng(): Promise<Blob>
  destroy(): void
}
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: errors about AdjustmentLayer not handled in renderer/controls — these are fixed in later tasks.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/lib/types.ts
git commit -m "feat: add FilterEntry and AdjustmentLayer types"
```

---

### Task 3: Create lib/filters.ts

**Files:**
- Create: `app/texture-playground/lib/filters.ts`

This is a pure function — no React, no side effects. Takes an array of FilterEntry and a displacement sprite, returns an array of PixiJS Filter instances (only enabled ones).

- [ ] **Step 1: Create the file**

```ts
// app/texture-playground/lib/filters.ts
import {
  NoiseFilter,
  BlurFilter,
  ColorMatrixFilter,
  DisplacementFilter,
  type Filter,
  type Sprite,
} from 'pixi.js'
import { PixelateFilter } from 'pixi-filters/pixelate'
import { GlowFilter } from 'pixi-filters/glow'
import type { FilterEntry } from './types'

// RGBSplitFilter and HalftoneFilter — import from pixi-filters main bundle
// (subpath exports may not exist for all filters in v6)
import { RGBSplitFilter, HalftoneFilter } from 'pixi-filters'

export function buildFilters(
  entries: FilterEntry[],
  displacementSprite: Sprite | null,
): Filter[] {
  return entries
    .filter((e) => e.enabled)
    .flatMap((entry): Filter[] => {
      switch (entry.type) {
        case 'noise':
          return [new NoiseFilter({ noise: entry.intensity, seed: Math.random() })]

        case 'blur':
          return [new BlurFilter({ strength: entry.strength })]

        case 'pixelate':
          return [new PixelateFilter(entry.size)]

        case 'displacement': {
          if (!displacementSprite) return []
          return [new DisplacementFilter({ sprite: displacementSprite, scale: entry.scale })]
        }

        case 'rgbsplit':
          return [new RGBSplitFilter({
            red: [-entry.amount, 0] as [number, number],
            green: [0, 0] as [number, number],
            blue: [entry.amount, 0] as [number, number],
          })]

        case 'colormatrix': {
          const f = new ColorMatrixFilter()
          f.brightness(entry.brightness, false)
          f.contrast(entry.contrast, false)
          f.saturate(entry.saturation - 1, false)  // saturate() takes delta, not absolute
          f.hue(entry.hue, false)
          if (entry.invert) f.negative(false)
          return [f]
        }

        case 'halftone':
          return [new HalftoneFilter({ scale: entry.scale, angle: entry.angle })]

        case 'glow':
          return [new GlowFilter({
            distance: entry.distance,
            outerStrength: entry.strength,
            color: parseInt(entry.color.replace('#', ''), 16),
            quality: 0.5,
          })]
      }
    })
}
```

- [ ] **Step 2: Build check — filters.ts compiles**

```bash
npm run build 2>&1 | grep "filters.ts" | head -10
```

If RGBSplitFilter or HalftoneFilter import fails (subpath not found), change the import to:
```ts
import * as pixiFilters from 'pixi-filters'
const { RGBSplitFilter, HalftoneFilter } = pixiFilters
```

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/lib/filters.ts
git commit -m "feat: add buildFilters pure function for all 8 filter types"
```

---

### Task 4: Update renderer.ts — layersContainer + filter application

**Files:**
- Modify: `app/texture-playground/lib/renderer.ts`

The renderer currently adds all layer Graphics/Sprites directly to `app.stage`. This task wraps them in a `layersContainer` and applies adjustment filters to it.

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/lib/renderer.ts` in full.

- [ ] **Step 2: Add imports and new private fields**

Add to imports:
```ts
import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js'
import { drawBackground, drawGridLayer } from './draw'
import { buildFilters } from './filters'
import type { FrameSnapshot, RendererAdapter, AdjustmentLayer } from './types'
```

Add private fields to the class:
```ts
private layersContainer: Container | null = null
private displacementSprite: Sprite | null = null
```

- [ ] **Step 3: Update init() to create layersContainer and displacement sprite**

Replace the `init()` method body after `this.initialized = true` line with the additions:

```ts
async init(host: HTMLElement, size: number): Promise<void> {
  if (this.app) return
  this.size = size
  const app = new Application()
  this.app = app
  await app.init({
    canvas: host as HTMLCanvasElement,
    width: size,
    height: size,
    antialias: true,
    backgroundColor: 0xffffff,
  })
  if (this.app !== app) return
  this.initialized = true

  // Wrap all content layers in a container so filters apply to the composite
  this.layersContainer = new Container()
  app.stage.addChild(this.layersContainer)

  // Generate a white-noise sprite for DisplacementFilter
  const noiseSize = 256
  const canvas = document.createElement('canvas')
  canvas.width = noiseSize
  canvas.height = noiseSize
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(noiseSize, noiseSize)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256)
    imageData.data[i] = v
    imageData.data[i + 1] = v
    imageData.data[i + 2] = v
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
  const noiseTex = Texture.from(canvas)
  this.displacementSprite = new Sprite(noiseTex)
  this.displacementSprite.texture.source.addressMode = 'repeat'
}
```

- [ ] **Step 4: Update renderFrame() to partition layers and apply filters**

Replace the entire `renderFrame()` method:

```ts
renderFrame(snapshot: FrameSnapshot): void {
  if (!this.initialized || !this.app || !this.layersContainer) return
  const container = this.layersContainer
  const size = this.size

  // Partition: content layers go into layersContainer, adjustment layer applies filters
  const contentLayers = snapshot.layers.filter((l) => l.kind !== 'adjustment')
  const adjustmentLayer = snapshot.layers.find((l) => l.kind === 'adjustment') as AdjustmentLayer | undefined

  // Remove graphics for content layers that no longer exist
  const contentIds = new Set(contentLayers.map((l) => l.id))
  for (const id of [...this.layerGraphics.keys()]) {
    if (!contentIds.has(id)) {
      const g = this.layerGraphics.get(id)!
      container.removeChild(g)
      g.destroy()
      this.layerGraphics.delete(id)
      this.layerUrls.delete(id)
    }
  }

  // Render content layers bottom-to-top into layersContainer
  contentLayers.forEach((layer, index) => {
    if (layer.kind === 'background') {
      let g = this.layerGraphics.get(layer.id) as Graphics | undefined
      if (!g) {
        g = new Graphics()
        this.layerGraphics.set(layer.id, g)
      }
      drawBackground(g, layer.color, size)
      ensureChildAt(container, g, index)
      return
    }

    if (layer.kind === 'grid') {
      let g = this.layerGraphics.get(layer.id) as Graphics | undefined
      if (!g) {
        g = new Graphics()
        this.layerGraphics.set(layer.id, g)
      }
      drawGridLayer(g, layer, size)
      ensureChildAt(container, g, index)
      return
    }

    if (layer.kind === 'image') {
      const existingSprite = this.layerGraphics.get(layer.id) as Sprite | undefined
      const prevUrl = this.layerUrls.get(layer.id)
      let sprite = existingSprite
      if (!sprite || prevUrl !== layer.objectUrl) {
        existingSprite?.destroy()
        const tex = Texture.from(layer.objectUrl)
        sprite = new Sprite(tex)
        this.layerGraphics.set(layer.id, sprite)
        this.layerUrls.set(layer.id, layer.objectUrl)
      }
      sprite.alpha = layer.opacity
      sprite.scale.set(layer.scale)
      sprite.x = layer.x
      sprite.y = layer.y
      ensureChildAt(container, sprite, Math.min(index, container.children.length))
    }
  })

  // Apply adjustment layer filters to the container
  container.filters = adjustmentLayer
    ? buildFilters(adjustmentLayer.filters, this.displacementSprite)
    : []

  this.app.renderer.render(this.app.stage)
}
```

- [ ] **Step 5: Update destroy() to null displacementSprite and layersContainer**

Add before the final `app.destroy(true)` call:

```ts
destroy(): void {
  this.initialized = false
  for (const g of [...this.layerGraphics.values()]) {
    try { g.destroy() } catch { /* ignore */ }
  }
  this.layerGraphics.clear()
  this.layerUrls.clear()
  this.displacementSprite?.destroy()
  this.displacementSprite = null
  this.layersContainer = null  // app.destroy(true) handles the actual cleanup
  const app = this.app
  this.app = null
  if (app) {
    try { app.destroy(true) } catch { /* may throw if destroyed before init resolved */ }
  }
}
```

- [ ] **Step 6: Build check**

```bash
npm run build 2>&1 | grep -E "renderer.ts.*error|error.*renderer.ts" | head -10
```

- [ ] **Step 7: Commit**

```bash
git add app/texture-playground/lib/renderer.ts
git commit -m "feat: wrap content layers in container, apply adjustment filters"
```

---

### Task 5: Create FilterControls.tsx

**Files:**
- Create: `app/texture-playground/components/controls/FilterControls.tsx`

Per-filter parameter sliders. A single component that receives one `FilterEntry` and renders its controls.

- [ ] **Step 1: Create the file**

```tsx
// app/texture-playground/components/controls/FilterControls.tsx
'use client'
import type { FilterEntry } from '../../lib/types'

type Props = {
  entry: FilterEntry
  onChange: (changes: Partial<FilterEntry>) => void
}

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, unit = '', onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 9, color: '#555' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#777' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#D1E043', cursor: 'pointer' }}
      />
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontFamily: 'var(--font-geist)', fontSize: 9, color: '#555' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 28, height: 14, borderRadius: 7, padding: '0 2px',
          background: value ? '#1a2208' : '#1a1a1a',
          border: `1px solid ${value ? '#D1E043' : '#333'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: value ? 'flex-end' : 'flex-start',
          transition: 'all 0.15s',
        }}
      >
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: value ? '#D1E043' : '#444',
          transition: 'all 0.15s',
        }} />
      </button>
    </div>
  )
}

export default function FilterControls({ entry, onChange }: Props) {
  switch (entry.type) {
    case 'noise':
      return <Slider label="Intensity" value={entry.intensity} min={0} max={1} step={0.01} onChange={(v) => onChange({ intensity: v })} />

    case 'blur':
      return <Slider label="Strength" value={entry.strength} min={0} max={20} step={0.5} unit="px" onChange={(v) => onChange({ strength: v })} />

    case 'pixelate':
      return <Slider label="Size" value={entry.size} min={1} max={50} step={1} unit="px" onChange={(v) => onChange({ size: v })} />

    case 'displacement':
      return <Slider label="Scale" value={entry.scale} min={0} max={100} step={1} onChange={(v) => onChange({ scale: v })} />

    case 'rgbsplit':
      return <Slider label="Amount" value={entry.amount} min={0} max={30} step={0.5} unit="px" onChange={(v) => onChange({ amount: v })} />

    case 'colormatrix':
      return (
        <div>
          <Slider label="Brightness" value={entry.brightness} min={0} max={2} step={0.02} onChange={(v) => onChange({ brightness: v })} />
          <Slider label="Contrast" value={entry.contrast} min={0} max={2} step={0.02} onChange={(v) => onChange({ contrast: v })} />
          <Slider label="Saturation" value={entry.saturation} min={0} max={2} step={0.02} onChange={(v) => onChange({ saturation: v })} />
          <Slider label="Hue" value={entry.hue} min={-180} max={180} step={1} unit="°" onChange={(v) => onChange({ hue: v })} />
          <Toggle label="Invert" value={entry.invert} onChange={(v) => onChange({ invert: v })} />
        </div>
      )

    case 'halftone':
      return (
        <div>
          <Slider label="Scale" value={entry.scale} min={1} max={20} step={0.5} unit="px" onChange={(v) => onChange({ scale: v })} />
          <Slider label="Angle" value={entry.angle} min={0} max={180} step={1} unit="°" onChange={(v) => onChange({ angle: v })} />
        </div>
      )

    case 'glow':
      return (
        <div>
          <Slider label="Distance" value={entry.distance} min={1} max={30} step={1} unit="px" onChange={(v) => onChange({ distance: v })} />
          <Slider label="Strength" value={entry.strength} min={0} max={10} step={0.1} onChange={(v) => onChange({ strength: v })} />
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-geist)', fontSize: 9, color: '#555', marginBottom: 4 }}>Colour</div>
            <input
              type="color" value={entry.color}
              onChange={(e) => onChange({ color: e.target.value })}
              style={{ width: '100%', height: 24, border: '1px solid #222', borderRadius: 3, cursor: 'pointer', background: 'none', padding: 0 }}
            />
          </div>
        </div>
      )
  }
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | grep "FilterControls" | head -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/components/controls/FilterControls.tsx
git commit -m "feat: add FilterControls per-filter parameter sliders"
```

---

### Task 6: Create FilterStack.tsx

**Files:**
- Create: `app/texture-playground/components/controls/FilterStack.tsx`

Renders the full adjustment layer UI: list of active filters with enable/disable toggle and delete, plus an "+ Add filter" picker.

- [ ] **Step 1: Create the file**

```tsx
// app/texture-playground/components/controls/FilterStack.tsx
'use client'
import { useState } from 'react'
import type { AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'
import FilterControls from './FilterControls'
import CompositionIcon from './CompositionIcon'

type Props = {
  layer: AdjustmentLayer
  onAdd: (entry: FilterEntry) => void
  onChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemove: (filterType: FilterType) => void
}

const FILTER_DEFAULTS: Record<FilterType, FilterEntry> = {
  noise:        { type: 'noise',        enabled: true, intensity: 0.4 },
  blur:         { type: 'blur',         enabled: true, strength: 4 },
  pixelate:     { type: 'pixelate',     enabled: true, size: 8 },
  displacement: { type: 'displacement', enabled: true, scale: 30 },
  rgbsplit:     { type: 'rgbsplit',     enabled: true, amount: 6 },
  colormatrix:  { type: 'colormatrix',  enabled: true, brightness: 1, contrast: 1, saturation: 1, hue: 0, invert: false },
  halftone:     { type: 'halftone',     enabled: true, scale: 5, angle: 45 },
  glow:         { type: 'glow',         enabled: true, distance: 10, strength: 2, color: '#D1E043' },
}

const FILTER_LABELS: Record<FilterType, string> = {
  noise: 'Noise', blur: 'Blur', pixelate: 'Pixelate', displacement: 'Displacement',
  rgbsplit: 'RGB Split', colormatrix: 'Colour Adjust', halftone: 'Halftone', glow: 'Glow',
}

export default function FilterStack({ layer, onAdd, onChange, onRemove }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const activeTypes = new Set(layer.filters.map((f) => f.type))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {layer.filters.map((entry) => (
        <div
          key={entry.type}
          style={{
            border: '1px solid #1e1e1e',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 8px', background: '#151515',
          }}>
            {/* Enable toggle */}
            <button
              onClick={() => onChange(entry.type, { enabled: !entry.enabled })}
              title={entry.enabled ? 'Disable' : 'Enable'}
              style={{
                width: 10, height: 10, borderRadius: '50%', padding: 0, border: 'none',
                background: entry.enabled ? '#D1E043' : '#333',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: entry.enabled ? '#bbb' : '#444', fontWeight: 500, flex: 1 }}>
              {FILTER_LABELS[entry.type]}
            </span>
            <button
              onClick={() => onRemove(entry.type)}
              style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
              title="Remove filter"
            >
              ×
            </button>
          </div>
          {/* Controls — only when enabled */}
          {entry.enabled && (
            <div style={{ padding: '8px 8px 4px', background: '#111' }}>
              <FilterControls
                entry={entry}
                onChange={(changes) => onChange(entry.type, changes)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Add filter button + picker */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setPickerOpen((o) => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
            background: 'none', border: '1px dashed #222', color: '#333',
            fontSize: 10, fontFamily: 'var(--font-geist)',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add filter
        </button>

        {pickerOpen && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
            background: '#111', border: '1px solid #222', borderRadius: 6,
            padding: 6, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10,
          }}>
            {(Object.keys(FILTER_DEFAULTS) as FilterType[]).map((type) => {
              const active = activeTypes.has(type)
              return (
                <button
                  key={type}
                  disabled={active}
                  onClick={() => { onAdd(FILTER_DEFAULTS[type]); setPickerOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '5px 8px', borderRadius: 4, border: 'none',
                    background: active ? 'transparent' : '#161616',
                    color: active ? '#333' : '#888',
                    fontSize: 10, fontFamily: 'var(--font-geist)',
                    cursor: active ? 'default' : 'pointer', textAlign: 'left',
                  }}
                >
                  {FILTER_LABELS[type]}
                  {active && <span style={{ marginLeft: 'auto', fontSize: 8, color: '#333' }}>active</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | grep "FilterStack" | head -5
```

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/components/controls/FilterStack.tsx
git commit -m "feat: add FilterStack adjustment layer UI with add/toggle/remove"
```

---

### Task 7: Update TexturePlaygroundClient.tsx

**Files:**
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

Add adjustment layer to DEFAULT_LAYERS, fix add-layer handlers to insert before it, add 3 filter handlers, thread new props to LeftPanel.

- [ ] **Step 1: Update DEFAULT_LAYERS**

```ts
const DEFAULT_LAYERS: Layer[] = [
  { id: 'bg', kind: 'background', color: '#434625' },
  { id: 'g1', kind: 'grid', composition: 'dot-grid', spacing: 18, thickness: 1, dotSize: 3, opacity: 1, scale: 1 },
  { id: 'adj', kind: 'adjustment', filters: [] },
]
```

- [ ] **Step 2: Update handleAddGridLayer to insert before the adjustment layer**

```ts
function handleAddGridLayer(composition: CompositionType) {
  const newLayer: GridLayer = {
    id: nanoid(6), kind: 'grid', composition,
    spacing: 20, thickness: 1, dotSize: 3, opacity: 1, scale: 1,
  }
  setProject(p => ({
    ...p,
    frames: p.frames.map(f => {
      if (f.id !== p.activeFrameId) return f
      const adjLayers = f.layers.filter(l => l.kind === 'adjustment')
      const contentLayers = f.layers.filter(l => l.kind !== 'adjustment')
      return { ...f, layers: [...contentLayers, newLayer, ...adjLayers] }
    }),
  }))
  setSelectedLayerId(newLayer.id)
}
```

- [ ] **Step 3: Update handleAddImageLayer the same way**

```ts
function handleAddImageLayer(file: File) {
  const objectUrl = URL.createObjectURL(file)
  const newLayer: ImageLayer = {
    id: nanoid(6), kind: 'image', file, objectUrl,
    scale: 1, x: 0, y: 0, opacity: 1,
  }
  setProject(p => ({
    ...p,
    frames: p.frames.map(f => {
      if (f.id !== p.activeFrameId) return f
      const adjLayers = f.layers.filter(l => l.kind === 'adjustment')
      const contentLayers = f.layers.filter(l => l.kind !== 'adjustment')
      return { ...f, layers: [...contentLayers, newLayer, ...adjLayers] }
    }),
  }))
  setSelectedLayerId(newLayer.id)
}
```

- [ ] **Step 4: Add the three filter handlers**

Add these after `handleDeleteFrame`:

```ts
function handleAddFilter(entry: FilterEntry) {
  setProject(p => ({
    ...p,
    frames: p.frames.map(f =>
      f.id !== p.activeFrameId ? f : {
        ...f,
        layers: f.layers.map(l =>
          l.kind === 'adjustment' ? { ...l, filters: [...l.filters, entry] } : l
        ),
      }
    ),
  }))
}

function handleFilterChange(filterType: FilterType, changes: Partial<FilterEntry>) {
  setProject(p => ({
    ...p,
    frames: p.frames.map(f =>
      f.id !== p.activeFrameId ? f : {
        ...f,
        layers: f.layers.map(l =>
          l.kind !== 'adjustment' ? l : {
            ...l,
            filters: l.filters.map(fe =>
              fe.type === filterType ? { ...fe, ...changes } as FilterEntry : fe
            ),
          }
        ),
      }
    ),
  }))
}

function handleRemoveFilter(filterType: FilterType) {
  setProject(p => ({
    ...p,
    frames: p.frames.map(f =>
      f.id !== p.activeFrameId ? f : {
        ...f,
        layers: f.layers.map(l =>
          l.kind !== 'adjustment' ? l : {
            ...l,
            filters: l.filters.filter(fe => fe.type !== filterType),
          }
        ),
      }
    ),
  }))
}
```

- [ ] **Step 5: Add FilterEntry and FilterType to imports from types**

```ts
import type { Project, RendererAdapter, Layer, CompositionType, GridLayer, ImageLayer, LayerOverride, Frame, FilterEntry, FilterType } from './lib/types'
```

- [ ] **Step 6: Pass new props to LeftPanel**

In the LeftPanel JSX, add the three new props:

```tsx
<LeftPanel
  snapshot={snapshot}
  selectedLayerId={selectedLayerId}
  onSelectLayer={setSelectedLayerId}
  onLayerChange={handleLayerChange}
  onAddGridLayer={handleAddGridLayer}
  onDeleteLayer={handleDeleteLayer}
  onAddImageLayer={handleAddImageLayer}
  onAddToTimeline={handleAddToTimeline}
  activeComposition={pickerComposition}
  onChangeComposition={(c) => {
    setActiveComposition(c)
    if (selectedLayerResolved?.kind === 'grid') handleLayerChange(selectedLayerId, { composition: c })
  }}
  onAddFilter={handleAddFilter}
  onFilterChange={handleFilterChange}
  onRemoveFilter={handleRemoveFilter}
/>
```

- [ ] **Step 7: Build check**

```bash
npm run build 2>&1 | grep "TexturePlaygroundClient" | head -10
```

Expected: type errors about LeftPanel not accepting the new props — fixed in the next task.

- [ ] **Step 8: Commit**

```bash
git add app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add adjustment layer to default state and filter handlers"
```

---

### Task 8: Update LeftPanel.tsx and LayerControls.tsx

**Files:**
- Modify: `app/texture-playground/components/LeftPanel.tsx`
- Modify: `app/texture-playground/components/controls/LayerControls.tsx`

Thread filter handler props through LeftPanel and add the `adjustment` case to LayerControls.

- [ ] **Step 1: Update LeftPanel Props and signature**

Add to the `Props` type in `LeftPanel.tsx`:

```ts
import type { CompositionType, LayerOverride, FrameSnapshot, FilterEntry, FilterType, AdjustmentLayer } from '../lib/types'
import FilterStack from './controls/FilterStack'

type Props = {
  snapshot: FrameSnapshot
  selectedLayerId: string
  onSelectLayer: (id: string) => void
  onLayerChange: (layerId: string, override: LayerOverride) => void
  onAddGridLayer: (composition: CompositionType) => void
  onDeleteLayer: (id: string) => void
  onAddImageLayer: (file: File) => void
  onAddToTimeline: () => void
  activeComposition: CompositionType
  onChangeComposition: (c: CompositionType) => void
  onAddFilter: (entry: FilterEntry) => void
  onFilterChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemoveFilter: (filterType: FilterType) => void
}
```

Update the function signature to include the new props and pass them to LayerControls:

```tsx
export default function LeftPanel({
  snapshot, selectedLayerId, onSelectLayer, onLayerChange,
  onAddGridLayer, onDeleteLayer, onAddImageLayer, onAddToTimeline,
  activeComposition, onChangeComposition,
  onAddFilter, onFilterChange, onRemoveFilter,
}: Props) {
  const selectedLayer = snapshot.layers.find(l => l.id === selectedLayerId)

  return (
    <div style={{ width: 192, background: '#111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Composition</div>
        <CompositionPicker value={activeComposition} onChange={onChangeComposition} />
      </div>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Layers</div>
        <LayerStack
          layers={snapshot.layers}
          selectedId={selectedLayerId}
          onSelect={onSelectLayer}
          onAdd={() => onAddGridLayer(activeComposition)}
          onDelete={onDeleteLayer}
          onAddImage={onAddImageLayer}
        />
      </div>

      <div style={{ ...SECTION, flex: 1, overflowY: 'auto' }}>
        <div style={SECTION_LABEL}>
          {selectedLayer?.kind === 'adjustment' ? 'Filters' : 'Parameters'}
        </div>
        {selectedLayer ? (
          <LayerControls
            layer={selectedLayer}
            onChange={(override) => onLayerChange(selectedLayer.id, override)}
            onAddFilter={onAddFilter}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
          />
        ) : (
          <span style={{ fontSize: 10, color: '#444' }}>Select a layer</span>
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #1a1a1a' }}>
        <button
          onClick={onAddToTimeline}
          style={{
            width: '100%', fontFamily: 'var(--font-geist)', fontSize: 11, fontWeight: 500,
            background: '#D1E043', color: '#111', border: 'none',
            borderRadius: 6, padding: '8px 10px', cursor: 'pointer', textAlign: 'center',
          }}
        >
          Add to timeline →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update LayerControls.tsx to add adjustment case**

Add to imports: `import type { AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'`
Add to imports: `import FilterStack from './FilterStack'`

Update the Props type:

```ts
type Props = {
  layer: Layer
  onChange: (override: LayerOverride) => void
  onAddFilter: (entry: FilterEntry) => void
  onFilterChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemoveFilter: (filterType: FilterType) => void
}
```

Update the function signature and add the adjustment case before the background check:

```tsx
export default function LayerControls({ layer, onChange, onAddFilter, onFilterChange, onRemoveFilter }: Props) {
  if (layer.kind === 'adjustment') {
    return (
      <FilterStack
        layer={layer}
        onAdd={onAddFilter}
        onChange={onFilterChange}
        onRemove={onRemoveFilter}
      />
    )
  }

  if (layer.kind === 'background') {
    // ... existing background case
  }
  // ... rest unchanged
}
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "error TS" | head -20
```

Expected: clean or only minor type warnings.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/components/LeftPanel.tsx app/texture-playground/components/controls/LayerControls.tsx
git commit -m "feat: thread filter handlers through LeftPanel to LayerControls"
```

---

### Task 9: Update LayerStack and CompositionIcon for adjustment layer

**Files:**
- Modify: `app/texture-playground/components/controls/LayerStack.tsx`
- Modify: `app/texture-playground/components/controls/CompositionIcon.tsx`

The adjustment layer always shows at the top of the visual stack with a ✦ icon and no delete button.

- [ ] **Step 1: Add 'adjustment' to CompositionIcon**

In `CompositionIcon.tsx`, add `'adjustment'` to the `LayerIconType` union:

```ts
export type LayerIconType = CompositionType | 'background' | 'image' | 'adjustment'
```

Add the case to the switch (before the closing of the switch):

```tsx
case 'adjustment':
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2 L9.5 6.5 L14 6.5 L10.5 9.5 L12 14 L8 11 L4 14 L5.5 9.5 L2 6.5 L6.5 6.5 Z"
        stroke={color} strokeWidth={1} strokeLinejoin="round" fill="none" />
    </svg>
  )
```

- [ ] **Step 2: Update LayerStack to render adjustment layer specially**

In `LayerStack.tsx`, update `layerLabel` and `layerIconType` functions:

```ts
function layerLabel(layer: Layer): string {
  if (layer.kind === 'background') return 'Background'
  if (layer.kind === 'grid') return layer.composition.replace(/-/g, ' ')
  if (layer.kind === 'adjustment') return 'Adjustments'
  return 'Image'
}

function layerIconType(layer: Layer): LayerIconType {
  if (layer.kind === 'background') return 'background'
  if (layer.kind === 'image') return 'image'
  if (layer.kind === 'adjustment') return 'adjustment'
  return layer.composition
}
```

Update the layer row rendering to suppress the delete button for `adjustment` kind (it already suppresses it for `background`, extend the condition):

```tsx
{layer.kind !== 'background' && layer.kind !== 'adjustment' && (
  <button
    onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
    style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
    title="Delete layer"
  >
    ×
  </button>
)}
```

Give the adjustment layer row a subtle lime left border when unselected to distinguish it:

```tsx
style={{
  display: 'flex', alignItems: 'center', gap: 7,
  padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
  background: selected ? '#161616' : 'transparent',
  color: selected ? '#e8e8e8' : '#666',
  fontSize: 11, fontFamily: 'var(--font-geist)',
  borderLeft: layer.kind === 'adjustment' ? `2px solid ${selected ? '#D1E043' : '#2a3a10'}` : '2px solid transparent',
}}
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "error TS" | head -20
```

Expected: clean build.

- [ ] **Step 4: Start dev server and manually verify**

```bash
npm run dev
```

Open `http://localhost:3000/texture-playground` and check:
- ✦ Adjustments row appears at top of layer stack with lime left border
- Clicking it shows "Filters" section with "+ Add filter" button
- Adding Noise shows a slider
- Toggling the green dot enables/disables the filter (canvas updates)
- Adding Colour Adjust shows brightness/contrast/saturation/hue sliders + invert toggle
- Export WebM still works (filters render into export)

- [ ] **Step 5: Commit**

```bash
git add app/texture-playground/components/controls/LayerStack.tsx app/texture-playground/components/controls/CompositionIcon.tsx
git commit -m "feat: adjustment layer display in LayerStack with star icon"
```

---

### Task 10: Final build and push

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: exits 0 with no TypeScript errors.

- [ ] **Step 2: Fix any remaining type errors**

Common issues to look for:
- `AdjustmentLayer` not handled in a switch somewhere — add a `case 'adjustment': return` or `l.kind !== 'adjustment'` guard
- `layerGraphics` in renderer iterating over adjustment layer id — already handled since adjustment layer is filtered out of `contentLayers`
- `handleDeleteLayer` — adjustment layer can't be deleted (LayerStack hides the button), but add a guard in the handler:

```ts
function handleDeleteLayer(layerId: string) {
  setProject(p => ({
    ...p,
    frames: p.frames.map(f => {
      if (f.id !== p.activeFrameId) return f
      const layer = f.layers.find(l => l.id === layerId)
      if (!layer || layer.kind === 'adjustment') return f  // guard
      if (layer.kind === 'image') URL.revokeObjectURL(layer.objectUrl)
      return { ...f, layers: f.layers.filter(l => l.id !== layerId) }
    }),
  }))
  setSelectedLayerId(prev => prev === layerId ? 'bg' : prev)
}
```

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "feat: Phase 2 filters — adjustment layer with 8 stackable GPU filters

- AdjustmentLayer (kind: 'adjustment') sits permanently at top of stack
- buildFilters() maps FilterEntry[] to PixiJS filter instances
- Renderer wraps content layers in Container; adjustment filters apply to it
- Filters: noise, blur, pixelate, displacement, rgbsplit, colormatrix, halftone, glow
- ColorMatrix filter includes brightness/contrast/saturation/hue/invert
- FilterStack UI: add/toggle/remove per filter; FilterControls: per-filter sliders
- Architecture ready for Option B (positional adjustment layers)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git push
```
