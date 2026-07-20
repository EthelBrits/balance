import type {
  AppSettings,
  BodyMeasurement,
  DailyLog,
  StrengthTestResult,
  UserProfile,
  WorkoutLog,
} from '../../types';
import {
  STORAGE_SCHEMA_VERSION,
  type StorageProvider,
  type StorageSnapshot,
} from './StorageProvider';

const KEYS = {
  version: 'mb.schemaVersion',
  profile: 'mb.profile',
  dailyLogs: 'mb.dailyLogs',
  measurements: 'mb.measurements',
  workouts: 'mb.workouts',
  strengthTests: 'mb.strengthTests',
  settings: 'mb.settings',
} as const;

/**
 * Opslag op basis van localStorage. Bewust volledig async, zodat de rest van de
 * app niet hoeft te weten of de opslag lokaal of online is. Lichaamsfoto's staan
 * NIET hier maar in IndexedDB (zie photoStore.ts) wegens het ~5 MB quotum.
 */
export class LocalStorageProvider implements StorageProvider {
  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
    this.ensureVersion();
  }

  private ensureVersion() {
    const raw = this.storage.getItem(KEYS.version);
    if (raw === null) {
      this.storage.setItem(KEYS.version, String(STORAGE_SCHEMA_VERSION));
    }
    // Toekomstige migraties: vergelijk hier de versie en transformeer records.
  }

  private read<T>(key: string, fallback: T): T {
    const raw = this.storage.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  private upsert<T extends { id: string }>(list: T[], item: T): T[] {
    const index = list.findIndex((entry) => entry.id === item.id);
    if (index === -1) return [...list, item];
    const next = list.slice();
    next[index] = item;
    return next;
  }

  async getSchemaVersion(): Promise<number> {
    return Number(this.storage.getItem(KEYS.version) ?? STORAGE_SCHEMA_VERSION);
  }

  async getProfile(): Promise<UserProfile | null> {
    return this.read<UserProfile | null>(KEYS.profile, null);
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    this.write(KEYS.profile, profile);
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    return this.read<DailyLog[]>(KEYS.dailyLogs, []);
  }

  async saveDailyLog(log: DailyLog): Promise<void> {
    const logs = await this.getDailyLogs();
    this.write(KEYS.dailyLogs, this.upsert(logs, log));
  }

  async getMeasurements(): Promise<BodyMeasurement[]> {
    return this.read<BodyMeasurement[]>(KEYS.measurements, []);
  }

  async saveMeasurement(measurement: BodyMeasurement): Promise<void> {
    const list = await this.getMeasurements();
    this.write(KEYS.measurements, this.upsert(list, measurement));
  }

  async deleteMeasurement(id: string): Promise<void> {
    const list = await this.getMeasurements();
    this.write(
      KEYS.measurements,
      list.filter((m) => m.id !== id),
    );
  }

  async getWorkouts(): Promise<WorkoutLog[]> {
    return this.read<WorkoutLog[]>(KEYS.workouts, []);
  }

  async saveWorkout(workout: WorkoutLog): Promise<void> {
    const list = await this.getWorkouts();
    this.write(KEYS.workouts, this.upsert(list, workout));
  }

  async getStrengthTests(): Promise<StrengthTestResult[]> {
    return this.read<StrengthTestResult[]>(KEYS.strengthTests, []);
  }

  async saveStrengthTest(result: StrengthTestResult): Promise<void> {
    const list = await this.getStrengthTests();
    this.write(KEYS.strengthTests, this.upsert(list, result));
  }

  async getSettings(): Promise<AppSettings | null> {
    return this.read<AppSettings | null>(KEYS.settings, null);
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    this.write(KEYS.settings, settings);
  }

  async exportAll(): Promise<StorageSnapshot> {
    return {
      schemaVersion: await this.getSchemaVersion(),
      exportedAt: new Date().toISOString(),
      profile: await this.getProfile(),
      dailyLogs: await this.getDailyLogs(),
      measurements: await this.getMeasurements(),
      workouts: await this.getWorkouts(),
      strengthTests: await this.getStrengthTests(),
      settings: await this.getSettings(),
    };
  }

  async importAll(snapshot: StorageSnapshot): Promise<void> {
    if (snapshot.profile) this.write(KEYS.profile, snapshot.profile);
    this.write(KEYS.dailyLogs, snapshot.dailyLogs ?? []);
    this.write(KEYS.measurements, snapshot.measurements ?? []);
    this.write(KEYS.workouts, snapshot.workouts ?? []);
    this.write(KEYS.strengthTests, snapshot.strengthTests ?? []);
    if (snapshot.settings) this.write(KEYS.settings, snapshot.settings);
  }

  async clearAll(): Promise<void> {
    Object.values(KEYS).forEach((key) => {
      if (key !== KEYS.version) this.storage.removeItem(key);
    });
  }

  async bulkReplaceDailyLogs(logs: DailyLog[]): Promise<void> {
    this.write(KEYS.dailyLogs, logs);
  }

  async bulkReplaceMeasurements(measurements: BodyMeasurement[]): Promise<void> {
    this.write(KEYS.measurements, measurements);
  }

  async bulkReplaceWorkouts(workouts: WorkoutLog[]): Promise<void> {
    this.write(KEYS.workouts, workouts);
  }
}
