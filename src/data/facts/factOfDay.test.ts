import { describe, it, expect } from 'vitest';
import { factForDate } from './factOfDay';
import { FACTS } from './facts';

describe('factForDate', () => {
  it('geeft binnen één cyclus geen herhaling', () => {
    const seen = new Set<string>();
    for (let offset = 0; offset < FACTS.length; offset++) {
      const fact = factForDate('2026-07-20', offset);
      expect(seen.has(fact.id)).toBe(false);
      seen.add(fact.id);
    }
    expect(seen.size).toBe(FACTS.length);
  });

  it('is stabiel voor dezelfde dag en offset', () => {
    expect(factForDate('2026-07-20', 0).id).toBe(factForDate('2026-07-20', 0).id);
  });

  it('rouleert over opeenvolgende dagen', () => {
    const a = factForDate('2026-07-20');
    const b = factForDate('2026-07-21');
    expect(a.id).not.toBe(b.id);
  });
});
