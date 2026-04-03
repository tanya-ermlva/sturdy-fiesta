"use client";

import { useEffect, useState } from "react";

// ─── shared data ──────────────────────────────────────────────────────────────
// One dataset used across every example so you can compare methods directly.

const projects = [
  { id: 1, title: "Granola redesign",  type: "product",  done: true,  hours: 40 },
  { id: 2, title: "Portfolio site",    type: "personal", done: true,  hours: 20 },
  { id: 3, title: "LeadDay app",       type: "personal", done: false, hours: 5  },
  { id: 4, title: "Design system",     type: "product",  done: false, hours: 12 },
];

// ─── syntax reference ─────────────────────────────────────────────────────────
// Before the methods — understand arrow function forms.
// All four of these do the exact same thing.

// Form 1: full body, explicit return   ← most readable when learning
// (item) => { return item.title }

// Form 2: implicit return              ← no {} means "return this expression"
// (item) => item.title

// Form 3: implicit return, no parens on single param
// item => item.title

// Form 4: returning an object — needs () so JS doesn't think {} is a block
// (item) => ({ id: item.id, title: item.title })

// ─── shared ui primitives ─────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return <h2 className="text-foreground-muted text-sm mb-4 font-mono">{label}</h2>;
}

function Card({ title, subtitle, tag, faded }: {
  title: string;
  subtitle?: string;
  tag?: string;
  faded?: boolean;
}) {
  return (
    <div className={`bg-surface-default border border-border-default rounded-2xl p-5 flex flex-col gap-1 transition-opacity ${faded ? "opacity-30" : "opacity-100"}`}>
      {tag && <span className="text-xs text-foreground-subtle font-mono">{tag}</span>}
      <h3 className="text-foreground-strong font-bold">{title}</h3>
      {subtitle && <p className="text-foreground-muted text-sm">{subtitle}</p>}
    </div>
  );
}

function ConsoleHint({ text }: { text: string }) {
  return (
    <p className="text-foreground-subtle text-xs font-mono mt-3">
      ↳ console: {text}
    </p>
  );
}

// ─── 1. .map() ────────────────────────────────────────────────────────────────

function MapDemo() {
  useEffect(() => {
    console.group("1 ─ .map()")

    // JS: transform each object into just its title string
    // (project) is each item as the loop runs
    // => project.title means "return the title from this project"
    const titles = projects.map((project) => project.title);
    console.log("titles:", titles);

    // JS: transform into a new object with different shape
    // () around {} because without them JS thinks {} is a block of code
    const summary = projects.map((project) => ({
      name: project.title,
      finished: project.done,
    }));
    console.log("summary objects:", summary);

    console.groupEnd();
  }, []);

  return (
    <section>
      <SectionHeader label=".map() — transform every item, same length in → same length out" />

      {/* syntax annotation */}
      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects.map( (project) => project.title )
//            └────────┘    └─────────────┘
//            each item     what to return
//            one at a time from each item`}</pre>

      {/* React: .map() renders a component per item */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {projects.map((project) => (
          // key= is required — React uses it to track each item in the list
          <Card
            key={project.id}
            title={project.title}
            tag={project.type}
          />
        ))}
      </div>
      <ConsoleHint text="open console to see .map() on plain data" />
    </section>
  );
}

// ─── 2. .filter() ─────────────────────────────────────────────────────────────

function FilterDemo() {
  const [activeType, setActiveType] = useState<"all" | "product" | "personal">("all");

  useEffect(() => {
    console.group("2 ─ .filter()")

    // The function you pass must return true (keep) or false (drop)
    const personal = projects.filter((project) => project.type === "personal");
    console.log("personal only:", personal);

    const done = projects.filter((project) => project.done === true);
    console.log("done:", done);

    // Shorter: project.done is already true/false so === true is redundant
    const doneShort = projects.filter((project) => project.done);
    console.log("done (short):", doneShort);

    // ! means NOT — keep items where done is false
    const todo = projects.filter((project) => !project.done);
    console.log("not done:", todo);

    console.groupEnd();
  }, []);

  const visible =
    activeType === "all"
      ? projects
      : projects.filter((p) => p.type === activeType);

  return (
    <section>
      <SectionHeader label=".filter() — keep items that pass a test, returns shorter array" />

      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects.filter( (project) => project.type === "personal" )
//               └────────┘    └───────────────────────────┘
//               each item     test: true = keep, false = drop`}</pre>

      {/* interactive: filter by type */}
      <div className="flex gap-2 mb-4">
        {(["all", "product", "personal"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
              activeType === type
                ? "bg-accent text-white"
                : "bg-surface-strong text-foreground-muted"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            title={project.title}
            tag={project.type}
            // faded instead of removed — so you can see what filter keeps/drops
            faded={activeType !== "all" && project.type !== activeType}
          />
        ))}
      </div>
      <ConsoleHint text="open console to see .filter() on plain data" />
    </section>
  );
}

// ─── 3. chaining .filter().map() ──────────────────────────────────────────────

function ChainDemo() {
  useEffect(() => {
    console.group("3 ─ chaining")

    // Chain: first filter, then map the result
    // Read left to right: start with projects → keep personal → get titles
    const personalTitles = projects
      .filter((p) => p.type === "personal")  // keep personal → 2 items
      .map((p) => p.title);                  // get title of each → 2 strings

    console.log("personal titles:", personalTitles);

    console.groupEnd();
  }, []);

  return (
    <section>
      <SectionHeader label=".filter().map() — chain them: filter first, then transform" />

      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects
  .filter((p) => p.type === "personal")  // step 1: narrow down
  .map((p) => <Card title={p.title} />)  // step 2: render each`}</pre>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {projects
          .filter((p) => p.type === "personal")
          .map((p) => (
            <Card key={p.id} title={p.title} tag="personal only" />
          ))}
      </div>
    </section>
  );
}

