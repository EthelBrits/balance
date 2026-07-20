import type {
  EquipmentType,
  GoalType,
  LimitationType,
  MeasurementPreferences,
  ModuleType,
  PreferenceType,
  ToneType,
  WeighFrequency,
} from './enums';

export type BalanceCategory = 'body' | 'nutrition' | 'recovery';

export type BalanceCategoryScore = {
  /** Behaalde punten binnen deze categorie. */
  points: number;
  /** Maximaal haalbare punten voor deze gebruiker (uitgeschakelde delen tellen niet mee). */
  max: number;
  /** Percentage, of null wanneer de categorie niet actief is (max = 0). */
  percentage: number | null;
  active: boolean;
};

export type BalanceScore = {
  total: number; // 0-100, over de actieve categorieën
  categories: Record<BalanceCategory, BalanceCategoryScore>;
};

export type UserProfile = {
  id: string;
  name: string;
  birthDate?: string;
  age?: number;
  heightCm?: number;
  onboardingCompleted: boolean;
  tone: ToneType;
  goals: GoalType[];
  equipment: EquipmentType[];
  preferences: PreferenceType[];
  preferredDurations: number[];
  limitations: LimitationType[];
  enabledModules: ModuleType[];
  weighDay: number; // 0 = zondag
  weighFrequency: WeighFrequency; // standaard "weekly"
  measurementPreferences: MeasurementPreferences;
  waterGoalGlasses: number;
  fruitGoalPortions: number;
  vegetableGoalPortions: number;
  sleepGoalHours: number;
  alcoholSettings: AlcoholSettings;
  createdAt: string;
  updatedAt: string;
};

export type AlcoholSettings = {
  weeklyGoalFreeDays: number;
  maxGlassesPerWeek: number;
  typicalMoments: string[];
};

export type SleepQuality = 1 | 2 | 3;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type StressLevel = 1 | 2 | 3 | 4 | 5;
export type LegFeeling = 'normal' | 'slightlyHeavy' | 'heavy' | 'moreSwollen';

export type DailyLog = {
  id: string;
  date: string; // ISO, yyyy-MM-dd
  waterGlasses?: number;
  fruitPortions?: number;
  vegetablePortions?: number;
  activeMinutes?: number;
  mobilityDone?: boolean;
  trainingCompleted?: boolean;
  trainingType?: string;
  trainingDurationMinutes?: number;
  trainingEffort?: 'light' | 'moderate' | 'hard';
  sleepHours?: number;
  sleepQuality?: SleepQuality;
  energy?: EnergyLevel;
  recoveryMoment?: boolean;
  alcoholGlasses?: number;
  alcoholFree?: boolean;
  alcoholTrigger?: string;
  alcoholAlternative?: string;
  legFeeling?: LegFeeling;
  legNote?: string;
  stress?: StressLevel;
  notes?: string;
  balanceScore?: BalanceScore;
  /** Gemarkeerd wanneer gegenereerd door demodata. */
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BodyMeasurement = {
  id: string;
  date: string;
  weightKg?: number;
  waistCm?: number;
  hipCm?: number;
  thighLeftCm?: number;
  thighRightCm?: number;
  upperArmCm?: number;
  restingHeartRate?: number;
  systolic?: number;
  diastolic?: number;
  note?: string;
  /** Gemarkeerd wanneer gegenereerd door demodata. */
  demo?: boolean;
};

export type ExerciseLog = {
  exerciseId: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  perceivedEffort?: 1 | 2 | 3 | 4 | 5;
};

export type WorkoutLog = {
  id: string;
  workoutId?: string;
  date: string;
  durationMinutes: number;
  exercises: ExerciseLog[];
  effort: 'light' | 'moderate' | 'hard';
  energyBefore?: number;
  energyAfter?: number;
  pain?: boolean;
  swellingChange?: boolean;
  note?: string;
  demo?: boolean;
};

/**
 * Generieke gewoontemodule. Alcohol is de eerste implementatie; roken, vapen,
 * frisdrank, snoep en energiedranken passen later in dezelfde structuur.
 */
export type HabitModuleField = {
  key: string;
  label: string;
  type: 'counter' | 'boolean' | 'text' | 'select';
  options?: string[];
};

export type HabitModule = {
  id: ModuleType;
  label: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  dayFields: HabitModuleField[];
};

/** Persoonlijke krachttest. */
export type StrengthTestType =
  | 'chairStand30s'
  | 'wallSit'
  | 'plank'
  | 'gobletSquatWeight'
  | 'rowWeight'
  | 'wallPushups'
  | 'singleLegBalance';

export type StrengthTestResult = {
  id: string;
  testType: StrengthTestType;
  date: string;
  value: number;
  unit: string;
  note?: string;
};

export type AppSettings = {
  fontScale: number;
  remindersEnabled: boolean;
  reminderTime: string; // "HH:mm"
  reminderTypes: string[];
  hiddenInsightIds: string[];
  selectedStrengthTests: StrengthTestType[];
};
