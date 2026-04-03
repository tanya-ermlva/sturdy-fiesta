# Texture Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone layered texture compositor at `/texture-playground` that lets Tatiana create Granola-branded geometric textures, assemble frame-by-frame animations, and export to WebM + PNG.

**Architecture:** PixiJS v8 renders all compositions to a `<canvas>` via a `RendererAdapter` interface that keeps React state decoupled from the engine. Frames store base + per-frame overrides merged by `resolveFrame()`. Export uses both `MediaRecorder` (fast preview) and `WebCodecs + webm-muxer` (deterministic, loop-perfect).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, PixiJS v8, `webm-muxer`, Geist + Geist Mono (Google Fonts), Tailwind CSS 4

> **Note:** No test framework is configured in this repo. Each task includes browser verification steps and, for pure functions, inline console assertions to run in the browser DevTools.

---

## File Map

```
app/texture-playground/
  page.tsx                              NEW
  TexturePlaygroundClient.tsx           NEW — 'use client', project state, layout shell
  components/
    TopBar.tsx                          NEW
    LeftPanel.tsx                       NEW
    CanvasPreview.tsx                   NEW — holds RendererAdapter ref, mounts canvas
    Timeline.tsx                        NEW
    controls/
      CompositionPicker.tsx             NEW
      LayerStack.tsx                    NEW
      LayerControls.tsx                 NEW
      ColorPicker.tsx                   NEW
  lib/
    types.ts                            NEW — all shared TypeScript types
    resolve.ts                          NEW — resolveFrame(base, frame): FrameSnapshot
    draw.ts                             NEW — per-composition draw functions (pure)
    renderer.ts                         NEW — RendererAdapter interface + PixiRenderer
    playback.ts                         NEW — usePlayback(adapter, project) hook
    export.ts                           NEW — exportWebMFast, exportWebMDeterministic, exportFramePng
```

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Install PixiJS v8 and webm-muxer**

```bash
npm install pixi.js@^8 webm-muxer
```

- [ ] **Verify install**

```bash
npm ls pixi.js webm-muxer
```

Expected: both packages listed without errors.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add pixi.js v8 and webm-muxer dependencies"
```

---

## Task 2: Types

**Files:**
- Create: `app/texture-playground/lib/types.ts`

- [ ] **Write types.ts**

```ts
// app/texture-playground/lib/types.ts

export type CompositionType =
  | 'dot-grid'
  | 'regular-grid'
  | 'variable-grid'
  | 'linear'
  | 'layered'
  | 'checkered'

export type BackgroundLayer = {
  id: string
  kind: 'background'
  color: string
}

export type GridLayer = {
  id: string
  kind: 'grid'
  composition: CompositionType
  spacing: number
  thickness: number
  dotSize: number       // used by dot-grid; ignored by others
  opacity: number       // 0–1
  scale: number         // 0.5–2.0
}

export type ImageLayer = {
  id: string
  kind: 'image'
  file: File
  objectUrl: string
  scale: number
  x: number
  y: number
  opacity: number
}

export type Layer = BackgroundLayer | GridLayer | ImageLayer

export type LayerOverride = Partial<Omit<GridLayer | BackgroundLayer | ImageLayer, 'id' | 'kind' | 'file'>>

export type Frame = {
  id: string
  layerOverrides: Record<string, LayerOverride>  // keyed by layer.id
  durationFrames: number                          // e.g. 5 @ 30fps = 167ms
}

export type BaseComposition = {
  layers: Layer[]
}

export type Project = {
  base: BaseComposition
  frames: Frame[]               // 1–5
  outputSize: 512 | 1024 | 2048
  fps: number
  activeFrameId: string
}

// Resolved form — used by renderer and exporter, never stored
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

- [ ] **Commit**

```bash
git add app/texture-playground/lib/types.ts
git commit -m "feat: add texture playground types"
```

---

## Task 3: resolveFrame

**Files:**
- Create: `app/texture-playground/lib/resolve.ts`

- [ ] **Write resolve.ts**

```ts
// app/texture-playground/lib/resolve.ts

import type { BaseComposition, Frame, FrameSnapshot, Layer } from './types'

export function resolveFrame(base: BaseComposition, frame: Frame): FrameSnapshot {
  const layers: Layer[] = base.layers.map((layer) => {
    const override = frame.layerOverrides[layer.id]
    if (!override) return layer
    return { ...layer, ...override } as Layer
  })
  return { layers, durationFrames: frame.durationFrames }
}
```

- [ ] **Verify in browser DevTools console** — navigate to any page, paste:

```js
// Quick smoke test — paste in DevTools console after running npm run dev
const base = {
  layers: [
    { id: 'bg', kind: 'background', color: '#434625' },
    { id: 'g1', kind: 'grid', composition: 'dot-grid', spacing: 18, thickness: 1, dotSize: 3, opacity: 1, scale: 1 }
  ]
}
const frame = {
  id: 'f1',
  layerOverrides: { g1: { scale: 1.2 } },
  durationFrames: 5
}
// Expected: g1.scale === 1.2, g1.spacing still 18
console.assert(base.layers[1].scale === 1, 'base unchanged')
```

- [ ] **Commit**

```bash
git add app/texture-playground/lib/resolve.ts
git commit -m "feat: add resolveFrame utility"
```

---

## Task 4: Draw functions

**Files:**
- Create: `app/texture-playground/lib/draw.ts`

Each function takes a `PIXI.Graphics` object, clears it, and redraws. Line/dot colour is always `#1E1E1E`. Functions accept a `size` param (canvas width = height).

- [ ] **Write draw.ts**

