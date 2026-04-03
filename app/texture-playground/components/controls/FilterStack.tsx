// app/texture-playground/components/controls/FilterStack.tsx
'use client'
import { useState } from 'react'
import type { AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'
import FilterControls from './FilterControls'

type Props = {
  layer: AdjustmentLayer
  onAdd: (entry: FilterEntry) => void
  onChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemove: (filterType: FilterType) => void
}

const FILTER_DEFAULTS: Record<FilterType, FilterEntry> = {
  noise:        { type: 'noise',        enabled: true, intensity: 0.4 },
  blur:         { type: 'blur',         enabled: true, strength: 4 },
  pixelate:     { type: 'pixelate',     enabled: true, size: 8 },
  displacement: { type: 'displacement', enabled: true, scale: 30 },
  rgbsplit:     { type: 'rgbsplit',     enabled: true, amount: 6 },
  colormatrix:  { type: 'colormatrix',  enabled: true, brightness: 1, contrast: 1, saturation: 1, hue: 0, invert: false },
  halftone:     { type: 'halftone',     enabled: true, scale: 5, angle: 45 },
  glow:         { type: 'glow',         enabled: true, distance: 10, strength: 2, color: '#D1E043' },
}

const FILTER_LABELS: Record<FilterType, string> = {
  noise: 'Noise', blur: 'Blur', pixelate: 'Pixelate', displacement: 'Displacement',
  rgbsplit: 'RGB Split', colormatrix: 'Colour Adjust', halftone: 'Halftone', glow: 'Glow',
}

export default function FilterStack({ layer, onAdd, onChange, onRemove }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const activeTypes = new Set(layer.filters.map((f) => f.type))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {layer.filters.map((entry) => (
        <div
          key={entry.type}
          style={{
            border: '1px solid #1e1e1e',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 8px', background: '#151515',
          }}>
            {/* Enable toggle */}
            <button
              onClick={() => onChange(entry.type, { enabled: !entry.enabled })}
              title={entry.enabled ? 'Disable' : 'Enable'}
              style={{
                width: 10, height: 10, borderRadius: '50%', padding: 0, border: 'none',
                background: entry.enabled ? '#D1E043' : '#333',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: entry.enabled ? '#bbb' : '#444', fontWeight: 500, flex: 1 }}>
              {FILTER_LABELS[entry.type]}
            </span>
            <button
              onClick={() => onRemove(entry.type)}
              style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}
              title="Remove filter"
            >
              ×
            </button>
          </div>
          {/* Controls — only when enabled */}
          {entry.enabled && (
            <div style={{ padding: '8px 8px 4px', background: '#111' }}>
              <FilterControls
                entry={entry}
                onChange={(changes) => onChange(entry.type, changes)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Add filter button + picker */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setPickerOpen((o) => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px', borderRadius: 5, cursor: 'pointer',
            background: 'none', border: '1px dashed #222', color: '#333',
            fontSize: 10, fontFamily: 'var(--font-geist)',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add filter
        </button>

        {pickerOpen && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
            background: '#111', border: '1px solid #222', borderRadius: 6,
            padding: 6, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10,
          }}>
            {(Object.keys(FILTER_DEFAULTS) as FilterType[]).map((type) => {
              const active = activeTypes.has(type)
              return (
                <button
                  key={type}
                  disabled={active}
                  onClick={() => { onAdd(FILTER_DEFAULTS[type]); setPickerOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '5px 8px', borderRadius: 4, border: 'none',
                    background: active ? 'transparent' : '#161616',
                    color: active ? '#333' : '#888',
                    fontSize: 10, fontFamily: 'var(--font-geist)',
                    cursor: active ? 'default' : 'pointer', textAlign: 'left',
                  }}
                >
                  {FILTER_LABELS[type]}
                  {active && <span style={{ marginLeft: 'auto', fontSize: 8, color: '#333' }}>active</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
