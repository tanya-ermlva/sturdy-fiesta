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
