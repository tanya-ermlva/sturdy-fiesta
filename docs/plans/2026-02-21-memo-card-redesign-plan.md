# Memo Card Stack Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the `/memo` scrollable list with a swipeable full-screen card stack on mobile and a filtered grid on desktop.

**Architecture:** Add a `FlatCard` type and flatten utility to the data layer. Build a single `MemoCardStack` client component that renders a Framer Motion drag stack on mobile and a category-filtered grid on desktop. Simplify `page.tsx` to a thin wrapper that passes data down.

**Tech Stack:** Next.js App Router, React 19, Framer Motion (`motion` package), Tailwind CSS 4

---

## Notes for the implementer

- No test framework is configured — verification steps use the dev server (`npm run dev`) and browser
- `motion` is already installed — import from `"motion/react"`
- Use `cn()` from `lib/utils.ts` for conditional class merging
- CSS custom properties for colours: `--foreground`, `--surface`, `--border-muted`, etc. — see `app/globals.css`
- Illustrations (`note.illustration`) are **out of scope** for this phase — ignore them

---

## Task 1: Add `FlatCard` type and flatten utility

**Files:**
- Modify: `app/data/learning-notes.ts`

**Step 1: Add `FlatCard` interface after `LearningCategory`**

```ts
export interface FlatCard {
  category: string;
  subcategory: string;
  title: string;
  explanation: string;
}
```

**Step 2: Add flatten function at the bottom of the file**

```ts
export function flattenNotes(notes: LearningCategory[]): FlatCard[] {
  return notes.flatMap((cat) =>
    cat.subcategories.flatMap((sub) =>
      sub.notes.map((note) => ({
        category: cat.category,
        subcategory: sub.name,
        title: note.title,
        explanation: note.explanation,
      }))
    )
  );
}
```

**Step 3: Verify**

Run `npm run build` — should compile with no type errors.

**Step 4: Commit**

```bash
git add app/data/learning-notes.ts
git commit -m "feat: add FlatCard type and flattenNotes utility"
```

---

## Task 2: Build `MemoCard` — Dia-inspired card UI

**Visual reference:** diabrowser.com/skills — large image header with overlaid label, clean editorial body below.

**Our translation (no imagery yet):** Coloured gradient header per category with label + counter overlaid. Clean white/surface body with title and explanation. Rounded card, subtle shadow. Future imagery slots into the header area naturally.

**Category colour map** (adjust to taste):
- CSS → indigo/violet gradient
- Motion → emerald/teal gradient
- Tailwind → sky/cyan gradient
- Default → slate/zinc gradient

**Files:**
- Create: `app/memo/MemoCard.tsx`

**Step 1: Create the component**

```tsx
import { FlatCard } from "../data/learning-notes";
import { cn } from "@/lib/utils";

interface MemoCardProps {
  card: FlatCard;
  index: number;
  total: number;
  className?: string;
}

// Category → gradient class. Add entries as new categories appear.
const categoryGradients: Record<string, string> = {
  CSS: "from-violet-900 via-indigo-800 to-indigo-900",
  Motion: "from-emerald-900 via-teal-800 to-teal-900",
  Tailwind: "from-sky-900 via-cyan-800 to-cyan-900",
};

function getGradient(category: string) {
  return categoryGradients[category] ?? "from-zinc-800 via-slate-700 to-slate-800";
}

export function MemoCard({ card, index, total, className }: MemoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl overflow-hidden shadow-md h-full",
        "bg-surface",
        className
      )}
    >
      {/* ── Header: coloured gradient, label + counter overlaid ── */}
      <div
        className={cn(
          "relative shrink-0 h-36 bg-gradient-to-br",
          getGradient(card.category)
        )}
      >
        {/* Category label — bottom-left, like Dia's slash command */}
        <span className="absolute bottom-3 left-4 text-white/80 text-xs font-mono tracking-wide">
          {card.category} / {card.subcategory}
        </span>
        {/* Progress counter — top-right */}
        <span className="absolute top-3 right-4 text-white/50 text-xs tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      {/* ── Body: title + explanation ── */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 py-5 gap-3">
        <h2 className="text-lg text-foreground-strong leading-snug shrink-0">
          {card.title}
        </h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          {card.explanation}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

Run `npm run dev`. The component isn't wired up yet — no visual check needed. Just confirm no import errors by temporarily importing it anywhere, then revert.

**Step 3: Commit**

```bash
git add app/memo/MemoCard.tsx
git commit -m "feat: add MemoCard static card component"
```

---

## Task 3: Build `MemoCardStack` — mobile swipe stack

**Files:**
- Create: `app/memo/MemoCardStack.tsx`

**Step 1: Create the file with swipe stack logic**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FlatCard, LearningCategory, flattenNotes } from "../data/learning-notes";
import { MemoCard } from "./MemoCard";

interface MemoCardStackProps {
  notes: LearningCategory[];
}

// Direction: 1 = swiping left (advance), -1 = swiping right (retreat)
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const SWIPE_VELOCITY_THRESHOLD = 300;

export function MemoCardStack({ notes }: MemoCardStackProps) {
  const cards = flattenNotes(notes);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function advance() {
    if (index < cards.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }

  function retreat() {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }

  function handleDragEnd(_: unknown, info: { velocity: { x: number }; offset: { x: number } }) {
    const { velocity, offset } = info;
    if (velocity.x < -SWIPE_VELOCITY_THRESHOLD || offset.x < -80) {
      advance();
    } else if (velocity.x > SWIPE_VELOCITY_THRESHOLD || offset.x > 80) {
      retreat();
    }
  }

  const card = cards[index];

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <MemoCard card={card} index={index} total={cards.length} className="h-full" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: Update `page.tsx` to use `MemoCardStack`**

Replace the entire content of `app/memo/page.tsx` with:

```tsx
import { learningNotes } from "../data/learning-notes";
import { MemoCardStack } from "./MemoCardStack";

