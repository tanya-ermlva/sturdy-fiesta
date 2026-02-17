"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { meetingData } from "./mock-data";

type NubState = "collapsed" | "hover" | "expanded";

const COLLAPSED = { width: 60, height: 110, borderRadius: 40 };
const HOVER = { width: 360, height: 150, borderRadius: 20 };
const EXPANDED_WIDTH = 360;
const EXPANDED_BORDER_RADIUS = 20;

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export default function GranolaNub() {
  const [state, setState] = useState<NubState>("collapsed");
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isOpen = state !== "collapsed";

  // Measure the full content height for expanded state
  useEffect(() => {
    if (state === "expanded" && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [state]);

  const handleMouseEnter = () => {
    if (state === "collapsed") setState("hover");
  };

  const handleMouseLeave = () => {
    setState("collapsed");
  };

  const handleClick = () => {
    if (state === "hover") setState("expanded");
    else if (state === "expanded") setState("hover");
  };

  const dims =
    state === "collapsed"
      ? COLLAPSED
      : state === "hover"
        ? HOVER
        : {
            width: EXPANDED_WIDTH,
            height: Math.max(HOVER.height, contentHeight + 56), // 56 = header height
            borderRadius: EXPANDED_BORDER_RADIUS,
          };

  return (
    <div className="flex h-screen w-screen items-center justify-end bg-[#1a1a1a] pr-12">
      <motion.div
        className="relative cursor-pointer overflow-hidden bg-[#0d0d0d]"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        animate={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.borderRadius,
        }}
        transition={spring}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Collapsed layout */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Logo size="lg" />
              <Waveform size="lg" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded card layout */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header row */}
              <div className="flex shrink-0 items-center gap-3 px-4 pt-4 pb-2">
                <Logo size="sm" />
                <div className="min-w-0 flex-1">
                  <span className="truncate text-[15px] text-white/40">
                    {meetingData.title}
                  </span>
                  <span className="ml-2 text-[15px] text-white/25">
                    {meetingData.duration}
                  </span>
                </div>
                <Waveform size="sm" />
              </div>

              {/* Body */}
              <div className="relative min-h-0 flex-1">
                <div
                  ref={contentRef}
                  className="h-full overflow-y-auto px-4 pb-4"
                  style={
                    state === "hover"
                      ? {
                          maskImage:
                            "linear-gradient(to bottom, black 60%, transparent 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, black 60%, transparent 100%)",
                        }
                      : undefined
                  }
                >
                  <div className="space-y-4 text-[15px] leading-relaxed text-white/70">
                    {meetingData.briefParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {/* Links — only in expanded state */}
                  {state === "expanded" && (
                    <motion.div
                      className="mt-5 flex gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {meetingData.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
                        >
                          <LinkIcon type={link.icon} />
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Logo({ size }: { size: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-9 w-9 text-lg" : "h-7 w-7 text-sm";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-medium text-white/80 ${dim}`}
    >
      G
    </div>
  );
}

const BAR_COLORS = [
  "#4a9e5c",
  "#5aad6a",
  "#7ebb5a",
  "#b8cc44",
  "#d4a83a",
  "#c97a32",
];

function Waveform({ size }: { size: "sm" | "lg" }) {
  const bars = [0.35, 0.55, 0.3, 0.5, 0.6, 0.4];
  const w = size === "lg" ? 30 : 24;
  const h = size === "lg" ? 24 : 18;
  const gap = size === "lg" ? 5 : 4;
  const barW = size === "lg" ? 3 : 2.5;

  return (
    <svg width={w} height={h} className="shrink-0">
      {bars.map((duration, i) => (
        <motion.rect
          key={i}
          x={i * gap}
          width={barW}
          height={h}
          rx={barW / 2}
          fill={BAR_COLORS[i]}
          style={{ originY: "50%" }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </svg>
  );
}

function LinkIcon({ type }: { type: "linkedin" | "globe" }) {
  if (type === "linkedin") {
    return (
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
