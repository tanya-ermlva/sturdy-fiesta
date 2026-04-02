'use client'

import { useEffect, useRef, useState } from 'react'
import { ProjectDock } from './ProjectDock'
import { ProjectModal } from './ProjectModal'
import type { Project } from './ProjectDock'

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
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [dockHeight, setDockHeight]       = useState(0)
  const dockWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dockWrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setDockHeight(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <main className="relative h-screen bg-background flex flex-col px-6 py-6 overflow-hidden">

        {/* ── Header ──────────────────────────────────── */}
        <header className="absolute top-6 left-6 flex items-start">
          <div className="flex items-center gap-3">
            <img src="/imgs/Team.svg"      alt="" width={50} height={50} className="dark:invert" />
            <img src="/imgs/Explosion.svg" alt="" width={55} height={55} className="dark:invert" />
            <img src="/imgs/Direction.svg" alt="" width={98} height={50} className="dark:invert" />
          </div>
        </header>

        {/* ── Content row ─────────────────────────────── */}
        <div className="flex-1 flex items-center gap-8 min-h-0">

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
              style={{ fontSize: '28px', letterSpacing: '0px', lineHeight: 1.3, maxWidth: '60%' }}
            >
              Moscow-born product & visual designer,
              {' '}based in <LogoPlaceholder /> London since 2023.
              {' '}Currently designing at <LogoPlaceholder /> Granola.
              {' '}Previously at <LogoPlaceholder /> Intercom, <LogoPlaceholder /> Wednesday Studio, Aaply, and Strelka.
              {' '}Generalist: product, visual, branding, and motion.
              {' '}Increasingly building as well as designing.
            </p>
          </div>

          {/* Right — project dock */}
          <div ref={dockWrapRef} className="flex items-center self-stretch py-2">
            <ProjectDock onProjectClick={setActiveProject} availableHeight={dockHeight} />
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
      </main>

      {/* ── Project modal — outside main so blur works ── */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
