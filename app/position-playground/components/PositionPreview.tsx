'use client';

interface PositionPreviewProps {
  containerPosition?: 'static' | 'relative';
  children: React.ReactNode;
  className?: string;
  label?: string;
  height?: string;
}

export default function PositionPreview({
  containerPosition = 'static',
  children,
  className = '',
  label = 'Container',
  height = '320px',
}: PositionPreviewProps) {
  return (
    <div
      className={`relative rounded-xl border-2 border-dashed border-border-default overflow-hidden ${className}`}
      style={{
        position: containerPosition,
        height,
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 19px, var(--border-subtle) 19px, var(--border-subtle) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, var(--border-subtle) 19px, var(--border-subtle) 20px)',
      }}
    >
      <span className="absolute top-2 left-3 text-[10px] font-mono uppercase tracking-wider text-foreground-subtle select-none">
        {label}
      </span>
      {children}
    </div>
  );
}
