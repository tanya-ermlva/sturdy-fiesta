'use client'
import { useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Project } from './lib/types'

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
      {/* TopBar placeholder */}
      <div style={{ height: 40, background: '#111', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#D1E043', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Texture</span>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LeftPanel placeholder */}
        <div style={{ width: 192, background: '#111', borderRight: '1px solid #1e1e1e', flexShrink: 0 }} />

        {/* CanvasPreview placeholder */}
        <div style={{ flex: 1, background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#444' }}>canvas</span>
        </div>
      </div>

      {/* Timeline placeholder */}
      <div style={{ height: 72, background: '#0e0e0e', borderTop: '1px solid #1e1e1e' }} />
    </div>
  )
}