```ts
// app/texture-playground/lib/draw.ts
import { Graphics } from 'pixi.js'
import type { GridLayer } from './types'

const LINE_COLOR = 0x1e1e1e

export function drawBackground(g: Graphics, color: string, size: number): void {
  g.clear()
  g.rect(0, 0, size, size).fill(color)
}

export function drawDotGrid(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, dotSize, opacity, scale } = layer
  const step = spacing * scale
  const radius = (dotSize / 2) * scale
  g.alpha = opacity
  for (let x = step / 2; x < size; x += step) {
    for (let y = step / 2; y < size; y += step) {
      g.circle(x, y, radius).fill(LINE_COLOR)
    }
  }
}

export function drawRegularGrid(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, thickness, opacity, scale } = layer
  const step = spacing * scale
  g.alpha = opacity
  for (let x = 0; x <= size; x += step) {
    g.moveTo(x, 0).lineTo(x, size).stroke({ color: LINE_COLOR, width: thickness * scale })
  }
  for (let y = 0; y <= size; y += step) {
    g.moveTo(0, y).lineTo(size, y).stroke({ color: LINE_COLOR, width: thickness * scale })
  }
}

export function drawVariableGrid(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, thickness, opacity, scale } = layer
  const step = spacing * scale
  const thickWeight = thickness * scale * 2
  const thinWeight = thickness * scale * 0.5
  g.alpha = opacity
  let idx = 0
  for (let x = 0; x <= size; x += step) {
    const w = idx % 3 === 0 ? thickWeight : thinWeight
    g.moveTo(x, 0).lineTo(x, size).stroke({ color: LINE_COLOR, width: w })
    idx++
  }
  idx = 0
  for (let y = 0; y <= size; y += step) {
    const w = idx % 3 === 0 ? thickWeight : thinWeight
    g.moveTo(0, y).lineTo(size, y).stroke({ color: LINE_COLOR, width: w })
    idx++
  }
}

export function drawLinear(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, thickness, opacity, scale } = layer
  const step = spacing * scale
  const thickWeight = thickness * scale * 2
  const thinWeight = thickness * scale * 0.5
  g.alpha = opacity
  // horizontal stripes; rhythm: 1 thick per 4 thin
  let idx = 0
  for (let y = 0; y <= size; y += step) {
    const w = idx % 4 === 0 ? thickWeight : thinWeight
    g.moveTo(0, y).lineTo(size, y).stroke({ color: LINE_COLOR, width: w })
    idx++
  }
}

export function drawLayered(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, thickness, opacity, scale } = layer
  const coarseStep = spacing * scale * 2
  const fineStep = spacing * scale
  g.alpha = opacity
  // coarse grid at 60% opacity
  const coarseAlpha = 0.6
  for (let x = 0; x <= size; x += coarseStep) {
    g.moveTo(x, 0).lineTo(x, size).stroke({ color: LINE_COLOR, width: thickness * scale, alpha: coarseAlpha })
  }
  for (let y = 0; y <= size; y += coarseStep) {
    g.moveTo(0, y).lineTo(size, y).stroke({ color: LINE_COLOR, width: thickness * scale, alpha: coarseAlpha })
  }
  // fine grid offset at 35% opacity
  const fineAlpha = 0.35
  const offset = fineStep / 2
  for (let x = offset; x <= size; x += fineStep) {
    g.moveTo(x, 0).lineTo(x, size).stroke({ color: LINE_COLOR, width: (thickness * scale) / 2, alpha: fineAlpha })
  }
  for (let y = offset; y <= size; y += fineStep) {
    g.moveTo(0, y).lineTo(size, y).stroke({ color: LINE_COLOR, width: (thickness * scale) / 2, alpha: fineAlpha })
  }
}

export function drawCheckered(g: Graphics, layer: GridLayer, size: number): void {
  g.clear()
  const { spacing, opacity, scale } = layer
  const cell = spacing * scale
  g.alpha = opacity
  for (let row = 0; row * cell < size; row++) {
    for (let col = 0; col * cell < size; col++) {
      if ((row + col) % 2 === 0) {
        g.rect(col * cell, row * cell, cell, cell).fill(LINE_COLOR)
      }
    }
  }
}

export function drawGridLayer(g: Graphics, layer: GridLayer, size: number): void {
  switch (layer.composition) {
    case 'dot-grid':     return drawDotGrid(g, layer, size)
    case 'regular-grid': return drawRegularGrid(g, layer, size)
    case 'variable-grid': return drawVariableGrid(g, layer, size)
    case 'linear':       return drawLinear(g, layer, size)
    case 'layered':      return drawLayered(g, layer, size)
    case 'checkered':    return drawCheckered(g, layer, size)
  }
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/lib/draw.ts
git commit -m "feat: add composition draw functions"
```

---

## Task 5: RendererAdapter + PixiRenderer

**Files:**
- Create: `app/texture-playground/lib/renderer.ts`

- [ ] **Write renderer.ts**

