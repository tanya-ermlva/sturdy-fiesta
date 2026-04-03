# Granola Nub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive playground page with 3 variants of a Dynamic Island-style "Nub" element, exploring morph animations, drag-and-snap, and progressive disclosure.

**Architecture:** Single playground page at `/playground/granola-nub` with a variant tab picker. Each variant is rendered conditionally inside one client component (`GranolaNub.tsx`). All animation powered by `motion` (Framer Motion v12). Mock data in a separate file.

**Tech Stack:** Next.js App Router, React 19, motion v12, lucide-react, Tailwind CSS 4

**Design doc:** `docs/plans/2026-02-16-granola-nub-design.md`

---

### Task 1: Scaffold page and mock data

**Files:**
- Create: `app/playground/granola-nub/page.tsx`
- Create: `app/playground/granola-nub/mock-data.ts`
- Create: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Create mock data file**

```ts
// app/playground/granola-nub/mock-data.ts
export const meetingData = {
  title: "Meeting with Sarah Chen",
  topic: "Product Design Review",
  duration: "12m",
  briefSlides: [
    "Sarah is Head of Design at Linear. She previously led product design at Figma for 3 years, focusing on multiplayer collaboration features.",
    "This is a follow-up to your initial intro call last Tuesday. She mentioned interest in Granola's approach to async meeting summaries.",
    "Key talking points: her team's pain points with meeting notes, Linear's current tooling, and potential pilot program for Q2.",
  ],
  briefFull:
    "Sarah is Head of Design at Linear, previously leading product design at Figma for 3 years. This is a follow-up to last Tuesday's intro call — she's interested in Granola's async meeting summaries. Key topics: her team's pain points with notes, Linear's current tooling, and a potential Q2 pilot program.",
  links: [
    { label: "sarah.design", url: "#", icon: "globe" as const },
    { label: "LinkedIn", url: "#", icon: "linkedin" as const },
  ],
};
```

**Step 2: Create the page server component**

```tsx
// app/playground/granola-nub/page.tsx
import type { Metadata } from "next";
import GranolaNub from "./GranolaNub";

export const metadata: Metadata = {
  title: "Granola Nub Exploration",
  description: "Dynamic Island-style interaction design prototype",
  robots: "noindex",
};

export default function GranolaNubPage() {
  return <GranolaNub />;
}
```

**Step 3: Create the client component shell with variant tabs and background**

```tsx
// app/playground/granola-nub/GranolaNub.tsx
"use client";

import { useState } from "react";

type Variant = "island" | "ticker" | "hybrid";

export default function GranolaNub() {
  const [variant, setVariant] = useState<Variant>("island");

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)",
      }}
    >
      {/* Variant picker tabs */}
      <div className="absolute top-6 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full bg-black/40 p-1 backdrop-blur-md">
        {([
          { key: "island", label: "A: Island" },
          { key: "ticker", label: "C: Ticker" },
          { key: "hybrid", label: "D: Hybrid" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVariant(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              variant === tab.key
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nub variants render here — built in subsequent tasks */}
      {variant === "island" && <div>Island placeholder</div>}
      {variant === "ticker" && <div>Ticker placeholder</div>}
      {variant === "hybrid" && <div>Hybrid placeholder</div>}
    </div>
  );
}
```

**Step 4: Verify it renders**

Run: `npm run dev`
Open: `http://localhost:3000/playground/granola-nub`
Expected: macOS-style gradient background with 3 tab buttons at top. Clicking tabs switches placeholder text.

**Step 5: Commit**

```bash
git add app/playground/granola-nub/
git commit -m "feat: scaffold granola nub playground page with variant tabs"
```

---

### Task 2: Waveform visualization component

Build the shared waveform SVG that all 3 variants use. This is defined inline in `GranolaNub.tsx`.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Add the Waveform component inside GranolaNub.tsx**

Add above the `GranolaNub` default export:

