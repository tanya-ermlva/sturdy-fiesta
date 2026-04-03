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
