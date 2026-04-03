// app/texture-playground/components/LeftPanel.tsx
'use client'
import type { CompositionType, LayerOverride, FrameSnapshot, FilterEntry, FilterType } from '../lib/types'
import CompositionPicker from './controls/CompositionPicker'
import LayerStack from './controls/LayerStack'
import LayerControls from './controls/LayerControls'

type Props = {
  snapshot: FrameSnapshot
  selectedLayerId: string
  onSelectLayer: (id: string) => void
  onLayerChange: (layerId: string, override: LayerOverride) => void
  onAddGridLayer: (composition: CompositionType) => void
  onDeleteLayer: (id: string) => void
  onAddImageLayer: (file: File) => void
  onAddToTimeline: () => void
  activeComposition: CompositionType
  onChangeComposition: (c: CompositionType) => void
  onAddFilter: (entry: FilterEntry) => void
  onFilterChange: (filterType: FilterType, changes: Partial<FilterEntry>) => void
  onRemoveFilter: (filterType: FilterType) => void
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: '#444',
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
}
const SECTION: React.CSSProperties = {
  padding: '14px 14px 10px', borderBottom: '1px solid #1a1a1a',
}

export default function LeftPanel({
  snapshot, selectedLayerId, onSelectLayer, onLayerChange,
  onAddGridLayer, onDeleteLayer, onAddImageLayer, onAddToTimeline,
  activeComposition, onChangeComposition,
  onAddFilter, onFilterChange, onRemoveFilter,
}: Props) {
  const selectedLayer = snapshot.layers.find(l => l.id === selectedLayerId)

  return (
    <div style={{ width: 192, background: '#111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Composition</div>
        <CompositionPicker value={activeComposition} onChange={onChangeComposition} />
      </div>

      <div style={SECTION}>
        <div style={SECTION_LABEL}>Layers</div>
        <LayerStack
          layers={snapshot.layers}
          selectedId={selectedLayerId}
          onSelect={onSelectLayer}
          onAdd={() => onAddGridLayer(activeComposition)}
          onDelete={onDeleteLayer}
          onAddImage={onAddImageLayer}
        />
      </div>

      <div style={{ ...SECTION, flex: 1, overflowY: 'auto' }}>
        <div style={SECTION_LABEL}>
          {selectedLayer?.kind === 'adjustment' ? 'Filters' : 'Parameters'}
        </div>
        {selectedLayer ? (
          <LayerControls
            layer={selectedLayer}
            onChange={(override) => onLayerChange(selectedLayer.id, override)}
            onAddFilter={onAddFilter}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
          />
        ) : (
          <span style={{ fontSize: 10, color: '#444' }}>Select a layer</span>
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #1a1a1a' }}>
        <button
          onClick={onAddToTimeline}
          style={{
            width: '100%', fontFamily: 'var(--font-geist)', fontSize: 11, fontWeight: 500,
            background: '#D1E043', color: '#111', border: 'none',
            borderRadius: 6, padding: '8px 10px', cursor: 'pointer', textAlign: 'center',
          }}
        >
          Add to timeline →
        </button>
      </div>

    </div>
  )
}