```ts
// app/texture-playground/lib/renderer.ts
'use client'
import { Application, Graphics, Sprite, Texture } from 'pixi.js'
import { drawBackground, drawGridLayer } from './draw'
import type { FrameSnapshot, RendererAdapter } from './types'

export class PixiRenderer implements RendererAdapter {
  private app: Application | null = null
  private layerGraphics = new Map<string, Graphics>()
  private size = 512

  async init(host: HTMLElement, size: number): Promise<void> {
    this.size = size
    this.app = new Application()
    await this.app.init({
      canvas: host as HTMLCanvasElement,
      width: size,
      height: size,
      antialias: true,
      backgroundColor: 0xffffff,
    })
  }

  renderFrame(snapshot: FrameSnapshot): void {
    if (!this.app) return
    const { stage } = this.app
    const size = this.size

    // Track which layer ids appear in this snapshot
    const snapshotIds = new Set(snapshot.layers.map((l) => l.id))

    // Remove graphics for layers that no longer exist
    for (const [id, g] of this.layerGraphics) {
      if (!snapshotIds.has(id)) {
        stage.removeChild(g)
        g.destroy()
        this.layerGraphics.delete(id)
      }
    }

    // Render layers bottom-to-top
    snapshot.layers.forEach((layer, index) => {
      if (layer.kind === 'background') {
        let g = this.layerGraphics.get(layer.id)
        if (!g) {
          g = new Graphics()
          this.layerGraphics.set(layer.id, g)
        }
        drawBackground(g, layer.color, size)
        stage.addChildAt(g, index)
        return
      }

      if (layer.kind === 'grid') {
        let g = this.layerGraphics.get(layer.id)
        if (!g) {
          g = new Graphics()
          this.layerGraphics.set(layer.id, g)
        }
        drawGridLayer(g, layer, size)
        stage.addChildAt(g, Math.min(index, stage.children.length))
        return
      }

      if (layer.kind === 'image') {
        // Image layers: create a Sprite from the objectUrl
        let sprite = this.layerGraphics.get(layer.id) as unknown as Sprite | undefined
        if (!sprite) {
          const tex = Texture.from(layer.objectUrl)
          sprite = new Sprite(tex)
          this.layerGraphics.set(layer.id, sprite as unknown as Graphics)
        }
        sprite.alpha = layer.opacity
        sprite.scale.set(layer.scale)
        sprite.x = layer.x
        sprite.y = layer.y
        stage.addChildAt(sprite, Math.min(index, stage.children.length))
      }
    })
  }

  setSize(size: number): void {
    if (!this.app) return
    this.size = size
    this.app.renderer.resize(size, size)
  }

  async exportPng(): Promise<Blob> {
    if (!this.app) throw new Error('Renderer not initialised')
    const canvas = this.app.renderer.extract.canvas(this.app.stage) as HTMLCanvasElement
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob returned null'))
      }, 'image/png')
    })
  }

  destroy(): void {
    for (const g of this.layerGraphics.values()) {
      g.destroy()
    }
    this.layerGraphics.clear()
    this.app?.destroy(true)
    this.app = null
  }
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/lib/renderer.ts
git commit -m "feat: add PixiRenderer implementing RendererAdapter"
```

---

## Task 6: Page shell + layout

**Files:**
- Create: `app/texture-playground/page.tsx`
- Create: `app/texture-playground/TexturePlaygroundClient.tsx`

- [ ] **Write page.tsx**

```tsx
// app/texture-playground/page.tsx
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Texture Playground',
  robots: { index: false },
}

const TexturePlaygroundClient = dynamic(
  () => import('./TexturePlaygroundClient'),
  { ssr: false }  // PixiJS requires browser APIs
)

export default function TexturePage() {
  return <TexturePlaygroundClient />
}
```

- [ ] **Write TexturePlaygroundClient.tsx** — layout shell with placeholder panels

```tsx
// app/texture-playground/TexturePlaygroundClient.tsx
'use client'
import { useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Project } from './lib/types'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const DEFAULT_PROJECT: Project = {
  base: {
    layers: [
      { id: 'bg', kind: 'background', color: '#434625' },
      { id: 'g1', kind: 'grid', composition: 'dot-grid', spacing: 18, thickness: 1, dotSize: 3, opacity: 1, scale: 1 },
    ],
  },
  frames: [
    { id: 'f1', layerOverrides: {}, durationFrames: 5 },
  ],
  outputSize: 1024,
  fps: 30,
  activeFrameId: 'f1',
}

export default function TexturePlaygroundClient() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT)

  return (
    <div
      className={`${geist.variable} ${geistMono.variable}`}
      style={{
        fontFamily: 'var(--font-geist), system-ui, sans-serif',
        background: '#0a0a0a',
        color: '#e8e8e8',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* TopBar placeholder */}
      <div style={{ height: 40, background: '#111', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#D1E043', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Texture</span>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LeftPanel placeholder */}
        <div style={{ width: 192, background: '#111', borderRight: '1px solid #1e1e1e', flexShrink: 0 }} />

        {/* CanvasPreview placeholder */}
        <div style={{ flex: 1, background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#444' }}>canvas</span>
        </div>
      </div>

      {/* Timeline placeholder */}
      <div style={{ height: 72, background: '#0e0e0e', borderTop: '1px solid #1e1e1e' }} />
    </div>
  )
}
```

- [ ] **Verify** — `npm run dev` → navigate to `/texture-playground` — three-panel layout visible, no errors

- [ ] **Commit**

```bash
git add app/texture-playground/page.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: scaffold texture playground page shell"
```

---

## Task 7: CanvasPreview

**Files:**
- Create: `app/texture-playground/components/CanvasPreview.tsx`

- [ ] **Write CanvasPreview.tsx**

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

