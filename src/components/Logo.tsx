type LogoProps = {
  /** Toont de subtekst "by Dr. Ethel Brits" */
  withSubtitle?: boolean;
  /** Alleen het symbool, zonder tekst */
  markOnly?: boolean;
  className?: string;
};

/**
 * Logo voor Mijn Balans.
 * Het symbool: twee organische halve cirkels in evenwicht met een klein
 * terracotta steunpunt — een rustige balansvorm, geen weegschaal of halter.
 */
export function Logo({ withSubtitle = false, markOnly = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0 text-primary" />
      {!markOnly && (
        <div className="leading-tight">
          <span className="block font-heading text-xl font-semibold text-primary-dark">
            Mijn Balans
          </span>
          {withSubtitle && (
            <span className="block text-xs text-text-muted">by Dr. Ethel Brits</span>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Mijn Balans logo"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth={3.4} strokeLinecap="round">
        {/* bovenste halve cirkel, kantelt licht naar rechts */}
        <path d="M18 38 A14 14 0 0 1 32 24" />
        {/* onderste halve cirkel, kantelt licht naar links */}
        <path d="M46 26 A14 14 0 0 1 32 40" />
      </g>
      {/* rustpunt in evenwicht */}
      <circle cx="32" cy="32" r="3.4" fill="rgb(var(--color-accent))" stroke="none" />
    </svg>
  );
}
