# Flex Shrink Playground Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page interactive playground at `/flex-playground` that teaches `flex-shrink`, `flex-grow`, `flex-basis`, the `flex` shorthand, and the `min-width: 0` gotcha through live toggle demos.

**Architecture:** Single file `app/flex-playground/page.tsx`, `"use client"`, mirrors the exact structure of `app/array-playground/page.tsx` — local helper components, annotated `<pre>` syntax blocks, `useState` toggles for interactivity. No external dependencies beyond what the project already has (`cn`, Tailwind).

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS 4, `cn()` from `lib/utils`

---

### Task 1: Scaffold the page shell

**Files:**
- Create: `app/flex-playground/page.tsx`

**Step 1: Create the file with shell + shared primitives**

```tsx
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
}: {
  label: string;
  color?: string;
  className?: string;
}) {
  return (
    <div
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

// ─── the page ─────────────────────────────────────────────────────────────────

export default function FlexPlayground() {
  return (
    <main className="p-8 flex flex-col gap-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-foreground-strong text-2xl font-bold mb-2">
          flex-shrink & friends
        </h1>
        <p className="text-foreground-muted text-sm">
          Toggle properties on live boxes to see exactly what each one does. All
          demos use a fixed-width container so you can see squishing and growing
          in action.
        </p>
      </div>

      {/* stages go here */}
    </main>
  );
}
```

**Step 2: Verify it renders (no errors)**

Run: `npm run dev`, visit `http://localhost:3000/flex-playground`
Expected: Page with heading, no console errors.

**Step 3: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: scaffold flex-playground page shell"
```

---

### Task 2: Stage 1 — The problem (default shrink behaviour)

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** By default, flex items *shrink* to fit their container. This surprises people. No controls — just show it.

**Step 1: Add the `ShrinkProblemDemo` component above the page export**

```tsx
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
```

**Step 2: Add `<ShrinkProblemDemo />` inside the `{/* stages go here */}` comment in the page**

**Step 3: Check in browser** — you should see three boxes inside a 400px container, all squeezed.

**Step 4: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 1 — default shrink behaviour"
```

---

### Task 3: Stage 2 — `flex-shrink` / `shrink-0` toggle

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** `shrink-0` (= `flex-shrink: 0`) tells one item "never give up your space". Other items absorb the squeeze.

**Step 1: Add the `ShrinkToggleDemo` component**

```tsx
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
        <Toggle
          label="shrink (default)"
          active={!pinned}
          onClick={() => setPinned(false)}
        />
        <Toggle
          label="shrink-0"
          active={pinned}
          onClick={() => setPinned(true)}
        />
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
```

**Step 2: Add `<ShrinkToggleDemo />` after `<ShrinkProblemDemo />` in the page**

**Step 3: Check in browser** — toggle should visibly change which items squish.

**Step 4: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 2 — flex-shrink toggle"
```

---

### Task 4: Stage 3 — `flex-grow`

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** `flex-grow: 1` (Tailwind: `grow`) makes an item *expand* to fill leftover space. `grow-0` is the default — don't expand.

**Step 1: Add the `GrowDemo` component**

```tsx
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
            label={
              growIndex === i
                ? `${label} (grow)`
                : label
            }
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
```

Note: `Box` needs an `onClick` prop. Update the `Box` component signature to add `onClick?: () => void` and spread it onto the div.

**Step 2: Update `Box` to accept `onClick`**

```tsx
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
```

**Step 3: Add `<GrowDemo />` after `<ShrinkToggleDemo />` in the page**

**Step 4: Check in browser** — clicking a box should make it fill the row.

**Step 5: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 3 — flex-grow"
```

---

### Task 5: Stage 4 — `flex-basis`

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** `flex-basis` sets the *starting size* of an item before grow/shrink kicks in. It's like `width` for flex items but smarter — it's the "ideal size" before the container decides what to do.

**Step 1: Add the `BasisDemo` component**

```tsx
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
          <Toggle
            key={opt}
            label={opt}
            active={basis === opt}
            onClick={() => setBasis(opt)}
          />
        ))}
      </div>

      <p className="text-foreground-subtle text-xs font-mono mb-3">
        ↳ {basis}: {descriptions[basis]}
      </p>

      <div className="flex gap-2 border border-border-default rounded-xl p-3">
        <Box
          label="A"
          className={cn("grow", basis)}
        />
        <Box
          label="B"
          color="bg-sky-500/20 border-sky-500/40"
          className={cn("grow", basis)}
        />
        <Box
          label="C"
          color="bg-emerald-500/20 border-emerald-500/40"
          className={cn("grow", basis)}
        />
      </div>
    </section>
  );
}
```

**Step 2: Add `<BasisDemo />` after `<GrowDemo />` in the page**

**Step 3: Check in browser** — switching basis options should redistribute the boxes.

