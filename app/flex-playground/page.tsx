"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── shared ui primitives ─────────────────────────────────────────────────────

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-foreground-muted text-sm font-mono">{label}</h2>
      {sub && <p className="text-foreground-subtle text-xs mt-1">{sub}</p>}
    </div>
  );
}

// A coloured flex item box used across all demos
function Box({
  label,
  color = "bg-violet-500/20 border-violet-500/40",
  className,
  onClick,
}: {
  label: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border rounded-xl px-3 py-2 text-xs font-mono text-foreground-muted flex items-center justify-center text-center",
        color,
        className
      )}
    >
      {label}
    </div>
  );
}

// Toggle button — shows which value is active
function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-lg text-xs font-mono transition-colors",
        active
          ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
          : "bg-surface-strong text-foreground-subtle border border-border-default"
      )}
    >
      {label}
    </button>
  );
}

// ─── stage components ─────────────────────────────────────────────────────────

function ShrinkProblemDemo() {
  return (
    <section>
      <SectionHeader
        label="Stage 1 — the default: flex items shrink"
        sub="A flex container with a fixed width. Items shrink to fit — even if it distorts them."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`<div style={{ display: "flex", width: 400 }}>
  <div>Short</div>
  <div>A much longer item that wants more space</div>
  <div>Medium item</div>
</div>
// All three squish equally to fit 400px.
// flex-shrink defaults to 1 — every item gives up space proportionally.`}</pre>
      <div
        className="flex gap-2 border border-border-default rounded-xl p-3 overflow-hidden"
        style={{ width: 400 }}
      >
        <Box label="Short" className="min-w-0" />
        <Box
          label="A much longer item that wants more space"
          color="bg-sky-500/20 border-sky-500/40"
          className="min-w-0"
        />
        <Box
          label="Medium item"
          color="bg-emerald-500/20 border-emerald-500/40"
          className="min-w-0"
        />
      </div>
      <p className="text-foreground-subtle text-xs font-mono mt-3">
        ↳ container is fixed at 400px — all three shrink equally
      </p>
    </section>
  );
}

function ShrinkToggleDemo() {
  const [pinned, setPinned] = useState(false);

  return (
    <section>
      <SectionHeader
        label="Stage 2 — flex-shrink / shrink-0"
        sub="Toggle shrink-0 on the middle item. It refuses to shrink — the others absorb the squeeze."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`flex-shrink: 1   /* default — this item CAN shrink */
flex-shrink: 0   /* shrink-0 — this item REFUSES to shrink */

// Tailwind:
// shrink    → flex-shrink: 1
// shrink-0  → flex-shrink: 0`}</pre>
      <div className="flex gap-2 mb-4">
        <Toggle label="shrink (default)" active={!pinned} onClick={() => setPinned(false)} />
        <Toggle label="shrink-0" active={pinned} onClick={() => setPinned(true)} />
      </div>
      <div
        className="flex gap-2 border border-border-default rounded-xl p-3 overflow-hidden"
        style={{ width: 400 }}
      >
        <Box label="Flexible" className="min-w-0" />
        <Box
          label={pinned ? "shrink-0 — I keep my size!" : "shrink — I squish too"}
          color="bg-sky-500/20 border-sky-500/40"
          className={cn("min-w-0", pinned ? "shrink-0" : "shrink")}
        />
        <Box
          label="Flexible"
          color="bg-emerald-500/20 border-emerald-500/40"
          className="min-w-0"
        />
      </div>
      <p className="text-foreground-subtle text-xs font-mono mt-3">
        ↳ container is fixed at 400px — watch the middle box
      </p>
    </section>
  );
}

function GrowDemo() {
  const [growIndex, setGrowIndex] = useState<number | null>(null);

  const colors = [
    "bg-violet-500/20 border-violet-500/40",
    "bg-sky-500/20 border-sky-500/40",
    "bg-emerald-500/20 border-emerald-500/40",
  ];

  return (
    <section>
      <SectionHeader
        label="Stage 3 — flex-grow"
        sub="Click a box to give it grow. It stretches to fill all the leftover space."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`flex-grow: 0   /* default — stay your natural size */
flex-grow: 1   /* grow — claim all available space */

// Tailwind:
// grow-0  → flex-grow: 0  (default)
// grow    → flex-grow: 1`}</pre>
      <div className="flex gap-2 border border-border-default rounded-xl p-3">
        {["Box A", "Box B", "Box C"].map((label, i) => (
          <Box
            key={label}
            label={growIndex === i ? `${label} (grow)` : label}
            color={colors[i]}
            className={cn("cursor-pointer transition-all", growIndex === i ? "grow" : "grow-0")}
            onClick={() => setGrowIndex(growIndex === i ? null : i)}
          />
        ))}
      </div>
      <p className="text-foreground-subtle text-xs font-mono mt-3">
        ↳ click a box to give it grow — click again to remove it
      </p>
    </section>
  );
}

type BasisOption = "basis-auto" | "basis-0" | "basis-1/3" | "basis-2/3";

