import type { StorageSnapshot } from '../../services/storage';
import { STORAGE_SCHEMA_VERSION } from '../../services/storage';

/** Start een download van tekstinhoud in de browser. */
export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function snapshotToJson(snapshot: StorageSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

/** Zet de dagelijkse registraties om naar CSV. */
export function dailyLogsToCsv(snapshot: StorageSnapshot): string {
  const columns = [
    'date',
    'waterGlasses',
    'fruitPortions',
    'vegetablePortions',
    'activeMinutes',
    'trainingCompleted',
    'sleepHours',
    'sleepQuality',
    'energy',
    'recoveryMoment',
    'alcoholGlasses',
    'alcoholFree',
    'stress',
    'balanceTotal',
  ];
  const header = columns.join(',');
  const rows = [...snapshot.dailyLogs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => {
      const values: (string | number | boolean | undefined)[] = [
        log.date,
        log.waterGlasses,
        log.fruitPortions,
        log.vegetablePortions,
        log.activeMinutes,
        log.trainingCompleted,
        log.sleepHours,
        log.sleepQuality,
        log.energy,
        log.recoveryMoment,
        log.alcoholGlasses,
        log.alcoholFree,
        log.stress,
        log.balanceScore?.total,
      ];
      return values.map((v) => (v === undefined ? '' : String(v))).join(',');
    });
  return [header, ...rows].join('\n');
}

export type ImportResult =
  | { ok: true; snapshot: StorageSnapshot }
  | { ok: false; error: string };

/** Valideert en parseert een eerder geëxporteerd JSON-bestand. */
export function parseImport(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Het bestand is geen geldige JSON. Kies een eerder geëxporteerd bestand.' };
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'Het bestand heeft niet de verwachte structuur.' };
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.schemaVersion !== 'number') {
    return { ok: false, error: 'Het bestand mist een schemaversie en kan niet worden ingelezen.' };
  }
  if (obj.schemaVersion > STORAGE_SCHEMA_VERSION) {
    return {
      ok: false,
      error: 'Dit bestand komt uit een nieuwere versie van de app en kan hier niet worden ingelezen.',
    };
  }
  for (const key of ['dailyLogs', 'measurements', 'workouts'] as const) {
    if (obj[key] !== undefined && !Array.isArray(obj[key])) {
      return { ok: false, error: `Het veld "${key}" heeft niet de verwachte vorm.` };
    }
  }
  const snapshot: StorageSnapshot = {
    schemaVersion: obj.schemaVersion,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    profile: (obj.profile as StorageSnapshot['profile']) ?? null,
    dailyLogs: (obj.dailyLogs as StorageSnapshot['dailyLogs']) ?? [],
    measurements: (obj.measurements as StorageSnapshot['measurements']) ?? [],
    workouts: (obj.workouts as StorageSnapshot['workouts']) ?? [],
    strengthTests: (obj.strengthTests as StorageSnapshot['strengthTests']) ?? [],
    settings: (obj.settings as StorageSnapshot['settings']) ?? null,
  };
  return { ok: true, snapshot };
}