**Step 4: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 4 — flex-basis"
```

---

### Task 6: Stage 5 — the `flex` shorthand + `flex-1`

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** `flex` is the shorthand for `flex-grow flex-shrink flex-basis`. `flex-1` = `1 1 0` (grow, shrink, start from zero) — the most common value.

**Step 1: Add the `FlexShorthandDemo` component**

```tsx
type FlexPreset = "flex-none" | "flex-1" | "flex-auto" | "flex-initial";

function FlexShorthandDemo() {
  const [preset, setPreset] = useState<FlexPreset>("flex-1");

  const presets: { value: FlexPreset; expanded: string; meaning: string }[] = [
    {
      value: "flex-none",
      expanded: "flex: 0 0 auto",
      meaning: "don't grow, don't shrink — rigid box",
    },
    {
      value: "flex-1",
      expanded: "flex: 1 1 0",
      meaning: "grow AND shrink, start from zero — equal sharing",
    },
    {
      value: "flex-auto",
      expanded: "flex: 1 1 auto",
      meaning: "grow AND shrink, but respect content size first",
    },
    {
      value: "flex-initial",
      expanded: "flex: 0 1 auto",
      meaning: "shrink if needed, don't grow — browser default",
    },
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
          <Toggle
            key={p.value}
            label={p.value}
            active={preset === p.value}
            onClick={() => setPreset(p.value)}
          />
        ))}
      </div>

      <p className="text-foreground-subtle text-xs font-mono mb-3">
        ↳ {active.value} = {active.expanded} — {active.meaning}
      </p>

      <div className="flex gap-2 border border-border-default rounded-xl p-3">
        <Box label="Short" className={preset} />
        <Box
          label="A much longer item"
          color="bg-sky-500/20 border-sky-500/40"
          className={preset}
        />
        <Box
          label="Medium"
          color="bg-emerald-500/20 border-emerald-500/40"
          className={preset}
        />
      </div>
    </section>
  );
}
```

**Step 2: Add `<FlexShorthandDemo />` after `<BasisDemo />` in the page**

**Step 3: Check in browser** — switching presets should visibly change how the boxes share space.

**Step 4: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 5 — flex shorthand"
```

---

### Task 7: Stage 6 — the `min-width: 0` gotcha

**Files:**
- Modify: `app/flex-playground/page.tsx`

**What to teach:** Flex items have `min-width: auto` by default — they never shrink below their content size. This breaks text truncation. The fix is `min-w-0`. This is a very common real-world bug.

**Step 1: Add the `MinWidthDemo` component**

```tsx
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
  <div className="truncate">Very long text that should truncate...</div>
  <div className="shrink-0">Side content</div>
</div>
// text does NOT truncate — flex item won't shrink below text width

/* The fix */
<div className="flex">
  <div className="truncate min-w-0">Now it truncates correctly</div>
  <div className="shrink-0">Side content</div>
</div>`}</pre>

      <div className="flex gap-2 mb-4">
        <Toggle
          label="without min-w-0 (broken)"
          active={!fixed}
          onClick={() => setFixed(false)}
        />
        <Toggle
          label="with min-w-0 (fixed)"
          active={fixed}
          onClick={() => setFixed(true)}
        />
      </div>

      <div className="flex gap-2 border border-border-default rounded-xl p-3 overflow-hidden" style={{ width: 400 }}>
        <div
          className={cn(
            "text-xs font-mono text-foreground-muted bg-violet-500/20 border border-violet-500/40 rounded-xl px-3 py-2 truncate grow",
            fixed && "min-w-0"
          )}
        >
          This is a very long piece of text that should truncate when there is not enough space
        </div>
        <Box
          label="Fixed"
          color="bg-sky-500/20 border-sky-500/40"
          className="shrink-0"
        />
      </div>

      <p className="text-foreground-subtle text-xs font-mono mt-3">
        ↳ {fixed
          ? "min-w-0 lets the item shrink below content size → truncate works"
          : "without min-w-0, the item refuses to shrink → text overflows"}
      </p>
    </section>
  );
}
```

**Step 2: Add `<MinWidthDemo />` after `<FlexShorthandDemo />` in the page**

**Step 3: Check in browser** — toggling should show text overflowing vs truncating cleanly.

**Step 4: Commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: flex-playground stage 6 — min-width gotcha"
```

---

### Task 8: Final cleanup — run lint and verify

**Step 1: Run lint**

```bash
npm run lint
```

Expected: no errors. If there are TypeScript errors, fix them (usually a missing type on the `onClick` handler or unused import).

**Step 2: Verify all 6 stages render correctly at `http://localhost:3000/flex-playground`**

Checklist:
- [ ] Stage 1: 3 boxes squeezed in a 400px container
- [ ] Stage 2: toggle changes which boxes squish
- [ ] Stage 3: clicking a box makes it fill remaining space
- [ ] Stage 4: basis options redistribute boxes
- [ ] Stage 5: flex preset toggles change sharing behaviour
- [ ] Stage 6: min-w-0 toggle fixes text truncation

**Step 3: Final commit**

```bash
git add app/flex-playground/page.tsx
git commit -m "feat: complete flex-shrink playground — 6 interactive stages"
```
