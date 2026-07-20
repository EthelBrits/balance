import type {
  AppSettings,
  BodyMeasurement,
  DailyLog,
  StrengthTestResult,
  UserProfile,
  WorkoutLog,
} from '../../types';

/** Huidige versie van het opslagschema — voor toekomstige migraties. */
export const STORAGE_SCHEMA_VERSION = 1;

/**
 * Opslaginterface. Alles is async — ook al is localStorage synchroon — zodat een
 * latere online opslag (bijv. Firestore) zonder aanpassing van de store inplugbaar is.
 */
export interface StorageProvider {
  getSchemaVersion(): Promise<number>;

  getProfile(): Promise<UserProfile | null>;
  saveProfile(profile: UserProfile): Promise<void>;

  getDailyLogs(): Promise<DailyLog[]>;
  saveDailyLog(log: DailyLog): Promise<void>;

  getMeasurements(): Promise<BodyMeasurement[]>;
  saveMeasurement(measurement: BodyMeasurement): Promise<void>;
  deleteMeasurement(id: string): Promise<void>;

  getWorkouts(): Promise<WorkoutLog[]>;
  saveWorkout(workout: WorkoutLog): Promise<void>;

  getStrengthTests(): Promise<StrengthTestResult[]>;
  saveStrengthTest(result: StrengthTestResult): Promise<void>;

  getSettings(): Promise<AppSettings | null>;
  saveSettings(settings: AppSettings): Promise<void>;

  /** Volledige export van alle niet-fotogegevens. */
  exportAll(): Promise<StorageSnapshot>;
  /** Import van een eerder gemaakte snapshot. */
  importAll(snapshot: StorageSnapshot): Promise<void>;
  /** Wist alle lokale gegevens (niet de foto's — die staan in IndexedDB). */
  clearAll(): Promise<void>;

  /** Vervangt alle records van één type in bulk (voor demodata). */
  bulkReplaceDailyLogs(logs: DailyLog[]): Promise<void>;
  bulkReplaceMeasurements(measurements: BodyMeasurement[]): Promise<void>;
  bulkReplaceWorkouts(workouts: WorkoutLog[]): Promise<void>;
}

export type StorageSnapshot = {
  schemaVersion: number;
  exportedAt: string;
  profile: UserProfile | null;
  dailyLogs: DailyLog[];
  measurements: BodyMeasurement[];
  workouts: WorkoutLog[];
  strengthTests: StrengthTestResult[];
  settings: AppSettings | null;
};
