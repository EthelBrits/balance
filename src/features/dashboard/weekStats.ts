import { subDays } from 'date-fns';
import type { DailyLog } from '../../types';
import { toISODate, weekDates } from '../../utils/date';

export type WeekStats = {
  dates: string[];
  averageBalance: number | null;
  balancedDays: number;
  activeDays: number;
  strengthWorkouts: number;
  alcoholFreeDays: number;
  averageWater: number | null;
  averageEnergy: number | null;
  averageSleep: number | null;
  daysWithData: number;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Balansstatistieken voor de week rond een referentiedatum. */
export function computeWeekStats(logs: DailyLog[], reference: Date = new Date()): WeekStats {
  const dates = weekDates(reference);
  const byDate = new Map(logs.map((log) => [log.date, log]));
  const weekLogs = dates.map((d) => byDate.get(d)).filter((l): l is DailyLog => Boolean(l));

  const balances = weekLogs
    .map((l) => l.balanceScore?.total)
    .filter((v): v is number => v !== undefined);
  const waters = weekLogs
    .map((l) => l.waterGlasses)
    .filter((v): v is number => v !== undefined);
  const energies = weekLogs
    .map((l) => l.energy)
    .filter((v): v is NonNullable<typeof v> => v !== undefined)
    .map((v) => v as number);
  const sleeps = weekLogs.map((l) => l.sleepHours).filter((v): v is number => v !== undefined);

  return {
    dates,
    averageBalance: average(balances),
    balancedDays: balances.filter((b) => b >= 60).length,
    activeDays: weekLogs.filter((l) => (l.activeMinutes ?? 0) >= 10 || l.trainingCompleted).length,
    strengthWorkouts: weekLogs.filter((l) => l.trainingCompleted).length,
    alcoholFreeDays: weekLogs.filter((l) => l.alcoholFree === true).length,
    averageWater: average(waters),
    averageEnergy: average(energies),
    averageSleep: average(sleeps),
    daysWithData: weekLogs.length,
  };
}

/** Aantal alcoholvrije dagen deze en vorige (rollende 7-daagse) week. */
export function countAlcoholFreeDays(logs: DailyLog[], reference: Date = new Date()): {
  thisWeek: number;
  lastWeek: number;
} {
  const byDate = new Map(logs.map((log) => [log.date, log]));
  const countFree = (start: Date) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const iso = toISODate(subDays(start, i));
      if (byDate.get(iso)?.alcoholFree === true) count++;
    }
    return count;
  };
  return {
    thisWeek: countFree(reference),
    lastWeek: countFree(subDays(reference, 7)),
  };
}