// ─── 4. .find() ───────────────────────────────────────────────────────────────

function FindDemo() {
  useEffect(() => {
    console.group("4 ─ .find()")

    // .find() returns the ITEM itself (not an array)
    // stops at the first match
    const portfolio = projects.find((p) => p.title === "Portfolio site");
    console.log("found item:", portfolio);
    console.log("just the title:", portfolio?.title);  // ?. = "if it exists"

    // Returns undefined if nothing matches
    const missing = projects.find((p) => p.title === "Nonexistent");
    console.log("not found:", missing);  // undefined

    console.groupEnd();
  }, []);

  const found = projects.find((p) => p.type === "personal" && p.done);

  return (
    <section>
      <SectionHeader label='.find() — returns the first match as an item, not an array' />

      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects.find( (p) => p.id === 2 )
// returns the object itself: { id:2, title:"Portfolio"... }
// NOT an array — just one item (or undefined if no match)`}</pre>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {found && (
          <Card
            title={found.title}
            subtitle={`First personal+done project`}
            tag="found"
          />
        )}
      </div>
      <ConsoleHint text="open console to see .find() return value" />
    </section>
  );
}

// ─── 5. .some() and .every() ──────────────────────────────────────────────────

function SomeEveryDemo() {
  useEffect(() => {
    console.group("5 ─ .some() and .every()")

    // .some() → true if AT LEAST ONE item passes
    const hasUnfinished = projects.some((p) => !p.done);
    console.log("has unfinished?", hasUnfinished);  // true

    // .every() → true only if ALL items pass
    const allDone = projects.every((p) => p.done);
    console.log("all done?", allDone);  // false

    const allHaveId = projects.every((p) => p.id !== undefined);
    console.log("all have id?", allHaveId);  // true

    console.groupEnd();
  }, []);

  const hasUnfinished = projects.some((p) => !p.done);
  const allDone = projects.every((p) => p.done);

  return (
    <section>
      <SectionHeader label=".some() / .every() — ask a yes/no question about the array" />

      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects.some((p) => !p.done)   // true if ≥1 unfinished
projects.every((p) => p.done)   // true only if ALL done`}</pre>

      <div className="grid grid-cols-2 gap-3">
        <Card
          title={hasUnfinished ? "Yes, unfinished work exists" : "Everything done!"}
          subtitle=".some((p) => !p.done)"
          tag={hasUnfinished ? "some → true" : "some → false"}
        />
        <Card
          title={allDone ? "All projects complete" : "Not everything done yet"}
          subtitle=".every((p) => p.done)"
          tag={allDone ? "every → true" : "every → false"}
        />
      </div>
      <ConsoleHint text="open console to see .some() and .every() return values" />
    </section>
  );
}

// ─── 6. .reduce() ─────────────────────────────────────────────────────────────

function ReduceDemo() {
  useEffect(() => {
    console.group("6 ─ .reduce()")

    // reduce(callback, startingValue)
    // callback receives: (accumulator, currentItem)
    // accumulator = running total, starts at startingValue

    // Add up all hours
    const totalHours = projects.reduce((total, p) => {
      return total + p.hours;
      //     └────┘   └──────┘
      //     running   add this item's hours
      //     total     to the total
    }, 0);  // ← start counting from 0

    console.log("total hours:", totalHours);  // 77

    // Count finished projects
    const doneCount = projects.reduce((count, p) => {
      return p.done ? count + 1 : count;
    }, 0);
    console.log("done count:", doneCount);  // 2

    console.groupEnd();
  }, []);

  const totalHours = projects.reduce((total, p) => total + p.hours, 0);
  const doneCount = projects.reduce((count, p) => (p.done ? count + 1 : count), 0);

  return (
    <section>
      <SectionHeader label=".reduce() — collapse the whole array into a single value" />

      <pre className="text-xs font-mono text-foreground-muted bg-surface-strong rounded-xl p-4 mb-4 overflow-x-auto">{`projects.reduce( (accumulator, item) => accumulator + item.hours, 0 )
//               └───────────┘  └──┘    └───────────────────────┘  └┘
//               running total  each    add hours to total         start value`}</pre>

      <div className="grid grid-cols-2 gap-3">
        <Card title={`${totalHours} hours total`} subtitle="across all projects" tag="reduce" />
        <Card title={`${doneCount} of ${projects.length} done`} subtitle="projects completed" tag="reduce" />
      </div>
      <ConsoleHint text="open console to see .reduce() step by step" />
    </section>
  );
}

// ─── the page ─────────────────────────────────────────────────────────────────

export default function ArrayPlayground() {
  return (
    <main className="p-8 flex flex-col gap-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-foreground-strong text-2xl font-bold mb-2">Array methods</h1>
        <p className="text-foreground-muted text-sm">
          One dataset. Six methods. Open DevTools console (Cmd+Option+J) to see the raw JS output alongside the React rendering.
        </p>
      </div>

      <MapDemo />
      <FilterDemo />
      <ChainDemo />
      <FindDemo />
      <SomeEveryDemo />
      <ReduceDemo />
    </main>
  );
}
