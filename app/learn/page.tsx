import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learning Playgrounds",
  robots: "noindex",
};

const playgrounds = [
  {
    category: "CSS",
    items: [
      {
        title: "Gradients",
        description: "Linear, radial, conic, repeating, composition, and masking.",
        href: "/playground",
        tag: "interactive",
      },
      {
        title: "Positioning",
        description: "Static, relative, absolute, fixed, sticky, z-index, and real-world patterns.",
        href: "/position-playground",
        tag: "interactive",
      },
    ],
  },
  {
    category: "JavaScript & React",
    items: [
      {
        title: "Array methods",
        description: "map, filter, find, some, every, reduce — JS syntax to React rendering.",
        href: "/array-playground",
        tag: "console + visual",
      },
      {
        title: "CSS Grid + React components",
        description: "Raw grid → component → props. How bento grids are built from scratch.",
        href: "/grid-playground",
        tag: "step by step",
      },
      {
        title: "Flexbox",
        description: "flex-shrink, flex-grow, flex-basis, the flex shorthand, and the min-width gotcha.",
        href: "/flex-playground",
        tag: "interactive",
      },
    ],
  },
  {
    category: "Design prototypes",
    items: [
      {
        title: "Granola Nub",
        description: "Dynamic Island-style interaction design exploration.",
        href: "/playground/granola-nub",
        tag: "prototype",
      },
    ],
  },
];

const allItems = playgrounds.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.category }))
);

export default function LearnIndex() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-foreground-strong text-2xl font-bold mb-2">Playgrounds</h1>
        <p className="text-foreground-muted text-sm">
          Personal learning pages. Not linked from the portfolio.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between bg-surface-subtle hover:bg-surface-default border border-border-muted rounded-2xl px-5 py-4 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground-default">{item.title}</span>
                <span className="text-foreground-subtle text-xs font-mono">{item.tag}</span>
              </div>
              <p className="text-foreground-muted text-sm mt-0.5">{item.description}</p>
            </div>
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <span className="text-foreground-subtle group-hover:text-accent transition-colors">→</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
