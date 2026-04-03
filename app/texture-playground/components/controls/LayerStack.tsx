// app/texture-playground/components/controls/LayerStack.tsx
'use client'
import type { Layer } from '../../lib/types'

type Props = {
  layers: Layer[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
  onAddImage: (file: File) => void
}

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

export default function LayerStack({ layers, selectedId, onSelect, onAdd, onDelete, onAddImage }: Props) {
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
    </div>
  )
}
