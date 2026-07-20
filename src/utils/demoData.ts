import { subDays } from 'date-fns';
import type { BodyMeasurement, DailyLog, UserProfile, WorkoutLog } from '../types';
import { toISODate } from './date';
import { createId } from './id';

/**
 * Genereert twaalf weken realistische demogegevens: dalende buikomtrek, licht
 * schommelend gewicht, geleidelijk meer kracht, wisselende energie, meer
 * alcoholvrije dagen en regelmatige maar niet perfecte trainingsweken.
 *
 * Alle records worden gemarkeerd met demo: true. Wordt UITSLUITEND op expliciete
 * klik uitgevoerd, nooit automatisch bij een lege database.
 */
export function generateDemoData(profile: UserProfile | null): {
  logs: DailyLog[];
  measurements: BodyMeasurement[];
  workouts: WorkoutLog[];
} {
  const days = 84; // 12 weken
  const now = new Date().toISOString();
  const logs: DailyLog[] = [];
  const measurements: BodyMeasurement[] = [];
  const workouts: WorkoutLog[] = [];

  const alcoholEnabled = profile?.enabledModules.includes('alcohol') ?? true;

  // Pseudo-willekeur op basis van dagindex (deterministisch, geen Math.random).
  const wobble = (i: number, amp: number, period: number) =>
    Math.sin((i / period) * Math.PI * 2) * amp;

  for (let d = days - 1; d >= 0; d--) {
    const date = toISODate(subDays(new Date(), d));
    const i = days - 1 - d; // 0 .. days-1, oplopend in de tijd
    const weekday = subDays(new Date(), d).getDay();
    const progress = i / days;

    // Niet elke dag ingevuld: sla af en toe een dag over.
    if (i % 9 === 4) continue;

    const trained = weekday === 1 || weekday === 3 || (weekday === 5 && i % 2 === 0);
    const activeMinutes = trained ? 25 + Math.round(wobble(i, 8, 11)) : 10 + Math.round(wobble(i, 6, 7) + 4);
    // Meer alcoholvrije dagen naarmate de tijd vordert.
    const alcoholFree = alcoholEnabled ? (i + weekday) % 7 >= (progress > 0.5 ? 3 : 4) : false;

    const log: DailyLog = {
      id: createId(),
      date,
      demo: true,
      waterGlasses: 5 + Math.round(wobble(i, 2, 6)) + (trained ? 2 : 0),
      fruitPortions: (i % 3) as 0 | 1 | 2,
      vegetablePortions: 1 + ((i % 3) as 0 | 1 | 2),
      activeMinutes: Math.max(0, activeMinutes),
      mobilityDone: i % 4 === 0,
      trainingCompleted: trained,
      trainingDurationMinutes: trained ? (i % 2 === 0 ? 20 : 10) : undefined,
      trainingEffort: trained ? 'moderate' : undefined,
      sleepHours: 6.5 + wobble(i, 1, 9) + progress * 0.5,
      sleepQuality: (1 + ((i % 3) as 0 | 1 | 2)) as 1 | 2 | 3,
      energy: clampEnergy(3 + Math.round(wobble(i, 1.4, 8) + progress)),
      recoveryMoment: weekday === 0 || i % 5 === 0,
      stress: clampStress(3 - Math.round(progress) + (i % 4 === 0 ? 1 : 0)),
      alcoholFree,
      alcoholGlasses: alcoholEnabled ? (alcoholFree ? 0 : 1 + (i % 2)) : undefined,
      createdAt: now,
      updatedAt: now,
    };
    logs.push(log);

    if (trained) {
      workouts.push({
        id: createId(),
        date,
        demo: true,
        durationMinutes: log.trainingDurationMinutes ?? 20,
        exercises: [],
        effort: 'moderate',
        energyBefore: log.energy,
        energyAfter: log.energy,
      });
    }
  }

  // Wekelijkse metingen: buikomtrek daalt geleidelijk, gewicht schommelt licht.
  const startWaist = profile?.heightCm ? 92 : 92;
  const startWeight = 78;
  for (let w = 12; w >= 0; w--) {
    const date = toISODate(subDays(new Date(), w * 7));
    const t = (12 - w) / 12;
    measurements.push({
      id: createId(),
      date,
      demo: true,
      weightKg: Math.round((startWeight - t * 1.5 + Math.sin(w) * 0.6) * 10) / 10,
      waistCm: Math.round((startWaist - t * 4 + Math.sin(w) * 0.4) * 10) / 10,
      restingHeartRate: 72 - Math.round(t * 4),
    });
  }

  return { logs, measurements, workouts };
}

function clampEnergy(n: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.max(1, n)) as 1 | 2 | 3 | 4 | 5;
}
function clampStress(n: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.max(1, n)) as 1 | 2 | 3 | 4 | 5;
}
