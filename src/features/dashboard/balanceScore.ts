import type {
  BalanceCategory,
  BalanceScore,
  DailyLog,
  UserProfile,
} from '../../types';

/**
 * Balansscore — transparant en uitlegbaar puntensysteem.
 *
 * Bindende regels (zie opdracht 2.1):
 *  1. Onderdelen die de gebruiker uitschakelt tellen niet mee in teller noch noemer.
 *  2. Een categorie waarvan het maximum op 0 uitkomt, valt uit de totaalberekening
 *     en wordt getoond als "niet actief" — nooit als 0 %. Nooit delen door nul.
 *  3. De totaalscore is persoonlijk en niet vergelijkbaar tussen gebruikers.
 *  4. Herberekening gebeurt automatisch bij elke wijziging van de dag.
 *
 * De wegingen zijn configureerbaar (BalanceWeights).
 */

export type BalanceWeights = {
  body: { workout: number; activeMinutes: number; mobility: number; recovery: number };
  nutrition: { water: number; vegetables: number; fruit: number; alcohol: number };
  recovery: { sleep: number; recoveryMoment: number; energy: number; stress: number };
};

export const DEFAULT_BALANCE_WEIGHTS: BalanceWeights = {
  body: { workout: 20, activeMinutes: 10, mobility: 5, recovery: 5 },
  nutrition: { water: 10, vegetables: 10, fruit: 5, alcohol: 10 },
  recovery: { sleep: 10, recoveryMoment: 5, energy: 5, stress: 5 },
};

/** Aantal actieve minuten dat als "voldoende" telt. */
export const ACTIVE_MINUTES_TARGET = 20;

type Component = {
  weight: number;
  /** Telt dit onderdeel mee voor deze gebruiker? (uitgeschakeld = niet in teller/noemer) */
  enabled: boolean;
  /** Is het onderdeel vandaag behaald? */
  achieved: boolean;
};

function scoreCategory(components: Component[]): {
  points: number;
  max: number;
  percentage: number | null;
  active: boolean;
} {
  const active = components.filter((c) => c.enabled && c.weight > 0);
  const max = active.reduce((sum, c) => sum + c.weight, 0);
  const points = active.reduce((sum, c) => sum + (c.achieved ? c.weight : 0), 0);
  if (max === 0) {
    return { points: 0, max: 0, percentage: null, active: false };
  }
  return { points, max, percentage: Math.round((points / max) * 100), active: true };
}

export function computeBalanceScore(
  log: DailyLog,
  profile: UserProfile,
  weights: BalanceWeights = DEFAULT_BALANCE_WEIGHTS,
): BalanceScore {
  const alcoholEnabled = profile.enabledModules.includes('alcohol');
  const dayAlcoholGoal = Math.round((profile.alcoholSettings.maxGlassesPerWeek ?? 0) / 7);

  const alcoholWithinGoal =
    log.alcoholFree === true ||
    (log.alcoholGlasses !== undefined && log.alcoholGlasses <= dayAlcoholGoal);

  const body = scoreCategory([
    { weight: weights.body.workout, enabled: true, achieved: log.trainingCompleted === true },
    {
      weight: weights.body.activeMinutes,
      enabled: true,
      achieved: (log.activeMinutes ?? 0) >= ACTIVE_MINUTES_TARGET,
    },
    { weight: weights.body.mobility, enabled: true, achieved: log.mobilityDone === true },
    { weight: weights.body.recovery, enabled: true, achieved: log.recoveryMoment === true },
  ]);

  const nutrition = scoreCategory([
    {
      weight: weights.nutrition.water,
      enabled: true,
      achieved: (log.waterGlasses ?? 0) >= profile.waterGoalGlasses,
    },
    {
      weight: weights.nutrition.vegetables,
      enabled: true,
      achieved: (log.vegetablePortions ?? 0) >= profile.vegetableGoalPortions,
    },
    {
      weight: weights.nutrition.fruit,
      enabled: true,
      achieved: (log.fruitPortions ?? 0) >= profile.fruitGoalPortions,
    },
    {
      weight: weights.nutrition.alcohol,
      enabled: alcoholEnabled,
      achieved: alcoholWithinGoal,
    },
  ]);

  const recovery = scoreCategory([
    {
      weight: weights.recovery.sleep,
      enabled: true,
      achieved: (log.sleepHours ?? 0) >= profile.sleepGoalHours,
    },
    {
      weight: weights.recovery.recoveryMoment,
      enabled: true,
      achieved: log.recoveryMoment === true,
    },
    { weight: weights.recovery.energy, enabled: true, achieved: log.energy !== undefined },
    { weight: weights.recovery.stress, enabled: true, achieved: log.stress !== undefined },
  ]);

  const categories: Record<BalanceCategory, ReturnType<typeof scoreCategory>> = {
    body,
    nutrition,
    recovery,
  };

  // Totaal uitsluitend over actieve categorieën — nooit delen door nul.
  const activeCategories = Object.values(categories).filter((c) => c.active);
  const totalMax = activeCategories.reduce((sum, c) => sum + c.max, 0);
  const totalPoints = activeCategories.reduce((sum, c) => sum + c.points, 0);
  const total = totalMax === 0 ? 0 : Math.round((totalPoints / totalMax) * 100);

  return { total, categories };
}
