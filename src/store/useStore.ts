import { create } from 'zustand';
import type {
  AppSettings,
  BodyMeasurement,
  DailyLog,
  StrengthTestResult,
  UserProfile,
  WorkoutLog,
} from '../types';
import { storage, type StorageSnapshot } from '../services/storage';
import { createDefaultSettings } from '../utils/defaults';
import { createId } from '../utils/id';
import { todayISO } from '../utils/date';
import { computeBalanceScore } from '../features/dashboard/balanceScore';

type StoreState = {
  loaded: boolean;
  profile: UserProfile | null;
  settings: AppSettings;
  dailyLogs: DailyLog[];
  measurements: BodyMeasurement[];
  workouts: WorkoutLog[];
  strengthTests: StrengthTestResult[];

  init: () => Promise<void>;

  saveProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;

  getLog: (date: string) => DailyLog | undefined;
  updateDailyLog: (date: string, patch: Partial<DailyLog>) => Promise<void>;

  saveMeasurement: (measurement: BodyMeasurement) => Promise<void>;
  deleteMeasurement: (id: string) => Promise<void>;

  saveWorkout: (workout: WorkoutLog) => Promise<void>;

  saveStrengthTest: (result: StrengthTestResult) => Promise<void>;

  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;

  exportAll: () => Promise<StorageSnapshot>;
  importAll: (snapshot: StorageSnapshot) => Promise<void>;
  clearAll: () => Promise<void>;
  replaceDemoData: (data: {
    logs: DailyLog[];
    measurements: BodyMeasurement[];
    workouts: WorkoutLog[];
  }) => Promise<void>;
};

/** Herberekent de balansscore van een log op basis van het profiel. */
function withScore(log: DailyLog, profile: UserProfile | null): DailyLog {
  if (!profile) return log;
  return { ...log, balanceScore: computeBalanceScore(log, profile) };
}

export const useStore = create<StoreState>((set, get) => ({
  loaded: false,
  profile: null,
  settings: createDefaultSettings(),
  dailyLogs: [],
  measurements: [],
  workouts: [],
  strengthTests: [],

  async init() {
    const [profile, settings, dailyLogs, measurements, workouts, strengthTests] = await Promise.all(
      [
        storage.getProfile(),
        storage.getSettings(),
        storage.getDailyLogs(),
        storage.getMeasurements(),
        storage.getWorkouts(),
        storage.getStrengthTests(),
      ],
    );
    set({
      loaded: true,
      profile,
      settings: settings ?? createDefaultSettings(),
      dailyLogs,
      measurements,
      workouts,
      strengthTests,
    });
  },

  async saveProfile(profile) {
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    await storage.saveProfile(updated);
    set({ profile: updated });
    // Herbereken scores omdat doelen/modules kunnen zijn gewijzigd.
    const rescored = get().dailyLogs.map((log) => withScore(log, updated));
    await Promise.all(rescored.map((log) => storage.saveDailyLog(log)));
    set({ dailyLogs: rescored });
  },

  async updateProfile(patch) {
    const current = get().profile;
    if (!current) return;
    await get().saveProfile({ ...current, ...patch });
  },

  getLog(date) {
    return get().dailyLogs.find((log) => log.date === date);
  },

  async updateDailyLog(date, patch) {
    const now = new Date().toISOString();
    const existing = get().getLog(date);
    const base: DailyLog =
      existing ?? { id: createId(), date, createdAt: now, updatedAt: now };
    const merged = withScore({ ...base, ...patch, updatedAt: now }, get().profile);
    await storage.saveDailyLog(merged);
    const others = get().dailyLogs.filter((log) => log.date !== date);
    set({ dailyLogs: [...others, merged] });
  },

  async saveMeasurement(measurement) {
    await storage.saveMeasurement(measurement);
    const others = get().measurements.filter((m) => m.id !== measurement.id);
    set({ measurements: [...others, measurement] });
  },

  async deleteMeasurement(id) {
    await storage.deleteMeasurement(id);
    set({ measurements: get().measurements.filter((m) => m.id !== id) });
  },

  async saveWorkout(workout) {
    await storage.saveWorkout(workout);
    const others = get().workouts.filter((w) => w.id !== workout.id);
    set({ workouts: [...others, workout] });
  },

  async saveStrengthTest(result) {
    await storage.saveStrengthTest(result);
    const others = get().strengthTests.filter((t) => t.id !== result.id);
    set({ strengthTests: [...others, result] });
  },

  async updateSettings(patch) {
    const next = { ...get().settings, ...patch };
    await storage.saveSettings(next);
    set({ settings: next });
  },

  async exportAll() {
    return storage.exportAll();
  },

  async importAll(snapshot) {
    await storage.importAll(snapshot);
    await get().init();
  },

  async clearAll() {
    await storage.clearAll();
    set({
      profile: null,
      settings: createDefaultSettings(),
      dailyLogs: [],
      measurements: [],
      workouts: [],
      strengthTests: [],
    });
  },

  async replaceDemoData({ logs, measurements, workouts }) {
    const scored = logs.map((log) => withScore(log, get().profile));
    await storage.bulkReplaceDailyLogs(scored);
    await storage.bulkReplaceMeasurements(measurements);
    await storage.bulkReplaceWorkouts(workouts);
    set({ dailyLogs: scored, measurements, workouts });
  },
}));

export { todayISO };
