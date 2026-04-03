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
  private layerGraphics = new Map<string, Graphics | Sprite>()
  private layerUrls = new Map<string, string>()
  private size = 512

  async init(host: HTMLElement, size: number): Promise<void> {
    if (this.app) return
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
    for (const id of [...this.layerGraphics.keys()]) {
      if (!snapshotIds.has(id)) {
        const g = this.layerGraphics.get(id)!
        stage.removeChild(g)
        g.destroy()
        this.layerGraphics.delete(id)
        this.layerUrls.delete(id)
      }
    }

    // Render layers bottom-to-top
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
  }

  setSize(size: number): void {
    if (!this.app) return
    this.size = size
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
    for (const g of this.layerGraphics.values()) {
      g.destroy()
    }
    this.layerGraphics.clear()
    this.layerUrls.clear()
    this.app?.destroy(true)
    this.app = null
  }
}
