'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { bioLines } from '@/app/data/footnotes'

const PINYON = "'Pinyon Script', cursive"

export function HomeClient() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const activeLine = bioLines.find((l) => l.id === activeId)

  return (
    <main className="relative min-h-screen bg-background flex flex-col px-6 py-6 overflow-hidden">

      {/* ── Header ─────────────────────────────────── */}
      <header className="flex justify-between items-start">
        {/* Logo mark — three SVGs */}
        <div className="flex items-center gap-3">
          <img src="/imgs/Team.svg" alt="" width={50} height={50} className="dark:invert" />
          <img src="/imgs/Explosion.svg" alt="" width={55} height={55} className="dark:invert" />
          <img src="/imgs/Direction.svg" alt="" width={98} height={50} className="dark:invert" />
        </div>

        {/* Social links */}
        <nav aria-label="Social links">
          <ul className="flex flex-col gap-1">
            {[
              { label: 'Email', href: 'mailto:' },
              { label: 'LinkedIn', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter', href: '#' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-foreground-muted text-base leading-4 hover:text-foreground transition-colors duration-150"
                >
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

          {/* Name */}
          <h1
            className="text-foreground-strong capitalize leading-[1]"
            style={{ fontSize: '48px', letterSpacing: '-0.96px' }}
          >
            Tanya Ermolaeva
          </h1>

          {/* Bio lines */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            {bioLines.map((line) => (
              <div
                key={line.id}
                className="relative cursor-default select-none"
                onMouseEnter={() => setActiveId(line.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* Hover highlight pill */}
                <AnimatePresence>
                  {activeId === line.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute inset-y-0 -inset-x-3 bg-surface-default rounded-2xl"
                    />
                  )}
                </AnimatePresence>

                <p
                  className="relative px-3 -mx-3 text-foreground-muted leading-[40px]"
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

      {/* ── Footnote popover ────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeLine && (
          <motion.div
            key={activeLine.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50"
            style={{ right: '5%', top: '50%', transform: 'translateY(-50%)', width: '360px' }}
          >
            <div className="bg-background border-hairline rounded-3xl p-8 shadow-lg">
              <p
                className="text-foreground-muted"
                style={{ fontSize: '16px', lineHeight: '1.65' }}
              >
                {activeLine.footnote}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
