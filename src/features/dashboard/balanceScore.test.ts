import { describe, it, expect } from 'vitest';
import { computeBalanceScore, DEFAULT_BALANCE_WEIGHTS } from './balanceScore';
import { createDefaultProfile } from '../../utils/defaults';
import type { DailyLog, UserProfile } from '../../types';

function baseProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return { ...createDefaultProfile(), waterGoalGlasses: 8, vegetableGoalPortions: 3, fruitGoalPortions: 2, sleepGoalHours: 7.5, ...overrides };
}

function makeLog(fields: Partial<DailyLog>): DailyLog {
  const now = new Date().toISOString();
  return { id: 'x', date: '2026-07-20', createdAt: now, updatedAt: now, ...fields };
}

describe('computeBalanceScore', () => {
  it('geeft 0% voor een lege dag maar deelt nooit door nul', () => {
    const profile = baseProfile(); // geen alcoholmodule
    const score = computeBalanceScore(makeLog({}), profile);
    expect(score.total).toBe(0);
    expect(score.categories.body.percentage).toBe(0);
    expect(score.categories.nutrition.active).toBe(true);
  });

  it('sluit alcohol uit de noemer wanneer de module uit staat', () => {
    const profile = baseProfile({ enabledModules: [] });
    const score = computeBalanceScore(makeLog({}), profile);
    // Voeding zonder alcohol: water 10 + groenten 10 + fruit 5 = 25 max
    expect(score.categories.nutrition.max).toBe(25);
  });

  it('telt alcohol mee in de noemer wanneer de module aan staat', () => {
    const profile = baseProfile({ enabledModules: ['alcohol'] });
    const score = computeBalanceScore(makeLog({}), profile);
    expect(score.categories.nutrition.max).toBe(35);
  });

  it('kent punten toe voor een alcoholvrije dag', () => {
    const profile = baseProfile({ enabledModules: ['alcohol'] });
    const withFree = computeBalanceScore(makeLog({ alcoholFree: true }), profile);
    const without = computeBalanceScore(makeLog({ alcoholFree: false }), profile);
    expect(withFree.categories.nutrition.points).toBeGreaterThan(without.categories.nutrition.points);
  });

  it('markeert een categorie met 0 maximum als niet actief en houdt die uit het totaal', () => {
    const profile = baseProfile({ enabledModules: [] });
    const weights = {
      ...DEFAULT_BALANCE_WEIGHTS,
      nutrition: { water: 0, vegetables: 0, fruit: 0, alcohol: 0 },
    };
    const score = computeBalanceScore(
      makeLog({ trainingCompleted: true, sleepHours: 8, energy: 4, stress: 2 }),
      profile,
      weights,
    );
    expect(score.categories.nutrition.active).toBe(false);
    expect(score.categories.nutrition.percentage).toBeNull();
    // Totaal is berekend over body + recovery, niet gedeeld door de lege categorie.
    expect(score.total).toBeGreaterThan(0);
    expect(Number.isNaN(score.total)).toBe(false);
  });

  it('bereikt 100% wanneer alle actieve onderdelen behaald zijn', () => {
    const profile = baseProfile({ enabledModules: ['alcohol'] });
    const perfect = makeLog({
      trainingCompleted: true,
      activeMinutes: 30,
      mobilityDone: true,
      recoveryMoment: true,
      waterGlasses: 8,
      vegetablePortions: 3,
      fruitPortions: 2,
      alcoholFree: true,
      sleepHours: 8,
      energy: 5,
      stress: 2,
    });
    const score = computeBalanceScore(perfect, profile);
    expect(score.total).toBe(100);
    expect(score.categories.body.percentage).toBe(100);
    expect(score.categories.nutrition.percentage).toBe(100);
    expect(score.categories.recovery.percentage).toBe(100);
  });

  it('rekent binnen persoonlijk alcoholdoel ook als behaald', () => {
    const profile = baseProfile({
      enabledModules: ['alcohol'],
      alcoholSettings: { weeklyGoalFreeDays: 3, maxGlassesPerWeek: 7, typicalMoments: [] },
    });
    // dagdoel = round(7/7) = 1 glas
    const within = computeBalanceScore(makeLog({ alcoholGlasses: 1 }), profile);
    const over = computeBalanceScore(makeLog({ alcoholGlasses: 3 }), profile);
    expect(within.categories.nutrition.points).toBeGreaterThan(over.categories.nutrition.points);
  });
});
