# Midground Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `MidgroundLayer` — a PNG texture overlay (one per frame, optional) that renders above the background colour and below grid/filter layers, selectable from 11 built-in assets or user-uploaded.

**Architecture:** `MidgroundLayer` is a new member of the `Layer` union. Every new frame starts with `bg + midground(src:null) + adj(filters:[])` — midground and adj exist but are empty until the user activates them. The renderer renders midground as a full-canvas sprite (scaled to fill, alpha-composited). The picker lives in `LayerControls` when a midground layer is selected.

**Tech Stack:** Next.js App Router, PixiJS v8, TypeScript, React inline styles. No new dependencies.

---

## File Map

| File | Change |
|---|---|
| `public/textures/midground/` | NEW — copy 11 PNGs here |
| `app/texture-playground/lib/types.ts` | Add `MidgroundLayer`, extend `Layer` union + `LayerOverride` |
| `app/texture-playground/TexturePlaygroundClient.tsx` | Update `DEFAULT_LAYERS` + `handleAddToTimeline` |
| `app/texture-playground/lib/renderer.ts` | Add `midground` case to `renderFrame()` |
| `app/texture-playground/components/controls/MidgroundPicker.tsx` | NEW — thumbnail grid + upload |
| `app/texture-playground/components/controls/LayerControls.tsx` | Add `midground` case |
| `app/texture-playground/components/controls/LayerStack.tsx` | Label + icon for midground |
| `app/texture-playground/components/controls/CompositionIcon.tsx` | Add `'midground'` icon |

---

### Task 1: Copy midground PNGs to public/

**Files:**
- Create: `public/textures/midground/` (directory + 11 files)

- [ ] **Step 1: Copy the files**

```bash
mkdir -p /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio/public/textures/midground
cp "/Users/Tatiana/Dropbox (Personal)/Mac/Downloads/Midground-Textures/"*.png \
   /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio/public/textures/midground/
```

- [ ] **Step 2: Verify all 11 are there**

```bash
ls /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio/public/textures/midground/
# Expected: 1.png  2.png  3.png  4.png  5.png  6.png  7.png  8.png  9.png  10.png  11.png
```

- [ ] **Step 3: Commit**

```bash
cd /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio
git add public/textures/midground/
git commit -m "chore: add 11 midground texture PNGs to public assets"
```

---

### Task 2: Add MidgroundLayer to types.ts

**Files:**
- Modify: `app/texture-playground/lib/types.ts`

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/lib/types.ts`. Current `Layer` union is `BackgroundLayer | GridLayer | ImageLayer | AdjustmentLayer`.

- [ ] **Step 2: Add MidgroundLayer and update union**

After the `ImageLayer` type definition (before the filter types section), add:

```ts
export type MidgroundLayer = {
  id: string
  kind: 'midground'
  src: string | null  // '/textures/midground/1.png' or object URL; null = nothing selected
  label: string       // '1'–'11' for built-ins, filename for uploads, '' if unset
  opacity: number
  scale: number       // 1.0 = fills canvas exactly
  x: number           // pixel offset from top-left
  y: number
}
```

Update the `Layer` union:

```ts
export type Layer = BackgroundLayer | GridLayer | ImageLayer | MidgroundLayer | AdjustmentLayer
```

Update `LayerOverride` to include MidgroundLayer:

```ts
export type LayerOverride = Partial<Omit<GridLayer | BackgroundLayer | ImageLayer | MidgroundLayer, 'id' | 'kind' | 'file'>>
```

- [ ] **Step 3: Build check**

```bash
cd /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio && npm run build 2>&1 | grep "error TS" | head -20
```

Expected: errors about `midground` not handled in renderer/controls — fixed in later tasks.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/lib/types.ts
git commit -m "feat: add MidgroundLayer type to Layer union"
```

---

### Task 3: Update default frame state + new frame logic

**Files:**
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