export const metadata = {
  title: "Learning Memo",
  robots: "noindex",
};

export default function MemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground-default px-4 py-8">
      <MemoCardStack notes={learningNotes} />
    </main>
  );
}
```

**Step 3: Verify in browser on mobile viewport**

Run `npm run dev`. Open `http://localhost:3000/memo`. In DevTools, toggle mobile viewport (e.g. iPhone 14). Confirm:
- Single card visible, centred
- Drag left → next card slides in from right
- Drag right → previous card slides in from left
- Counter updates correctly
- Long explanation text scrolls within the card without triggering a swipe

**Step 4: Commit**

```bash
git add app/memo/MemoCardStack.tsx app/memo/page.tsx
git commit -m "feat: add swipeable card stack for memo on mobile"
```

---

## Task 4: Add desktop grid + filter tabs to `MemoCardStack`

**Files:**
- Modify: `app/memo/MemoCardStack.tsx`

**Step 1: Replace the file contents with the responsive version**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LearningCategory, flattenNotes } from "../data/learning-notes";
import { MemoCard } from "./MemoCard";
import { cn } from "@/lib/utils";

interface MemoCardStackProps {
  notes: LearningCategory[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const SWIPE_VELOCITY_THRESHOLD = 300;

export function MemoCardStack({ notes }: MemoCardStackProps) {
  const allCards = flattenNotes(notes);
  const categories = ["All", ...notes.map((n) => n.category)];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? allCards
      : allCards.filter((c) => c.category === activeCategory);

  function advance() {
    if (index < filtered.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }

  function retreat() {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }

  function handleDragEnd(_: unknown, info: { velocity: { x: number }; offset: { x: number } }) {
    const { velocity, offset } = info;
    if (velocity.x < -SWIPE_VELOCITY_THRESHOLD || offset.x < -80) advance();
    else if (velocity.x > SWIPE_VELOCITY_THRESHOLD || offset.x > 80) retreat();
  }

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    setIndex(0);
    setDirection(1);
  }

  const card = filtered[index];

  return (
    <>
      {/* ── Mobile: full-screen swipe stack ── */}
      <div className="md:hidden relative w-full h-[calc(100dvh-4rem)] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={`${activeCategory}-${index}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {card && (
              <MemoCard card={card} index={index} total={filtered.length} className="h-full" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Desktop: filter tabs + grid ── */}
      <div className="hidden md:block">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm transition-colors",
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-surface text-foreground-muted hover:text-foreground-strong"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card, i) => (
            <div key={`${card.category}-${card.title}`} className="h-64">
              <MemoCard card={card} index={i} total={filtered.length} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

**Step 2: Verify in browser on desktop viewport**

Run `npm run dev`. Open `http://localhost:3000/memo` at full desktop width. Confirm:
- Filter tabs visible at top
- Cards render in a 2-column grid (3 columns on wide screens)
- Clicking a category tab filters the grid
- Switching tabs resets to first card on mobile

Switch to mobile viewport and confirm:
- Grid is hidden, swipe stack is visible
- Swiping still works correctly

**Step 3: Commit**

```bash
git add app/memo/MemoCardStack.tsx
git commit -m "feat: add desktop filter tabs and grid layout to memo"
```

---

## Done

The memo page now has:
- Mobile: full-screen swipe stack with Framer Motion drag
- Desktop: category-filtered card grid
- Shared: `MemoCard` with title, category tag, progress counter, scrollable body
- Data layer: `FlatCard` type + `flattenNotes()` utility
