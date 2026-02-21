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

export function MemoCardStack({ notes }: MemoCardStackProps) {
  const allCards = flattenNotes(notes);
  const categories = notes.map((n) => n.category);
  const desktopCategories = ["All", ...categories];

  // Mobile and desktop track their own active category independently
  const [mobileCategory, setMobileCategory] = useState(categories[0] ?? "");
  const [desktopCategory, setDesktopCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const mobileCards = allCards.filter((c) => c.category === mobileCategory);
  const desktopCards =
    desktopCategory === "All"
      ? allCards
      : allCards.filter((c) => c.category === desktopCategory);

  function advance() {
    if (index < mobileCards.length - 1) {
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

  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    if (clientX - left < width / 2) retreat();
    else advance();
  }

  function selectMobileCategory(cat: string) {
    setMobileCategory(cat);
    setIndex(0);
    setDirection(1);
  }

  const mobileCard = mobileCards[index];

  return (
    <>
      {/* ── Mobile: Stories-style ── */}
      <div className="md:hidden flex flex-col h-[100dvh]">

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-4 pb-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectMobileCategory(cat)}
              aria-pressed={mobileCategory === cat}
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs transition-colors",
                mobileCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-surface text-foreground-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Segmented progress bar */}
        <div className="flex gap-1 px-4 py-2 shrink-0">
          {mobileCards.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors duration-300",
                i <= index ? "bg-foreground" : "bg-foreground/20"
              )}
            />
          ))}
        </div>

        {/* Card area — tap left/right to navigate, scroll vertically to read */}
        {mobileCards.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-foreground-muted text-sm">
            No notes yet.
          </div>
        ) : (
          <div
            className="relative flex-1 overflow-hidden px-4 pb-6"
            onClick={handleTap}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${mobileCategory}-${index}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-x-4 inset-y-0 bottom-6"
              >
                <MemoCard
                  card={mobileCard}
                  index={index}
                  total={mobileCards.length}
                  className="h-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Desktop: filter tabs + grid ── */}
      <div className="hidden md:block">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {desktopCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setDesktopCategory(cat)}
              aria-pressed={desktopCategory === cat}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm transition-colors",
                desktopCategory === cat
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
          {desktopCards.map((card, i) => (
            <div key={`${card.category}-${card.title}`} className="h-64">
              <MemoCard card={card} index={i} total={desktopCards.length} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
