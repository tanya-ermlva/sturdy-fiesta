'use client';

import ThemeToggle from '@/app/components/ui/ThemeToggle';
import LinearGradientSection from './components/sections/LinearGradientSection';
import RadialGradientSection from './components/sections/RadialGradientSection';
import ConicGradientSection from './components/sections/ConicGradientSection';
import RepeatingGradientsSection from './components/sections/RepeatingGradientsSection';
import GradientCompositionSection from './components/sections/GradientCompositionSection';
import GradientMaskingSection from './components/sections/GradientMaskingSection';

const toc = [
  { id: 'linear', label: '01 Linear' },
  { id: 'radial', label: '02 Radial' },
  { id: 'conic', label: '03 Conic' },
  { id: 'repeating', label: '04 Repeating' },
  { id: 'composition', label: '05 Composition' },
  { id: 'masking', label: '06 Masking' },
];

export default function PlaygroundClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 glass border-b border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg text-foreground-strong">CSS Gradient Playground</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Intro */}
        <div className="mb-12 max-w-2xl">
          <p className="text-foreground-muted leading-relaxed">
            An interactive deep-dive into CSS gradients — from basic linear fills to
            multi-layer compositions and mask-image vignettes. Every section is live:
            drag sliders, tweak colors, and watch the CSS update in real time.
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
          <LinearGradientSection />
          <RadialGradientSection />
          <ConicGradientSection />
          <RepeatingGradientsSection />
          <GradientCompositionSection />
          <GradientMaskingSection />
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-border-subtle pt-8 pb-12">
          <p className="text-sm text-foreground-subtle">
            Further reading:{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/gradient"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-default hover:underline"
            >
              MDN — CSS Gradients
            </a>
            {' · '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-default hover:underline"
            >
              MDN — mask-image
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
