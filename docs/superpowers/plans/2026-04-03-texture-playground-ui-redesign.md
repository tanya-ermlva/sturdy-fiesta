# Texture Playground UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the Figma design (node 66:3265) — replace dark chrome with a warm beige light theme, accordion left panel, floating export pill top-right, floating timeline pill bottom-center.

**Architecture:** `TexturePlaygroundClient` wraps `LeftPanel` (300px accordion) + a `position: relative` canvas area div. `TopBar` and `Timeline` render `position: absolute` inside that canvas area div. All layer/filter/export logic is unchanged — only presentation.

**Tech Stack:** Next.js App Router, React 19, TypeScript, PixiJS (untouched), inline styles throughout (no Tailwind in this feature area).

**Spec:** `docs/superpowers/specs/2026-04-03-texture-playground-ui-redesign.md`

**Design tokens used everywhere:**
```
background:       #f2f2ec
surface:          #f7f7f2
tint:             rgba(98,90,34,0.06)
tint-strong:      rgba(98,90,34,0.10)
ink-primary:      #292929
ink-secondary:    #72726e
border-hairline:  rgba(71,67,42,0.2)
green-300:        #b2c248   (export video, play button)
green-200:        #d1e043   (selected borders)
```

---

### Task 1: Layout shell — TexturePlaygroundClient + CanvasPreview

