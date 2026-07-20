import type { BodyMeasurement, DailyLog } from '../../types';

export type Insight = {
  id: string;
  text: string;
};

/** Drempels (bindend): minstens 14 bruikbare dagen, elke groep minstens 5. */
export const MIN_USABLE_DAYS = 14;
export const MIN_GROUP_DAYS = 5;

function isUsable(log: DailyLog): boolean {
  return (
    log.waterGlasses !== undefined ||
    log.activeMinutes !== undefined ||
    log.energy !== undefined ||
    log.sleepHours !== undefined ||
    log.trainingCompleted !== undefined ||
    log.alcoholFree !== undefined ||
    log.fruitPortions !== undefined ||
    log.vegetablePortions !== undefined
  );
}

function avg(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Berekent inzichten uitsluitend uit lokale gegevens met transparante regels.
 * Altijd geformuleerd als verband ("lijkt samen te hangen met"), nooit als oorzaak.
 * Elk inzicht vermeldt hoeveel dagen of metingen gebruikt zijn.
 */
export function computeInsights(
  logs: DailyLog[],
  measurements: BodyMeasurement[],
  hiddenIds: string[] = [],
): { insights: Insight[]; usableDays: number } {
  const usable = logs.filter(isUsable);
  const usableDays = usable.length;
  const results: Insight[] = [];

  if (usableDays >= MIN_USABLE_DAYS) {
    push(results, energyVsMovement(usable));
    push(results, sleepVsAlcohol(usable));
    push(results, waterVsTraining(usable));
    push(results, legVsMovement(usable));
    push(results, shortVsLongWorkouts(usable));
  }

  // Metingen: buikomtrek daalt terwijl gewicht stabiel blijft.
  if (usableDays >= MIN_USABLE_DAYS) {
    push(results, waistVsWeight(measurements));
  }

  return {
    insights: results.filter((i) => !hiddenIds.includes(i.id)),
    usableDays,
  };
}

function push(list: Insight[], insight: Insight | null) {
  if (insight) list.push(insight);
}

function energyVsMovement(logs: DailyLog[]): Insight | null {
  const active = logs.filter((l) => (l.activeMinutes ?? 0) >= 20 && l.energy !== undefined);
  const less = logs.filter((l) => (l.activeMinutes ?? 0) < 20 && l.energy !== undefined);
  if (active.length < MIN_GROUP_DAYS || less.length < MIN_GROUP_DAYS) return null;
  if (avg(active.map((l) => l.energy!)) > avg(less.map((l) => l.energy!)) + 0.25) {
    return {
      id: 'energy-movement',
      text: `Op dagen met minstens twintig minuten beweging registreerde u gemiddeld meer energie. Gebaseerd op ${active.length} actieve en ${less.length} rustigere dagen.`,
    };
  }
  return null;
}

function sleepVsAlcohol(logs: DailyLog[]): Insight | null {
  const free = logs.filter((l) => l.alcoholFree === true && l.sleepHours !== undefined);
  const drink = logs.filter(
    (l) => l.alcoholFree !== true && (l.alcoholGlasses ?? 0) > 0 && l.sleepHours !== undefined,
  );
  if (free.length < MIN_GROUP_DAYS || drink.length < MIN_GROUP_DAYS) return null;
  if (avg(free.map((l) => l.sleepHours!)) > avg(drink.map((l) => l.sleepHours!)) + 0.2) {
    return {
      id: 'sleep-alcohol',
      text: `Uw gemiddelde slaapduur lijkt samen te hangen met alcoholvrije dagen: die was hoger op de ${free.length} alcoholvrije dagen dan op de ${drink.length} dagen met alcohol.`,
    };
  }
  return null;
}

function waterVsTraining(logs: DailyLog[]): Insight | null {
  const training = logs.filter((l) => l.trainingCompleted === true && l.waterGlasses !== undefined);
  const rest = logs.filter((l) => l.trainingCompleted !== true && l.waterGlasses !== undefined);
  if (training.length < MIN_GROUP_DAYS || rest.length < MIN_GROUP_DAYS) return null;
  if (avg(training.map((l) => l.waterGlasses!)) > avg(rest.map((l) => l.waterGlasses!)) + 0.5) {
    return {
      id: 'water-training',
      text: `U drinkt gemiddeld meer water op trainingsdagen. Gebaseerd op ${training.length} trainingsdagen en ${rest.length} andere dagen.`,
    };
  }
  return null;
}

function legVsMovement(logs: DailyLog[]): Insight | null {
  const heavy = logs.filter(
    (l) => (l.legFeeling === 'heavy' || l.legFeeling === 'moreSwollen') && l.activeMinutes !== undefined,
  );
  const normal = logs.filter((l) => l.legFeeling === 'normal' && l.activeMinutes !== undefined);
  if (heavy.length < MIN_GROUP_DAYS || normal.length < MIN_GROUP_DAYS) return null;
  if (avg(heavy.map((l) => l.activeMinutes!)) < avg(normal.map((l) => l.activeMinutes!)) - 5) {
    return {
      id: 'leg-movement',
      text: `Uw zwaarste beengevoel lijkt samen te hangen met dagen met weinig beweging. Gebaseerd op ${heavy.length} dagen met een zwaar gevoel en ${normal.length} normale dagen.`,
    };
  }
  return null;
}

function shortVsLongWorkouts(logs: DailyLog[]): Insight | null {
  const short = logs.filter(
    (l) => l.trainingCompleted && (l.trainingDurationMinutes ?? 0) > 0 && (l.trainingDurationMinutes ?? 0) <= 15,
  );
  const long = logs.filter((l) => l.trainingCompleted && (l.trainingDurationMinutes ?? 0) >= 25);
  if (short.length < MIN_GROUP_DAYS || long.length < MIN_GROUP_DAYS) return null;
  if (short.length > long.length) {
    return {
      id: 'short-workouts',
      text: `U voltooit korte trainingen vaker dan langere. Gebaseerd op ${short.length} korte en ${long.length} langere trainingen.`,
    };
  }
  return null;
}

function waistVsWeight(measurements: BodyMeasurement[]): Insight | null {
  const waist = measurements
    .filter((m) => m.waistCm !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));
  const weight = measurements
    .filter((m) => m.weightKg !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (waist.length < 2 || weight.length < 2) return null;
  const waistDelta = waist[waist.length - 1].waistCm! - waist[0].waistCm!;
  const weightDelta = weight[weight.length - 1].weightKg! - weight[0].weightKg!;
  if (waistDelta <= -1 && Math.abs(weightDelta) < 1) {
    return {
      id: 'waist-weight',
      text: `Uw buikomtrek daalt, terwijl uw gewicht ongeveer stabiel blijft. Gebaseerd op ${waist.length} buikomtrek- en ${weight.length} gewichtsmetingen.`,
    };
  }
  return null;
}
