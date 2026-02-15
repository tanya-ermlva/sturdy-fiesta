'use client';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  hint?: string;
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  hint,
}: SliderControlProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground-muted">{label}</label>
        <span className="text-sm font-mono text-foreground-subtle tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="playground-slider w-full"
      />
      {hint && (
        <p className="text-xs text-accent-default italic">{hint}</p>
      )}
    </div>
  );
}
