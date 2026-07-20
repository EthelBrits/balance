import { subDays, subMonths, subYears, parseISO, isAfter } from 'date-fns';
import type { BodyMeasurement, DailyLog, UserProfile } from '../../types';
import { toISODate, weekdayOf, daysBetween } from '../../utils/date';

export type RangeKey = '4w' | '3m' | '6m' | '1y' | 'all';

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '4w', label: '4 weken' },
  { key: '3m', label: '3 maanden' },
  { key: '6m', label: '6 maanden' },
  { key: '1y', label: '1 jaar' },
  { key: 'all', label: 'Alles' },
];

export function cutoffFor(range: RangeKey, reference: Date = new Date()): Date | null {
  switch (range) {
    case '4w':
      return subDays(reference, 28);
    case '3m':
      return subMonths(reference, 3);
    case '6m':
      return subMonths(reference, 6);
    case '1y':
      return subYears(reference, 1);
    case 'all':
      return null;
  }
}

export type Point = { date: string; value: number };

function withinRange(iso: string, cutoff: Date | null): boolean {
  return cutoff === null || isAfter(parseISO(iso), cutoff);
}

/** Bouwt een tijdreeks voor één numeriek metingveld. */
export function measurementSeries(
  measurements: BodyMeasurement[],
  field: keyof BodyMeasurement,
  range: RangeKey,
): Point[] {
  const cutoff = cutoffFor(range);
  return measurements
    .filter((m) => typeof m[field] === 'number' && withinRange(m.date, cutoff))
    .map((m) => ({ date: m.date, value: m[field] as number }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Tijdreeks voor een numeriek dagveld. */
export function logSeries(
  logs: DailyLog[],
  field: 'activeMinutes' | 'energy' | 'sleepHours',
  range: RangeKey,
): Point[] {
  const cutoff = cutoffFor(range);
  return logs
    .filter((l) => typeof l[field] === 'number' && withinRange(l.date, cutoff))
    .map((l) => ({ date: l.date, value: l[field] as number }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Dagelijkse balansscore als reeks. */
export function balanceSeries(logs: DailyLog[], range: RangeKey): Point[] {
  const cutoff = cutoffFor(range);
  return logs
    .filter((l) => l.balanceScore && withinRange(l.date, cutoff))
    .map((l) => ({ date: l.date, value: l.balanceScore!.total }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Aantal alcoholvrije dagen per week (rollend), als reeks. */
export function alcoholFreeWeeklySeries(logs: DailyLog[], range: RangeKey): Point[] {
  const cutoff = cutoffFor(range);
  const relevant = logs
    .filter((l) => withinRange(l.date, cutoff))
    .sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(logs.map((l) => [l.date, l]));
  // Groepeer per kalenderweek (op zondag eindigend), tel alcoholvrije dagen.
  const points: Point[] = [];
  const seenWeeks = new Set<string>();
  for (const log of relevant) {
    const weekKey = weekKeyOf(log.date);
    if (seenWeeks.has(weekKey)) continue;
    seenWeeks.add(weekKey);
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const iso = toISODate(subDays(parseISO(weekKey), -i));
      if (byDate.get(iso)?.alcoholFree === true) count++;
    }
    points.push({ date: weekKey, value: count });
  }
  return points;
}

/** Maandag van de week waarin een datum valt. */
function weekKeyOf(iso: string): string {
  const day = weekdayOf(iso); // 0 = zondag
  const diffToMonday = (day + 6) % 7;
  return toISODate(subDays(parseISO(iso), diffToMonday));
}

/** Is vandaag de weegdag volgens het profiel? */
export function isWeighDay(profile: UserProfile, reference: Date = new Date()): boolean {
  if (profile.weighFrequency === 'daily') return true;
  return reference.getDay() === profile.weighDay;
}

/** Aantal dagen sinds de laatste buikomtrekmeting; null als er geen is. */
export function daysSinceLastWaist(measurements: BodyMeasurement[]): number | null {
  const waist = measurements
    .filter((m) => m.waistCm !== undefined)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (waist.length === 0) return null;
  return daysBetween(toISODate(), waist[0].date);
}
