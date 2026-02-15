'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import GradientPreview from '../GradientPreview';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';
import ColorStopEditor, { type ColorStop } from '../ColorStopEditor';
import SelectControl from '../SelectControl';

const shapeOptions = [
  { label: 'circle', value: 'circle' },
  { label: 'ellipse', value: 'ellipse' },
];

const sizeOptions = [
  { label: 'farthest-corner (default)', value: 'farthest-corner' },
  { label: 'closest-side', value: 'closest-side' },
  { label: 'closest-corner', value: 'closest-corner' },
  { label: 'farthest-side', value: 'farthest-side' },
];

export default function RadialGradientSection() {
  const [shape, setShape] = useState('circle');
  const [size, setSize] = useState('farthest-corner');
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#EB62ED', position: 0 },
    { color: '#171717', position: 100 },
  ]);

  const cssString = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    return `background: radial-gradient(${shape} ${size} at ${centerX}% ${centerY}%, ${stopsStr});`;
  }, [shape, size, centerX, centerY, stops]);

  const previewStyle: React.CSSProperties = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    return {
      background: `radial-gradient(${shape} ${size} at ${centerX}% ${centerY}%, ${stopsStr})`,
    };
  }, [shape, size, centerX, centerY, stops]);

  return (
    <SectionWrapper
      id="radial"
      number={2}
      title="Radial Gradient"
      description="Colors radiating outward from a center point. The shape and size keywords do WILDLY different things — play with them."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <GradientPreview style={previewStyle} className="aspect-video lg:sticky lg:top-24" />
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl label="Shape" value={shape} options={shapeOptions} onChange={setShape} />
          <SelectControl label="Size" value={size} options={sizeOptions} onChange={setSize} />

          <SliderControl
            label="Center X"
            value={centerX}
            min={0}
            max={100}
            unit="%"
            onChange={setCenterX}
          />
          <SliderControl
            label="Center Y"
            value={centerY}
            min={0}
            max={100}
            unit="%"
            onChange={setCenterY}
          />

          <ColorStopEditor stops={stops} onChange={setStops} />

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Try this!</strong> Move the center to a corner and switch between size keywords — see how closest-side vs farthest-corner changes everything.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
