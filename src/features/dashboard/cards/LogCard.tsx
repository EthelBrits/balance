import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type LogCardProps = {
  icon: LucideIcon;
  title: string;
  hint?: string;
  done?: boolean;
  children: ReactNode;
};

/** Uniforme kaart voor één dagelijkse invoer. */
export function LogCard({ icon: Icon, title, hint, done, children }: LogCardProps) {
  return (
    <section className="card">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            done ? 'bg-primary text-white' : 'bg-primary-light text-primary'
          }`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-heading font-semibold text-text">{title}</h3>
      </div>
      {children}
      {hint && <p className="mt-2 text-xs text-text-muted">{hint}</p>}
    </section>
  );
}

type OptionRowProps<T extends string | number> = {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  ariaLabel: string;
};

/** Rij met keuzeknoppen (bijv. porties, minuten, kwaliteit). */
export function OptionRow<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: OptionRowProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`chip ${value === opt.value ? 'chip-active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
