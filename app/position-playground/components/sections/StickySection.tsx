'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import SelectControl from '@/app/playground/components/SelectControl';
import ScrollableContainer from '../ScrollableContainer';

const overflowOptions = [
  { label: 'visible (works)', value: 'visible' },
  { label: 'hidden (breaks!)', value: 'hidden' },
  { label: 'auto (breaks!)', value: 'auto' },
];

export default function StickySection() {
  const [topThreshold, setTopThreshold] = useState(0);
  const [overflow, setOverflow] = useState('visible');

  const cssString = useMemo(
    () =>
      `.parent {\n  overflow: ${overflow};\n}\n\n.sticky-header {\n  position: sticky;\n  top: ${topThreshold}px;\n}`,
    [topThreshold, overflow]
  );

  return (
    <SectionWrapper
      id="sticky"
      number={5}
      title="Sticky"
      description="Sticky is a hybrid: it acts like relative until the element reaches a scroll threshold, then it 'sticks' like fixed. But it REQUIRES a top/bottom value, and overflow on any ancestor will break it."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <ScrollableContainer height={320}>
            <div style={{ overflow }}>
              <div className="p-6 pt-10">
                <div className="mb-4 rounded-lg bg-surface-muted p-4 text-sm text-foreground-subtle font-mono">
                  Content above sticky header
                </div>
                <div className="mb-4 rounded-lg bg-surface-muted p-4 text-sm text-foreground-subtle font-mono">
                  More content above
                </div>

                <div
                  className="mb-4 rounded-lg bg-orange-500 px-4 py-3 text-sm font-mono font-bold text-white shadow-md z-10"
                  style={{
                    position: 'sticky',
                    top: topThreshold,
                  }}
                >
                  Sticky Header — top: {topThreshold}px
                </div>

                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="mb-4 rounded-lg bg-surface-muted p-4 text-sm text-foreground-subtle font-mono"
                  >
                    Content block {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </ScrollableContainer>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SliderControl
            label="top threshold"
            value={topThreshold}
            min={0}
            max={100}
            unit="px"
            onChange={setTopThreshold}
          />
          <SelectControl
            label="Parent overflow"
            value={overflow}
            options={overflowOptions}
            onChange={setOverflow}
          />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Gotcha!</strong> Switch overflow
              to &quot;hidden&quot; or &quot;auto&quot;. Sticky stops working! This
              is the #1 debugging headache with sticky positioning.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
