'use client';

interface SelectControlProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export default function SelectControl({
  label,
  value,
  options,
  onChange,
}: SelectControlProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-foreground-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border-muted bg-surface-default px-3 py-2 text-sm text-foreground-default focus:outline-none focus:ring-2 focus:ring-accent-default"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
