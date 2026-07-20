import { Minus, Plus } from 'lucide-react';

type CounterProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  suffix?: string;
};

/** Plus/min-teller met toegankelijke knoppen en een leesbare waarde. */
export function Counter({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  suffix,
}: CounterProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="tap-target flex items-center justify-center rounded-full border border-sand text-primary-dark hover:bg-primary-light disabled:opacity-40"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label={`${label} verlagen`}
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
      <span className="min-w-[3ch] text-center font-heading text-lg font-semibold tabular-nums text-text">
        {value}
        {suffix ? <span className="ml-1 text-sm font-normal text-text-muted">{suffix}</span> : null}
      </span>
      <button
        type="button"
        className="tap-target flex items-center justify-center rounded-full border border-sand text-primary-dark hover:bg-primary-light disabled:opacity-40"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label={`${label} verhogen`}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
