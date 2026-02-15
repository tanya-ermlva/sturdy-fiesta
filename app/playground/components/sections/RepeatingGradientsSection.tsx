'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import GradientPreview from '../GradientPreview';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';
import ColorStopEditor, { type ColorStop } from '../ColorStopEditor';
import SelectControl from '../SelectControl';

const typeOptions = [
  { label: 'repeating-linear-gradient', value: 'linear' },
  { label: 'repeating-radial-gradient', value: 'radial' },
  { label: 'repeating-conic-gradient', value: 'conic' },
];

export default function RepeatingGradientsSection() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(45);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#EB62ED', position: 0 },
    { color: '#EB62ED', position: 10 },
    { color: 'transparent', position: 10 },
    { color: 'transparent', position: 20 },
  ]);

  const cssString = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}px`).join(', ');
    if (type === 'linear') {
      return `background: repeating-linear-gradient(${angle}deg, ${stopsStr});`;
    }
    if (type === 'radial') {
      return `background: repeating-radial-gradient(circle, ${stopsStr});`;
    }
    return `background: repeating-conic-gradient(from 0deg, ${stopsStr});`;
  }, [type, angle, stops]);

  const previewStyle: React.CSSProperties = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}px`).join(', ');
    if (type === 'linear') {
      return { background: `repeating-linear-gradient(${angle}deg, ${stopsStr})` };
    }
    if (type === 'radial') {
      return { background: `repeating-radial-gradient(circle, ${stopsStr})` };
    }
    return { background: `repeating-conic-gradient(from 0deg, ${stopsStr})` };
  }, [type, angle, stops]);

  return (
    <SectionWrapper
      id="repeating"
      number={4}
      title="Repeating Gradients"
      description="Same gradient functions, but they TILE. The secret ingredient? Using pixel units instead of percentages. Percentages fill the whole space — pixels create a fixed-size pattern that repeats forever."
    >
      {/* Explainer block */}
      <div className="mb-8 max-w-2xl flex flex-col gap-6">
        <div>
          <h3 className="text-base text-foreground-strong mb-2">Why do regular gradients not repeat?</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            A normal <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">linear-gradient</code> always
            stretches to fill its entire container. If you write{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">linear-gradient(red 0%, blue 100%)</code>,
            the browser maps 0% to one edge and 100% to the other — there's nothing left over to repeat.
          </p>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">The px trick</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            When you switch to <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">repeating-linear-gradient</code> and
            use <strong>pixel</strong> stop positions, you're defining a fixed-size stripe that's smaller than the container.
            The browser tiles that stripe edge-to-edge automatically. For example:
          </p>
          <pre className="mt-3 rounded-lg border border-border-muted bg-surface-default p-4 text-xs font-mono text-foreground-muted overflow-x-auto leading-relaxed">{`/* A 20px repeating stripe pattern */
repeating-linear-gradient(
  45deg,
  #EB62ED  0px,   /* violet starts at 0 */
  #EB62ED 10px,   /* violet ends at 10 — hard stop */
  transparent 10px, /* gap starts at 10 */
  transparent 20px  /* gap ends at 20 — pattern restarts */
)`}</pre>
          <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
            The total "cycle" here is 20px. The browser draws violet from 0-10px, then transparent from 10-20px,
            then starts over at 20px, 40px, 60px... forever.
          </p>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">Hard stops = crisp stripes</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Notice the two stops at the same position:{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">#EB62ED 10px, transparent 10px</code>.
            When two colors share a position, there's zero room for the browser to blend between them —
            you get a razor-sharp edge instead of a smooth transition. That's the entire secret behind
            stripe patterns in CSS.
          </p>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">The three repeating functions</h3>
          <ul className="text-sm text-foreground-muted leading-relaxed flex flex-col gap-2">
            <li>
              <strong className="text-foreground-default">repeating-linear-gradient</strong> — stripes along a line.
              Change the angle to go horizontal, vertical, or diagonal.
            </li>
            <li>
              <strong className="text-foreground-default">repeating-radial-gradient</strong> — concentric rings radiating outward
              from a center point. Think bullseye / target patterns.
            </li>
            <li>
              <strong className="text-foreground-default">repeating-conic-gradient</strong> — repeating wedges swept around a center.
              Great for starburst or pinwheel effects.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">% vs px — when to use each</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            You <em>can</em> use percentages in repeating gradients, but percentages are relative to
            the gradient's full length, so they don't tile the way you'd expect. Pixel units give you
            a fixed cycle size that's independent of the container — that's what makes the pattern repeat
            predictably. Use <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">px</code>{' '}
            (or <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">em</code>/{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">rem</code>) for
            repeating patterns, and save <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">%</code> for
            one-shot gradients.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <GradientPreview style={previewStyle} className="aspect-video lg:sticky lg:top-24" />
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl
            label="Gradient Type"
            value={type}
            options={typeOptions}
            onChange={setType}
          />

          {type === 'linear' && (
            <SliderControl
              label="Angle"
              value={angle}
              min={0}
              max={360}
              unit="deg"
              onChange={setAngle}
            />
          )}

          <ColorStopEditor
            stops={stops}
            onChange={setStops}
            unit="px"
            maxPosition={100}
          />

          <div className="mt-2 flex flex-col gap-3">
            <div className="rounded-lg bg-accent-subtle p-3">
              <p className="text-xs text-foreground-muted">
                <strong className="text-accent-strong">Try this!</strong> Set all four stops to make crisp stripes:
                color A at 0px, color A at 10px, color B at 10px, color B at 20px. Then drag the positions
                to widen or narrow the stripes.
              </p>
            </div>
            <div className="rounded-lg bg-accent-subtle p-3">
              <p className="text-xs text-foreground-muted">
                <strong className="text-accent-strong">Try this!</strong> Remove the hard stops — set positions
                to 0, 8, 12, 20 instead of 0, 10, 10, 20. See how you get a smooth gradient that tiles
                instead of sharp stripes?
              </p>
            </div>
            <div className="rounded-lg bg-accent-subtle p-3">
              <p className="text-xs text-foreground-muted">
                <strong className="text-accent-strong">Try this!</strong> Switch to repeating-radial-gradient
                to see concentric rings, then repeating-conic-gradient for a starburst.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
