'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import GradientPreview from '../GradientPreview';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';

interface Layer {
  css: string;
  sizeW: number;
  sizeH: number;
}

const presets: Record<string, Layer[]> = {
  grid: [
    { css: 'linear-gradient(to right, #e4e4e7 1px, transparent 1px)', sizeW: 40, sizeH: 40 },
    { css: 'linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)', sizeW: 40, sizeH: 40 },
  ],
  dots: [
    { css: 'radial-gradient(circle, #EB62ED 1px, transparent 1px)', sizeW: 20, sizeH: 20 },
  ],
  plaid: [
    { css: 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(235,98,237,0.15) 35px, rgba(235,98,237,0.15) 36px)', sizeW: 100, sizeH: 100 },
    { css: 'repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(235,98,237,0.15) 35px, rgba(235,98,237,0.15) 36px)', sizeW: 100, sizeH: 100 },
    { css: 'repeating-linear-gradient(0deg, transparent, transparent 17px, rgba(135,0,160,0.08) 17px, rgba(135,0,160,0.08) 18px)', sizeW: 100, sizeH: 100 },
    { css: 'repeating-linear-gradient(90deg, transparent, transparent 17px, rgba(135,0,160,0.08) 17px, rgba(135,0,160,0.08) 18px)', sizeW: 100, sizeH: 100 },
  ],
  diagonalStripes: [
    { css: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(235,98,237,0.12) 10px, rgba(235,98,237,0.12) 20px)', sizeW: 100, sizeH: 100 },
  ],
};

export default function GradientCompositionSection() {
  const [layers, setLayers] = useState<Layer[]>(presets.grid);

  const updateLayer = (index: number, field: keyof Layer, value: string | number) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      { css: 'linear-gradient(to right, #EB62ED 1px, transparent 1px)', sizeW: 40, sizeH: 40 },
    ]);
  };

  const removeLayer = (index: number) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((_, i) => i !== index));
  };

  const cssString = useMemo(() => {
    const bgImages = layers.map((l) => l.css).join(',\n    ');
    const bgSizes = layers.map((l) => `${l.sizeW}px ${l.sizeH}px`).join(',\n    ');
    return `background-image:\n    ${bgImages};\nbackground-size:\n    ${bgSizes};`;
  }, [layers]);

  const previewStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundImage: layers.map((l) => l.css).join(', '),
      backgroundSize: layers.map((l) => `${l.sizeW}px ${l.sizeH}px`).join(', '),
    };
  }, [layers]);

  return (
    <SectionWrapper
      id="composition"
      number={5}
      title="Gradient Composition"
      description="Here's the BIG trick: CSS lets you stack multiple backgrounds. Each one gets its own background-size. That's exactly how the grid pattern on my portfolio works — two thin line gradients tiled at 40×40px."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <GradientPreview style={previewStyle} className="aspect-video lg:sticky lg:top-24" />
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <div>
            <span className="text-sm text-foreground-muted mb-2 block">Presets</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => setLayers(preset)}
                  className="rounded-md bg-surface-strong px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground-default transition-colors capitalize"
                >
                  {name === 'diagonalStripes' ? 'Diagonal Stripes' : name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground-muted">Layers</span>
            <button
              onClick={addLayer}
              className="rounded-md bg-surface-strong px-2 py-1 text-xs text-foreground-muted hover:text-foreground-default transition-colors"
            >
              + Add layer
            </button>
          </div>

          {layers.map((layer, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-border-subtle p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-foreground-subtle">Layer {i + 1}</span>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(i)}
                    className="text-foreground-subtle hover:text-foreground-default text-sm transition-colors"
                    aria-label="Remove layer"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="text"
                value={layer.css}
                onChange={(e) => updateLayer(i, 'css', e.target.value)}
                className="rounded-md border border-border-muted bg-surface-default px-2 py-1.5 text-xs font-mono text-foreground-default focus:outline-none focus:ring-2 focus:ring-accent-default"
              />
              <div className="grid grid-cols-2 gap-3">
                <SliderControl
                  label="Width"
                  value={layer.sizeW}
                  min={1}
                  max={200}
                  unit="px"
                  onChange={(v) => updateLayer(i, 'sizeW', v)}
                />
                <SliderControl
                  label="Height"
                  value={layer.sizeH}
                  min={1}
                  max={200}
                  unit="px"
                  onChange={(v) => updateLayer(i, 'sizeH', v)}
                />
              </div>
            </div>
          ))}

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Try this!</strong> Start with the "grid" preset — that's the exact pattern from my portfolio's Grid component. Then try "dots" and "plaid" to see how the same technique makes totally different patterns.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
