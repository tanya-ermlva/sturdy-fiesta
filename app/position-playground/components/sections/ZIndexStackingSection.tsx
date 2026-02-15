'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '@/app/playground/components/SectionWrapper';
import CssCodeBlock from '@/app/playground/components/CssCodeBlock';
import SliderControl from '@/app/playground/components/SliderControl';
import SelectControl from '@/app/playground/components/SelectControl';
import PositionPreview from '../PositionPreview';

const modeOptions = [
  { label: 'Basic z-index', value: 'basic' },
  { label: 'Stacking context trap', value: 'stacking' },
];

export default function ZIndexStackingSection() {
  const [mode, setMode] = useState('basic');
  const [zA, setZA] = useState(1);
  const [zB, setZB] = useState(2);
  const [zC, setZC] = useState(3);
  const [zGroupA, setZGroupA] = useState(1);
  const [zGroupB, setZGroupB] = useState(2);
  const [zChild, setZChild] = useState(9999);

  const cssString = useMemo(() => {
    if (mode === 'basic') {
      return `.box-a { position: absolute; z-index: ${zA}; }\n.box-b { position: absolute; z-index: ${zB}; }\n.box-c { position: absolute; z-index: ${zC}; }`;
    }
    return `.group-a { position: relative; z-index: ${zGroupA}; }\n.group-b { position: relative; z-index: ${zGroupB}; }\n\n.group-a .child {\n  position: absolute;\n  z-index: ${zChild}; /* trapped! */\n}`;
  }, [mode, zA, zB, zC, zGroupA, zGroupB, zChild]);

  return (
    <SectionWrapper
      id="z-index"
      number={6}
      title="Z-Index & Stacking Contexts"
      description="z-index only works on positioned elements. And here's the real brain-melter: when an element creates a stacking context, its children can NEVER escape above a sibling with a higher stacking order — even with z-index: 9999."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <PositionPreview containerPosition="relative" height="320px">
            {mode === 'basic' ? (
              <>
                <div
                  className="absolute rounded-lg bg-violet-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
                  style={{ width: 100, height: 100, top: 40, left: 40, zIndex: zA }}
                >
                  A (z:{zA})
                </div>
                <div
                  className="absolute rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
                  style={{ width: 100, height: 100, top: 70, left: 80, zIndex: zB }}
                >
                  B (z:{zB})
                </div>
                <div
                  className="absolute rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
                  style={{ width: 100, height: 100, top: 100, left: 120, zIndex: zC }}
                >
                  C (z:{zC})
                </div>
              </>
            ) : (
              <>
                {/* Group A */}
                <div
                  className="absolute rounded-xl border-2 border-violet-400 bg-violet-500/10 p-2"
                  style={{
                    width: 180,
                    height: 200,
                    top: 30,
                    left: 30,
                    zIndex: zGroupA,
                  }}
                >
                  <span className="text-[10px] font-mono text-violet-400">
                    Group A (z:{zGroupA})
                  </span>
                  <div
                    className="absolute rounded-lg bg-violet-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
                    style={{
                      width: 80,
                      height: 80,
                      top: 60,
                      left: 20,
                      zIndex: zChild,
                    }}
                  >
                    z:{zChild}
                  </div>
                </div>

                {/* Group B */}
                <div
                  className="absolute rounded-xl border-2 border-blue-400 bg-blue-500/10 p-2"
                  style={{
                    width: 180,
                    height: 200,
                    top: 60,
                    left: 160,
                    zIndex: zGroupB,
                  }}
                >
                  <span className="text-[10px] font-mono text-blue-400">
                    Group B (z:{zGroupB})
                  </span>
                  <div
                    className="absolute rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-mono font-bold shadow-md"
                    style={{ width: 80, height: 80, top: 60, left: 50, zIndex: 1 }}
                  >
                    z:1
                  </div>
                </div>
              </>
            )}
          </PositionPreview>
          <CssCodeBlock code={cssString} />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border-muted bg-surface-muted p-5">
          <SelectControl
            label="Mode"
            value={mode}
            options={modeOptions}
            onChange={setMode}
          />

          {mode === 'basic' ? (
            <>
              <SliderControl label="Box A z-index" value={zA} min={0} max={10} onChange={setZA} />
              <SliderControl label="Box B z-index" value={zB} min={0} max={10} onChange={setZB} />
              <SliderControl label="Box C z-index" value={zC} min={0} max={10} onChange={setZC} />
            </>
          ) : (
            <>
              <SliderControl label="Group A z-index" value={zGroupA} min={1} max={10} onChange={setZGroupA} />
              <SliderControl label="Group B z-index" value={zGroupB} min={1} max={10} onChange={setZGroupB} />
              <SliderControl label="Child in A z-index" value={zChild} min={1} max={9999} onChange={setZChild} />
            </>
          )}

          <div className="mt-2 rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              {mode === 'basic' ? (
                <>
                  <strong className="text-accent-strong">Play around!</strong> Drag
                  the z-index values to re-order the boxes. Higher z-index = closer
                  to the viewer.
                </>
              ) : (
                <>
                  <strong className="text-accent-strong">Mind-bender!</strong> Set the
                  child in Group A to 9999. It STILL can&apos;t beat Group B&apos;s
                  child — because Group A&apos;s stacking context is lower than Group
                  B&apos;s.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
