'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

export interface Project {
  name: string; slug: string; bg: string; fg: string
}

export const PROJECTS: Project[] = [
  { name: 'Granola',          slug: 'granola',          bg: '#0F0F0F', fg: '#FFFFFF' },
  { name: 'Fin.ai',           slug: 'fin-ai',           bg: '#DCE8FF', fg: '#0F1A3A' },
  { name: 'Intercom',         slug: 'intercom',         bg: '#1A56DB', fg: '#FFFFFF' },
  { name: 'The New Normal',   slug: 'the-new-normal',   bg: '#F2EBE0', fg: '#1A1208' },
  { name: 'Strelka Bar',      slug: 'strelka-bar',      bg: '#1C1A18', fg: '#D4C4A8' },
  { name: 'Ornamika',         slug: 'ornamika',         bg: '#EFE6FF', fg: '#2A0A4A' },
  { name: 'Wednesday Studio', slug: 'wednesday-studio', bg: '#E4F2E4', fg: '#0A1F0A' },
  { name: 'Aaply',            slug: 'aaply',            bg: '#E0EDFF', fg: '#0A1A3A' },
]

const MAX_SCALE = 2.2

const N = PROJECTS.length

function getGap() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1512
  return Math.round(Math.max(4, vw * 8 / 1512))
}

function baseFromHeight(h: number, gap: number) {
  return Math.max(40, Math.floor((h - (N - 1) * gap) / N))
}

interface ItemState { scale: number; y: number }

// Core physics: cosine falloff scale + neighbour-push translations
function calcStates(
  mouseY: number | null,
  containerTop: number,
  cfg: { base: number; gap: number; zone: number }
): ItemState[] {
  const { base, gap, zone } = cfg

  const scales = PROJECTS.map((_, i) => {
    if (mouseY === null) return 1
    const center = containerTop + i * (base + gap) + base / 2
    const d = Math.abs(mouseY - center)
    if (d >= zone) return 1
    // Cosine gives the smooth "magnetic" falloff of the real macOS dock
    return 1 + (MAX_SCALE - 1) * 0.5 * (1 + Math.cos((Math.PI * d) / zone))
  })

  // Each item j pushes items above it UP and items below it DOWN
  // by half its extra visual size — keeping gaps constant
  return scales.map((scale, i) => {
    let y = 0
    for (let j = 0; j < PROJECTS.length; j++) {
      if (j === i) continue
      const extra = (scales[j] - 1) * base / 2
      y += j < i ? extra : -extra // j above → push i down; j below → push i up
    }
    return { scale, y }
  })
}

export function ProjectDock({ onProjectClick, availableHeight }: { onProjectClick: (p: Project) => void; availableHeight: number }) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const containerTopRef = useRef(0)
  const gap  = getGap()
  const base = availableHeight > 0 ? baseFromHeight(availableHeight, gap) : 72
  const [states, setStates] = useState<ItemState[]>(() =>
    PROJECTS.map(() => ({ scale: 1, y: 0 }))
  )

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-end"
      style={{ gap, overflow: 'visible' }}
      onMouseEnter={() => {
        containerTopRef.current = containerRef.current?.getBoundingClientRect().top ?? 0
      }}
      onMouseMove={(e) => {
        setStates(calcStates(e.clientY, containerTopRef.current, { base, gap, zone: base * 2 }))
      }}
      onMouseLeave={() => {
        setStates(PROJECTS.map(() => ({ scale: 1, y: 0 })))
      }}
    >
      {PROJECTS.map((p, i) => (
        <motion.div
          key={p.slug}
          animate={{ scale: states[i].scale, y: states[i].y }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.4 }}
          style={{
            width: base,
            height: base,
            transformOrigin: 'right center',
            flexShrink: 0,
            cursor: 'pointer',
            borderRadius: Math.round(base * 12 / 72),
            overflow: 'hidden',
          }}
          onClick={() => onProjectClick(p)}
        >
          <div
            style={{ width: '100%', height: '100%', backgroundColor: p.bg }}
            className="flex items-end p-2"
          >
            <span style={{
              color: p.fg,
              fontFamily: "'Plain Medium', sans-serif",
              fontSize: Math.max(7, Math.round(base * 8 / 72)),
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              opacity: 0.5,
              lineHeight: 1,
            }}>
              {p.name}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
