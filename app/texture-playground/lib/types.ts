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

// Used by LayerControls onChange callbacks — partial properties to apply to a layer
export type LayerOverride = Partial<Omit<GridLayer | BackgroundLayer | ImageLayer, 'id' | 'kind' | 'file'>>

export type Frame = {
  id: string
  layers: Layer[]        // each frame owns its full, independent layer stack
  durationFrames: number
}

export type Project = {
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
