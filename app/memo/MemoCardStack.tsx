"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
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

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
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

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] text-foreground-muted text-sm">
        No notes yet.
      </div>
    );
  }

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
            <MemoCard card={card} index={index} total={filtered.length} className="h-full" />
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
