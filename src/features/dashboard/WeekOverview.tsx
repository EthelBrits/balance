import type { DailyLog, ToneType } from '../../types';
import { computeWeekStats } from './weekOverview';
import { weekSummary } from '../../data/copy/tone';
import { formatShort } from '../../utils/date';

const DAY_LETTERS = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'];

function stoneColor(balance: number | undefined): string {
  if (balance === undefined) return 'bg-sand';
  if (balance >= 80) return 'bg-primary';
  if (balance >= 60) return 'bg-primary/70';
  if (balance >= 40) return 'bg-primary/45';
  return 'bg-primary/25';
}

export function WeekOverview({ logs, tone }: { logs: DailyLog[]; tone: ToneType }) {
  const stats = computeWeekStats(logs);
  const byDate = new Map(logs.map((l) => [l.date, l]));

  return (
    <section className="card">
      <h2 className="mb-1 font-heading text-lg font-semibold text-text">Deze week</h2>
      <p className="mb-4 text-sm text-text-muted">
        {stats.daysWithData > 0
          ? weekSummary(tone, stats.balancedDays, 7)
          : 'Nog geen gegevens voor deze week.'}
      </p>

      {/* Zeven balansstenen — geen streak, geen vuursymbool. */}
      <ul className="mb-5 flex justify-between gap-1">
        {stats.dates.map((date, i) => {
          const log = byDate.get(date);
          const pct = log?.balanceScore?.total;
          return (
            <li key={date} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium ${stoneColor(
                  pct,
                )} ${pct !== undefined && pct >= 60 ? 'text-white' : 'text-text-muted'}`}
                title={`${formatShort(date)}${pct !== undefined ? `: ${pct}%` : ': geen gegevens'}`}
              >
                {pct !== undefined ? pct : ''}
              </span>
              <span className="text-xs text-text-muted" aria-hidden="true">
                {DAY_LETTERS[i]}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <Stat label="Gem. balans" value={stats.averageBalance !== null ? `${Math.round(stats.averageBalance)}%` : '—'} />
        <Stat label="Beweegdagen" value={String(stats.activeDays)} />
        <Stat label="Trainingen" value={String(stats.strengthWorkouts)} />
        <Stat label="Alcoholvrij" value={`${stats.alcoholFreeDays} dagen`} />
        <Stat label="Gem. water" value={stats.averageWater !== null ? `${stats.averageWater.toFixed(1)} glazen` : '—'} />
        <Stat label="Gem. energie" value={stats.averageEnergy !== null ? stats.averageEnergy.toFixed(1) : '—'} />
      </dl>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg px-3 py-2">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="font-heading font-semibold text-text">{value}</dd>
    </div>
  );
}
