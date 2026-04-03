// app/texture-playground/components/controls/CompositionPicker.tsx
'use client'
import type { CompositionType } from '../../lib/types'
import CompositionIcon from './CompositionIcon'

const COMPOSITIONS: { id: CompositionType; label: string }[] = [
  { id: 'dot-grid',      label: 'Dot grid' },
  { id: 'regular-grid',  label: 'Regular' },
  { id: 'variable-grid', label: 'Variable' },
  { id: 'linear',        label: 'Linear' },
  { id: 'layered',       label: 'Layered' },
  { id: 'checkered',     label: 'Checkered' },
]

type Props = {
  value: CompositionType
  onChange: (c: CompositionType) => void
}

export default function CompositionPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      {COMPOSITIONS.map(({ id, label }) => {
        const active = value === id
        const color = active ? '#c8d83a' : '#444'
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              padding: '8px 4px 6px',
              background: active ? '#161d07' : '#161616',
              border: `1px solid ${active ? '#3a4a10' : '#1e1e1e'}`,
              borderRadius: 4, cursor: 'pointer',
            }}
          >
            <CompositionIcon type={id} size={18} color={color} />
            <span style={{
              fontFamily: 'var(--font-geist)', fontSize: 9,
              color, letterSpacing: '0.02em', lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
