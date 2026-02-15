"use client";

function PositioningDemo() {
  return (
    <div className="relative h-32 border-2 border-dashed border-border-strong rounded-lg bg-surface-muted">
      <span className="absolute top-2 left-2 text-[10px] text-foreground-muted">
        relative parent
      </span>
      <div className="absolute top-0 right-0 w-10 h-10 bg-accent/20 border border-accent rounded-tl-none rounded-br-lg rounded-tr-lg flex items-center justify-center">
        <span className="text-[8px] text-accent-strong leading-tight text-center">
          absolute
        </span>
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-foreground-subtle">
        top-0 right-0
      </div>
    </div>
  );
}

function InsetDemo() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <p className="text-[10px] text-foreground-muted mb-1.5 text-center">
          inset-0 (fills parent)
        </p>
        <div className="relative h-24 border-2 border-dashed border-border-strong rounded-lg">
          <div className="absolute inset-0 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-[10px] text-accent-strong">inset-0</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-foreground-muted mb-1.5 text-center">
          top-2 left-2 (specific spot)
        </p>
        <div className="relative h-24 border-2 border-dashed border-border-strong rounded-lg">
          <div className="absolute top-2 left-2 w-8 h-8 bg-accent/20 border border-accent rounded flex items-center justify-center">
            <span className="text-[8px] text-accent-strong">here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlexAxesDemo() {
  return (
    <div>
      <div className="relative flex items-center justify-center gap-3 h-28 border-2 border-dashed border-border-strong rounded-lg bg-surface-muted px-4">
        {/* Main axis arrow */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <span className="text-[9px] text-foreground-subtle">main axis</span>
          <span className="text-foreground-subtle text-xs">&rarr;</span>
        </div>
        {/* Cross axis arrow */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-foreground-subtle leading-none [writing-mode:vertical-lr]">
            cross
          </span>
          <span className="text-foreground-subtle text-xs">&darr;</span>
        </div>
        {/* Boxes */}
        <div className="w-10 h-10 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          A
        </div>
        <div className="w-10 h-14 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          B
        </div>
        <div className="w-10 h-8 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          C
        </div>
      </div>
      <p className="text-[10px] text-foreground-subtle mt-1.5 text-center">
        flex + items-center + justify-center
      </p>
    </div>
  );
}

function FlexColDemo() {
  return (
    <div>
      <div className="relative flex flex-col items-center justify-center gap-2 h-40 border-2 border-dashed border-border-strong rounded-lg bg-surface-muted px-4">
        {/* Main axis arrow (now vertical) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-foreground-subtle leading-none [writing-mode:vertical-lr]">
            main
          </span>
          <span className="text-foreground-subtle text-xs">&darr;</span>
        </div>
        {/* Cross axis arrow (now horizontal) */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <span className="text-[9px] text-foreground-subtle">cross axis</span>
          <span className="text-foreground-subtle text-xs">&rarr;</span>
        </div>
        {/* Boxes */}
        <div className="w-16 h-8 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          A
        </div>
        <div className="w-16 h-8 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          B
        </div>
        <div className="w-16 h-8 rounded bg-accent/20 border border-accent flex items-center justify-center text-[10px] text-accent-strong">
          C
        </div>
      </div>
      <p className="text-[10px] text-foreground-subtle mt-1.5 text-center">
        flex-col swaps main &amp; cross axes
      </p>
    </div>
  );
}

function ResponsiveDemo() {
  return (
    <div className="border-2 border-dashed border-border-strong rounded-lg bg-surface-muted p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground-subtle w-12 shrink-0">
            mobile:
          </span>
          <div className="bg-accent/15 border border-accent/30 rounded px-2 py-1">
            <span className="text-xs text-accent-strong">text-sm</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground-subtle w-12 shrink-0">
            md:
          </span>
          <div className="bg-accent/15 border border-accent/30 rounded px-3 py-1.5">
            <span className="text-sm text-accent-strong">md:text-lg</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground-subtle w-12 shrink-0">
            lg:
          </span>
          <div className="bg-accent/15 border border-accent/30 rounded px-4 py-2">
            <span className="text-base text-accent-strong">lg:text-2xl</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-foreground-subtle mt-2">
        Mobile-first: base applies everywhere, prefixes add up
      </p>
    </div>
  );
}

function SpacingDemo() {
  return (
    <div className="border-2 border-dashed border-border-strong rounded-lg bg-surface-muted p-4">
      {/* The container representing a parent */}
      <div className="flex items-center h-16">
        {/* Left auto margin */}
        <div className="flex-1 flex items-center justify-center border-r border-dashed border-foreground-subtle/30 h-full">
          <span className="text-[10px] text-foreground-subtle">
            margin: auto
          </span>
        </div>
        {/* The centered block */}
        <div className="shrink-0">
          <div className="bg-accent/15 border border-accent/30 rounded px-4 h-full flex items-center">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-accent/50">px</span>
              <span className="text-xs text-accent-strong">content</span>
              <span className="text-[10px] text-accent/50">px</span>
            </div>
          </div>
        </div>
        {/* Right auto margin */}
        <div className="flex-1 flex items-center justify-center border-l border-dashed border-foreground-subtle/30 h-full">
          <span className="text-[10px] text-foreground-subtle">
            margin: auto
          </span>
        </div>
      </div>
      <p className="text-[10px] text-foreground-subtle mt-2 text-center">
        mx-auto pushes equal margins on both sides
      </p>
    </div>
  );
}

const demos: Record<string, () => React.JSX.Element> = {
  positioning: PositioningDemo,
  inset: InsetDemo,
  "flex-axes": FlexAxesDemo,
  "flex-col": FlexColDemo,
  responsive: ResponsiveDemo,
  spacing: SpacingDemo,
};

export function MemoDemo({ demoId }: { demoId: string }) {
  const Demo = demos[demoId];
  if (!Demo) return null;
  return (
    <div className="mt-3">
      <Demo />
    </div>
  );
}
