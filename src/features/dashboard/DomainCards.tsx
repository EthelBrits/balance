import { Activity, Apple, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BalanceCategory, BalanceScore } from '../../types';

const META: Record<
  BalanceCategory,
  { label: string; icon: LucideIcon; parts: string }
> = {
  body: {
    label: 'Lichaam',
    icon: Activity,
    parts: 'Training, actieve minuten, mobiliteit en herstel.',
  },
  nutrition: {
    label: 'Voeding',
    icon: Apple,
    parts: 'Water, groenten, fruit en alcohol binnen uw doel.',
  },
  recovery: {
    label: 'Herstel',
    icon: Moon,
    parts: 'Slaap, rustmoment, energie en rust- of stresscheck.',
  },
};

function MiniRing({ percentage }: { percentage: number | null }) {
  const active = percentage !== null;
  const value = percentage ?? 0;
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgb(var(--color-sand))" strokeWidth={7} />
      {active && (
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="rgb(var(--color-primary))"
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      )}
    </svg>
  );
}

export function DomainCards({ score }: { score: BalanceScore }) {
  const order: BalanceCategory[] = ['body', 'nutrition', 'recovery'];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {order.map((key) => {
        const cat = score.categories[key];
        const meta = META[key];
        const Icon = meta.icon;
        return (
          <details key={key} className="card group">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <div className="relative">
                <MiniRing percentage={cat.percentage} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
              </div>
              <div>
                <p className="font-heading font-semibold text-text">{meta.label}</p>
                <p className="text-sm text-text-muted">
                  {cat.active ? (
                    <span>
                      {cat.percentage}%{' '}
                      <span className="text-xs">
                        ({cat.points}/{cat.max} punten)
                      </span>
                    </span>
                  ) : (
                    <span>Niet actief</span>
                  )}
                </p>
              </div>
            </summary>
            <p className="mt-3 border-t border-sand pt-3 text-xs text-text-muted">
              {meta.parts}{' '}
              {cat.active
                ? 'Uitgeschakelde onderdelen tellen niet mee.'
                : 'Deze categorie telt momenteel niet mee in uw totaal.'}
            </p>
          </details>
        );
      })}
    </div>
  );
}
