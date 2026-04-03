// app/texture-playground/components/controls/ColorPicker.tsx
'use client'

// The 8 Granola background colours used in production textures
const PALETTE = [
  '#434625', // dark olive
  '#788C15', // mid olive
  '#B2C248', // lime
  '#E5EACD', // pale sage
  '#4691E2', // blue
  '#FF91E0', // pink
  '#ED9212', // amber
  '#A191CE', // purple
]

type Props = {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
      {PALETTE.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          title={c}
          style={{
            aspectRatio: '1',
            borderRadius: 4,
            background: c,
            border: value === c ? '2px solid #D1E043' : '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            padding: 0,
          }}
        />
      ))}
    </div>
  )
}
