'use client';

import ThemeToggle from '@/app/components/ui/ThemeToggle';
import StaticFlowSection from './components/sections/StaticFlowSection';
import RelativeSection from './components/sections/RelativeSection';
import AbsoluteSection from './components/sections/AbsoluteSection';
import FixedSection from './components/sections/FixedSection';
import StickySection from './components/sections/StickySection';
import ZIndexStackingSection from './components/sections/ZIndexStackingSection';
import RealWorldPatternsSection from './components/sections/RealWorldPatternsSection';

const toc = [
  { id: 'static', label: '01 Static' },
  { id: 'relative', label: '02 Relative' },
  { id: 'absolute', label: '03 Absolute' },
  { id: 'fixed', label: '04 Fixed' },
  { id: 'sticky', label: '05 Sticky' },
  { id: 'z-index', label: '06 Z-Index' },
  { id: 'patterns', label: '07 Patterns' },
];

export default function PositionPlaygroundClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 glass border-b border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg text-foreground-strong">CSS Position Playground</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Intro */}
        <div className="mb-12 max-w-2xl">
          <p className="text-foreground-muted leading-relaxed">
            An interactive deep-dive into CSS positioning — from the default static
            flow through relative, absolute, fixed, and sticky. Every section is live:
            drag sliders, toggle options, and watch the CSS update in real time.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-16 flex flex-wrap gap-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-border-muted bg-surface-muted px-4 py-1.5 text-xs font-mono text-foreground-muted hover:text-foreground-default hover:border-border-default transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Sections */}
        <div className="flex flex-col gap-24">
          <StaticFlowSection />
          <RelativeSection />
          <AbsoluteSection />
          <FixedSection />
          <StickySection />
          <ZIndexStackingSection />
          <RealWorldPatternsSection />
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-border-subtle pt-8 pb-12">
          <p className="text-sm text-foreground-subtle">
            Further reading:{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/position"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-default hover:underline"
            >
              MDN — CSS position
            </a>
            {' · '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/z-index"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-default hover:underline"
            >
              MDN — z-index
            </a>
            {' · '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-default hover:underline"
            >
              MDN — Stacking contexts
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
