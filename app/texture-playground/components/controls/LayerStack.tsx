// app/texture-playground/components/controls/LayerStack.tsx
'use client'
import type { Layer } from '../../lib/types'
import CompositionIcon, { type LayerIconType } from './CompositionIcon'

type Props = {
  layers: Layer[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
  onAddImage: (file: File) => void
}

const COLOR_NAMES: Record<string, string> = {
  '#434625': 'dark olive',
  '#788C15': 'mid olive',
  '#B2C248': 'lime',
  '#E5EACD': 'pale sage',
  '#4691E2': 'blue',
  '#FF91E0': 'pink',
  '#ED9212': 'amber',
  '#A191CE': 'purple',
}

function layerLabel(layer: Layer): string {
  if (layer.kind === 'background') return COLOR_NAMES[layer.color] ?? layer.color
  if (layer.kind === 'grid') return layer.composition.replace(/-/g, ' ')
  if (layer.kind === 'adjustment') return 'Adjustments'
  return 'Image'
}

function layerIconType(layer: Layer): LayerIconType {
  if (layer.kind === 'background') return 'background'
  if (layer.kind === 'image') return 'image'
  if (layer.kind === 'adjustment') return 'adjustment'
  return layer.composition
}

export default function LayerStack({ layers, selectedId, onSelect, onAdd, onDelete, onAddImage }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[...layers].reverse().map((layer) => {
        const selected = selectedId === layer.id
        const iconColor = selected ? '#c8d83a' : '#444'
        return (
          <div
            key={layer.id}
            onClick={() => onSelect(layer.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
              background: selected ? '#161616' : 'transparent',
              color: selected ? '#e8e8e8' : '#666',
              fontSize: 11, fontFamily: 'var(--font-geist)',
              borderLeft: layer.kind === 'adjustment' ? `2px solid ${selected ? '#D1E043' : '#2a3a10'}` : '2px solid transparent',
            }}
          >
            <CompositionIcon type={layerIconType(layer)} size={14} color={iconColor} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {layerLabel(layer)}
            </span>
            {layer.kind !== 'background' && layer.kind !== 'adjustment' && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
                style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
                title="Delete layer"
              >
                ×
              </button>
            )}
          </div>
        )
      })}
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
