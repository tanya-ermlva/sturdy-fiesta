// app/texture-playground/components/controls/CompositionPicker.tsx
'use client'
import type { CompositionType } from '../../lib/types'

const COMPOSITIONS: { id: CompositionType; label: string }[] = [
  { id: 'dot-grid',     label: 'Dot grid' },
  { id: 'regular-grid', label: 'Regular' },
  { id: 'variable-grid',label: 'Variable' },
  { id: 'linear',       label: 'Linear' },
  { id: 'layered',      label: 'Layered' },
  { id: 'checkered',    label: 'Checkered' },
]

type Props = {
  value: CompositionType
  onChange: (c: CompositionType) => void
}

export default function CompositionPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      {COMPOSITIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            fontFamily: 'var(--font-geist)', fontSize: 10,
            background: value === id ? '#161d07' : '#161616',
            border: `1px solid ${value === id ? '#3a4a10' : '#1e1e1e'}`,
            color: value === id ? '#c8d83a' : '#555',
            borderRadius: 4, padding: '5px 6px',
            cursor: 'pointer', textAlign: 'center',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
