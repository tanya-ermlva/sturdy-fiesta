'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { bioLines } from '@/app/data/footnotes'

const PINYON = "'Pinyon Script', cursive"

export function HomeClient() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeLine = bioLines.find((l) => l.id === activeId)

  const handleMouseEnter = (id: number, index: number) => {
    const el = lineRefs.current[index]
    if (el) {
      const rect = el.getBoundingClientRect()
      setPopoverPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 16,
      })
    }
    setActiveId(id)
  }

  return (
    <main className="relative min-h-screen bg-background flex flex-col px-6 py-6 overflow-hidden">

      {/* ── Header ─────────────────────────────────── */}
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img src="/imgs/Team.svg" alt="" width={50} height={50} className="dark:invert" />
          <img src="/imgs/Explosion.svg" alt="" width={55} height={55} className="dark:invert" />
          <img src="/imgs/Direction.svg" alt="" width={98} height={50} className="dark:invert" />
        </div>

        <nav aria-label="Social links">
          <ul className="flex flex-col gap-1">
            {[
              { label: 'Email', href: 'mailto:' },
              { label: 'LinkedIn', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter', href: '#' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="text-foreground-muted text-base leading-4 hover:text-foreground transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ── Bio — vertically centred ────────────────── */}
      <div className="flex-1 flex items-center">
        <div className="flex flex-col" style={{ gap: '72px' }}>

          <h1
            className="text-foreground-strong capitalize leading-[1]"
            style={{ fontSize: '48px', letterSpacing: '-0.96px' }}
          >
            Tanya Ermolaeva
          </h1>

          {/* Bio lines */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            {bioLines.map((line, index) => (
              <div
                key={line.id}
                ref={(el) => { lineRefs.current[index] = el }}
                className="relative w-fit cursor-default select-none"
                style={{ paddingInline: '12px', marginInline: '-12px' }}
                onMouseEnter={() => handleMouseEnter(line.id, index)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* Hover highlight — hugs the text */}
                <AnimatePresence>
                  {activeId === line.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute inset-0 bg-surface-default rounded-2xl"
                    />
                  )}
                </AnimatePresence>

                <p
                  className="relative text-foreground-muted leading-[40px]"
                  style={{ fontSize: '32px', letterSpacing: '-0.64px' }}
                >
                  {line.text}{' '}
                  <span style={{ fontFamily: PINYON }}>({line.id})</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footnote popover — anchored to hovered line ── */}
      <AnimatePresence mode="wait">
        {activeLine && popoverPos && (
          <motion.div
            key={activeLine.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50"
            style={{
              top: popoverPos.top,
              left: popoverPos.left,
              transform: 'translateY(-50%)',
              width: '300px',
            }}
          >
            <div className="bg-background border-hairline rounded-2xl shadow-lg overflow-hidden">
              <div className="px-5 pt-4 pb-0">
                <span
                  className="text-foreground-subtle uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                >
                  {activeLine.popover.label}
                </span>
              </div>
              <div className="px-5 pt-2 pb-0">
                <p className="text-foreground-strong font-medium leading-snug" style={{ fontSize: '15px' }}>
                  {activeLine.popover.title}
                </p>
              </div>
              <div className="px-5 pt-2 pb-4">
                <p className="text-foreground-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  {activeLine.popover.body}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