Every frame (initial + every new one from timeline) must start with: bg (colour set) + midground (src: null) + adj (filters: []).

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/TexturePlaygroundClient.tsx`. Look at `DEFAULT_LAYERS`, `DEFAULT_PROJECT`, and `handleAddToTimeline`.

- [ ] **Step 2: Update DEFAULT_LAYERS**

```ts
const DEFAULT_LAYERS: Layer[] = [
  { id: 'bg',  kind: 'background',  color: '#434625' },
  { id: 'mid', kind: 'midground',   src: null, label: '', opacity: 1, scale: 1, x: 0, y: 0 },
  { id: 'adj', kind: 'adjustment',  filters: [] },
]
```

- [ ] **Step 3: Update handleAddToTimeline**

New frames inherit ALL layers from the current frame (full duplicate), each with a fresh ID. Duration is also inherited:

```ts
function handleAddToTimeline() {
  setProject(p => {
    const currentFrame = p.frames.find(f => f.id === p.activeFrameId) ?? p.frames[0]
    const newFrame: Frame = {
      id: nanoid(6),
      layers: currentFrame.layers.map(l => ({ ...l, id: nanoid(6) })),
      durationFrames: currentFrame.durationFrames,
    }
    return {
      ...p,
      frames: [...p.frames.slice(0, 4), newFrame],
      activeFrameId: newFrame.id,
    }
  })
}
```

- [ ] **Step 4: Add MidgroundLayer to the import from types**

Make sure `MidgroundLayer` is imported:

```ts
import type { Project, RendererAdapter, Layer, CompositionType, GridLayer, ImageLayer, MidgroundLayer, LayerOverride, Frame, FilterEntry, FilterType } from './lib/types'
```

- [ ] **Step 5: Update handleAddGridLayer and handleAddImageLayer to preserve midground + adj position**

Both handlers already filter out `adjustment` layers and put new layers before them. Update to also keep midground in its position (between bg and grid layers):

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
      const pinned = f.layers.filter(l => l.kind === 'adjustment')
      const content = f.layers.filter(l => l.kind !== 'adjustment')
      return { ...f, layers: [...content, newLayer, ...pinned] }
    }),
  }))
  setSelectedLayerId(newLayer.id)
}

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
      const pinned = f.layers.filter(l => l.kind === 'adjustment')
      const content = f.layers.filter(l => l.kind !== 'adjustment')
      return { ...f, layers: [...content, newLayer, ...pinned] }
    }),
  }))
  setSelectedLayerId(newLayer.id)
}
```

- [ ] **Step 6: Build check**

```bash
npm run build 2>&1 | grep "error TS" | head -20
```

- [ ] **Step 7: Commit**

```bash
git add app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add midground + adj to default frame, inherit bg colour on new frame"
```

---

### Task 4: Update renderer for midground

**Files:**
- Modify: `app/texture-playground/lib/renderer.ts`

The midground renders as a full-canvas sprite. `scale: 1.0` fills the canvas exactly. When `src` is null, the layer is skipped entirely.

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/lib/renderer.ts`. Find the `renderFrame()` method — it has cases for `background`, `grid`, `image`.

- [ ] **Step 2: Add the midground import**

Add `MidgroundLayer` to the types import:

```ts
import type { AdjustmentLayer, MidgroundLayer, FrameSnapshot, RendererAdapter } from './types'
```

- [ ] **Step 3: Add the midground case inside renderFrame()**

After the `if (layer.kind === 'grid')` block and before the `if (layer.kind === 'image')` block, add:

```ts
if (layer.kind === 'midground') {
  if (!layer.src) {
    // Nothing selected — remove any existing sprite for this layer
    const existing = this.layerGraphics.get(layer.id)
    if (existing) {
      container.removeChild(existing)
      existing.destroy()
      this.layerGraphics.delete(layer.id)
      this.layerUrls.delete(layer.id)
    }
    return
  }
  const existingSprite = this.layerGraphics.get(layer.id) as Sprite | undefined
  const prevUrl = this.layerUrls.get(layer.id)
  let sprite = existingSprite
  if (!sprite || prevUrl !== layer.src) {
    existingSprite?.destroy()
    const tex = Texture.from(layer.src)
    sprite = new Sprite(tex)
    this.layerGraphics.set(layer.id, sprite)
    this.layerUrls.set(layer.id, layer.src)
  }
  // scale: 1.0 = fill the canvas; scale: 1.5 = 150% of canvas
  sprite.width = size * layer.scale
  sprite.height = size * layer.scale
  sprite.alpha = layer.opacity
  sprite.x = layer.x
  sprite.y = layer.y
  ensureChildAt(container, sprite, index)
  return
}
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | grep "renderer.ts" | head -10
```

Expected: no errors in renderer.ts.

- [ ] **Step 5: Commit**

```bash
git add app/texture-playground/lib/renderer.ts
git commit -m "feat: render midground layer as full-canvas sprite"
```

---

### Task 5: Create MidgroundPicker component

**Files:**
- Create: `app/texture-playground/components/controls/MidgroundPicker.tsx`

Grid of 11 thumbnail buttons (from `/textures/midground/1.png`…`11.png`) + a clear button + upload file input.

- [ ] **Step 1: Create the file**

```tsx
// app/texture-playground/components/controls/MidgroundPicker.tsx
'use client'
import type { MidgroundLayer } from '../../lib/types'

