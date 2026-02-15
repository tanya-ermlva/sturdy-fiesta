'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SelectControl from '@/app/playground/components/SelectControl';
import SliderControl from '@/app/playground/components/SliderControl';

const patternOptions = [
  { label: 'Badge / Notification dot', value: 'badge' },
  { label: 'Full overlay', value: 'overlay' },
  { label: 'Sticky headers in list', value: 'sticky-list' },
  { label: 'Centering with absolute', value: 'center' },
];

function BadgePattern({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative inline-block">
        <div className="rounded-xl bg-surface-strong px-8 py-6 text-sm font-mono text-foreground-default">
          Inbox
        </div>
        <span
          className="absolute flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
          style={{
            width: 20,
            height: 20,
            top: offsetY,
            right: offsetX,
          }}
        >
          3
        </span>
      </div>
    </div>
  );
}

function OverlayPattern({ opacity }: { opacity: number }) {
  return (
    <div className="relative h-full rounded-lg overflow-hidden">
      <div className="p-6 text-sm font-mono text-foreground-default">
        <p className="mb-2 font-bold">Card content underneath</p>
        <p className="text-foreground-muted">
          This content is covered by the overlay. The overlay uses absolute positioning
          with inset: 0 to cover the entire parent.
        </p>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-black text-white text-sm font-mono font-bold"
        style={{ opacity: opacity / 100 }}
      >
        Overlay (opacity: {opacity}%)
      </div>
    </div>
  );
}

function StickyListPattern() {
  const groups = [
    { header: 'Section A', items: ['Item A-1', 'Item A-2', 'Item A-3', 'Item A-4'] },
    { header: 'Section B', items: ['Item B-1', 'Item B-2', 'Item B-3', 'Item B-4'] },
    { header: 'Section C', items: ['Item C-1', 'Item C-2', 'Item C-3', 'Item C-4'] },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {groups.map((group) => (
        <div key={group.header}>
          <div className="sticky top-0 z-10 bg-violet-500 px-4 py-2 text-sm font-mono font-bold text-white">
            {group.header}
          </div>
          {group.items.map((item) => (
            <div
              key={item}
              className="border-b border-border-subtle px-4 py-3 text-sm font-mono text-foreground-muted"
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CenterPattern({ width, height }: { width: number; height: number }) {
  return (
    <div className="relative h-full">
      <div
        className="absolute rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
        style={{
          inset: 0,
          margin: 'auto',
          width,
          height,
        }}
      >
        {width}x{height}
      </div>
    </div>
  );
}

export default function RealWorldPatternsSection() {
  const [pattern, setPattern] = useState('badge');
  const [badgeX, setBadgeX] = useState(-6);
  const [badgeY, setBadgeY] = useState(-6);
  const [overlayOpacity, setOverlayOpacity] = useState(70);
  const [centerW, setCenterW] = useState(120);
  const [centerH, setCenterH] = useState(80);

  const cssString = useMemo(() => {
    switch (pattern) {
      case 'badge':
        return `.parent {\n  position: relative;\n  display: inline-block;\n}\n\n.badge {\n  position: absolute;\n  top: ${badgeY}px;\n  right: ${badgeX}px;\n}`;
      case 'overlay':
        return `.parent {\n  position: relative;\n}\n\n.overlay {\n  position: absolute;\n  inset: 0;\n  opacity: ${overlayOpacity / 100};\n}`;
      case 'sticky-list':
        return `.section-header {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}`;
      case 'center':
        return `.parent {\n  position: relative;\n}\n\n.centered {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  width: ${centerW}px;\n  height: ${centerH}px;\n}`;
      default:
        return '';
    }
  }, [pattern, badgeX, badgeY, overlayOpacity, centerW, centerH]);

  return (
    <SectionWrapper
      id="patterns"
      number={7}
      title="Real-World Patterns"
      description="These are the position combos you'll actually use every day. Each one is a building block for real UI components — badges, modals, sticky navs, and centering tricks."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border-2 border-dashed border-border-default overflow-hidden bg-surface-default" style={{ height: 280 }}>
            {pattern === 'badge' && <BadgePattern offsetX={badgeX} offsetY={badgeY} />}
            {pattern === 'overlay' && <OverlayPattern opacity={overlayOpacity} />}
            {pattern === 'sticky-list' && <StickyListPattern />}
            {pattern === 'center' && <CenterPattern width={centerW} height={centerH} />}
          </div>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl
            label="Pattern"
            value={pattern}
            options={patternOptions}
            onChange={setPattern}
          />

          {pattern === 'badge' && (
            <>
              <SliderControl label="top" value={badgeY} min={-20} max={20} unit="px" onChange={setBadgeY} />
              <SliderControl label="right" value={badgeX} min={-20} max={20} unit="px" onChange={setBadgeX} />
            </>
          )}

          {pattern === 'overlay' && (
            <SliderControl
              label="Overlay opacity"
              value={overlayOpacity}
              min={0}
              max={100}
              unit="%"
              onChange={setOverlayOpacity}
            />
          )}

          {pattern === 'sticky-list' && (
            <div className="rounded-lg bg-accent-subtle p-3">
              <p className="text-xs text-foreground-muted">
                <strong className="text-accent-strong">Scroll the list!</strong> Each
                section header sticks to the top as you scroll past it — perfect for
                contact lists, settings pages, or any grouped content.
              </p>
            </div>
          )}

          {pattern === 'center' && (
            <>
              <SliderControl label="Width" value={centerW} min={40} max={250} unit="px" onChange={setCenterW} />
              <SliderControl label="Height" value={centerH} min={40} max={200} unit="px" onChange={setCenterH} />
            </>
          )}

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Pro tip:</strong>{' '}
              {pattern === 'badge' && 'Negative values push the badge outside the parent — the classic notification dot look.'}
              {pattern === 'overlay' && 'inset: 0 is shorthand for top: 0; right: 0; bottom: 0; left: 0 — it stretches the element to fill its positioned parent.'}
              {pattern === 'sticky-list' && 'This pattern works because each sticky header is scoped to its own section container.'}
              {pattern === 'center' && 'The magic: absolute + inset: 0 + margin: auto + explicit dimensions = perfect centering. Works for any sized element.'}
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
