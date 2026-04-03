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
