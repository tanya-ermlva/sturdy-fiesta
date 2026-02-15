'use client';

export interface ColorStop {
  color: string;
  position: number;
}

interface ColorStopEditorProps {
  stops: ColorStop[];
  onChange: (stops: ColorStop[]) => void;
  unit?: '%' | 'px';
  maxPosition?: number;
}

export default function ColorStopEditor({
  stops,
  onChange,
  unit = '%',
  maxPosition = 100,
}: ColorStopEditorProps) {
  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    const next = stops.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(next);
  };

  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position ?? 0;
    const newPos = Math.min(lastPos + 20, maxPosition);
    onChange([...stops, { color: '#888888', position: newPos }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    onChange(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground-muted">Color Stops</span>
        <button
          onClick={addStop}
          className="rounded-md bg-surface-strong px-2 py-1 text-xs text-foreground-muted hover:text-foreground-default transition-colors"
        >
          + Add stop
        </button>
      </div>
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="color"
            value={stop.color}
            onChange={(e) => updateStop(i, 'color', e.target.value)}
            className="h-8 w-8 shrink-0 cursor-pointer rounded border border-border-muted bg-transparent"
          />
          <input
            type="range"
            min={0}
            max={maxPosition}
            value={stop.position}
            onChange={(e) => updateStop(i, 'position', Number(e.target.value))}
            className="playground-slider flex-1"
          />
          <span className="w-12 text-right text-xs font-mono text-foreground-subtle tabular-nums">
            {stop.position}{unit}
          </span>
          {stops.length > 2 && (
            <button
              onClick={() => removeStop(i)}
              className="text-foreground-subtle hover:text-foreground-default text-sm transition-colors"
              aria-label="Remove stop"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
