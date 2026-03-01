'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export interface Project {
  name: string
  slug: string
  bg: string
  fg: string
}

export const PROJECTS: Project[] = [
  { name: 'Granola',           slug: 'granola',           bg: '#0F0F0F', fg: '#FFFFFF' },
  { name: 'Fin.ai',            slug: 'fin-ai',            bg: '#DCE8FF', fg: '#0F1A3A' },
  { name: 'Intercom',          slug: 'intercom',          bg: '#1A56DB', fg: '#FFFFFF' },
  { name: 'The New Normal',    slug: 'the-new-normal',    bg: '#F2EBE0', fg: '#1A1208' },
  { name: 'Strelka Bar',       slug: 'strelka-bar',       bg: '#1C1A18', fg: '#D4C4A8' },
  { name: 'Ornamika',          slug: 'ornamika',          bg: '#EFE6FF', fg: '#2A0A4A' },
  { name: 'Wednesday Studio',  slug: 'wednesday-studio',  bg: '#E4F2E4', fg: '#0A1F0A' },
  { name: 'Aaply',             slug: 'aaply',             bg: '#E0EDFF', fg: '#0A1A3A' },
]

const BASE = 72      // px — resting size
const MAX  = 2.4     // max scale multiplier at cursor
const ZONE = 140     // px — influence radius

function DockItem({
  project,
  mouseY,
  onClick,
}: {
  project: Project
  mouseY: ReturnType<typeof useMotionValue<number>>
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseY, (y: number) => {
    if (!ref.current) return Infinity
    const { top, height } = ref.current.getBoundingClientRect()
    return Math.abs(y - (top + height / 2))
  })

  const scale = useSpring(
    useTransform(distance, [0, ZONE], [MAX, 1], { clamp: true }),
    { stiffness: 380, damping: 28, mass: 0.5 }
  )

  return (
    <motion.div
      ref={ref}
      style={{ scale, transformOrigin: 'right center' }}
      className="cursor-pointer rounded-xl overflow-hidden flex-shrink-0"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
    >
      <div
        style={{ width: BASE, height: BASE, backgroundColor: project.bg }}
        className="flex items-end p-2"
      >
        <span
          style={{
            color: project.fg,
            fontFamily: "'Plain Medium', sans-serif",
            fontSize: '8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: 0.5,
            lineHeight: 1,
          }}
        >
          {project.name}
        </span>
      </div>
    </motion.div>
  )
}

export function ProjectDock({ onProjectClick }: { onProjectClick: (p: Project) => void }) {
  const mouseY = useMotionValue(Infinity)

  return (
    <div
      className="flex flex-col items-end gap-2"
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      {PROJECTS.map((p) => (
        <DockItem key={p.slug} project={p} mouseY={mouseY} onClick={() => onProjectClick(p)} />
      ))}
    </div>
  )
}
