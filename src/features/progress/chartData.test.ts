import { describe, it, expect } from 'vitest';
import { isWeighDay, daysSinceLastWaist, measurementSeries } from './chartData';
import { createDefaultProfile } from '../../utils/defaults';
import { todayISO } from '../../utils/date';
import type { BodyMeasurement } from '../../types';

describe('isWeighDay', () => {
  it('is waar op de ingestelde weegdag bij wekelijks wegen', () => {
    const wednesday = new Date('2026-07-22T09:00:00'); // getDay() === 3
    const profile = { ...createDefaultProfile(), weighFrequency: 'weekly' as const, weighDay: 3 };
    expect(isWeighDay(profile, wednesday)).toBe(true);
  });

  it('is onwaar op andere dagen bij wekelijks wegen', () => {
    const thursday = new Date('2026-07-23T09:00:00'); // getDay() === 4
    const profile = { ...createDefaultProfile(), weighFrequency: 'weekly' as const, weighDay: 3 };
    expect(isWeighDay(profile, thursday)).toBe(false);
  });

  it('is altijd waar bij dagelijks wegen', () => {
    const anyDay = new Date('2026-07-23T09:00:00');
    const profile = { ...createDefaultProfile(), weighFrequency: 'daily' as const, weighDay: 3 };
    expect(isWeighDay(profile, anyDay)).toBe(true);
  });
});

describe('daysSinceLastWaist', () => {
  it('geeft null wanneer er geen buikomtrekmeting is', () => {
    expect(daysSinceLastWaist([])).toBeNull();
  });

  it('geeft 0 wanneer vandaag gemeten is', () => {
    const m: BodyMeasurement = { id: 'a', date: todayISO(), waistCm: 90 };
    expect(daysSinceLastWaist([m])).toBe(0);
  });
});

describe('measurementSeries', () => {
  it('sorteert op datum en negeert lege waarden', () => {
    const measurements: BodyMeasurement[] = [
      { id: '1', date: '2026-07-10', weightKg: 80 },
      { id: '2', date: '2026-07-01', weightKg: 81 },
      { id: '3', date: '2026-07-05' }, // geen gewicht
    ];
    const series = measurementSeries(measurements, 'weightKg', 'all');
    expect(series.map((p) => p.value)).toEqual([81, 80]);
  });
});
