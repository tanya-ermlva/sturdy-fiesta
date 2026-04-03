'use client'
import { useRef, useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { nanoid } from 'nanoid'
import type { Project, RendererAdapter, Layer, CompositionType, GridLayer, ImageLayer, LayerOverride } from './lib/types'
import CanvasPreview from './components/CanvasPreview'
import LeftPanel from './components/LeftPanel'
import TopBar from './components/TopBar'
import Timeline from './components/Timeline'
import { resolveFrame } from './lib/resolve'
import { usePlayback } from './lib/playback'
import { exportWebMDeterministic, exportFramePng } from './lib/export'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const DEFAULT_PROJECT: Project = {
  base: {
    layers: [
      { id: 'bg', kind: 'background', color: '#434625' },
      { id: 'g1', kind: 'grid', composition: 'dot-grid', spacing: 18, thickness: 1, dotSize: 3, opacity: 1, scale: 1 },
    ],
  },
  frames: [
    { id: 'f1', layerOverrides: {}, durationFrames: 5 },
  ],
  outputSize: 1024,
  fps: 30,
  activeFrameId: 'f1',
}

export default function TexturePlaygroundClient() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT)
  const adapterRef = useRef<RendererAdapter | null>(null)
  const [adapter, setAdapter] = useState<RendererAdapter | null>(null)
  const activeFrame = project.frames.find(f => f.id === project.activeFrameId) ?? project.frames[0]
  const snapshot = resolveFrame(project.base, activeFrame)

  const [selectedLayerId, setSelectedLayerId] = useState('g1')
  const [activeComposition, setActiveComposition] = useState<CompositionType>('dot-grid')
  const [exporting, setExporting] = useState(false)
  const [playing, setPlaying] = useState(false)
  usePlayback(adapter, project, playing, () => setPlaying(false))

  function handleLayerChange(layerId: string, override: LayerOverride) {
    setProject(p => ({
      ...p,
      base: {
        layers: p.base.layers.map(l => l.id === layerId ? { ...l, ...override } as Layer : l)
      }
    }))
  }

  function handleAddGridLayer(composition: CompositionType) {
    const newLayer: GridLayer = {
      id: nanoid(6), kind: 'grid', composition,
      spacing: 20, thickness: 1, dotSize: 3, opacity: 1, scale: 1,
    }
    setProject(p => ({ ...p, base: { layers: [...p.base.layers, newLayer] } }))
    setSelectedLayerId(newLayer.id)
  }

  function handleDeleteLayer(layerId: string) {
    setProject(p => {
      const layer = p.base.layers.find(l => l.id === layerId)
      if (layer?.kind === 'image') URL.revokeObjectURL(layer.objectUrl)
      return { ...p, base: { layers: p.base.layers.filter(l => l.id !== layerId) } }
    })
    setSelectedLayerId(prev => prev === layerId ? 'bg' : prev)
  }

  function handleAddImageLayer(file: File) {
    const objectUrl = URL.createObjectURL(file)
    const newLayer: ImageLayer = {
      id: nanoid(6), kind: 'image', file, objectUrl,
      scale: 1, x: 0, y: 0, opacity: 1,
    }
    setProject(p => ({ ...p, base: { layers: [...p.base.layers, newLayer] } }))
    setSelectedLayerId(newLayer.id)
  }

  function handleAddToTimeline() {
    const newFrame = { id: nanoid(6), layerOverrides: {}, durationFrames: 5 }
    setProject(p => ({
      ...p,
      frames: [...p.frames.slice(0, 4), newFrame],
      activeFrameId: newFrame.id,
    }))
  }

  function handleDeleteFrame(frameId: string) {
    setProject(p => {
      const frames = p.frames.filter(f => f.id !== frameId)
      return { ...p, frames, activeFrameId: frames[0]?.id ?? p.activeFrameId }
    })
  }

  function handleDurationChange(frameId: string, durationFrames: number) {
    setProject(p => ({
      ...p,
      frames: p.frames.map(f => f.id === frameId ? { ...f, durationFrames } : f),
    }))
  }

  async function handleExportFrame() {
    if (!adapterRef.current) return
    await exportFramePng(adapterRef.current)
  }

  async function handleExportWebM() {
    if (!adapterRef.current) return
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    setExporting(true)
    try {
      await exportWebMDeterministic(canvas, adapterRef.current, project)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      className={`${geist.variable} ${geistMono.variable}`}
      style={{
        fontFamily: 'var(--font-geist), system-ui, sans-serif',
        background: '#0a0a0a',
        color: '#e8e8e8',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <TopBar
        outputSize={project.outputSize}
        onSizeChange={(s) => setProject(p => ({ ...p, outputSize: s }))}
        onExportFrame={handleExportFrame}
        onExportWebM={handleExportWebM}
        exporting={exporting}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel
          project={project}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onLayerChange={handleLayerChange}
          onAddGridLayer={handleAddGridLayer}
          onDeleteLayer={handleDeleteLayer}
          onAddImageLayer={handleAddImageLayer}
          onAddToTimeline={handleAddToTimeline}
          activeComposition={activeComposition}
          onChangeComposition={setActiveComposition}
        />

        <CanvasPreview
          snapshot={snapshot}
          outputSize={project.outputSize}
          onAdapterReady={(a) => { adapterRef.current = a; setAdapter(a) }}
          frameLabel={`editing ${(project.frames.indexOf(activeFrame) + 1)}/${project.frames.length}`}
        />
      </div>

      <Timeline
        frames={project.frames}
        activeFrameId={project.activeFrameId}
        fps={project.fps}
        playing={playing}
        onSelectFrame={(id) => setProject(p => ({ ...p, activeFrameId: id }))}
        onDeleteFrame={handleDeleteFrame}
        onDurationChange={handleDurationChange}
        onFpsChange={(fps) => setProject(p => ({ ...p, fps }))}
        onPlay={() => setPlaying(true)}
        onStop={() => setPlaying(false)}
      />
    </div>
  )
}
