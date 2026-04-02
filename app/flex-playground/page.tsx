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
          flex-shrink &amp; friends
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
