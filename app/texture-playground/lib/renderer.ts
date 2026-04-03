// app/texture-playground/lib/renderer.ts
'use client'
import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js'
import { drawBackground, drawGridLayer } from './draw'
import type { FrameSnapshot, RendererAdapter } from './types'

function ensureChildAt(stage: Container, child: Container, index: number): void {
  if (child.parent === stage) {
    stage.setChildIndex(child, Math.min(index, stage.children.length - 1))
  } else {
    stage.addChildAt(child, Math.min(index, stage.children.length))
  }
}

export class PixiRenderer implements RendererAdapter {
  private app: Application | null = null
  private initialized = false
  private layerGraphics = new Map<string, Graphics | Sprite>()
  private layerUrls = new Map<string, string>()
  private size = 512

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
    // destroy() may have been called while we awaited (React Strict Mode double-invoke)
    if (this.app !== app) return
    this.initialized = true
  }

  renderFrame(snapshot: FrameSnapshot): void {
    if (!this.initialized || !this.app) return
    const { stage } = this.app
    const size = this.size

    // Track which layer ids appear in this snapshot
    const snapshotIds = new Set(snapshot.layers.map((l) => l.id))

    // Remove graphics for layers that no longer exist
    for (const id of [...this.layerGraphics.keys()]) {
      if (!snapshotIds.has(id)) {
        const g = this.layerGraphics.get(id)!
        stage.removeChild(g)
        g.destroy()
        this.layerGraphics.delete(id)
        this.layerUrls.delete(id)
      }
    }

    // Render layers bottom-to-top, then flush to canvas immediately
    snapshot.layers.forEach((layer, index) => {
      if (layer.kind === 'background') {
        let g = this.layerGraphics.get(layer.id) as Graphics | undefined
        if (!g) {
          g = new Graphics()
          this.layerGraphics.set(layer.id, g)
        }
        drawBackground(g, layer.color, size)
        ensureChildAt(stage, g, index)
        return
      }

      if (layer.kind === 'grid') {
        let g = this.layerGraphics.get(layer.id) as Graphics | undefined
        if (!g) {
          g = new Graphics()
          this.layerGraphics.set(layer.id, g)
        }
        drawGridLayer(g, layer, size)
        ensureChildAt(stage, g, index)
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
        ensureChildAt(stage, sprite, Math.min(index, stage.children.length))
      }
    })

    // Flush display-object changes to the WebGL canvas immediately.
    // Without this, rendering is deferred to the auto-ticker and the canvas
    // may be blank when read back during export.
    this.app.renderer.render(this.app.stage)
  }

  setSize(size: number): void {
    this.size = size
    if (!this.initialized || !this.app) return
    this.app.renderer.resize(size, size)
  }

  async exportPng(): Promise<Blob> {
    if (!this.app) throw new Error('Renderer not initialised')
    const base64 = await this.app.renderer.extract.base64({
      target: this.app.stage,
      format: 'png',
    })
    const [, data] = base64.split(',')
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
    return new Blob([bytes], { type: 'image/png' })
  }

  destroy(): void {
    this.initialized = false
    for (const g of [...this.layerGraphics.values()]) {
      try { g.destroy() } catch { /* ignore if not fully initialized */ }
    }
    this.layerGraphics.clear()
    this.layerUrls.clear()
    const app = this.app
    this.app = null  // null first so init() detects destruction mid-await
    if (app) {
      try { app.destroy(true) } catch { /* may throw if destroyed before init resolved */ }
    }
  }
}
