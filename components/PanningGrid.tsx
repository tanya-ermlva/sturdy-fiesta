"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import mediaItems from "@/lib/mediaItems";
import GridItem from "./GridItem";

const CANVAS_W = 2480;
const CANVAS_H = 1680;
const COLS = 6;
const ROWS = 4;
const SPRING = { stiffness: 60, damping: 20 };
const DRAG_THRESHOLD = 4;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export default function PanningGrid() {
  const [items, setItems] = useState(mediaItems);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  // Track drag state in refs — not state, so no re-renders during drag
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setItems(shuffle(mediaItems));
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      // Prevent browser's native image/text drag
      e.preventDefault();
      isDragging.current = true;
      didDrag.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { x: rawX.get(), y: rawY.get() };
    }

    function onPointerMove(e: PointerEvent) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (isDragging.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        // Only commit to drag once past threshold — avoids jitter on clicks
        if (!didDrag.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        didDrag.current = true;

        rawX.set(clamp(panStart.current.x + dx, -(CANVAS_W - vw), 0));
        rawY.set(clamp(panStart.current.y + dy, -(CANVAS_H - vh), 0));
      } else {
        // Parallax: mouse position maps linearly across the full travel range
        rawX.set(-(e.clientX / vw) * (CANVAS_W - vw));
        rawY.set(-(e.clientY / vh) * (CANVAS_H - vh));
      }
    }

    function onPointerUp() {
      isDragging.current = false;
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [rawX, rawY]);

  return (
    <motion.section
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: CANVAS_W,
        height: CANVAS_H,
        x,
        y,
        cursor: "grab",
        display: "grid",
        padding: 80,
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: 80,
        alignItems: "start",
        touchAction: "none",
        userSelect: "none",
        willChange: "transform",
      }}
    >
      {items.map((item) => (
        <GridItem key={item.id} item={item} />
      ))}
    </motion.section>
  );
}
