import { useId, type ReactNode } from 'react';

type FieldProps = {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
};

/** Label + optionele toelichting rond een invoerelement, toegankelijk gekoppeld. */
export function Field({ label, hint, children }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label-text">
        {label}
      </label>
      {children(id)}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

type NumberInputProps = {
  id?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
};

export function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  suffix,
  ariaLabel,
}: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="input-field"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? undefined : Number(raw));
        }}
      />
      {suffix && <span className="shrink-0 text-sm text-text-muted">{suffix}</span>}
    </div>
  );
}
