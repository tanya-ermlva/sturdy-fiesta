'use client'

import { useRef, useState, type MutableRefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { bioLines } from '@/app/data/footnotes'
import { ProjectDock } from './ProjectDock'
import { ProjectModal } from './ProjectModal'
import type { Project } from './ProjectDock'

const PINYON = "'Pinyon Script', cursive"
const PINK   = '#FF2D78'

function Fn({
  id, index, activeId, refs, onEnter, onLeave,
}: {
  id: number
  index: number
  activeId: number | null
  refs: MutableRefObject<(HTMLSpanElement | null)[]>
  onEnter: (id: number, index: number) => void
  onLeave: () => void
}) {
  return (
    <span
      ref={(el) => { refs.current[index] = el }}
      onMouseEnter={() => onEnter(id, index)}
      onMouseLeave={onLeave}
      style={{
        fontFamily: PINYON,
        color: activeId === id ? PINK : 'inherit',
        cursor: 'default',
        transition: 'color 0.15s ease',
      }}
    >
      ({id})
    </span>
  )
}

function LogoPlaceholder() {
  return (
    <span
      className="inline-block rounded-md"
      style={{
        width: '22px',
        height: '22px',
        verticalAlign: 'top',
        background: 'linear-gradient(135deg, var(--color-surface-strong) 0%, var(--color-surface-muted) 100%)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
      }}
    />
  )
}

export function HomeClient() {
  const [activeId, setActiveId]           = useState<number | null>(null)
  const [popoverPos, setPopoverPos]       = useState<{ top: number; left: number } | null>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])
  const activeLine = bioLines.find((l) => l.id === activeId)

  const handleNumberEnter = (id: number, index: number) => {
    const el = numberRefs.current[index]
    if (el) {
      const { top, height, right } = el.getBoundingClientRect()
      setPopoverPos({ top: top + height / 2, left: right + 14 })
    }
    setActiveId(id)
  }

  return (
    <>
      <main className="relative min-h-screen bg-background flex flex-col px-6 py-6 overflow-hidden">

        {/* ── Header ──────────────────────────────────── */}
        <header className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src="/imgs/Team.svg"      alt="" width={50} height={50} className="dark:invert" />
            <img src="/imgs/Explosion.svg" alt="" width={55} height={55} className="dark:invert" />
            <img src="/imgs/Direction.svg" alt="" width={98} height={50} className="dark:invert" />
          </div>
        </header>

        {/* ── Content row ─────────────────────────────── */}
        <div className="flex-1 flex items-center gap-8">

          {/* Left — bio */}
          <div className="flex-1 flex flex-col" style={{ gap: 'clamp(40px, 4.76vw, 72px)' }}>
            <h1
              className="text-foreground-strong capitalize"
              style={{ fontSize: 'clamp(28px, 3.17vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              Tanya Ermolaeva
            </h1>

            <p
              className="text-foreground-muted select-none"
              style={{ fontSize: 'clamp(18px, 2.12vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.0, maxWidth: '60%' }}
            >
              Moscow-born product & visual designer{' '}
              <Fn id={1} index={0} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />,
              {' '}based in <LogoPlaceholder /> London since 2023{' '}
              <Fn id={2} index={1} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />.
              {' '}Currently designing at <LogoPlaceholder /> Granola{' '}
              <Fn id={3} index={2} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />.
              {' '}Previously at <LogoPlaceholder /> Intercom, <LogoPlaceholder /> Wednesday Studio, Aaply,
              and Strelka{' '}
              <Fn id={4} index={3} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />.
              {' '}Generalist: product, visual, branding, and motion{' '}
              <Fn id={5} index={4} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />.
              {' '}Increasingly building as well as designing{' '}
              <Fn id={6} index={5} activeId={activeId} refs={numberRefs} onEnter={handleNumberEnter} onLeave={() => setActiveId(null)} />.
            </p>
          </div>

          {/* Right — project dock */}
          <div className="flex items-center self-stretch py-2">
            <ProjectDock onProjectClick={setActiveProject} />
          </div>
        </div>

        {/* ── Footer nav ──────────────────────────────── */}
        <nav aria-label="Social links">
          <ul className="flex gap-5">
            {[
              { label: 'Email',     href: 'mailto:' },
              { label: 'LinkedIn',  href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter',   href: '#' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="text-foreground-muted text-base hover:text-foreground transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footnote popover ────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeLine && popoverPos && (
            <motion.div
              key={activeLine.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="fixed pointer-events-none z-30"
              style={{
                top: popoverPos.top,
                left: popoverPos.left,
                transform: 'translateY(-50%)',
                width: '280px',
                transformOrigin: 'left center',
              }}
            >
              <div className="bg-background border-hairline rounded-2xl shadow-lg overflow-hidden">
                <div className="px-5 pt-4">
                  <span
                    className="text-foreground-subtle uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.12em' }}
                  >
                    {activeLine.popover.label}
                  </span>
                </div>
                <div className="px-5 pt-1">
                  <p className="text-foreground-strong font-medium leading-snug" style={{ fontSize: '14px' }}>
                    {activeLine.popover.title}
                  </p>
                </div>
                <div className="px-5 pt-2 pb-4">
                  <p className="text-foreground-muted" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                    {activeLine.popover.body}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Project modal — outside main so blur works ── */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
