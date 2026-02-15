'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import PositionPreview from '../PositionPreview';
import PositionBox from '../PositionBox';

export default function StaticFlowSection() {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const cssString = useMemo(
    () =>
      `.box {\n  position: static;\n  top: ${top}px;    /* ignored */\n  left: ${left}px;   /* ignored */\n}`,
    [top, left]
  );

  return (
    <SectionWrapper
      id="static"
      number={1}
      title="Static & Normal Flow"
      description="Every element starts as position: static. It sits in the normal document flow — one after another, top to bottom. Here's the thing: offset properties like top and left are completely ignored."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <PositionPreview>
            <div className="flex flex-col items-start gap-3 p-8 pt-10">
              <PositionBox label="A" color="violet" />
              <PositionBox
                label="B"
                color="blue"
                style={{ position: 'static', top, left }}
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
            min={0}
            max={100}
            unit="px"
            onChange={setTop}
          />
          <SliderControl
            label="left"
            value={left}
            min={0}
            max={100}
            unit="px"
            onChange={setLeft}
          />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Notice!</strong> Drag the
              sliders. Nothing moves. That&apos;s{' '}
              <code className="text-accent-default">position: static</code> —
              offset properties are completely ignored.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
