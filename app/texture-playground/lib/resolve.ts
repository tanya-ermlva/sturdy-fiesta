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