```tsx
import { motion } from "motion/react";

// --- Waveform ---
const BAR_COUNT = 6;
const BAR_DURATIONS = [0.35, 0.5, 0.3, 0.45, 0.55, 0.4]; // seconds per bar cycle

function Waveform({ size = "default" }: { size?: "default" | "small" }) {
  const barWidth = size === "small" ? 2 : 3;
  const barGap = size === "small" ? 1.5 : 2;
  const maxHeight = size === "small" ? 12 : 20;
  const svgWidth = BAR_COUNT * (barWidth + barGap) - barGap;

  return (
    <svg
      width={svgWidth}
      height={maxHeight}
      viewBox={`0 0 ${svgWidth} ${maxHeight}`}
      className="shrink-0"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.rect
          key={i}
          x={i * (barWidth + barGap)}
          y={0}
          width={barWidth}
          height={maxHeight}
          rx={barWidth / 2}
          fill="rgba(255, 255, 255, 0.7)"
          style={{ originY: "50%", originX: "50%" }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration: BAR_DURATIONS[i],
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </svg>
  );
}
```

**Step 2: Add a Granola logo placeholder**

A simple circle with "G" as a stand-in:

```tsx
function GranolaLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      G
    </div>
  );
}
```

**Step 3: Temporarily render waveform in the island placeholder to verify**

Replace the island placeholder:
```tsx
{variant === "island" && (
  <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-black/85 px-4 py-3 backdrop-blur-[40px]" style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
    <GranolaLogo />
    <Waveform />
  </div>
)}
```

**Step 4: Verify visually**

Open: `http://localhost:3000/playground/granola-nub`
Expected: Dark pill centered on screen with a "G" logo and 6 bars animating up/down at different speeds.

**Step 5: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: add waveform visualization and logo placeholder"
```

---

### Task 3: Shared glass surface styles and spring constants

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Add shared constants at the top of the file (below imports)**

```tsx
// --- Shared animation config ---
const SPRING_MORPH = { type: "spring" as const, stiffness: 400, damping: 30 };
const SPRING_SNAP = { type: "spring" as const, stiffness: 300, damping: 28 };
const FADE = { duration: 0.15, ease: "easeOut" as const };

const GLASS_STYLE = {
  background: "rgba(0, 0, 0, 0.85)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
} as const;
```

**Step 2: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: add shared spring constants and glass surface styles"
```

---

### Task 4: Drag and edge-snap hook

Build a reusable `useDragSnap` hook inside `GranolaNub.tsx` that handles free dragging + snapping to nearest edge on release.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Implement the hook**

```tsx
import { useState, useCallback, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";

type SnapMode = "all" | "vertical"; // all = snap to any edge, vertical = top/bottom only

function useDragSnap(snapMode: SnapMode = "all") {
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const nubRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(
    (_event: PointerEvent, info: { point: { x: number; y: number } }) => {
      if (!containerRef.current || !nubRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const nub = nubRef.current.getBoundingClientRect();
      const padding = 16;

      // Current center of the nub
      const cx = info.point.x - container.left;
      const cy = info.point.y - container.top;

      let targetX: number;
      let targetY: number;

      if (snapMode === "vertical") {
        // Snap to top or bottom only, keep horizontal position
        const distTop = cy;
        const distBottom = container.height - cy;
        targetX = cx - nub.width / 2; // keep current X
        targetY =
          distTop < distBottom
            ? padding
            : container.height - nub.height - padding;
      } else {
        // Snap to nearest of all 4 edges
        const distLeft = cx;
        const distRight = container.width - cx;
        const distTop = cy;
        const distBottom = container.height - cy;
        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist === distLeft) {
          targetX = padding;
          targetY = cy - nub.height / 2;
        } else if (minDist === distRight) {
          targetX = container.width - nub.width - padding;
          targetY = cy - nub.height / 2;
        } else if (minDist === distTop) {
          targetX = cx - nub.width / 2;
          targetY = padding;
        } else {
          targetX = cx - nub.width / 2;
          targetY = container.height - nub.height - padding;
        }

        // Clamp within bounds
        targetX = Math.max(padding, Math.min(targetX, container.width - nub.width - padding));
        targetY = Math.max(padding, Math.min(targetY, container.height - nub.height - padding));
      }

      controls.start({
        x: targetX - (container.width / 2 - nub.width / 2), // offset from center origin
        y: targetY - (container.height / 2 - nub.height / 2),
        transition: SPRING_SNAP,
      });
    },
    [snapMode, controls]
  );

  return { controls, containerRef, nubRef, handleDragEnd };
}
```

**Note:** The x/y calculation offsets from center because the nub starts centered via CSS `translate-x-1/2 translate-y-1/2`. This may need adjustment during implementation — verify by dragging and checking snap positions visually. If the math is off, the fix is to track position with `useMotionValue` instead and set absolute positioning.

**Step 2: Verify by wiring it to the island placeholder**

