// app/texture-playground/components/controls/ColorPicker.tsx
'use client'

const PALETTE: Record<string, string[]> = {
  'Primary': ['#434625', '#5B6F00', '#788C15', '#B2C248', '#D1E043', '#E5EACD'],
  'Neutral dark': ['#1E1E1E', '#333332', '#686865', '#898985', '#A9A9A5', '#D9D9D9'],
  'Neutral light': ['#EBEBE4', '#F2F2EC', '#F8F8F3', '#FCFCF9', '#FFFFFF'],
  'Blue': ['#3E49B8', '#4691E2', '#B8D5FF', '#D2E4F8'],
  'Purple': ['#564391', '#A191CE', '#CEBEF8', '#E8E4F3'],
  'Pink': ['#A42962', '#FF91E0', '#FFBCEF', '#FFDEF6'],
  'Red': ['#BD4A30', '#E95D3D', '#F29E8B', '#F8CEC5'],
  'Amber': ['#8B4E23', '#ED9212', '#FFB567', '#FFEAA6'],
  'Khaki': ['#40351A', '#BB9F56', '#E5CD75', '#EDE1A1'],
}

type Props = {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(PALETTE).map(([group, colors]) => (
        <div key={group}>
          <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 8, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            {group}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => onChange(c)}
                title={c}
                style={{
                  width: 18, height: 18,
                  borderRadius: 3,
                  background: c,
                  border: value === c ? '2px solid #D1E043' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
