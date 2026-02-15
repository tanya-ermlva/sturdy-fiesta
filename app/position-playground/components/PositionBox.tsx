'use client';

const colorMap = {
  violet: { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-white' },
  blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-white' },
  green: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-white' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-white' },
} as const;

interface PositionBoxProps {
  label: string;
  color?: keyof typeof colorMap;
  size?: number;
  showGhost?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function PositionBox({
  label,
  color = 'violet',
  size = 80,
  showGhost = false,
  style = {},
  className = '',
}: PositionBoxProps) {
  const colors = colorMap[color];

  return (
    <>
      {showGhost && (
        <div
          className={`rounded-lg border-2 border-dashed ${colors.border} opacity-30`}
          style={{ width: size, height: size }}
        />
      )}
      <div
        className={`rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-mono font-bold select-none shadow-md ${className}`}
        style={{ width: size, height: size, ...style }}
      >
        {label}
      </div>
    </>
  );
}