Replace the island placeholder div with:
```tsx
{variant === "island" && (
  <IslandVariant />
)}
```

Create a temporary `IslandVariant`:
```tsx
function IslandVariant() {
  const { controls, containerRef, nubRef, handleDragEnd } = useDragSnap("all");

  return (
    <div ref={containerRef} className="absolute inset-0">
      <motion.div
        ref={nubRef}
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-grab items-center gap-3 rounded-full px-4 py-3 text-white active:cursor-grabbing"
        style={GLASS_STYLE}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        animate={controls}
        onDragEnd={handleDragEnd}
      >
        <GranolaLogo />
        <Waveform />
      </motion.div>
    </div>
  );
}
```

**Step 3: Verify drag + snap**

Open: `http://localhost:3000/playground/granola-nub`
Expected: The pill is draggable. On release, it springs to the nearest edge with 16px padding.

**Important:** The center-offset math in `handleDragEnd` might need debugging. If the snap position is wrong, switch to tracking absolute position with `useMotionValue(0)` for x and y, and use `style={{ x, y }}` with absolute positioning instead of CSS transforms. Test thoroughly.

**Step 4: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: add drag-and-snap hook with edge snapping"
```

---

### Task 5: Variant A — Dynamic Island (3-state morph)

The main event. Build the Island variant with default → hover → expanded states, layout animations, and element continuity.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Build the IslandVariant component with state machine**

Replace the temporary `IslandVariant` with the full implementation:

```tsx
import { AnimatePresence } from "motion/react";
import { Globe, Linkedin } from "lucide-react";
import { meetingData } from "./mock-data";

type NubState = "default" | "hover" | "expanded";

function IslandVariant() {
  const [state, setState] = useState<NubState>("default");
  const { controls, containerRef, nubRef, handleDragEnd } = useDragSnap("all");

  // Click outside to dismiss expanded
  const handleContainerClick = useCallback(() => {
    if (state === "expanded") setState("default");
  }, [state]);

  return (
    <div ref={containerRef} className="absolute inset-0" onClick={handleContainerClick}>
      <motion.div
        ref={nubRef}
        layout
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab text-white active:cursor-grabbing"
        style={{
          ...GLASS_STYLE,
          borderRadius: state === "expanded" ? 20 : 24,
          padding: state === "expanded" ? "16px" : "12px 16px",
          width: state === "default" ? 160 : state === "hover" ? 320 : 360,
          height: state === "default" ? 48 : state === "hover" ? 56 : 280,
        }}
        transition={SPRING_MORPH}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        animate={controls}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => {
          if (state === "default") setState("hover");
        }}
        onMouseLeave={() => {
          if (state === "hover" || state === "expanded") setState("default");
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (state === "hover") setState("expanded");
        }}
      >
        {/* Header row — always present */}
        <motion.div layout className="flex items-center gap-3">
          <GranolaLogo size={state === "expanded" ? 22 : state === "hover" ? 24 : 28} />
          <Waveform size={state === "default" ? "default" : "small"} />

          {/* Title + subtitle — visible in hover + expanded */}
          <AnimatePresence>
            {state !== "default" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={FADE}
                className="min-w-0 flex-1"
              >
                <div className="truncate text-sm font-medium">{meetingData.title}</div>
                <div className="truncate text-xs text-white/50">
                  {meetingData.topic} · {meetingData.duration}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Expanded content — brief carousel + links */}
        <AnimatePresence>
          {state === "expanded" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ ...FADE, delay: 0.06 }}
              className="mt-3"
            >
              <BriefCarousel />
              <LinkPills />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

**Step 2: Build BriefCarousel (swipeable slides with dots)**

