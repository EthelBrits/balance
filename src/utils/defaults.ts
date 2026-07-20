import type { AppSettings, UserProfile } from '../types';
import { createId } from './id';

/** Nieuw, leeg profiel met verstandige standaardwaarden. */
export function createDefaultProfile(): UserProfile {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: '',
    onboardingCompleted: false,
    tone: 'warm',
    goals: [],
    equipment: [],
    preferences: [],
    preferredDurations: [],
    limitations: [],
    enabledModules: [],
    weighDay: 0, // zondag
    weighFrequency: 'weekly', // standaard wekelijks
    measurementPreferences: { weightUnit: 'kg', lengthUnit: 'cm' },
    waterGoalGlasses: 8,
    fruitGoalPortions: 2,
    vegetableGoalPortions: 3,
    sleepGoalHours: 7.5,
    alcoholSettings: {
      weeklyGoalFreeDays: 3,
      maxGlassesPerWeek: 7,
      typicalMoments: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultSettings(): AppSettings {
  return {
    fontScale: 1,
    remindersEnabled: false,
    reminderTime: '09:00',
    reminderTypes: [],
    hiddenInsightIds: [],
    selectedStrengthTests: [],
  };
}
