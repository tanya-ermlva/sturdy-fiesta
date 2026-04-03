// app/texture-playground/components/controls/LayerControls.tsx
'use client'
import type { Layer, LayerOverride, AdjustmentLayer, FilterEntry, FilterType } from '../../lib/types'
import ColorPicker from './ColorPicker'
import FilterStack from './FilterStack'

type Props = {
  layer: Layer
  onChange: (override: LayerOverride) => void
  onAddFilter: (entry: FilterEntry) => void
  onFilterChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemoveFilter: (filterType: FilterType) => void
}

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, unit = '', onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: '#555' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#888' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#D1E043', cursor: 'pointer' }}
      />
    </div>
  )
}

export default function LayerControls({ layer, onChange, onAddFilter, onFilterChange, onRemoveFilter }: Props) {
  if (layer.kind === 'adjustment') {
    return (
      <FilterStack
        layer={layer}
        onAdd={onAddFilter}
        onChange={onFilterChange}
        onRemove={onRemoveFilter}
      />
    )
  }

  if (layer.kind === 'background') {
    return (
      <div>
        <div style={{ fontFamily: 'var(--font-geist)', fontSize: 10, color: '#555', marginBottom: 8 }}>Background colour</div>
        <ColorPicker value={layer.color} onChange={(color) => onChange({ color })} />
      </div>
    )
  }

  if (layer.kind === 'image') {
    return (
      <div>
        <Slider label="Scale" value={layer.scale} min={0.1} max={4} step={0.05} onChange={(v) => onChange({ scale: v })} />
        <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onChange({ opacity: v / 100 })} />
        <Slider label="X offset" value={layer.x} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ x: v })} />
        <Slider label="Y offset" value={layer.y} min={-512} max={512} step={1} unit="px" onChange={(v) => onChange({ y: v })} />
      </div>
    )
  }

  // grid layer
  return (
    <div>
      <Slider label="Spacing" value={layer.spacing} min={4} max={120} step={1} unit="px" onChange={(v) => onChange({ spacing: v })} />
      {layer.composition === 'dot-grid' && (
        <Slider label="Dot size" value={layer.dotSize} min={1} max={20} step={0.5} unit="px" onChange={(v) => onChange({ dotSize: v })} />
      )}
      {(layer.composition !== 'dot-grid' && layer.composition !== 'checkered') && (
        <Slider label="Thickness" value={layer.thickness} min={0.5} max={8} step={0.5} unit="px" onChange={(v) => onChange({ thickness: v })} />
      )}
      <Slider label="Scale" value={layer.scale} min={0.5} max={3} step={0.05} onChange={(v) => onChange({ scale: v })} />
      <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => onChange({ opacity: v / 100 })} />
    </div>
  )
}
