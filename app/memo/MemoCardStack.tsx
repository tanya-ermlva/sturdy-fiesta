"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { LearningCategory, flattenNotes } from "../data/learning-notes";
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

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
    const { velocity, offset } = info;
    if (velocity.x < -SWIPE_VELOCITY_THRESHOLD || offset.x < -80) {
      advance();
    } else if (velocity.x > SWIPE_VELOCITY_THRESHOLD || offset.x > 80) {
      retreat();
    }
  }

  const card = cards[index];

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] text-foreground-muted text-sm">
        No notes yet.
      </div>
    );
  }

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
