import { describe, it, expect } from 'vitest';
import { computeInsights } from './insights';
import type { DailyLog } from '../../types';

function log(i: number, fields: Partial<DailyLog>): DailyLog {
  const date = `2026-06-${String((i % 28) + 1).padStart(2, '0')}`;
  const now = new Date().toISOString();
  return { id: `l${i}`, date, createdAt: now, updatedAt: now, ...fields };
}

describe('computeInsights — drempels', () => {
  it('toont geen inzichten onder 14 bruikbare dagen', () => {
    const logs = Array.from({ length: 10 }, (_, i) =>
      log(i, { activeMinutes: 30, energy: 4 }),
    );
    const { insights, usableDays } = computeInsights(logs, []);
    expect(usableDays).toBe(10);
    expect(insights).toHaveLength(0);
  });

  it('toont geen inzicht wanneer een groep kleiner is dan 5', () => {
    // 14 dagen, maar slechts 4 actieve dagen met energie
    const active = Array.from({ length: 4 }, (_, i) => log(i, { activeMinutes: 30, energy: 5 }));
    const less = Array.from({ length: 12 }, (_, i) => log(i + 4, { activeMinutes: 5, energy: 2 }));
    const { insights } = computeInsights([...active, ...less], []);
    expect(insights.find((x) => x.id === 'energy-movement')).toBeUndefined();
  });

  it('toont het inzicht en vermeldt het aantal dagen wanneer drempels gehaald zijn', () => {
    const active = Array.from({ length: 7 }, (_, i) => log(i, { activeMinutes: 30, energy: 5 }));
    const less = Array.from({ length: 7 }, (_, i) => log(i + 7, { activeMinutes: 5, energy: 2 }));
    const { insights, usableDays } = computeInsights([...active, ...less], []);
    expect(usableDays).toBe(14);
    const insight = insights.find((x) => x.id === 'energy-movement');
    expect(insight).toBeDefined();
    expect(insight!.text).toContain('7');
  });

  it('respecteert verborgen inzichten', () => {
    const active = Array.from({ length: 7 }, (_, i) => log(i, { activeMinutes: 30, energy: 5 }));
    const less = Array.from({ length: 7 }, (_, i) => log(i + 7, { activeMinutes: 5, energy: 2 }));
    const { insights } = computeInsights([...active, ...less], [], ['energy-movement']);
    expect(insights.find((x) => x.id === 'energy-movement')).toBeUndefined();
  });
});
