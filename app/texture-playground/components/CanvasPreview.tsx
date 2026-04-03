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