```tsx
function BriefCarousel() {
  const [slide, setSlide] = useState(0);
  const slideCount = meetingData.briefSlides.length;

  // Auto-advance every 6 seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoAdvance = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % slideCount);
    }, 6000);
  }, [slideCount]);
  const stopAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Start auto-advance on mount
  useState(() => {
    startAutoAdvance();
    return () => stopAutoAdvance();
  });

  return (
    <div
      className="mb-3"
      onMouseEnter={stopAutoAdvance}
      onMouseLeave={startAutoAdvance}
    >
      <div className="relative h-[120px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={slide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 text-sm leading-relaxed text-white/70"
          >
            {meetingData.briefSlides[slide]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="mt-2 flex justify-center gap-1.5">
        {meetingData.briefSlides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setSlide(i); }}
            className={`h-1.5 rounded-full transition-all ${
              i === slide ? "w-4 bg-white/80" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Note:** The auto-advance uses `useState` as an initializer hack. If this causes issues, switch to `useEffect`. The idea is to start the interval once when the carousel mounts.

**Step 3: Build LinkPills**

```tsx
function LinkPills() {
  const iconMap = { globe: Globe, linkedin: Linkedin };

  return (
    <div className="flex gap-2">
      {meetingData.links.map((link) => {
        const Icon = iconMap[link.icon];
        return (
          <a
            key={link.label}
            href={link.url}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <Icon size={12} />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
```

**Step 4: Verify the full Island variant**

Open: `http://localhost:3000/playground/granola-nub`
Expected:
- Pill with logo + waveform
- Hover → morphs wider, shows title + subtitle
- Click → morphs into card with carousel + links
- Mouse leave from any state → collapses back to pill
- Drag works in all states
- Carousel auto-advances, dots are clickable

**Step 5: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: implement Variant A (Dynamic Island) with 3-state morph"
```

---

### Task 6: Variant C — Ticker Strip

Build the Ticker variant: a full-width strip with scrolling text, 2 states, vertical-only drag snapping.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Build the TickerVariant component**

```tsx
function TickerVariant() {
  const [hovered, setHovered] = useState(false);
  const { controls, containerRef, nubRef, handleDragEnd } = useDragSnap("vertical");

  return (
    <div ref={containerRef} className="absolute inset-0">
      <motion.div
        ref={nubRef}
        layout
        className="absolute bottom-4 left-4 right-4 cursor-grab text-white active:cursor-grabbing"
        style={{
          ...GLASS_STYLE,
          borderRadius: 16,
          padding: hovered ? "16px 20px" : "10px 16px",
        }}
        animate={{
          ...controls,
          height: hovered ? 120 : 40,
        }}
        transition={SPRING_MORPH}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header row — always visible */}
        <motion.div layout className="flex items-center gap-3">
          <GranolaLogo size={22} />
          <Waveform size="small" />

          {/* Ticker or static title depending on state */}
          <div className="min-w-0 flex-1 overflow-hidden">
            {hovered ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium"
              >
                {meetingData.title}
                <span className="ml-2 text-white/50">
                  {meetingData.topic} · {meetingData.duration}
                </span>
              </motion.span>
            ) : (
              <div className="relative overflow-hidden whitespace-nowrap">
                <motion.span
                  className="inline-block text-sm text-white/70"
                  animate={{ x: ["0%", "-100%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {meetingData.title} — {meetingData.briefFull}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {meetingData.title} — {meetingData.briefFull}
                </motion.span>
              </div>
            )}
          </div>

          {/* Links — always visible */}
          <div className="flex shrink-0 gap-2">
            {meetingData.links.map((link) => {
              const Icon = { globe: Globe, linkedin: Linkedin }[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.url}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Expanded brief — visible on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={FADE}
              className="mt-3 text-sm leading-relaxed text-white/60"
            >
              {meetingData.briefFull}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

**Step 2: Wire it into the variant switch**

```tsx
{variant === "ticker" && <TickerVariant />}
```

**Step 3: Verify**

Open: `http://localhost:3000/playground/granola-nub`
Switch to "C: Ticker" tab.
Expected:
- Thin strip at bottom with logo, waveform, scrolling ticker text, link icons
- Hover → strip expands taller, ticker stops, full brief text appears static
- Mouse leave → collapses back
- Drag → snaps to top or bottom edge
- Link icons always clickable

**Step 4: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: implement Variant C (Ticker Strip) with scrolling text and drag"
```

---

### Task 7: Variant D — Hybrid Pill-Strip

Build the Hybrid: starts as a pill like A, stretches horizontally like C on hover, expands slightly taller on click.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Build the HybridVariant component**

```tsx
function HybridVariant() {
  const [state, setState] = useState<NubState>("default");
  const { controls, containerRef, nubRef, handleDragEnd } = useDragSnap("all");

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onClick={() => {
        if (state === "expanded") setState("default");
      }}
    >
      <motion.div
        ref={nubRef}
        layout
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab text-white active:cursor-grabbing"
        style={{
          ...GLASS_STYLE,
          borderRadius: state === "default" ? 24 : 20,
          padding: state === "expanded" ? "14px 20px" : "10px 16px",
          width: state === "default" ? 160 : 480,
          height: state === "default" ? 48 : state === "hover" ? 48 : 140,
        }}
        transition={SPRING_MORPH}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        animate={controls}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => {
          if (state === "default") setState("hover");
        }}
        onMouseLeave={() => {
          if (state === "hover" || state === "expanded") setState("default");
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (state === "hover") setState("expanded");
        }}
      >
        {/* Single inline row — all states */}
        <motion.div layout className="flex items-center gap-3">
          <GranolaLogo size={state === "default" ? 28 : 22} />
          <Waveform size={state === "default" ? "default" : "small"} />

          <AnimatePresence>
            {state !== "default" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
                className="min-w-0 flex-1 truncate text-sm"
              >
                <span className="font-medium">{meetingData.title}</span>
                <span className="ml-2 text-white/50">
                  {meetingData.topic} · {meetingData.duration}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Link icons — visible from hover onward */}
          <AnimatePresence>
            {state !== "default" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={FADE}
                className="flex shrink-0 gap-2"
              >
                {meetingData.links.map((link) => {
                  const Icon = { globe: Globe, linkedin: Linkedin }[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Brief text — expanded only */}
        <AnimatePresence>
          {state === "expanded" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ ...FADE, delay: 0.06 }}
              className="mt-3 text-sm leading-relaxed text-white/60"
            >
              {meetingData.briefFull}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

**Step 2: Wire it into the variant switch**

```tsx
{variant === "hybrid" && <HybridVariant />}
```

**Step 3: Verify**

Open: `http://localhost:3000/playground/granola-nub`
Switch to "D: Hybrid" tab.
Expected:
- Pill with logo + waveform (same as Island default)
- Hover → stretches horizontally to 480px strip, title + links appear inline
- Click → strip grows taller, brief text appears below
- Mouse leave → collapses to pill
- Drag + edge snap works

**Step 4: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: implement Variant D (Hybrid Pill-Strip) with horizontal morph"
```

---

### Task 8: Polish and visual refinement

Final pass: check all transitions look smooth, fix any layout jank, ensure drag doesn't conflict with click/hover states.

**Files:**
- Modify: `app/playground/granola-nub/GranolaNub.tsx`

**Step 1: Test all variant transitions**

Manually test each variant through all state transitions:
- Default → hover → default (mouse leave quickly)
- Default → hover → expanded → default (mouse leave)
- Drag during each state
- Rapid hover in/out (test spring interruption)
- Switch between tabs while a variant is expanded

**Step 2: Fix any issues found**

Common issues to watch for:
- `layout` prop causing jank on text elements → add `layout="position"` to text elements if they distort during morph
- Drag conflicting with click → add a drag distance threshold: only register click if drag distance < 3px
- Ticker text restarting animation on re-render → ensure the ticker `motion.span` has a stable `key`
- `AnimatePresence` children flickering → ensure each child has a unique `key`

**Step 3: Add a subtle label below the Nub area showing current state for debugging**

```tsx
{/* Debug state indicator — bottom center */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/30">
  {variant} · {/* pass state up or use a ref */}
</div>
```

**Step 4: Commit**

```bash
git add app/playground/granola-nub/GranolaNub.tsx
git commit -m "feat: polish transitions and fix edge cases"
```

---

### Task 9: Final build check

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors. The playground page is statically generated.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Fix any build/lint issues**

Common issues:
- Unused imports → remove them
- Missing `key` props → add them
- `any` types → add proper types
- `useEffect` dependency warnings → fix dependency arrays

**Step 4: Commit any fixes**

```bash
git add app/playground/granola-nub/
git commit -m "fix: resolve build and lint issues"
```

---

## Task Summary

| Task | Description | Est. |
|------|-------------|------|
| 1 | Scaffold page, mock data, variant tabs | Small |
| 2 | Waveform SVG + logo placeholder | Small |
| 3 | Shared glass styles + spring constants | Tiny |
| 4 | Drag-and-snap hook | Medium |
| 5 | Variant A: Dynamic Island (3-state) | Large |
| 6 | Variant C: Ticker Strip (2-state) | Medium |
| 7 | Variant D: Hybrid Pill-Strip (3-state) | Medium |
| 8 | Polish transitions + edge cases | Medium |
| 9 | Build + lint verification | Small |

**Total tasks:** 9
**Dependencies:** Tasks 1-3 must be done first. Tasks 5-7 are independent of each other (can be built in any order). Task 8 requires 5-7 complete. Task 9 is last.
