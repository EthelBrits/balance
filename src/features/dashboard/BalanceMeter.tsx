import { balanceLabel } from '../../data/copy/tone';

type BalanceMeterProps = {
  percentage: number;
};

/**
 * Rustige halve-cirkel balansmeter. Bewust géén rapportcijfer-gevoel:
 * zachte boog, kalme kleur, tekstlabel dat de score kwalificeert.
 */
export function BalanceMeter({ percentage }: BalanceMeterProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  // Halve cirkel: 180 graden. We tekenen een boog van links naar rechts.
  const radius = 80;
  const circumference = Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-xs" role="img"
        aria-label={`Balansscore vandaag: ${clamped} procent, ${balanceLabel(clamped)}`}>
        {/* achtergrondboog */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="rgb(var(--color-sand))"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* voortgangsboog */}
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="rgb(var(--color-primary))"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="fill-[rgb(var(--color-text))] font-heading"
          style={{ fontSize: '2rem', fontWeight: 600 }}
        >
          {clamped}%
        </text>
      </svg>
      <p className="-mt-2 text-sm font-medium text-text-muted">{balanceLabel(clamped)}</p>
    </div>
  );
}
