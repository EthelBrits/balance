import type {
  EquipmentType,
  GoalType,
  LimitationType,
  ModuleType,
  PreferenceType,
  StrengthTestType,
  ToneType,
} from '../../types';

export const GOAL_LABELS: Record<GoalType, string> = {
  moveMore: 'Meer bewegen',
  getStronger: 'Sterker worden',
  loseWeight: 'Gewicht verminderen',
  reduceWaist: 'Buikomtrek verminderen',
  moreEnergy: 'Meer energie',
  betterSleep: 'Beter slapen',
  drinkWater: 'Voldoende water drinken',
  moreVegFruit: 'Meer groenten en fruit',
  lessAlcohol: 'Minder alcohol',
  buildRoutine: 'Regelmaat opbouwen',
  improveFitness: 'Conditie verbeteren',
  betterRecovery: 'Beter herstellen',
};

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  none: 'Geen',
  mat: 'Mat',
  dumbbellsSmall: 'Kleine halters',
  dumbbellsAdjustable: 'Verstelbare gewichten',
  bands: 'Elastieken',
  minibands: 'Minibands',
  jumpRope: 'Springtouw',
  chair: 'Stoel',
  stairs: 'Trap',
  homeTrainer: 'Hometrainer',
  pool: 'Zwembad',
  other: 'Ander materiaal',
};

export const LIMITATION_LABELS: Record<LimitationType, string> = {
  back: 'Rugklachten',
  knee: 'Knieklachten',
  hip: 'Heupklachten',
  shoulder: 'Schouderklachten',
  balance: 'Evenwichtsproblemen',
  heartLung: 'Hart- of longproblemen',
  recentSurgery: 'Recente operatie',
  pregnancy: 'Zwangerschap',
  menopause: 'Perimenopauze of menopauze',
  lymphedema: 'Lymfoedeem',
  other: 'Andere beperking',
};

export const PREFERENCE_LABELS: Record<PreferenceType, string> = {
  calm: 'Rustig',
  varied: 'Afwisselend',
  strength: 'Kracht',
  cardio: 'Cardio',
  walking: 'Wandelen',
  swimming: 'Zwemmen',
  dance: 'Dans',
  noJumping: 'Liever niet springen',
  chairTraining: 'Stoeltraining',
  floorExercises: 'Oefeningen op de grond',
  shortWorkouts: 'Korte trainingen',
  lowMotivation: 'Ik heb weinig zin om te sporten',
};

export const MODULE_LABELS: Record<ModuleType, string> = {
  alcohol: 'Alcohol',
  lymphedema: 'Zwaar gevoel / lymfoedeem',
  smoking: 'Roken',
  vaping: 'Vapen',
};

export const TONE_LABELS: Record<ToneType, string> = {
  warm: 'Warm en nuchter',
  business: 'Zakelijk',
  dryHumor: 'Droge humor',
};

export const TONE_EXAMPLES: Record<ToneType, string> = {
  warm: '“Goed bezig. Nog één kleine stap voor vandaag.”',
  business: '“Vandaag staan nog twee doelen open.”',
  dryHumor: '“Uw drinkfles begint zich wat genegeerd te voelen.”',
};

export const STRENGTH_TEST_LABELS: Record<StrengthTestType, string> = {
  chairStand30s: 'Stoelopstaan in 30 seconden',
  wallSit: 'Wall sit (seconden)',
  plank: 'Plank of verhoogde plank (seconden)',
  gobletSquatWeight: 'Goblet squat-gewicht (kg)',
  rowWeight: 'Roeigewicht (kg)',
  wallPushups: 'Aantal wall push-ups',
  singleLegBalance: 'Balans op één been (seconden)',
};

export const STRENGTH_TEST_UNITS: Record<StrengthTestType, string> = {
  chairStand30s: 'keer',
  wallSit: 'sec',
  plank: 'sec',
  gobletSquatWeight: 'kg',
  rowWeight: 'kg',
  wallPushups: 'keer',
  singleLegBalance: 'sec',
};

export const WEEKDAY_LABELS = [
  'Zondag',
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag',
];

export const ALCOHOL_MOMENTS = [
  'Na het werk',
  'Bij stress',
  'Weekend',
  'Sociaal',
  'Bij eten',
  'Verveling',
];
