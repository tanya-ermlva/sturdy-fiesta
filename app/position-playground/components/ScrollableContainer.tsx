'use client';

interface ScrollableContainerProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollableContainer({
  children,
  height = 300,
  className = '',
  style = {},
}: ScrollableContainerProps) {
  return (
    <div
      className={`relative rounded-xl border-2 border-dashed border-border-default overflow-y-auto ${className}`}
      style={{ height, ...style }}
    >
      <span className="sticky top-0 right-0 z-10 float-right mr-2 mt-2 rounded-full bg-surface-strong px-2 py-0.5 text-[10px] font-mono text-foreground-subtle select-none">
        Scroll me &darr;
      </span>
      {children}
    </div>
  );
}
