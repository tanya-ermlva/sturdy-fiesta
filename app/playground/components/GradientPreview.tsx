'use client';

interface GradientPreviewProps {
  style: React.CSSProperties;
  className?: string;
}

const checkerboard =
  'repeating-conic-gradient(#d0d0d0 0% 25%, #f0f0f0 0% 50%) 0 0 / 16px 16px';

export default function GradientPreview({ style, className = '' }: GradientPreviewProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border-muted ${className}`}
      style={{ background: checkerboard }}
    >
      <div className="absolute inset-0" style={style} />
    </div>
  );
}
