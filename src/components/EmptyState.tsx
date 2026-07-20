import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Nette lege staat — rustig geformuleerd, nooit verwijtend. */
export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-sand bg-surface/60 px-6 py-12 text-center">
      {Icon && (
        <div className="rounded-full bg-primary-light p-3 text-primary" aria-hidden="true">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-text">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
