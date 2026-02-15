'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import ScrollableContainer from '../ScrollableContainer';
import PositionBox from '../PositionBox';

export default function FixedSection() {
  const [top, setTop] = useState(20);
  const [right, setRight] = useState(20);
  const [useTransform, setUseTransform] = useState(false);

  const cssString = useMemo(
    () =>
      `.scroll-container {\n  ${useTransform ? 'transform: translateZ(0); /* creates containing block! */' : '/* no transform */'}\n}\n\n.fixed-box {\n  position: fixed;\n  top: ${top}px;\n  right: ${right}px;\n}`,
    [top, right, useTransform]
  );

  return (
    <SectionWrapper
      id="fixed"
      number={4}
      title="Fixed"
      description="Fixed elements are positioned relative to the viewport — they don't move when you scroll. But here's a gotcha: if any ancestor has a transform, filter, or perspective property, the fixed element becomes relative to THAT ancestor instead."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <ScrollableContainer
            height={320}
            style={useTransform ? { transform: 'translateZ(0)' } : undefined}
          >
            <div className="p-6 pt-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-4 rounded-lg bg-surface-muted p-4 text-sm text-foreground-subtle font-mono"
                >
                  Content block {i + 1}
                </div>
              ))}
            </div>
            <PositionBox
              label="Fixed"
              color="orange"
              size={60}
              style={{
                position: 'fixed',
                top,
                right,
              }}
            />
          </ScrollableContainer>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SliderControl
            label="top"
            value={top}
            min={0}
            max={280}
            unit="px"
            onChange={setTop}
          />
          <SliderControl
            label="right"
            value={right}
            min={0}
            max={280}
            unit="px"
            onChange={setRight}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="transform-toggle"
              checked={useTransform}
              onChange={(e) => setUseTransform(e.target.checked)}
              className="rounded border-border-muted"
            />
            <label
              htmlFor="transform-toggle"
              className="text-sm text-foreground-muted cursor-pointer"
            >
              Add <code className="text-accent-default">transform</code> to
              container
            </label>
          </div>

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Watch!</strong> Scroll the
              container — the box stays put. Now toggle &quot;transform&quot; — the
              fixed box becomes trapped inside the container!
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
