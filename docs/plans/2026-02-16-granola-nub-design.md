# Granola Nub — Interaction Design Exploration

## Overview

A Dynamic Island-inspired floating UI element ("Nub") for Granola. The Nub appears when the Granola window is backgrounded during an active transcription, giving the user ambient meeting context without switching windows. This is an **exploration prototype** built as a playground page in the portfolio project.

## Context

- **When it appears:** User closes/backgrounds the Granola window via macOS traffic lights while a meeting is being transcribed
- **When it disappears:** User foregrounds the Granola window again
- **Purpose:** Ambient awareness of active transcription + quick access to pre-meeting context (brief, links)

## Three Variants

We're building three variants on a single playground page to compare interaction models side by side.

### Variant A: Dynamic Island

A compact pill that morphs through 3 progressive-disclosure states.

**States:**

| State | Trigger | Dimensions | Content |
|-------|---------|-----------|---------|
| Default | Transcribing, idle | 160x48 pill | Granola logo + waveform |
| Hover | mouseEnter | 320x56 pill | Logo + compressed waveform + title + subtitle |
| Expanded | Click | 360x280 card | Header row + swipeable brief carousel + link pills |

**Brief display:** 3-slide carousel (~65 words per slide), swipeable left/right with dot indicators. Auto-advances every 6 seconds, pauses on interaction.

**Dismissal:** mouseLeave from hover returns to default. mouseLeave from expanded returns to default. Click outside returns to default.

### Variant C: Ticker Strip

A thin horizontal strip that docks to screen edges. Information is delivered passively via a scrolling ticker.

**States:**

| State | Trigger | Dimensions | Content |
|-------|---------|-----------|---------|
| Default | Transcribing, idle | Viewport-width x 40px | Logo + waveform + scrolling ticker text + link icons |
| Hover | mouseEnter | Same width x 120px | Logo + waveform + static full brief text + links |

**Brief display:** Scrolls continuously as a ticker in default state. On hover, ticker stops and full brief is displayed as static text.

**Links:** Always visible as icons on the right side, even in default state. Zero interaction cost.

**Drag behavior:** Snaps to top or bottom edge only (not left/right). Can slide horizontally along the docked edge.

### Variant D: Hybrid Pill-Strip

Combines A's compact default state with C's horizontal information layout. The pill stretches into a strip on hover instead of expanding into a tall card.

**States:**

| State | Trigger | Dimensions | Content |
|-------|---------|-----------|---------|
| Default | Transcribing, idle | 160x48 pill | Granola logo + waveform |
| Hover | mouseEnter | 480x48 strip | Logo + compressed waveform + title + duration + link icons (all inline) |
| Expanded | Click | 480x140 strip | Same header row + plain text brief below |

**Brief display:** Plain text block, no carousel. The strip width provides enough room.

**Links:** Visible from hover state onward (one step, not two).

## Shared Design Principles

### Element Continuity

Every element that exists in State 1 persists across all states. Nothing teleports in or out. Elements reflow, resize, and reposition — they never disappear and reappear. This is achieved with Framer Motion's `layoutId` prop.

| Element | State 1 | State 2 | State 3 |
|---------|---------|---------|---------|
| Logo | 28px, left-aligned | 24px, left-aligned | 22px, top-left |
| Waveform | Full size, right of logo | Compressed, between logo and text | Small, next to logo in header |
| Title | Hidden (opacity 0) | Visible, right of waveform | Same position |
| Subtitle | Hidden (opacity 0) | Below title | Same position |

New elements (brief, links) fade in alongside persistent elements.

### Animation Physics

All morphing transitions use spring physics, never duration-based easing. Springs are interruptible — if a user hovers then moves away mid-transition, it reverses naturally.

```
Morph transitions (state changes):  stiffness: 400, damping: 30
Drag release (edge snapping):       stiffness: 300, damping: 28
Content fade (text in/out):         duration: 0.15s, ease-out
```

### Transition Staggering

Content appears with staggered timing during morphs. The shape leads, content follows:

- 0ms: Container begins morphing (spring)
- 50ms: Waveform begins compressing/repositioning
- 80ms: Title fades in / repositions
- 120ms: Secondary content (subtitle, links) fades in

### Waveform Visualization

Decorative animation simulating transcription activity (not real audio):

- 5-7 vertical SVG bars (`motion.rect`)
- Each bar has randomized `scaleY` on a continuous loop (300-600ms durations, staggered)
- Bars compress and shrink when transitioning to hover/expanded states
- Never disappears — always present, just smaller

### Drag & Edge Snapping

All variants are draggable with edge-snapping behavior:

- **A and D:** Free drag, snaps to nearest screen edge (all 4 edges). 16px padding from edge.
- **C:** Snaps to top or bottom only. Slides horizontally along docked edge.
- Drag uses `dragMomentum={false}`, `dragElastic={0.1}`
- On drag end: calculate nearest valid edge, animate to snapped position with spring

### Visual Style

```css
background: rgba(0, 0, 0, 0.85);
backdrop-filter: blur(40px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
color: white;
```

Pill states: `border-radius: 24px`. Card states: `border-radius: 20px`.

## Page Design

### Layout

Variant picker tabs at top of the page ("A: Island", "C: Ticker", "D: Hybrid"). One Nub visible at a time. Full viewport area for dragging. macOS-style gradient background to show off the backdrop blur.

### Background

Subtle multi-color gradient simulating a macOS desktop wallpaper. Provides visual depth for the blur effect to work against.

## File Structure

```
app/playground/granola-nub/
  page.tsx          — Server component, page wrapper, metadata
  GranolaNub.tsx    — Client component, all variant logic
  mock-data.ts      — Shared meeting data
```

Single client component file. Variants rendered conditionally by active tab. Subcomponents (Waveform, BriefCarousel, LinkPills) defined within GranolaNub.tsx, not split into separate files.

## Mock Data

```ts
const meetingData = {
  title: "Meeting with Sarah Chen",
  topic: "Product Design Review",
  duration: "12m",
  briefSlides: [
    "Sarah is Head of Design at Linear. She previously led product design at Figma for 3 years, focusing on multiplayer collaboration features.",
    "This is a follow-up to your initial intro call last Tuesday. She mentioned interest in Granola's approach to async meeting summaries.",
    "Key talking points: her team's pain points with meeting notes, Linear's current tooling, and potential pilot program for Q2."
  ],
  briefFull: "Sarah is Head of Design at Linear, previously leading product design at Figma for 3 years. This is a follow-up to last Tuesday's intro call — she's interested in Granola's async meeting summaries. Key topics: her team's pain points with notes, Linear's current tooling, and a potential Q2 pilot program.",
  links: [
    { label: "sarah.design", url: "#", icon: "globe" },
    { label: "LinkedIn", url: "#", icon: "linkedin" }
  ]
}
```

## Tech Stack

- **Animation:** `motion` (Framer Motion) — layout animations, drag, springs, AnimatePresence
- **Icons:** `lucide-react`
- **Styling:** Tailwind CSS + inline styles for dynamic values
- **State:** `useState` for active variant tab + nub state per variant

## Principles to Learn

This prototype teaches:

1. **Layout animations** — Framer Motion's `layout` and `layoutId` for morphing
2. **Spring physics** — why springs feel better than easings, how stiffness/damping work
3. **Progressive disclosure** — revealing information in layers based on intent signals
4. **Drag and snap** — gesture handling, coordinate math, spring-to-target
5. **Element continuity** — persistent elements that reflow vs. elements that enter/exit
