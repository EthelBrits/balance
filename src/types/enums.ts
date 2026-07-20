/** Keuzelijsten die op meerdere plaatsen gedeeld worden. */

export type ToneType = 'warm' | 'business' | 'dryHumor';

export type GoalType =
  | 'moveMore'
  | 'getStronger'
  | 'loseWeight'
  | 'reduceWaist'
  | 'moreEnergy'
  | 'betterSleep'
  | 'drinkWater'
  | 'moreVegFruit'
  | 'lessAlcohol'
  | 'buildRoutine'
  | 'improveFitness'
  | 'betterRecovery';

export type EquipmentType =
  | 'none'
  | 'mat'
  | 'dumbbellsSmall'
  | 'dumbbellsAdjustable'
  | 'bands'
  | 'minibands'
  | 'jumpRope'
  | 'chair'
  | 'stairs'
  | 'homeTrainer'
  | 'pool'
  | 'other';

export type LimitationType =
  | 'back'
  | 'knee'
  | 'hip'
  | 'shoulder'
  | 'balance'
  | 'heartLung'
  | 'recentSurgery'
  | 'pregnancy'
  | 'menopause'
  | 'lymphedema'
  | 'other';

export type ModuleType = 'alcohol' | 'lymphedema' | 'smoking' | 'vaping';

export type PreferenceType =
  | 'calm'
  | 'varied'
  | 'strength'
  | 'cardio'
  | 'walking'
  | 'swimming'
  | 'dance'
  | 'noJumping'
  | 'chairTraining'
  | 'floorExercises'
  | 'shortWorkouts'
  | 'lowMotivation';

export type WeighFrequency = 'weekly' | 'daily';

export type MeasurementPreferences = {
  weightUnit: 'kg';
  lengthUnit: 'cm';
};
