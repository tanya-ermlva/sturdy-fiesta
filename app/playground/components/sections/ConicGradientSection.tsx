'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import GradientPreview from '../GradientPreview';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';
import ColorStopEditor, { type ColorStop } from '../ColorStopEditor';

export default function ConicGradientSection() {
  const [startAngle, setStartAngle] = useState(0);
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#EB62ED', position: 0 },
    { color: '#8700A0', position: 50 },
    { color: '#EB62ED', position: 100 },
  ]);

  const cssString = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    return `background: conic-gradient(from ${startAngle}deg at ${centerX}% ${centerY}%, ${stopsStr});`;
  }, [startAngle, centerX, centerY, stops]);

  const previewStyle: React.CSSProperties = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    return {
      background: `conic-gradient(from ${startAngle}deg at ${centerX}% ${centerY}%, ${stopsStr})`,
    };
  }, [startAngle, centerX, centerY, stops]);

  return (
    <SectionWrapper
      id="conic"
      number={3}
      title="Conic Gradient"
      description="OK this is where it gets REALLY cool. Instead of radiating outward, colors sweep AROUND a center point — like a pie chart or a color wheel."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <GradientPreview style={previewStyle} className="aspect-video lg:sticky lg:top-24" />
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SliderControl
            label="Start Angle"
            value={startAngle}
            min={0}
            max={360}
            unit="deg"
            onChange={setStartAngle}
            hint="This rotates where the gradient sweep begins."
          />
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
              <strong className="text-accent-strong">Try this!</strong> Use hard stops at even intervals (0%, 25%, 25%, 50%, 50%, 75%, 75%, 100%) to make a pie chart. Or match the first and last colors for a seamless loop!
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
