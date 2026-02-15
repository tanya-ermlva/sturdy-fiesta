'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import SelectControl from '@/app/playground/components/SelectControl';
import PositionPreview from '../PositionPreview';
import PositionBox from '../PositionBox';

const containerOptions = [
  { label: 'relative (positioned)', value: 'relative' },
  { label: 'static (default)', value: 'static' },
];

export default function AbsoluteSection() {
  const [containerPos, setContainerPos] = useState<'static' | 'relative'>('relative');
  const [top, setTop] = useState(10);
  const [left, setLeft] = useState(10);

  const cssString = useMemo(
    () =>
      `.container {\n  position: ${containerPos};\n}\n\n.box-b {\n  position: absolute;\n  top: ${top}%;\n  left: ${left}%;\n}`,
    [containerPos, top, left]
  );

  return (
    <SectionWrapper
      id="absolute"
      number={3}
      title="Absolute"
      description="An absolutely positioned element is removed from the flow entirely. It positions itself relative to its nearest POSITIONED ancestor — if there isn't one, it goes all the way up to the viewport."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <PositionPreview containerPosition={containerPos}>
            <div className="flex flex-col items-start gap-3 p-8 pt-10">
              <PositionBox label="A" color="violet" />
              <PositionBox label="C" color="green" />
            </div>
            <PositionBox
              label="B"
              color="blue"
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
              }}
            />
          </PositionPreview>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl
            label="Container position"
            value={containerPos}
            options={containerOptions}
            onChange={(v) => setContainerPos(v as 'static' | 'relative')}
          />
          <SliderControl
            label="top"
            value={top}
            min={0}
            max={100}
            unit="%"
            onChange={setTop}
          />
          <SliderControl
            label="left"
            value={left}
            min={0}
            max={100}
            unit="%"
            onChange={setLeft}
          />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Try this!</strong> Switch the
              container to &quot;static&quot;. Box B escapes the container! That&apos;s
              the containing block in action — absolute elements look for the nearest
              positioned ancestor.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
