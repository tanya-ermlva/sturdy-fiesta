'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import PositionPreview from '../PositionPreview';
import PositionBox from '../PositionBox';

export default function RelativeSection() {
  const [top, setTop] = useState(20);
  const [left, setLeft] = useState(30);

  const cssString = useMemo(
    () =>
      `.box-b {\n  position: relative;\n  top: ${top}px;\n  left: ${left}px;\n}`,
    [top, left]
  );

  return (
    <SectionWrapper
      id="relative"
      number={2}
      title="Relative"
      description="Position relative offsets an element from where it WOULD have been — but the original space is still reserved. Other elements don't move to fill the gap."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <PositionPreview>
            <div className="flex flex-col items-start gap-3 p-8 pt-10">
              <PositionBox label="A" color="violet" />
              <PositionBox
                label="B"
                color="blue"
                showGhost
                style={{ position: 'relative', top, left }}
              />
              <PositionBox label="C" color="green" />
            </div>
          </PositionPreview>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SliderControl
            label="top"
            value={top}
            min={-100}
            max={100}
            unit="px"
            onChange={setTop}
          />
          <SliderControl
            label="left"
            value={left}
            min={-100}
            max={100}
            unit="px"
            onChange={setLeft}
          />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">See the dashed outline?</strong>{' '}
              That&apos;s where Box B WOULD be. The space is still reserved — Box C
              doesn&apos;t move up to fill the gap.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
