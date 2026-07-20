import { describe, it, expect } from 'vitest';
import { computeWeekStats, countAlcoholFreeDays } from './weekStats';
import { weekDates } from '../../utils/date';
import type { BalanceScore, DailyLog } from '../../types';

function scoreOf(total: number): BalanceScore {
  return {
    total,
    categories: {
      body: { points: 0, max: 40, percentage: total, active: true },
      nutrition: { points: 0, max: 35, percentage: total, active: true },
      recovery: { points: 0, max: 25, percentage: total, active: true },
    },
  };
}

function log(date: string, fields: Partial<DailyLog>): DailyLog {
  const now = new Date().toISOString();
  return { id: date, date, createdAt: now, updatedAt: now, ...fields };
}

describe('computeWeekStats', () => {
  const reference = new Date('2026-07-22T12:00:00'); // een woensdag
  const dates = weekDates(reference);

  it('berekent gemiddelde balans en gebalanceerde dagen', () => {
    const logs = [
      log(dates[0], { balanceScore: scoreOf(80), waterGlasses: 8, energy: 4 }),
      log(dates[1], { balanceScore: scoreOf(40), waterGlasses: 4, energy: 2 }),
      log(dates[2], { balanceScore: scoreOf(60), waterGlasses: 6, energy: 3 }),
    ];
    const stats = computeWeekStats(logs, reference);
    expect(stats.averageBalance).toBe(60);
    expect(stats.balancedDays).toBe(2); // 80 en 60 >= 60
    expect(stats.averageWater).toBeCloseTo(6);
    expect(stats.averageEnergy).toBe(3);
    expect(stats.daysWithData).toBe(3);
  });

  it('geeft null-gemiddelden bij een lege week', () => {
    const stats = computeWeekStats([], reference);
    expect(stats.averageBalance).toBeNull();
    expect(stats.averageWater).toBeNull();
    expect(stats.balancedDays).toBe(0);
  });

  it('telt trainingen en alcoholvrije dagen', () => {
    const logs = [
      log(dates[0], { trainingCompleted: true, alcoholFree: true }),
      log(dates[1], { trainingCompleted: true }),
      log(dates[2], { alcoholFree: true }),
    ];
    const stats = computeWeekStats(logs, reference);
    expect(stats.strengthWorkouts).toBe(2);
    expect(stats.alcoholFreeDays).toBe(2);
  });
});

describe('countAlcoholFreeDays', () => {
  it('vergelijkt deze week met vorige week', () => {
    const reference = new Date('2026-07-22T12:00:00');
    const dates = weekDates(reference);
    const prev = weekDates(new Date('2026-07-15T12:00:00'));
    const logs = [
      log(dates[2], { alcoholFree: true }),
      log(dates[3], { alcoholFree: true }),
      log(prev[1], { alcoholFree: true }),
    ];
    const { thisWeek, lastWeek } = countAlcoholFreeDays(logs, reference);
    expect(thisWeek).toBeGreaterThanOrEqual(1);
    expect(lastWeek).toBeGreaterThanOrEqual(0);
    expect(typeof thisWeek).toBe('number');
  });
});
