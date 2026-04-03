"use client";

import { useEffect } from "react";

// ─── Stage 2: component, no props ───────────────────────────────

function Card() {
  return (
    <div className="bg-surface-default border border-border-default rounded-2xl p-6">
      <p className="text-foreground-muted text-sm">Description</p>
      <h3 className="text-foreground-strong text-xl font-bold mt-2">Title</h3>
    </div>
  )
}

// ─── Stage 3: component with props ──────────────────────────────
// React calls this function with { title, description } as one object.
// We never write that object — JSX attributes become the object invisibly.

function CardWithProps({ title, description }: { title: string; description: string }) {
  // ↓ uncomment this to see the object React created from your JSX attributes
   console.log("React made this object for me:", { title, description })
  return (
    <div className="bg-surface-default border border-border-default rounded-2xl p-6">
      <p className="text-foreground-muted text-sm">{description}</p>
      <h3 className="text-foreground-strong text-xl font-bold mt-2">{title}</h3>
    </div>
  )
}

// ─── Console demo ────────────────────────────────────────────────
// This component runs JS in your browser and logs to DevTools.
// Open: right-click → Inspect → Console tab

function ConsoleDemo() {
  useEffect(() => {

    // ── 1. A plain object ─────────────────────────────────────────
    const tanya = {
      name: "Tanya",
      role: "designer",
      company: "Granola",
      tools: ["Figma", "React", "TypeScript"],
    }

    console.log("1 ─ the raw object:", tanya)

    // ── 2. Dot notation — reaching into the box ───────────────────
    console.log("2 ─ dot notation:", tanya.name, tanya.role)
    console.log("2 ─ nested array:", tanya.tools[0])

    // ── 3. Destructuring — pull values into standalone variables ──
    const { name, role, company } = tanya

    console.log("3 ─ after destructuring:", name, role, company)
    console.log("3 ─ name is now just:", name)   // no tanya. needed

    const sergey = {
      name: "Sergey",
      role: "researcher",
      company: "University of Southampton",
      tools: ["Python", "TypeScript", "R"],
    }

    // ── 4. Destructuring in a function parameter ──────────────────
    function greet({ name, role }: { name: string; role: string }) {
      console.log("4 ─ inside function:", name, "is a", role)
    }

    greet(sergey)   // passes the whole object — function pulls out what it needs

    // ── 5. This is EXACTLY what React does with props ─────────────
    function CardDebug(props: { title: string; description: string }) {
      console.log("5 ─ props object:", props)
      console.log("5 ─ props.title:", props.title)
    }

    CardDebug({ title: "Design systems", description: "Tokens and rules" })

    // ── 6. Same as above but destructured — what you write in React
    function CardDestructured({ title, description }: { title: string; description: string }) {
      console.log("6 ─ destructured title:", title)
      console.log("6 ─ destructured description:", description)
    }

    CardDestructured({ title: "Design systems", description: "Tokens and rules" })

  }, []) // ← empty array means "run once when the component mounts"

  return (
    <div className="bg-surface-strong border border-border-default rounded-2xl p-6 space-y-2">
      <p className="text-foreground-muted text-sm font-mono">
        Open DevTools → Console to see the logs
      </p>
      <p className="text-foreground-subtle text-xs font-mono">
        Mac: Cmd + Option + J &nbsp;·&nbsp; Windows: Ctrl + Shift + J
      </p>
    </div>
  )
}

// ─── The page ────────────────────────────────────────────────────

export default function GridPlayground() {
  return (
    <main className="p-8 flex flex-col gap-16">

      {/* Stage 1 — raw grid, everything inline */}
      <section>
        <h2 className="text-foreground-muted text-sm mb-6">Stage 1 — raw CSS grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-surface-default border border-border-default rounded-2xl p-6">
            <p className="text-foreground-muted text-sm">Description</p>
            <h3 className="text-foreground-strong text-xl font-bold mt-2">Title</h3>
          </div>
          <div className="bg-surface-default border border-border-default rounded-2xl p-6">
            <p className="text-foreground-muted text-sm">Description</p>
            <h3 className="text-foreground-strong text-xl font-bold mt-2">Title</h3>
          </div>
          <div className="bg-surface-default border border-border-default rounded-2xl p-6">
            <p className="text-foreground-muted text-sm">Description</p>
            <h3 className="text-foreground-strong text-xl font-bold mt-2">Title</h3>
          </div>
        </div>
      </section>

      {/* Stage 2 — same grid, cards are a component */}
      <section>
        <h2 className="text-foreground-muted text-sm mb-6">Stage 2 — card extracted into a component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card />
          <Card />
          <Card />
        </div>
      </section>

      {/* Stage 3 — each card gets its own content via props */}
      <section>
        <h2 className="text-foreground-muted text-sm mb-6">Stage 3 — props: each card has its own content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardWithProps
            title="Design systems"
            description="Tokens, components, and the rules between them"
          />
          <CardWithProps
            title="React components"
            description="Functions that return JSX and accept props"
          />
          <CardWithProps
            title="CSS Grid"
            description="Rows, columns, and gaps — layout without flexbox hacks"
          />
        </div>
      </section>

      {/* Console demo — objects and destructuring */}
      <section>
        <h2 className="text-foreground-muted text-sm mb-6">Console demo — objects and destructuring</h2>
        <ConsoleDemo />
      </section>

    </main>
  )
}
