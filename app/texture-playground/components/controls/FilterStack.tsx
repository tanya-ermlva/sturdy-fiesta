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
  glow:         { type: 'glow',         enabled: true, distance: 10, strength: 2, color: '#b2c248' },
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
            border: '1px solid rgba(71,67,42,0.15)',
            borderRadius: 8, overflow: 'hidden',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'rgba(98,90,34,0.06)',
          }}>
            <button
              onClick={() => onChange(entry.type, { enabled: !entry.enabled })}
              title={entry.enabled ? 'Disable' : 'Enable'}
              style={{
                width: 10, height: 10, borderRadius: '50%', padding: 0, border: 'none',
                background: entry.enabled ? '#b2c248' : 'rgba(71,67,42,0.2)',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-geist)', fontSize: 13,
              color: entry.enabled ? '#292929' : '#72726e',
              fontWeight: 500, flex: 1,
            }}>
              {FILTER_LABELS[entry.type]}
            </span>
            <button
              onClick={() => onRemove(entry.type)}
              style={{
                background: 'none', border: 'none', color: '#72726e',
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
              }}
              title="Remove filter"
            >×</button>
          </div>
          {entry.enabled && (
            <div style={{ padding: '8px 12px 4px', background: '#f7f7f2' }}>
              <FilterControls entry={entry} onChange={(changes) => onChange(entry.type, changes)} />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setPickerOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(98,90,34,0.06)',
          border: `1px dashed ${pickerOpen ? 'rgba(71,67,42,0.4)' : 'rgba(71,67,42,0.2)'}`,
          color: '#72726e', fontSize: 13, fontFamily: 'var(--font-geist)',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{pickerOpen ? '−' : '+'}</span> Add filter
      </button>

      {pickerOpen && (
        <div style={{
          border: '1px solid rgba(71,67,42,0.15)', borderRadius: 8,
          padding: 4, display: 'flex', flexDirection: 'column', gap: 1,
          background: '#f7f7f2',
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
                  padding: '6px 10px', borderRadius: 6, border: 'none',
                  background: 'none',
                  color: active ? 'rgba(71,67,42,0.3)' : '#292929',
                  fontSize: 13, fontFamily: 'var(--font-geist)',
                  cursor: active ? 'default' : 'pointer', textAlign: 'left',
                }}
              >
                {FILTER_LABELS[type]}
                {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(71,67,42,0.3)' }}>active</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