function BasisDemo() {
  const [basis, setBasis] = useState<BasisOption>("basis-auto");

  const options: BasisOption[] = ["basis-auto", "basis-0", "basis-1/3", "basis-2/3"];

  const descriptions: Record<BasisOption, string> = {
    "basis-auto": "natural content size (default)",
    "basis-0": "start from zero — grow decides everything",
    "basis-1/3": "start at 33% of container",
    "basis-2/3": "start at 66% of container",
  };

  return (
    <section>
      <SectionHeader
        label="Stage 4 — flex-basis"
        sub="Sets the starting size before grow/shrink adjusts it. Think of it as the item's preferred width."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`flex-basis: auto   /* use the item's natural content size */
flex-basis: 0      /* start from nothing, grow decides the size */
flex-basis: 33%    /* start at 33% of the container */

// Tailwind: basis-auto, basis-0, basis-1/3, basis-2/3, basis-full…`}</pre>
      <div className="flex gap-2 mb-4 flex-wrap">
        {options.map((opt) => (
          <Toggle key={opt} label={opt} active={basis === opt} onClick={() => setBasis(opt)} />
        ))}
      </div>
      <p className="text-foreground-subtle text-xs font-mono mb-3">
        ↳ {basis}: {descriptions[basis]}
      </p>
      <div className="flex gap-2 border border-border-default rounded-xl p-3">
        <Box label="A" className={cn("grow", basis)} />
        <Box label="B" color="bg-sky-500/20 border-sky-500/40" className={cn("grow", basis)} />
        <Box label="C" color="bg-emerald-500/20 border-emerald-500/40" className={cn("grow", basis)} />
      </div>
    </section>
  );
}

type FlexPreset = "flex-none" | "flex-1" | "flex-auto" | "flex-initial";

function FlexShorthandDemo() {
  const [preset, setPreset] = useState<FlexPreset>("flex-1");

  const presets: { value: FlexPreset; expanded: string; meaning: string }[] = [
    { value: "flex-none",    expanded: "flex: 0 0 auto",  meaning: "don't grow, don't shrink — rigid box" },
    { value: "flex-1",       expanded: "flex: 1 1 0%",    meaning: "grow AND shrink, start from zero — equal sharing" },
    { value: "flex-auto",    expanded: "flex: 1 1 auto",  meaning: "grow AND shrink, but respect content size first" },
    { value: "flex-initial", expanded: "flex: 0 1 auto",  meaning: "shrink if needed, don't grow — browser default" },
  ];

  const active = presets.find((p) => p.value === preset)!;

  return (
    <section>
      <SectionHeader
        label="Stage 5 — the flex shorthand"
        sub="flex is a shorthand for grow + shrink + basis together. flex-1 is by far the most common."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`flex: <grow> <shrink> <basis>

flex-1       = flex: 1 1 0%    ← equal columns, most common
flex-auto    = flex: 1 1 auto  ← proportional to content size
flex-initial = flex: 0 1 auto  ← browser default
flex-none    = flex: 0 0 auto  ← rigid, ignores container`}</pre>
      <div className="flex gap-2 mb-3 flex-wrap">
        {presets.map((p) => (
          <Toggle key={p.value} label={p.value} active={preset === p.value} onClick={() => setPreset(p.value)} />
        ))}
      </div>
      <p className="text-foreground-subtle text-xs font-mono mb-3">
        ↳ {active.value} = {active.expanded} — {active.meaning}
      </p>
      <div className="flex gap-2 border border-border-default rounded-xl p-3">
        <Box label="Short" className={preset} />
        <Box label="A much longer item" color="bg-sky-500/20 border-sky-500/40" className={preset} />
        <Box label="Medium" color="bg-emerald-500/20 border-emerald-500/40" className={preset} />
      </div>
    </section>
  );
}

function MinWidthDemo() {
  const [fixed, setFixed] = useState(false);

  return (
    <section>
      <SectionHeader
        label="Stage 6 — the min-width: 0 gotcha"
        sub="Flex items can't shrink below their content size by default. This breaks text truncation. Fix: min-w-0."
      />
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`/* The bug */
<div className="flex">
  <div className="truncate">Very long text...</div>
  <div className="shrink-0">Side</div>
</div>
// text does NOT truncate — flex item won't shrink below text width

/* The fix */
<div className="flex">
  <div className="truncate min-w-0">Now it truncates</div>
  <div className="shrink-0">Side</div>
</div>`}</pre>
      <div className="flex gap-2 mb-4">
        <Toggle label="without min-w-0 (broken)" active={!fixed} onClick={() => setFixed(false)} />
        <Toggle label="with min-w-0 (fixed)" active={fixed} onClick={() => setFixed(true)} />
      </div>
      <div
        className="flex gap-2 border border-border-default rounded-xl p-3 overflow-hidden"
        style={{ width: 400 }}
      >
        <div
          className={cn(
            "text-xs font-mono text-foreground-muted bg-violet-500/20 border border-violet-500/40 rounded-xl px-3 py-2 truncate grow",
            fixed && "min-w-0"
          )}
        >
          This is a very long piece of text that should truncate when there is not enough space
        </div>
        <Box label="Fixed" color="bg-sky-500/20 border-sky-500/40" className="shrink-0" />
      </div>
      <p className="text-foreground-subtle text-xs font-mono mt-3">
        ↳ {fixed
          ? "min-w-0 lets the item shrink below content size → truncate works"
          : "without min-w-0, the item refuses to shrink → text overflows"}
      </p>
    </section>
  );
}

// ─── the page ─────────────────────────────────────────────────────────────────

export default function FlexPlayground() {
  return (
    <main className="p-8 flex flex-col gap-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-foreground-strong text-2xl font-bold mb-2">
          flex-shrink &amp; friends
        </h1>
        <p className="text-foreground-muted text-sm">
          Toggle properties on live boxes to see exactly what each one does. All
          demos use a fixed-width container so you can see squishing and growing
          in action.
        </p>
      </div>

      <ShrinkProblemDemo />
      <ShrinkToggleDemo />
      <GrowDemo />
      <BasisDemo />
      <FlexShorthandDemo />
      <MinWidthDemo />
    </main>
  );
}
