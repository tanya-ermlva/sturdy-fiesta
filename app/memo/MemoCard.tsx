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
