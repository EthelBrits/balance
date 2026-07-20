import type {
  EquipmentType,
  GoalType,
  LimitationType,
  PreferenceType,
} from '../../types';

/** Verzamelde onboarding-invoer voordat er een profiel + eerste meting van gemaakt wordt. */
export type OnboardingDraft = {
  name: string;
  birthDate?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  waistCm?: number;
  hipCm?: number;
  restingHeartRate?: number;
  weighDay: number;
  goals: GoalType[];
  equipment: EquipmentType[];
  preferredDurations: number[];
  preferences: PreferenceType[];
  limitations: LimitationType[];
};

export function emptyDraft(): OnboardingDraft {
  return {
    name: '',
    weighDay: 0,
    goals: [],
    equipment: [],
    preferredDurations: [],
    preferences: [],
    limitations: [],
  };
}