const BUILT_INS = Array.from({ length: 11 }, (_, i) => ({
  src: `/textures/midground/${i + 1}.png`,
  label: String(i + 1),
}))

type Props = {
  layer: MidgroundLayer
  onChange: (changes: { src: string | null; label: string }) => void
  onUpload: (file: File) => void
}

export default function MidgroundPicker({ layer, onChange, onUpload }: Props) {
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8,
      }}>
        {/* Clear / none button */}
        <button
          onClick={() => onChange({ src: null, label: '' })}
          title="No midground"
          style={{
            aspectRatio: '1', borderRadius: 6, border: `1px solid ${!layer.src ? '#D1E043' : '#1e1e1e'}`,
            background: '#151515', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: !layer.src ? '#D1E043' : '#333', fontSize: 16,
          }}
        >
          ∅
        </button>

        {BUILT_INS.map(({ src, label }) => {
          const selected = layer.src === src
          return (
            <button
              key={src}
              onClick={() => onChange({ src, label })}
              title={`Texture ${label}`}
              style={{
                aspectRatio: '1', borderRadius: 6, padding: 2,
                border: `1px solid ${selected ? '#D1E043' : '#1e1e1e'}`,
                background: '#151515', cursor: 'pointer', overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt={`Texture ${label}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, display: 'block' }}
              />
            </button>
          )
        })}
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
        background: 'none', border: '1px dashed #222', color: '#333',
        fontSize: 10, fontFamily: 'var(--font-geist)',
      }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>↑</span> Upload texture
        <input
          type="file"
          accept="image/png,image/webp,image/jpeg"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUpload(file)
            e.target.value = ''
          }}
        />
      </label>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | grep "MidgroundPicker" | head -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/components/controls/MidgroundPicker.tsx
git commit -m "feat: add MidgroundPicker thumbnail grid with built-ins and upload"
```

---

### Task 6: Wire midground into LayerControls

**Files:**
- Modify: `app/texture-playground/components/controls/LayerControls.tsx`

Add the `midground` case: shows MidgroundPicker + opacity/scale/offset sliders.

- [ ] **Step 1: Read the current file**

Open `app/texture-playground/components/controls/LayerControls.tsx`. Note the existing `Slider` sub-component and the `background`, `image`, `grid` cases.

- [ ] **Step 2: Add import**

```ts
import MidgroundPicker from './MidgroundPicker'
import type { MidgroundLayer, AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'
```

(Replace the existing types import line — add `MidgroundLayer` to it.)

- [ ] **Step 3: Add the midground case**

Add this after the `if (layer.kind === 'adjustment')` block and before the `if (layer.kind === 'background')` block:

```tsx
if (layer.kind === 'midground') {
  return (
    <div>
      <MidgroundPicker
        layer={layer}
        onChange={(changes) => onChange(changes)}
        onUpload={(file) => {
          const objectUrl = URL.createObjectURL(file)
          onChange({ src: objectUrl, label: file.name.replace(/\.[^.]+$/, '') })
        }}
      />
      <div style={{ marginTop: 12 }}>
        <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onChange({ opacity: v / 100 })} />
        <Slider label="Scale" value={layer.scale} min={0.5} max={3} step={0.05} onChange={(v) => onChange({ scale: v })} />
        <Slider label="X offset" value={layer.x} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ x: v })} />
        <Slider label="Y offset" value={layer.y} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ y: v })} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | grep "LayerControls" | head -10
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/texture-playground/components/controls/LayerControls.tsx
git commit -m "feat: add midground case to LayerControls with picker + sliders"
```

---

### Task 7: Update LayerStack + CompositionIcon for midground

**Files:**
- Modify: `app/texture-playground/components/controls/LayerStack.tsx`
- Modify: `app/texture-playground/components/controls/CompositionIcon.tsx`

- [ ] **Step 1: Read both files**

Open `LayerStack.tsx` and `CompositionIcon.tsx`. Note existing label/icon helper functions and the `LayerIconType` union.

- [ ] **Step 2: Update CompositionIcon.tsx**

Add `'midground'` to `LayerIconType`:

```ts
export type LayerIconType = CompositionType | 'background' | 'image' | 'adjustment' | 'midground'
```

Add the midground case to the switch (a stacked-layers icon):

```tsx
case 'midground':
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="8" rx="1.5" stroke={color} strokeWidth="1" />
      <rect x="4" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1" />
    </svg>
  )
```

- [ ] **Step 3: Update LayerStack.tsx layerLabel and layerIconType**

```ts
function layerLabel(layer: Layer): string {
  if (layer.kind === 'background') return COLOR_NAMES[layer.color] ?? layer.color
  if (layer.kind === 'grid') return layer.composition.replace(/-/g, ' ')
  if (layer.kind === 'adjustment') return 'Adjustments'
  if (layer.kind === 'midground') return layer.label ? `Midground — ${layer.label}` : 'Midground'
  return 'Image'
}

function layerIconType(layer: Layer): LayerIconType {
  if (layer.kind === 'background') return 'background'
  if (layer.kind === 'image') return 'image'
  if (layer.kind === 'adjustment') return 'adjustment'
  if (layer.kind === 'midground') return 'midground'
  return layer.composition
}
```

- [ ] **Step 4: Suppress delete for midground (like background and adjustment)**

```tsx
{layer.kind !== 'background' && layer.kind !== 'adjustment' && layer.kind !== 'midground' && (
  <button
    onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
    style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
    title="Delete layer"
  >
    ×
  </button>
)}
```

(Midground is a fixed structural layer — it exists in every frame, just with src: null when unused. It shouldn't be deletable.)

- [ ] **Step 5: Build check — expect clean**

```bash
npm run build 2>&1 | grep "error TS" | head -20
```

Expected: clean build (zero TypeScript errors).

- [ ] **Step 6: Commit**

```bash
git add app/texture-playground/components/controls/LayerStack.tsx \
        app/texture-playground/components/controls/CompositionIcon.tsx
git commit -m "feat: add midground display to LayerStack and CompositionIcon"
```

---

### Task 8: Final build verify + push

- [ ] **Step 1: Full build**

```bash
cd /Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio && npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 2: Manual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000/texture-playground` and verify:
- Layer stack shows: Adjustments / Midground / [bg colour name]
- Clicking Midground shows the thumbnail grid (11 images loading from `/textures/midground/`)
- Clicking a thumbnail updates the canvas (texture appears over background)
- Clicking ∅ clears it (canvas shows background only)
- Upload button accepts a PNG and applies it
- Opacity/scale sliders affect the midground sprite
- Adding a new frame (timeline +) creates a frame that is a full copy of the current frame
- All layers (background colour, midground selection, grid layers, filter settings) are inherited

- [ ] **Step 3: Push**

```bash
git push
```

---

## Self-Review

**Spec coverage:**
- ✅ 11 PNGs in public/ → Task 1
- ✅ MidgroundLayer type → Task 2
- ✅ Every frame starts with bg + midground(null) + adj(empty) → Task 3
- ✅ New frame inherits bg colour → Task 3 handleAddToTimeline
- ✅ Renderer handles midground → Task 4
- ✅ Midground picker with 11 built-ins → Task 5
- ✅ User upload for midground → Task 5 + Task 6
- ✅ Opacity/scale/offset controls → Task 6
- ✅ LayerStack label + icon → Task 7
- ✅ Midground not deletable → Task 7

**Placeholder scan:** None found.

**Type consistency:**
- `MidgroundLayer` defined in Task 2, referenced in Tasks 3–7 ✅
- `LayerOverride` updated in Task 2, `onChange(changes)` in Task 6 matches Partial<...> ✅
- `'midground'` added to `LayerIconType` in Task 7 before it's used in LayerStack ✅
