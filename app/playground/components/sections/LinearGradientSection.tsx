'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import GradientPreview from '../GradientPreview';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';
import ColorStopEditor, { type ColorStop } from '../ColorStopEditor';
import SelectControl from '../SelectControl';

const directionKeywords = [
  { label: 'Custom angle', value: 'custom' },
  { label: 'to top', value: 'to top' },
  { label: 'to right', value: 'to right' },
  { label: 'to bottom', value: 'to bottom' },
  { label: 'to left', value: 'to left' },
  { label: 'to top right', value: 'to top right' },
  { label: 'to bottom right', value: 'to bottom right' },
  { label: 'to bottom left', value: 'to bottom left' },
  { label: 'to top left', value: 'to top left' },
];

export default function LinearGradientSection() {
  const [directionMode, setDirectionMode] = useState('custom');
  const [angle, setAngle] = useState(180);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#8700A0', position: 0 },
    { color: '#EB62ED', position: 50 },
    { color: '#FAE3FF', position: 100 },
  ]);

  const direction = directionMode === 'custom' ? `${angle}deg` : directionMode;

  const cssString = useMemo(() => {
    const stopsStr = stops
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ');
    return `background: linear-gradient(${direction}, ${stopsStr});`;
  }, [direction, stops]);

  const previewStyle: React.CSSProperties = useMemo(() => {
    const stopsStr = stops
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ');
    return { background: `linear-gradient(${direction}, ${stopsStr})` };
  }, [direction, stops]);

  return (
    <SectionWrapper
      id="linear"
      number={1}
      title="Linear Gradient"
      description="The workhorse gradient. A smooth color transition along a straight line. Here's the mind-bender: 0deg points UP, not right. CSS decided to be different from math class."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <GradientPreview style={previewStyle} className="aspect-video lg:sticky lg:top-24" />
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl
            label="Direction"
            value={directionMode}
            options={directionKeywords}
            onChange={setDirectionMode}
          />

          {directionMode === 'custom' && (
            <SliderControl
              label="Angle"
              value={angle}
              min={0}
              max={360}
              unit="deg"
              onChange={setAngle}
              hint="Try dragging this slowly — 0deg means 'up', not 'right'!"
            />
          )}

          <ColorStopEditor stops={stops} onChange={setStops} />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Try this!</strong> Set two stops to the same position to make a hard edge — that's how you make stripes with gradients.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
