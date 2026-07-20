import { Check } from 'lucide-react';

export type ChipOption<T extends string> = { value: T; label: string };

type ChipSelectProps<T extends string> = {
  options: ChipOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  /** Maximaal aantal selecties; extra keuzes worden geweigerd. */
  max?: number;
  /** Zichtbaar label voor schermlezers. */
  ariaLabel: string;
};

/** Herbruikbare meerkeuze-chips met toegankelijke knoppen. */
export function ChipSelect<T extends string>({
  options,
  selected,
  onChange,
  max,
  ariaLabel,
}: ChipSelectProps<T>) {
  function toggle(value: T) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, value]);
    }
  }

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        const disabled = !active && max !== undefined && selected.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            onClick={() => toggle(opt.value)}
            className={`chip ${active ? 'chip-active' : ''} ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {active && <Check className="h-4 w-4" aria-hidden="true" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