export default function CanvasPreview({ snapshot, outputSize, onAdapterReady, frameLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const adapterRef = useRef<RendererAdapter | null>(null)

  // Init renderer once
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
  }, []) // init once only

  // Resize when outputSize changes
  useEffect(() => {
    adapterRef.current?.setSize(outputSize)
  }, [outputSize])

  // Re-render when snapshot changes
  useEffect(() => {
    adapterRef.current?.renderFrame(snapshot)
  }, [snapshot])

  return (
    <div style={{ flex: 1, background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', borderRadius: 3 }}
      />
      <span style={{
        position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#444',
        background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 3, whiteSpace: 'nowrap',
      }}>
        {outputSize} × {outputSize}
      </span>
      <span style={{
        position: 'absolute', top: 12, right: 12,
        fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#555',
        background: '#111', border: '1px solid #1e1e1e', borderRadius: 4, padding: '3px 7px',
      }}>
        {frameLabel}
      </span>
    </div>
  )
}
```

- [ ] **Wire into TexturePlaygroundClient** — replace the canvas placeholder. Add imports and state:

```tsx
// Add to TexturePlaygroundClient.tsx imports:
import CanvasPreview from './components/CanvasPreview'
import { resolveFrame } from './lib/resolve'
import type { RendererAdapter } from './lib/types'

// Add inside component, after useState:
// adapterRef for synchronous access in export handlers
const adapterRef = useRef<RendererAdapter | null>(null)
// adapter state triggers re-render so usePlayback sees the live adapter
const [adapter, setAdapter] = useState<RendererAdapter | null>(null)

const activeFrame = project.frames.find(f => f.id === project.activeFrameId) ?? project.frames[0]
const snapshot = resolveFrame(project.base, activeFrame)

// Replace canvas placeholder div with:
<CanvasPreview
  snapshot={snapshot}
  outputSize={project.outputSize}
  onAdapterReady={(a) => { adapterRef.current = a; setAdapter(a) }}
  frameLabel={`editing ${project.frames.indexOf(activeFrame) + 1}/${project.frames.length}`}
/>
```

Also add `import { useRef } from 'react'` to the imports line.

- [ ] **Verify** — `/texture-playground` shows a green canvas with a dot grid pattern. No console errors.

- [ ] **Commit**

```bash
git add app/texture-playground/components/CanvasPreview.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: mount PixiJS canvas with live dot grid preview"
```

---

## Task 8: ColorPicker

**Files:**
- Create: `app/texture-playground/components/controls/ColorPicker.tsx`

- [ ] **Write ColorPicker.tsx**

```tsx
// app/texture-playground/components/controls/ColorPicker.tsx
'use client'

const PALETTE: Record<string, string[]> = {
  'Primary': ['#434625', '#5B6F00', '#788C15', '#B2C248', '#D1E043', '#E5EACD'],
  'Neutral dark': ['#1E1E1E', '#333332', '#686865', '#898985', '#A9A9A5', '#D9D9D9'],
  'Neutral light': ['#EBEBE4', '#F2F2EC', '#F8F8F3', '#FCFCF9', '#FFFFFF'],
  'Blue': ['#3E49B8', '#4691E2', '#B8D5FF', '#D2E4F8'],
  'Purple': ['#564391', '#A191CE', '#CEBEF8', '#E8E4F3'],
  'Pink': ['#A42962', '#FF91E0', '#FFBCEF', '#FFDEF6'],
  'Red': ['#BD4A30', '#E95D3D', '#F29E8B', '#F8CEC5'],
  'Amber': ['#8B4E23', '#ED9212', '#FFB567', '#FFEAA6'],
  'Khaki': ['#40351A', '#BB9F56', '#E5CD75', '#EDE1A1'],
}

type Props = {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(PALETTE).map(([group, colors]) => (
        <div key={group}>
          <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 8, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            {group}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => onChange(c)}
                title={c}
                style={{
                  width: 18, height: 18,
                  borderRadius: 3,
                  background: c,
                  border: value === c ? '2px solid #D1E043' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/components/controls/ColorPicker.tsx
git commit -m "feat: add Granola palette ColorPicker"
```

---

## Task 9: CompositionPicker

**Files:**
- Create: `app/texture-playground/components/controls/CompositionPicker.tsx`

- [ ] **Write CompositionPicker.tsx**

```tsx
// app/texture-playground/components/controls/CompositionPicker.tsx
'use client'
import type { CompositionType } from '../../lib/types'

const COMPOSITIONS: { id: CompositionType; label: string }[] = [
  { id: 'dot-grid',     label: 'Dot grid' },
  { id: 'regular-grid', label: 'Regular' },
  { id: 'variable-grid',label: 'Variable' },
  { id: 'linear',       label: 'Linear' },
  { id: 'layered',      label: 'Layered' },
  { id: 'checkered',    label: 'Checkered' },
]

type Props = {
  value: CompositionType
  onChange: (c: CompositionType) => void
}

export default function CompositionPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      {COMPOSITIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            fontFamily: 'var(--font-geist)', fontSize: 10,
            background: value === id ? '#161d07' : '#161616',
            border: `1px solid ${value === id ? '#3a4a10' : '#1e1e1e'}`,
            color: value === id ? '#c8d83a' : '#555',
            borderRadius: 4, padding: '5px 6px',
            cursor: 'pointer', textAlign: 'center',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/components/controls/CompositionPicker.tsx
git commit -m "feat: add CompositionPicker"
```

---

## Task 10: LayerStack

**Files:**
- Create: `app/texture-playground/components/controls/LayerStack.tsx`

- [ ] **Write LayerStack.tsx**

```tsx
// app/texture-playground/components/controls/LayerStack.tsx
'use client'
import type { Layer } from '../../lib/types'

type Props = {
  layers: Layer[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}

const SWATCH_COLOR: Record<string, string> = {}

function layerLabel(layer: Layer): string {
  if (layer.kind === 'background') return `BG · ${layer.color}`
  if (layer.kind === 'grid') return layer.composition.replace('-', ' ')
  return 'Image'
}

function layerDot(layer: Layer): string {
  if (layer.kind === 'background') return layer.color
  if (layer.kind === 'grid') return '#D1E043'
  return '#4691E2'
}

export default function LayerStack({ layers, selectedId, onSelect, onAdd, onDelete }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[...layers].reverse().map((layer) => (
        <div
          key={layer.id}
          onClick={() => onSelect(layer.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
            background: selectedId === layer.id ? '#161616' : 'transparent',
            color: selectedId === layer.id ? '#e8e8e8' : '#666',
            fontSize: 11, fontFamily: 'var(--font-geist)',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 2, background: layerDot(layer), flexShrink: 0 }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {layerLabel(layer)}
          </span>
          {layer.kind !== 'background' && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
              style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
              title="Delete layer"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
          background: 'none', border: '1px dashed #222', color: '#333',
          fontSize: 11, fontFamily: 'var(--font-geist)', marginTop: 2,
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add layer
      </button>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/components/controls/LayerStack.tsx
git commit -m "feat: add LayerStack component"
```

---

## Task 11: LayerControls

**Files:**
- Create: `app/texture-playground/components/controls/LayerControls.tsx`

- [ ] **Write LayerControls.tsx**

```tsx
// app/texture-playground/components/controls/LayerControls.tsx
'use client'
import type { Layer, LayerOverride } from '../../lib/types'
import ColorPicker from './ColorPicker'

type Props = {
  layer: Layer
  onChange: (override: LayerOverride) => void
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
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: '#555' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#888' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#D1E043', cursor: 'pointer' }}
      />
    </div>
  )
}

export default function LayerControls({ layer, onChange }: Props) {
  if (layer.kind === 'background') {
    return (
      <div>
        <div style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: '#555', marginBottom: 8 }}>Background colour</div>
        <ColorPicker value={layer.color} onChange={(color) => onChange({ color })} />
      </div>
    )
  }

  if (layer.kind === 'image') {
    return (
      <div>
        <Slider label="Scale" value={layer.scale} min={0.1} max={4} step={0.05} onChange={(v) => onChange({ scale: v })} />
        <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onChange({ opacity: v / 100 })} />
        <Slider label="X offset" value={layer.x} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ x: v })} />
        <Slider label="Y offset" value={layer.y} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ y: v })} />
      </div>
    )
  }

  // grid layer
  return (
    <div>
      <Slider label="Spacing" value={layer.spacing} min={4} max={120} step={1} unit="px" onChange={(v) => onChange({ spacing: v })} />
      {layer.composition === 'dot-grid' && (
        <Slider label="Dot size" value={layer.dotSize} min={1} max={20} step={0.5} unit="px" onChange={(v) => onChange({ dotSize: v })} />
      )}
      {(layer.composition !== 'dot-grid' && layer.composition !== 'checkered') && (
        <Slider label="Thickness" value={layer.thickness} min={0.5} max={8} step={0.5} unit="px" onChange={(v) => onChange({ thickness: v })} />
      )}
      <Slider label="Scale" value={layer.scale} min={0.5} max={3} step={0.05} onChange={(v) => onChange({ scale: v })} />
      <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onChange({ opacity: v / 100 })} />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/texture-playground/components/controls/LayerControls.tsx
git commit -m "feat: add LayerControls with sliders per layer type"
```

---

## Task 12: LeftPanel + wire controls to project state

**Files:**
- Create: `app/texture-playground/components/LeftPanel.tsx`
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

- [ ] **Write LeftPanel.tsx**

```tsx
// app/texture-playground/components/LeftPanel.tsx
'use client'
import type { Layer, Project, CompositionType, LayerOverride } from '../lib/types'
import CompositionPicker from './controls/CompositionPicker'
import LayerStack from './controls/LayerStack'
import LayerControls from './controls/LayerControls'

type Props = {
  project: Project
  selectedLayerId: string
  onSelectLayer: (id: string) => void
  onLayerChange: (layerId: string, override: LayerOverride) => void
  onAddGridLayer: (composition: CompositionType) => void
  onDeleteLayer: (id: string) => void
  onAddToTimeline: () => void
  activeComposition: CompositionType
  onChangeComposition: (c: CompositionType) => void
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#444',
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
}
const SECTION: React.CSSProperties = {
  padding: '14px 14px 10px', borderBottom: '1px solid #1a1a1a',
}

export default function LeftPanel({
  project, selectedLayerId, onSelectLayer, onLayerChange,
  onAddGridLayer, onDeleteLayer, onAddToTimeline,
  activeComposition, onChangeComposition,
}: Props) {
  const selectedLayer = project.base.layers.find(l => l.id === selectedLayerId)

  return (
    <div style={{ width: 192, background: '#111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Composition</div>
        <CompositionPicker value={activeComposition} onChange={onChangeComposition} />
      </div>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Layers</div>
        <LayerStack
          layers={project.base.layers}
          selectedId={selectedLayerId}
          onSelect={onSelectLayer}
          onAdd={() => onAddGridLayer(activeComposition)}
          onDelete={onDeleteLayer}
        />
      </div>

      <div style={{ ...SECTION, flex: 1, overflowY: 'auto' }}>
        <div style={SECTION_LABEL}>Parameters</div>
        {selectedLayer ? (
          <LayerControls
            layer={selectedLayer}
            onChange={(override) => onLayerChange(selectedLayer.id, override)}
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

- [ ] **Add state handlers to TexturePlaygroundClient.tsx** — add these helpers inside the component, before the return:

```tsx
// Add these imports at top of TexturePlaygroundClient.tsx:
import { nanoid } from 'nanoid' // npm install nanoid
import LeftPanel from './components/LeftPanel'
import type { CompositionType, LayerOverride, GridLayer } from './lib/types'

// Add these state vars after const [project, setProject]:
const [selectedLayerId, setSelectedLayerId] = useState('g1')
const [activeComposition, setActiveComposition] = useState<CompositionType>('dot-grid')

// Add these handlers:
function handleLayerChange(layerId: string, override: LayerOverride) {
  setProject(p => ({
    ...p,
    base: {
      layers: p.base.layers.map(l => l.id === layerId ? { ...l, ...override } as typeof l : l)
    }
  }))
}

function handleAddGridLayer(composition: CompositionType) {
  const newLayer: GridLayer = {
    id: nanoid(6), kind: 'grid', composition,
    spacing: 20, thickness: 1, dotSize: 3, opacity: 1, scale: 1,
  }
  setProject(p => ({ ...p, base: { layers: [...p.base.layers, newLayer] } }))
  setSelectedLayerId(newLayer.id)
}

function handleDeleteLayer(layerId: string) {
  setProject(p => ({
    ...p,
    base: { layers: p.base.layers.filter(l => l.id !== layerId) }
  }))
  setSelectedLayerId(p => p === layerId ? 'bg' : p)
}

function handleAddToTimeline() {
  const newFrame = { id: nanoid(6), layerOverrides: {}, durationFrames: 5 }
  setProject(p => ({
    ...p,
    frames: [...p.frames.slice(0, 4), newFrame], // max 5
    activeFrameId: newFrame.id,
  }))
}
```

- [ ] **Install nanoid**

```bash
npm install nanoid
```

- [ ] **Replace LeftPanel placeholder in TexturePlaygroundClient.tsx return** with:

```tsx
<LeftPanel
  project={project}
  selectedLayerId={selectedLayerId}
  onSelectLayer={setSelectedLayerId}
  onLayerChange={handleLayerChange}
  onAddGridLayer={handleAddGridLayer}
  onDeleteLayer={handleDeleteLayer}
  onAddToTimeline={handleAddToTimeline}
  activeComposition={activeComposition}
  onChangeComposition={setActiveComposition}
/>
```

- [ ] **Verify** — adjusting sliders updates the canvas live. Switching composition chips adds a layer. "Add to timeline" appends a frame.

- [ ] **Commit**

```bash
git add app/texture-playground/components/LeftPanel.tsx app/texture-playground/TexturePlaygroundClient.tsx package.json package-lock.json
git commit -m "feat: wire LeftPanel controls to project state and live canvas"
```

---

## Task 13: TopBar

**Files:**
- Create: `app/texture-playground/components/TopBar.tsx`
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

- [ ] **Write TopBar.tsx**

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
      height: 40, background: '#111', borderBottom: '1px solid #1e1e1e',
      display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#D1E043', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Texture
      </span>
      <div style={{ width: 1, height: 16, background: '#222' }} />
      <div style={{ display: 'flex', gap: 2 }}>
        {SIZES.map(s => (
          <button key={s} onClick={() => onSizeChange(s)} style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 10,
            padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
            background: outputSize === s ? '#1a1f0f' : 'transparent',
            color: outputSize === s ? '#D1E043' : '#555',
          }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={onExportFrame} style={{ fontFamily: 'var(--font-geist)', fontSize: 10, background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
        Export frame
      </button>
      <button onClick={onExportWebM} disabled={exporting} style={{
        fontFamily: 'var(--font-geist)', fontSize: 11, fontWeight: 500,
        background: '#D1E043', color: '#111', border: 'none',
        borderRadius: 5, padding: '5px 12px', cursor: exporting ? 'wait' : 'pointer',
        opacity: exporting ? 0.6 : 1,
      }}>
        {exporting ? 'Exporting…' : 'Export WebM'}
      </button>
    </div>
  )
}
```

- [ ] **Add to TexturePlaygroundClient.tsx** — replace TopBar placeholder:

```tsx
// Add import:
import TopBar from './components/TopBar'

// Add state:
const [exporting, setExporting] = useState(false)

// Add handlers (stubs — wired properly in Task 16):
async function handleExportFrame() { /* wired in Task 16 */ }
async function handleExportWebM() { /* wired in Task 16 */ }

// Replace TopBar placeholder with:
<TopBar
  outputSize={project.outputSize}
  onSizeChange={(s) => setProject(p => ({ ...p, outputSize: s }))}
  onExportFrame={handleExportFrame}
  onExportWebM={handleExportWebM}
  exporting={exporting}
/>
```

- [ ] **Commit**

```bash
git add app/texture-playground/components/TopBar.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add TopBar with size selector and export button stubs"
```

---

## Task 14: Timeline

**Files:**
- Create: `app/texture-playground/components/Timeline.tsx`
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

- [ ] **Write Timeline.tsx**

```tsx
// app/texture-playground/components/Timeline.tsx
'use client'
import type { Frame, Project } from '../lib/types'

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
}

export default function Timeline({
  frames, activeFrameId, fps, playing,
  onSelectFrame, onDeleteFrame, onDurationChange, onFpsChange, onPlay, onStop,
}: Props) {
  return (
    <div style={{
      height: 72, background: '#0e0e0e', borderTop: '1px solid #1e1e1e',
      display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>
        Timeline
      </span>

      {frames.map((frame, i) => (
        <div key={frame.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div
            onClick={() => onSelectFrame(frame.id)}
            title={`Frame ${i + 1}`}
            style={{
              width: 44, height: 44, borderRadius: 4, cursor: 'pointer',
              background: '#434625', border: `1px solid ${activeFrameId === frame.id ? '#D1E043' : '#2a2a2a'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#D1E043',
              position: 'relative',
            }}
          >
            F{i + 1}
            {frames.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteFrame(frame.id) }}
                style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#1e1e1e', border: '1px solid #333',
                  color: '#555', fontSize: 9, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
          <input
            type="number"
            value={frame.durationFrames}
            min={1} max={120}
            onChange={(e) => onDurationChange(frame.id, Math.max(1, Number(e.target.value)))}
            style={{
              width: 44, background: 'transparent', border: 'none',
              fontFamily: 'var(--font-geist-mono)', fontSize: 8, color: '#444',
              textAlign: 'center', padding: 0,
            }}
            title="Duration in frames"
          />
        </div>
      ))}

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#444' }}>fps</span>
          <input
            type="number" value={fps} min={1} max={60}
            onChange={(e) => onFpsChange(Math.max(1, Math.min(60, Number(e.target.value))))}
            style={{
              width: 30, background: 'transparent', border: 'none',
              fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#888',
              textAlign: 'center', padding: 0,
            }}
          />
        </div>
        <button
          onClick={playing ? onStop : onPlay}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#D1E043', color: '#111', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, cursor: 'pointer', flexShrink: 0,
          }}
        >
          {playing ? '■' : '▶'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Wire into TexturePlaygroundClient.tsx** — replace Timeline placeholder:

```tsx
// Add import:
import Timeline from './components/Timeline'

// Add state:
const [playing, setPlaying] = useState(false)

// Add handlers:
function handleDeleteFrame(frameId: string) {
  setProject(p => {
    const frames = p.frames.filter(f => f.id !== frameId)
    return { ...p, frames, activeFrameId: frames[0]?.id ?? p.activeFrameId }
  })
}
function handleDurationChange(frameId: string, frames: number) {
  setProject(p => ({
    ...p,
    frames: p.frames.map(f => f.id === frameId ? { ...f, durationFrames: frames } : f),
  }))
}

// Replace Timeline placeholder with:
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
```

- [ ] **Verify** — frame thumbnails appear. Clicking a frame makes it active. Duration inputs are editable. Play/stop button toggles.

- [ ] **Commit**

```bash
git add app/texture-playground/components/Timeline.tsx app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add Timeline with frame selection and duration inputs"
```

---

## Task 15: Playback

**Files:**
- Create: `app/texture-playground/lib/playback.ts`
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`

- [ ] **Write playback.ts**

```ts
// app/texture-playground/lib/playback.ts
import { useEffect, useRef } from 'react'
import { resolveFrame } from './resolve'
import type { Project, RendererAdapter } from './types'

export function usePlayback(
  adapter: RendererAdapter | null,
  project: Project,
  playing: boolean,
  onStop: () => void,
) {
  const stopRef = useRef(false)

  useEffect(() => {
    if (!playing || !adapter) return
    stopRef.current = false

    let frameIdx = 0
    let rafId: number

    async function runLoop() {
      while (!stopRef.current) {
        const frame = project.frames[frameIdx % project.frames.length]
        const snapshot = resolveFrame(project.base, frame)
        adapter.renderFrame(snapshot)
        const holdMs = (frame.durationFrames / project.fps) * 1000
        await new Promise<void>((resolve) => {
          const start = performance.now()
          function tick() {
            if (stopRef.current) { resolve(); return }
            if (performance.now() - start >= holdMs) { resolve(); return }
            rafId = requestAnimationFrame(tick)
          }
          rafId = requestAnimationFrame(tick)
        })
        frameIdx++
      }
      onStop()
    }

    runLoop()

    return () => {
      stopRef.current = true
      cancelAnimationFrame(rafId)
    }
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps
}
```

- [ ] **Wire into TexturePlaygroundClient.tsx**

```tsx
// Add import:
import { usePlayback } from './lib/playback'

// Add after adapterRef declaration:
// Pass `adapter` (state, not ref) so the hook re-runs when the renderer is ready
usePlayback(adapter, project, playing, () => setPlaying(false))
```

- [ ] **Verify** — build a two-frame project with different dot spacing. Hit Play. Canvas should animate between the two frames in a loop. Hit Stop (■) to end playback.

- [ ] **Commit**

```bash
git add app/texture-playground/lib/playback.ts app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add animation playback loop"
```

---

## Task 16: Export functions

**Files:**
- Create: `app/texture-playground/lib/export.ts`

- [ ] **Write export.ts**

```ts
// app/texture-playground/lib/export.ts
import type { Project, RendererAdapter } from './types'
import { resolveFrame } from './resolve'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Fast preview export (MediaRecorder) ──────────────────────────────────────

export async function exportWebMFast(
  canvas: HTMLCanvasElement,
  adapter: RendererAdapter,
  project: Project,
): Promise<void> {
  const stream = canvas.captureStream(project.fps)
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

  recorder.start()

  // Play exactly one full cycle
  for (const frame of project.frames) {
    const snapshot = resolveFrame(project.base, frame)
    adapter.renderFrame(snapshot)
    await new Promise<void>((resolve) => setTimeout(resolve, (frame.durationFrames / project.fps) * 1000))
  }

  recorder.stop()
  await new Promise<void>((resolve) => { recorder.onstop = () => resolve() })
  downloadBlob(new Blob(chunks, { type: 'video/webm' }), 'texture-preview.webm')
}

// ── Deterministic export (WebCodecs + webm-muxer) ────────────────────────────

export async function exportWebMDeterministic(
  canvas: HTMLCanvasElement,
  adapter: RendererAdapter,
  project: Project,
): Promise<void> {
  const { Muxer, ArrayBufferTarget } = await import('webm-muxer')
  const { outputSize, fps, base, frames } = project

  const target = new ArrayBufferTarget()
  const muxer = new Muxer({
    target,
    video: { codec: 'V_VP9', width: outputSize, height: outputSize, frameRate: fps },
  })

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta ?? {}),
    error: (e) => { throw e },
  })
  encoder.configure({ codec: 'vp09.00.10.08', width: outputSize, height: outputSize, bitrate: 4_000_000 })

  let timestampUs = 0
  const frameDurationUs = (1 / fps) * 1_000_000

  for (const frame of frames) {
    const snapshot = resolveFrame(base, frame)
    adapter.renderFrame(snapshot)

    for (let tick = 0; tick < frame.durationFrames; tick++) {
      const bitmap = await createImageBitmap(canvas)
      const videoFrame = new VideoFrame(bitmap, { timestamp: timestampUs, duration: frameDurationUs })
      encoder.encode(videoFrame, { keyFrame: tick === 0 })
      videoFrame.close()
      bitmap.close()
      timestampUs += frameDurationUs
    }
  }

  await encoder.flush()
  muxer.finalize()

  downloadBlob(new Blob([target.buffer], { type: 'video/webm' }), 'texture.webm')
}

// ── PNG frame export ──────────────────────────────────────────────────────────

export async function exportFramePng(adapter: RendererAdapter): Promise<void> {
  const blob = await adapter.exportPng()
  downloadBlob(blob, 'texture-frame.png')
}
```

- [ ] **Wire export handlers in TexturePlaygroundClient.tsx** — replace the stub handlers:

```tsx
// Add import:
import { exportWebMFast, exportWebMDeterministic, exportFramePng } from './lib/export'

// Replace stub handlers:
async function handleExportFrame() {
  if (!adapterRef.current) return
  await exportFramePng(adapterRef.current)
}

async function handleExportWebM() {
  if (!adapterRef.current) return
  const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
  if (!canvas) return
  setExporting(true)
  try {
    await exportWebMDeterministic(canvas, adapterRef.current, project)
  } finally {
    setExporting(false)
  }
}
```

- [ ] **Verify deterministic export** — build a two-frame animation. Export WebM. Open in browser/VLC. Confirm:
  - Total duration = sum of (durationFrames / fps) for all frames
  - Loop plays cleanly without stutter or frame drift
  - Export again — file is identical frame count

- [ ] **Verify PNG export** — click "Export frame". PNG downloads at the correct output size. Open in Preview — check dimensions match selected size (512/1024/2048 × same).

- [ ] **Commit**

```bash
git add app/texture-playground/lib/export.ts app/texture-playground/TexturePlaygroundClient.tsx
git commit -m "feat: add WebM (deterministic + fast) and PNG export"
```

---

## Task 17: Resource cleanup

**Files:**
- Modify: `app/texture-playground/TexturePlaygroundClient.tsx`
- Modify: `app/texture-playground/components/LeftPanel.tsx`

- [ ] **Add object URL revocation in handleDeleteLayer**

```tsx
// In handleDeleteLayer inside TexturePlaygroundClient.tsx, update to:
function handleDeleteLayer(layerId: string) {
  setProject(p => {
    const layer = p.base.layers.find(l => l.id === layerId)
    if (layer?.kind === 'image') URL.revokeObjectURL(layer.objectUrl)
    return { ...p, base: { layers: p.base.layers.filter(l => l.id !== layerId) } }
  })
  setSelectedLayerId(prev => prev === layerId ? 'bg' : prev)
}
```

- [ ] **Add image upload handler** — inside TexturePlaygroundClient.tsx:

```tsx
import { nanoid } from 'nanoid'
import type { ImageLayer } from './lib/types'

function handleAddImageLayer(file: File) {
  const objectUrl = URL.createObjectURL(file)
  const newLayer: ImageLayer = {
    id: nanoid(6), kind: 'image', file, objectUrl,
    scale: 1, x: 0, y: 0, opacity: 1,
  }
  setProject(p => ({ ...p, base: { layers: [...p.base.layers, newLayer] } }))
  setSelectedLayerId(newLayer.id)
}
```

- [ ] **Add upload input to LeftPanel** — inside the "Add layer" section, add an upload button next to the "+ Add layer" button in `LayerStack.tsx`:

```tsx
// In LayerStack.tsx, add after the existing "Add layer" button:
<label style={{
  display: 'flex', alignItems: 'center', gap: 7,
  padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
  background: 'none', border: '1px dashed #222', color: '#333',
  fontSize: 11, fontFamily: 'var(--font-geist)', marginTop: 2,
}}>
  <span style={{ fontSize: 14, lineHeight: 1 }}>↑</span> Upload image
  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) onAddImage(file)
    e.target.value = ''
  }} />
</label>
```

Add `onAddImage: (file: File) => void` to the `Props` type in `LayerStack.tsx` and pass `onAddImage={handleAddImageLayer}` from `LeftPanel.tsx` (which receives it from `TexturePlaygroundClient.tsx`).

- [ ] **Verify** — upload an image, delete it, repeat 10 times. Check DevTools Memory tab — no growing heap. Navigate away and back — no Pixi errors.

- [ ] **Commit**

```bash
git add app/texture-playground/TexturePlaygroundClient.tsx app/texture-playground/components/controls/LayerStack.tsx
git commit -m "feat: add image upload layer and object URL cleanup"
```

---

## Task 18: Final verification

- [ ] **Run full verification checklist from spec**

```bash
npm run dev
```

1. Navigate to `/texture-playground` — loads, no console errors
2. Pick each of the 6 composition types — canvas updates correctly for each
3. Adjust spacing/dotSize/scale/opacity sliders — canvas updates without full rebuild
4. Switch composition type on a layer — redraws correctly
5. Upload image — appears as a layer, scale/position sliders work
6. Delete image layer — no URL leak (DevTools Memory)
7. Add 3 frames, set different durations — timeline shows all 3
8. Hit Play — loops correctly through all frames at specified timing
9. Hit Stop — playback ends, canvas returns to active frame
10. Export frame → PNG at 1024 — dimensions correct
11. Export WebM → file plays as seamless loop
12. Export WebM twice → same duration both times
13. Switch to 2048 — canvas resizes, export works at 2048
14. Navigate to home and back — no errors

- [ ] **Run build**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: texture playground complete — PixiJS compositor with WebM + PNG export"
```

---

## Architecture notes for future phases

**Adding Phase 2 filters (noise, pixelation, etc.):**
```ts
// In renderer.ts, after creating a Graphics object for a layer:
import { NoiseFilter } from '@pixi/filters'
gridGraphics.filters = [new NoiseFilter({ noise: 0.3 })]
```
No structural changes needed — the `RendererAdapter` interface and layer model are already designed for this.

**Moving to standalone repo:**
Copy `app/texture-playground/` to a new Next.js project. Remove Tailwind dependency from the tool chrome (all styles are inline). Update Google Fonts import. Done.

**Adding MP4 export:**
Replace `webm-muxer` with `mp4-muxer` (same API). Change codec from `vp09` to `avc1`. No other changes.
