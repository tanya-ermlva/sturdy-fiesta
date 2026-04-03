# Memo Page — Card Stack Redesign

**Date**: 2026-02-21
**Status**: Approved, ready for implementation

## Problem

The current `/memo` list format isn't ADHD-friendly — seeing all content at once is overwhelming. Need a format that shows one concept at a time.

## Solution

Swipeable card stack on mobile, filtered grid on desktop. Same data, different presentation.

## Architecture

- `app/memo/page.tsx` — server component, passes `learningNotes` to client component
- `app/memo/MemoCardStack.tsx` — new `'use client'` component, all interaction logic
- `app/data/learning-notes.ts` — unchanged

## Data

`learningNotes` flattened at render time into a flat array:

```ts
{ category, subcategory, title, explanation }[]
```

Filter tabs derived from unique categories.

## Mobile (< md breakpoint)

- Full-screen card, one at a time
- Framer Motion `drag="x"` with `dragDirectionLock`
- `onDragEnd` velocity threshold → advance or retreat
- `AnimatePresence` for enter/exit animations (card flies off, next slides in)
- Card: title + explanation (scrollable) + progress counter `X / total`
- Long content: `overflow-y: auto` within card; `dragDirectionLock` prevents gesture conflict

## Desktop (≥ md breakpoint)

- Filter tabs: "All" + one per category (CSS, Motion, etc.)
- Responsive grid: `grid-cols-2 lg:grid-cols-3`
- Cards are static (no drag)
- Counter shows position within filtered set

## Card Anatomy

```
┌─────────────────────┐
│ Category · Sub    3/24 │
│                     │
│  Title              │
│                     │
│  Explanation text   │
│  (scrollable if     │
│  overflows)         │
│                     │
└─────────────────────┘
```

## Out of Scope (this phase)

- Imagery / illustrations on cards
- Keyboard navigation on desktop
- Swipe animations on desktop
