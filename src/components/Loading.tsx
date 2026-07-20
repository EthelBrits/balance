import { LogoMark } from './Logo';

export function Loading({ label = 'Bezig met laden…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 text-text-muted"
      role="status"
      aria-live="polite"
    >
      <LogoMark className="h-10 w-10 animate-pulse text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