**Files:**
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`
- Modify: `app/texture-playground/components/CanvasPreview.tsx`

Change the root layout from a flex-column (TopBar / main / Timeline) to a flex-row (LeftPanel + canvas wrapper). TopBar and Timeline move *inside* the canvas wrapper as absolutely-positioned children.

- [ ] **Step 1: Rewrite the return value of `TexturePlaygroundClient`**

Replace the entire return statement (lines 202–260) with:

```tsx
  return (
    <div
      className={`${geist.variable} ${geistMono.variable}`}
      style={{
        fontFamily: 'var(--font-geist), system-ui, sans-serif',
        background: '#f2f2ec',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <LeftPanel
        snapshot={snapshot}
        selectedLayerId={selectedLayerId}
        onSelectLayer={setSelectedLayerId}
        onLayerChange={handleLayerChange}
        onAddGridLayer={() => handleAddGridLayer('dot-grid')}
        onDeleteLayer={handleDeleteLayer}
        onAddImageLayer={handleAddImageLayer}
        onAddToTimeline={handleAddToTimeline}
        onAddFilter={handleAddFilter}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Canvas area — TopBar and Timeline float inside this */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CanvasPreview
          snapshot={snapshot}
          outputSize={project.outputSize}
          onAdapterReady={(a) => { adapterRef.current = a; setAdapter(a) }}
          frameLabel={`${project.frames.indexOf(activeFrame) + 1}/${project.frames.length}`}
        />
        <TopBar
          outputSize={project.outputSize}
          onSizeChange={(s) => setProject(p => ({ ...p, outputSize: s }))}
          onExportFrame={handleExportFrame}
          onExportWebM={handleExportWebM}
          exporting={exporting}
        />
        <Timeline
          frames={project.frames}
          activeFrameId={project.activeFrameId}
          fps={project.fps}
          playing={playing}
          onSelectFrame={(id) => setProject(p => ({ ...p, activeFrameId: id }))}
          onDeleteFrame={handleDeleteFrame}
          onDurationChange={handleDurationChange}
          onFpsChange={(fps) => setProject(p => ({ ...p, fps }))}
          onPlay={() => setPlaying(true)}
          onStop={() => setPlaying(false)}
        />
      </div>
    </div>
  )
```

Note: `onAddFrame` is added to the Timeline call in Task 3, after Timeline's type is updated.

- [ ] **Step 2: Rewrite `CanvasPreview.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/CanvasPreview.tsx
'use client'
import { useEffect, useRef } from 'react'
import { PixiRenderer } from '../lib/renderer'
import type { RendererAdapter, FrameSnapshot } from '../lib/types'

type Props = {
  snapshot: FrameSnapshot
  outputSize: 512 | 1024 | 2048
  onAdapterReady: (adapter: RendererAdapter) => void
  frameLabel: string
}

export default function CanvasPreview({ snapshot, outputSize, onAdapterReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const adapterRef = useRef<RendererAdapter | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const renderer = new PixiRenderer()
    adapterRef.current = renderer
    renderer.init(canvasRef.current, outputSize).then(() => {
      onAdapterReady(renderer)
      renderer.renderFrame(snapshot)
    })
    return () => {
      renderer.destroy()
      adapterRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    adapterRef.current?.setSize(outputSize)
  }, [outputSize])

  useEffect(() => {
    adapterRef.current?.renderFrame(snapshot)
  }, [snapshot])

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <canvas
        ref={canvasRef}
        style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', borderRadius: 32 }}
      />
    </div>
  )
}
```

Changes from original: removed dark `#0c0c0c` bg, removed frame label overlay, removed size label overlay, added `border-radius: 32` to canvas, `frameLabel` prop kept in type for backwards compat but not rendered (removed in Task 5 when LeftPanel is rewired).

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: no TypeScript errors (Timeline will warn about missing `onAddFrame` prop — that's fixed in Task 3). Open http://localhost:3000/texture-playground. The page should show the beige background. LeftPanel still looks dark (restyled later). Canvas is visible and renders.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/TexturePlaygroundClient.tsx app/texture-playground/components/CanvasPreview.tsx
git commit -m "feat: new layout shell — row layout, canvas wrapper, beige bg"
```

---

### Task 2: TopBar → floating export pill

**Files:**
- Modify: `app/texture-playground/components/TopBar.tsx`

- [ ] **Step 1: Rewrite `TopBar.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/TopBar.tsx
'use client'
import type { Project } from '../lib/types'

type Props = {
  outputSize: Project['outputSize']
  onSizeChange: (s: Project['outputSize']) => void
  onExportFrame: () => void
  onExportWebM: () => void
  exporting: boolean
}

const SIZES: Project['outputSize'][] = [512, 1024, 2048]

export default function TopBar({ outputSize, onSizeChange, onExportFrame, onExportWebM, exporting }: Props) {
  return (
    <div style={{
      position: 'absolute', top: 8, right: 8,
      background: 'rgba(98,90,34,0.06)', borderRadius: 32,
      padding: 8, display: 'flex', gap: 4, alignItems: 'center',
    }}>
      {SIZES.map(s => (
        <button key={s} onClick={() => onSizeChange(s)} style={{
          fontFamily: 'var(--font-geist)', fontSize: 18,
          padding: '12px 16px', borderRadius: 40, border: 'none', cursor: 'pointer',
          background: outputSize === s ? 'rgba(98,90,34,0.10)' : 'transparent',
          color: outputSize === s ? '#292929' : '#72726e',
        }}>
          {s}
        </button>
      ))}
      <button onClick={onExportFrame} style={{
        fontFamily: 'var(--font-geist)', fontSize: 18,
        padding: '12px 16px', borderRadius: 40, border: 'none', cursor: 'pointer',
        background: 'rgba(98,90,34,0.06)', color: '#292929',
      }}>
        Export png
      </button>
      <button
        onClick={onExportWebM}
        disabled={exporting}
        style={{
          fontFamily: 'var(--font-geist)', fontSize: 18,
          padding: '12px 16px', borderRadius: 40, border: 'none',
          background: '#b2c248', color: '#292929',
          cursor: exporting ? 'wait' : 'pointer', opacity: exporting ? 0.6 : 1,
        }}
      >
        {exporting ? 'Exporting…' : 'Export video'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/texture-playground. Top-right should show a beige pill with `512 1024 2048 | Export png | Export video`. Clicking size buttons and export should work.

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/components/TopBar.tsx
git commit -m "feat: TopBar → floating export pill (light theme)"
```

---

### Task 3: Timeline → floating pill

**Files:**
- Modify: `app/texture-playground/components/Timeline.tsx`

The "Add to timeline" button moves from LeftPanel into the Timeline pill as a `+` button. A new `onAddFrame` prop is added.

- [ ] **Step 1: Rewrite `Timeline.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/Timeline.tsx
'use client'
import type { Frame } from '../lib/types'

type Props = {
  frames: Frame[]
  activeFrameId: string
  fps: number
  playing: boolean
  onSelectFrame: (id: string) => void
  onDeleteFrame: (id: string) => void
  onDurationChange: (id: string, frames: number) => void
  onFpsChange: (fps: number) => void
  onPlay: () => void
  onStop: () => void
  onAddFrame: () => void
}

export default function Timeline({
  frames, activeFrameId, fps, playing,
  onSelectFrame, onDeleteFrame, onDurationChange, onFpsChange,
  onPlay, onStop, onAddFrame,
}: Props) {
  return (
    <div style={{
      position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(98,90,34,0.06)', borderRadius: 20,
      padding: '18px 24px 8px',
      display: 'flex', alignItems: 'flex-start', gap: 6,
      whiteSpace: 'nowrap',
    }}>
      {/* Frame thumbnails */}
      {frames.map((frame) => (
        <div key={frame.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div
            onClick={() => onSelectFrame(frame.id)}
            style={{
              width: 54, height: 54, borderRadius: 12, cursor: 'pointer',
              background: '#f7f7f2',
              border: `1px solid ${activeFrameId === frame.id ? '#d1e043' : 'rgba(71,67,42,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0,
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 6, background: '#434625' }} />
            {frames.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteFrame(frame.id) }}
                style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#f7f7f2', border: '1px solid rgba(71,67,42,0.2)',
                  color: '#72726e', fontSize: 9, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, lineHeight: 1,
                }}
              >×</button>
            )}
          </div>
          <input
            type="number"
            value={frame.durationFrames}
            min={1} max={120}
            onChange={(e) => onDurationChange(frame.id, Math.max(1, Number(e.target.value)))}
            style={{
              width: 54, background: 'transparent', border: 'none',
              fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#72726e',
              textAlign: 'center', padding: 0,
            }}
            title="Duration in frames"
          />
        </div>
      ))}

      {/* Add frame button */}
      <button
        onClick={onAddFrame}
        style={{
          width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: '#f7f7f2', color: '#292929', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, alignSelf: 'center',
        }}
      >+</button>

      {/* fps + play */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center', marginLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#72726e' }}>fps</span>
          <input
            type="number" value={fps} min={1} max={60}
            onChange={(e) => onFpsChange(Math.max(1, Math.min(60, Number(e.target.value))))}
            style={{
              width: 30, background: 'transparent', border: 'none',
              fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#292929',
              textAlign: 'center', padding: 0,
            }}
          />
        </div>
        <button
          onClick={playing ? onStop : onPlay}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#b2c248', color: '#292929', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: 'pointer', flexShrink: 0,
          }}
        >
          {playing ? '■' : '▶'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add `onAddFrame={handleAddToTimeline}` to the Timeline call in `TexturePlaygroundClient.tsx`**

Find the `<Timeline` JSX block and add the prop after `onStop`:

```tsx
          onStop={() => setPlaying(false)}
          onAddFrame={handleAddToTimeline}
```

- [ ] **Step 3: Verify in browser**

http://localhost:3000/texture-playground. The timeline pill should appear centered at the bottom of the canvas area. The `+` button adds frames, play button works, frame selection works.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/components/Timeline.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: Timeline → floating pill (light theme, add onAddFrame)"
```

---

### Task 4: ColorPicker → circle swatches

**Files:**
- Modify: `app/texture-playground/components/controls/ColorPicker.tsx`

Remove the hex text input entirely. Render 8 fixed colour circles matching Figma.

- [ ] **Step 1: Rewrite `ColorPicker.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/controls/ColorPicker.tsx
'use client'

const COLOURS = [
  '#444625', '#788d16', '#b2c349', '#e5eacd',
  '#ee9212', '#4791e2', '#ff92e0', '#a291ce',
]

type Props = {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
      {COLOURS.map((color) => {
        const selected = value.toLowerCase() === color.toLowerCase()
        return (
          <button
            key={color}
            onClick={() => onChange(color)}
            title={color}
            style={{
              background: '#f7f7f2',
              border: selected ? '2px solid #d1e043' : '0.5px solid rgba(71,67,42,0.2)',
              borderRadius: '50%', padding: 1,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: color }} />
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Update `DEFAULT_PROJECT` background color in `TexturePlaygroundClient.tsx` to match a valid swatch**

The initial color `#434625` is close to but not identical to `#444625` in the swatches. Update the default to match so the correct swatch is pre-selected:

In `TexturePlaygroundClient.tsx`, line 18, change:
```tsx
{ id: 'bg',  kind: 'background',  color: '#434625' },
```
to:
```tsx
{ id: 'bg',  kind: 'background',  color: '#444625' },
```

Also update `LayerStack.tsx` `COLOR_NAMES` map — but since `LayerStack` is deleted in Task 7, skip this.

- [ ] **Step 3: Commit**

```bash
git add app/texture-playground/components/controls/ColorPicker.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: ColorPicker → circle swatches (8 fixed colours)"
```

---

### Task 5: LeftPanel accordion

**Files:**
- Modify: `app/texture-playground/components/LeftPanel.tsx`
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx` (update LeftPanel props)

This is the biggest task. The accordion replaces the LayerStack + LayerControls structure. `ColorPicker`, `MidgroundPicker`, `FilterStack`, and `CompositionPicker` are used directly in the sections.

- [ ] **Step 1: Rewrite `LeftPanel.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/LeftPanel.tsx
'use client'
import { useState } from 'react'
import type {
  FrameSnapshot, LayerOverride, FilterEntry, FilterType,
  BackgroundLayer, MidgroundLayer, GridLayer, AdjustmentLayer,
} from '../lib/types'
import ColorPicker from './controls/ColorPicker'
import MidgroundPicker from './controls/MidgroundPicker'
import FilterStack from './controls/FilterStack'
import CompositionPicker from './controls/CompositionPicker'

type Props = {
  snapshot: FrameSnapshot
  onLayerChange: (layerId: string, override: LayerOverride) => void
  onAddGridLayer: () => void
  onAddFilter: (entry: FilterEntry) => void
  onFilterChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemoveFilter: (filterType: FilterType) => void
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
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 13, color: '#72726e' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: '#292929' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#b2c248', cursor: 'pointer' }}
      />
    </div>
  )
}

type SectionProps = {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Section({ title, open, onToggle, children }: SectionProps) {
  return (
    <div style={{ background: 'rgba(98,90,34,0.06)', borderRadius: 12, overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 18, color: '#292929' }}>{title}</span>
        <span style={{ fontSize: 22, color: '#292929', lineHeight: 1 }}>{open ? '–' : '+'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 24px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function LeftPanel({
  snapshot, onLayerChange, onAddGridLayer,
  onAddFilter, onFilterChange, onRemoveFilter,
}: Props) {
  const [open, setOpen] = useState({ filters: false, texture: false, midground: true, colour: true })

  const bgLayer = snapshot.layers.find(l => l.kind === 'background') as BackgroundLayer
  const midLayer = snapshot.layers.find(l => l.kind === 'midground') as MidgroundLayer
  const gridLayer = snapshot.layers.find(l => l.kind === 'grid') as GridLayer | undefined
  const adjLayer = snapshot.layers.find(l => l.kind === 'adjustment') as AdjustmentLayer

  function toggle(k: keyof typeof open) {
    setOpen(o => ({ ...o, [k]: !o[k] }))
  }

  return (
    <div style={{
      width: 300, padding: 8, display: 'flex', flexDirection: 'column', gap: 4,
      overflowY: 'auto', flexShrink: 0, height: '100vh', boxSizing: 'border-box',
    }}>

      <Section title="Filters" open={open.filters} onToggle={() => toggle('filters')}>
        <FilterStack
          layer={adjLayer}
          onAdd={onAddFilter}
          onChange={onFilterChange}
          onRemove={onRemoveFilter}
        />
      </Section>

      <Section title="Texture" open={open.texture} onToggle={() => toggle('texture')}>
        {gridLayer ? (
          <div>
            <CompositionPicker
              value={gridLayer.composition}
              onChange={(c) => onLayerChange(gridLayer.id, { composition: c })}
            />
            <div style={{ height: 16 }} />
            <Slider label="Spacing" value={gridLayer.spacing} min={4} max={120} step={1} unit="px" onChange={(v) => onLayerChange(gridLayer.id, { spacing: v })} />
            {gridLayer.composition === 'dot-grid' && (
              <Slider label="Dot size" value={gridLayer.dotSize} min={1} max={20} step={0.5} unit="px" onChange={(v) => onLayerChange(gridLayer.id, { dotSize: v })} />
            )}
            {gridLayer.composition !== 'dot-grid' && gridLayer.composition !== 'checkered' && (
              <Slider label="Thickness" value={gridLayer.thickness} min={0.5} max={8} step={0.5} unit="px" onChange={(v) => onLayerChange(gridLayer.id, { thickness: v })} />
            )}
            <Slider label="Scale" value={gridLayer.scale} min={0.5} max={3} step={0.05} onChange={(v) => onLayerChange(gridLayer.id, { scale: v })} />
            <Slider label="Opacity" value={Math.round(gridLayer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onLayerChange(gridLayer.id, { opacity: v / 100 })} />
          </div>
        ) : (
          <button
            onClick={onAddGridLayer}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none',
              background: 'rgba(98,90,34,0.08)', color: '#292929',
              fontFamily: 'var(--font-geist)', fontSize: 14, cursor: 'pointer',
            }}
          >+ Add texture layer</button>
        )}
      </Section>

      <Section title="Midground Texture" open={open.midground} onToggle={() => toggle('midground')}>
        <MidgroundPicker
          layer={midLayer}
          onChange={(changes) => onLayerChange(midLayer.id, changes)}
          onUpload={(file) => {
            const url = URL.createObjectURL(file)
            onLayerChange(midLayer.id, { src: url, label: file.name })
          }}
        />
        {midLayer.src && (
          <div style={{ marginTop: 16 }}>
            <Slider label="Scale" value={midLayer.scale} min={0.5} max={3} step={0.05} onChange={(v) => onLayerChange(midLayer.id, { scale: v })} />
            <Slider label="Opacity" value={Math.round(midLayer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onLayerChange(midLayer.id, { opacity: v / 100 })} />
            <Slider label="X offset" value={midLayer.x} min={-512} max={512} step={1} unit="px" onChange={(v) => onLayerChange(midLayer.id, { x: v })} />
            <Slider label="Y offset" value={midLayer.y} min={-512} max={512} step={1} unit="px" onChange={(v) => onLayerChange(midLayer.id, { y: v })} />
          </div>
        )}
      </Section>

      <Section title="Colour bg" open={open.colour} onToggle={() => toggle('colour')}>
        <ColorPicker value={bgLayer.color} onChange={(color) => onLayerChange(bgLayer.id, { color })} />
      </Section>

    </div>
  )
}
```

- [ ] **Step 2: Update `TexturePlaygroundClient.tsx` — simplify LeftPanel props**

Replace the `<LeftPanel ... />` call inside the return statement with:

```tsx
      <LeftPanel
        snapshot={snapshot}
        onLayerChange={handleLayerChange}
        onAddGridLayer={() => handleAddGridLayer('dot-grid')}
        onAddFilter={handleAddFilter}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
      />
```

Also remove the now-unused `selectedLayerId` state and `setSelectedLayerId` (lines ~39):
```tsx
  // Remove these two lines:
  const [selectedLayerId, setSelectedLayerId] = useState('mid')
```

- [ ] **Step 3: Verify in browser**

http://localhost:3000/texture-playground. Left panel should show 4 accordion sections. "Midground Texture" and "Colour bg" should be expanded by default. Clicking a colour circle changes the canvas background. Clicking a midground thumbnail overlays the texture. "Texture" section shows "+ Add texture layer" button (no grid layer by default). Filters section is collapsed.

- [ ] **Step 4: Commit**

```bash
git add app/texture-playground/components/LeftPanel.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: LeftPanel → accordion (Filters, Texture, Midground, Colour bg)"
```

---

### Task 6: Light theme — remaining controls

**Files:**
- Modify: `app/texture-playground/components/controls/MidgroundPicker.tsx`
- Modify: `app/texture-playground/components/controls/CompositionPicker.tsx`
- Modify: `app/texture-playground/components/controls/FilterStack.tsx`
- Modify: `app/texture-playground/components/controls/FilterControls.tsx`

- [ ] **Step 1: Restyle `MidgroundPicker.tsx`**

Replace the entire file with:

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8 }}>
        {/* Clear button */}
        <button
          onClick={() => onChange({ src: null, label: '' })}
          title="No midground"
          style={{
            aspectRatio: '1', borderRadius: 10, padding: 2,
            border: `1px solid ${!layer.src ? '#d1e043' : 'rgba(71,67,42,0.2)'}`,
            background: '#f7f7f2', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: !layer.src ? '#b2c248' : 'rgba(71,67,42,0.4)', fontSize: 16,
          }}
        >∅</button>

        {BUILT_INS.map(({ src, label }) => {
          const selected = layer.src === src
          return (
            <button
              key={src}
              onClick={() => onChange({ src, label })}
              title={`Texture ${label}`}
              style={{
                aspectRatio: '1', borderRadius: 10, padding: 2,
                border: `1px solid ${selected ? '#d1e043' : 'rgba(71,67,42,0.2)'}`,
                background: '#f7f7f2', cursor: 'pointer', overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt={`Texture ${label}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, display: 'block' }}
              />
            </button>
          )
        })}
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
        background: 'rgba(98,90,34,0.06)', border: 'none', color: '#72726e',
        fontSize: 13, fontFamily: 'var(--font-geist)',
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

- [ ] **Step 2: Restyle `CompositionPicker.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/controls/CompositionPicker.tsx
'use client'
import type { CompositionType } from '../../lib/types'
import CompositionIcon from './CompositionIcon'

const COMPOSITIONS: { id: CompositionType; label: string }[] = [
  { id: 'dot-grid',      label: 'Dot grid' },
  { id: 'regular-grid',  label: 'Regular' },
  { id: 'variable-grid', label: 'Variable' },
  { id: 'linear',        label: 'Linear' },
  { id: 'layered',       label: 'Layered' },
  { id: 'checkered',     label: 'Checkered' },
]

type Props = {
  value: CompositionType
  onChange: (c: CompositionType) => void
}

export default function CompositionPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      {COMPOSITIONS.map(({ id, label }) => {
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              padding: '8px 4px 6px',
              background: active ? 'rgba(178,194,72,0.15)' : 'rgba(98,90,34,0.06)',
              border: `1px solid ${active ? 'rgba(178,194,72,0.5)' : 'rgba(71,67,42,0.1)'}`,
              borderRadius: 8, cursor: 'pointer',
            }}
          >
            <CompositionIcon type={id} size={18} color={active ? '#b2c248' : '#72726e'} />
            <span style={{
              fontFamily: 'var(--font-geist)', fontSize: 10,
              color: active ? '#292929' : '#72726e',
              letterSpacing: '0.02em', lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Restyle `FilterStack.tsx`**

Replace the entire file with:

```tsx
// app/texture-playground/components/controls/FilterStack.tsx
'use client'
import { useState } from 'react'
import type { AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'
import FilterControls from './FilterControls'

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
  glow:         { type: 'glow',         enabled: true, distance: 10, strength: 2, color: '#b2c248' },
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
            border: '1px solid rgba(71,67,42,0.15)',
            borderRadius: 8, overflow: 'hidden',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'rgba(98,90,34,0.06)',
          }}>
            <button
              onClick={() => onChange(entry.type, { enabled: !entry.enabled })}
              title={entry.enabled ? 'Disable' : 'Enable'}
              style={{
                width: 10, height: 10, borderRadius: '50%', padding: 0, border: 'none',
                background: entry.enabled ? '#b2c248' : 'rgba(71,67,42,0.2)',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-geist)', fontSize: 13,
              color: entry.enabled ? '#292929' : '#72726e',
              fontWeight: 500, flex: 1,
            }}>
              {FILTER_LABELS[entry.type]}
            </span>
            <button
              onClick={() => onRemove(entry.type)}
              style={{
                background: 'none', border: 'none', color: '#72726e',
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
              }}
              title="Remove filter"
            >×</button>
          </div>
          {entry.enabled && (
            <div style={{ padding: '8px 12px 4px', background: '#f7f7f2' }}>
              <FilterControls entry={entry} onChange={(changes) => onChange(entry.type, changes)} />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setPickerOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(98,90,34,0.06)',
          border: `1px dashed ${pickerOpen ? 'rgba(71,67,42,0.4)' : 'rgba(71,67,42,0.2)'}`,
          color: '#72726e', fontSize: 13, fontFamily: 'var(--font-geist)',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{pickerOpen ? '−' : '+'}</span> Add filter
      </button>

      {pickerOpen && (
        <div style={{
          border: '1px solid rgba(71,67,42,0.15)', borderRadius: 8,
          padding: 4, display: 'flex', flexDirection: 'column', gap: 1,
          background: '#f7f7f2',
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
                  padding: '6px 10px', borderRadius: 6, border: 'none',
                  background: 'none',
                  color: active ? 'rgba(71,67,42,0.3)' : '#292929',
                  fontSize: 13, fontFamily: 'var(--font-geist)',
                  cursor: active ? 'default' : 'pointer', textAlign: 'left',
                }}
              >
                {FILTER_LABELS[type]}
                {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(71,67,42,0.3)' }}>active</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Restyle `FilterControls.tsx`**

Replace the entire file with:

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
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 11, color: '#72726e' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: '#292929' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#b2c248', cursor: 'pointer' }}
      />
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--font-geist)', fontSize: 11, color: '#72726e' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 28, height: 14, borderRadius: 7, padding: '0 2px',
          background: value ? 'rgba(178,194,72,0.15)' : 'rgba(71,67,42,0.08)',
          border: `1px solid ${value ? '#b2c248' : 'rgba(71,67,42,0.2)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: value ? 'flex-end' : 'flex-start',
          transition: 'all 0.15s',
        }}
      >
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: value ? '#b2c248' : 'rgba(71,67,42,0.4)',
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
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-geist)', fontSize: 11, color: '#72726e', marginBottom: 4 }}>Colour</div>
            <input
              type="color" value={entry.color}
              onChange={(e) => onChange({ color: e.target.value })}
              style={{ width: '100%', height: 24, border: '1px solid rgba(71,67,42,0.2)', borderRadius: 4, cursor: 'pointer', background: 'none', padding: 0 }}
            />
          </div>
        </div>
      )
  }
}
```

- [ ] **Step 5: Verify in browser**

http://localhost:3000/texture-playground. Open the Filters accordion, add a filter — the controls should all be light-themed. Open Texture accordion, click "+ Add texture layer" — composition picker tiles appear in light theme. Midground thumbnails show light containers.

- [ ] **Step 6: Commit**

```bash
git add app/texture-playground/components/controls/MidgroundPicker.tsx \
        app/texture-playground/components/controls/CompositionPicker.tsx \
        app/texture-playground/components/controls/FilterStack.tsx \
        app/texture-playground/components/controls/FilterControls.tsx
git commit -m "feat: restyle all controls to light warm theme"
```

---

### Task 7: Cleanup — delete LayerStack and LayerControls

**Files:**
- Delete: `app/texture-playground/components/controls/LayerStack.tsx`
- Delete: `app/texture-playground/components/controls/LayerControls.tsx`

These files are no longer imported by anything — `LeftPanel.tsx` was their only consumer and it has been fully rewritten.

- [ ] **Step 1: Verify no imports remain**

```bash
grep -r "LayerStack\|LayerControls" app/texture-playground/
```

Expected: no output (no files import them).

- [ ] **Step 2: Delete the files**

```bash
rm app/texture-playground/components/controls/LayerStack.tsx
rm app/texture-playground/components/controls/LayerControls.tsx
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove LayerStack and LayerControls (replaced by accordion LeftPanel)"
```

---

### Task 8: Build verify

**Files:** none — verification only

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Zero TypeScript errors, zero lint errors.

If there are errors, fix them before proceeding. Common issues:
- `frameLabel` prop still passed somewhere — remove the prop from `CanvasPreview` type if unused
- `selectedLayerId` still referenced — remove from `TexturePlaygroundClient`
- `handleDeleteLayer` / `handleAddImageLayer` TypeScript `no-unused-vars` warnings — suppress with `// eslint-disable-next-line` or remove the functions

- [ ] **Step 2: Smoke test at `/texture-playground`**

Open http://localhost:3000/texture-playground and verify:
- Beige `#f2f2ec` background fills the page
- Left panel: 4 accordion sections, Midground Texture and Colour bg expanded by default
- Colour bg swatches: 8 circles, clicking one changes canvas background colour
- Midground: clicking a thumbnail overlays it on the canvas
- Texture section: "+ Add texture layer" button; after clicking, composition picker + sliders appear
- Filters section: add a filter, sliders work
- Top-right pill: size selector + Export png + Export video (green)
- Bottom center pill: frames with + button, play button, duration inputs
- Play button plays timeline if multiple frames exist
- Export png downloads a PNG

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: build verified — texture playground UI redesign complete"
```
