import { useId, type ReactNode } from 'react';

/** Uitklapbare instellingensectie (details/summary voor toegankelijkheid). */
export function SettingsSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <details className="card" open={defaultOpen}>
      <summary className="cursor-pointer list-none">
        <span className="flex items-center justify-between">
          <span className="font-heading text-lg font-semibold text-text">{title}</span>
          <span aria-hidden="true" className="text-text-muted">
            ⌄
          </span>
        </span>
        {description && <span id={id} className="mt-1 block text-sm text-text-muted">{description}</span>}
      </summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}
