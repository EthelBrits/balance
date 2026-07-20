import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { todayISO } from '../../utils/date';
import { greeting, dailyNudge } from '../../data/copy/tone';
import type { DailyLog } from '../../types';
import { BalanceMeter } from './BalanceMeter';
import { DomainCards } from './DomainCards';
import { WeekOverview } from './WeekOverview';
import { WaterCard, FruitCard, VegetableCard } from './cards/IntakeCards';
import { MovementCard, TrainingCard } from './cards/ActivityCards';
import { SleepCard, EnergyCard, StressCard, RecoveryMomentCard } from './cards/RecoveryCards';
import { AlcoholCard, LegCard } from './cards/ModuleCards';

export function TodayPage() {
  const profile = useStore((s) => s.profile);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const updateDailyLog = useStore((s) => s.updateDailyLog);

  const date = todayISO();
  const log = useMemo<DailyLog>(() => {
    const existing = dailyLogs.find((l) => l.date === date);
    const now = new Date().toISOString();
    return existing ?? { id: 'draft', date, createdAt: now, updatedAt: now };
  }, [dailyLogs, date]);

  if (!profile) return null;

  const update = (patch: Partial<DailyLog>) => void updateDailyLog(date, patch);

  const hour = new Date().getHours();
  const score = log.balanceScore;
  const total = score?.total ?? null;
  // Stabiele "seed" voor de toonvariatie: som van ingevulde velden.
  const seed = Object.values(log).filter((v) => v !== undefined).length;

  const alcoholEnabled = profile.enabledModules.includes('alcohol');
  const lymphEnabled = profile.enabledModules.includes('lymphedema');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-text">
          {greeting(hour, profile.name === 'daar' ? '' : profile.name)}
        </h1>
      </header>

      <section className="card flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-text-muted">Vandaag bent u</p>
        <BalanceMeter percentage={total ?? 0} />
        <p className="max-w-sm text-text">{dailyNudge(profile.tone, total, seed)}</p>
      </section>

      {score && <DomainCards score={score} />}

      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-text">Vandaag invullen</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <WaterCard log={log} profile={profile} update={update} />
          <MovementCard log={log} update={update} />
          <FruitCard log={log} profile={profile} update={update} />
          <VegetableCard log={log} profile={profile} update={update} />
          <TrainingCard log={log} update={update} />
          <SleepCard log={log} profile={profile} update={update} />
          <EnergyCard log={log} profile={profile} update={update} />
          <RecoveryMomentCard log={log} profile={profile} update={update} />
          <StressCard log={log} profile={profile} update={update} />
          {alcoholEnabled && (
            <AlcoholCard log={log} update={update} allLogs={dailyLogs} tone={profile.tone} />
          )}
          {lymphEnabled && <LegCard log={log} update={update} />}
        </div>
      </div>

      <WeekOverview logs={dailyLogs} tone={profile.tone} />
    </div>
  );
}
