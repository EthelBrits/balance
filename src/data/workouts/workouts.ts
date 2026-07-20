import type { Workout, WorkoutTag } from './types';

export const WORKOUTS: Workout[] = [
  {
    id: 'full-body-20',
    name: 'Volledige lichaam — 20 min',
    durationMinutes: 20,
    description: 'Een rustige, evenwichtige sessie voor het hele lichaam.',
    exerciseIds: [
      'gobletSquat',
      'dumbbellRow',
      'romanianDeadlift',
      'shoulderPress',
      'gluteBridge',
      'deadBug',
    ],
    tags: ['fullBody', 'withDumbbells', 'menopauseFriendly'],
    alternatives: ['Zwemmen', 'Stevig wandelen'],
  },
  {
    id: 'full-body-10',
    name: 'Volledige lichaam — 10 min',
    durationMinutes: 10,
    description: 'Kort en toegankelijk, met weinig of geen materiaal.',
    exerciseIds: ['sitToStand', 'bandRow', 'wallPushup', 'calfRaise', 'marching'],
    tags: ['fullBody', 'beginners', 'withChair', 'withBands', 'noJumping'],
    alternatives: ['Zwemmen', 'Wandeling'],
  },
  {
    id: 'legs-core-20',
    name: 'Benen en core — 20 min',
    durationMinutes: 20,
    description: 'Aandacht voor de benen, bilspieren en romp.',
    exerciseIds: ['squat', 'reverseLunge', 'gluteBridge', 'sideSteps', 'deadBug', 'birdDog'],
    tags: ['legs', 'core', 'withBands', 'noJumping'],
  },
  {
    id: 'upper-body-15',
    name: 'Bovenlichaam — 15 min',
    durationMinutes: 15,
    description: 'Voor armen, schouders en rug.',
    exerciseIds: [
      'floorChestPress',
      'oneArmRow',
      'shoulderPress',
      'bicepsCurl',
      'tricepsExtension',
      'bandPullApart',
    ],
    tags: ['upperBody', 'withDumbbells', 'withBands', 'noJumping'],
  },
  {
    id: 'jumprope-light-10',
    name: 'Springtouw light — 10 min',
    durationMinutes: 10,
    description: 'Rustige intervallen. Altijd met een alternatief zonder springen.',
    exerciseIds: ['jumpRopeLight', 'marching', 'calfRaise'],
    tags: ['cardio', 'withJumpRope'],
    warning:
      'Wie klachten heeft aan de bekkenbodem of gewrichten, of lymfoedeem, kan het alternatief zonder springen kiezen (stappen of marcheren).',
    alternatives: ['Marcheren ter plaatse', 'Stevig wandelen'],
  },
  {
    id: 'bands-15',
    name: 'Elastieken — 15 min',
    durationMinutes: 15,
    description: 'Een volledige sessie met elastieken.',
    exerciseIds: ['lateralWalk', 'seatedRow', 'bandPullApart', 'gluteKickback', 'pallofPress', 'facePull'],
    tags: ['fullBody', 'withBands', 'noJumping'],
  },
  {
    id: 'lymph-friendly-10',
    name: 'Lymfevriendelijke rustige sessie — 10 min',
    durationMinutes: 10,
    description:
      'Een kalme sessie met rustige mobiliteit en kuitpompbewegingen. Voorzichtig opgebouwd, geen behandeling.',
    exerciseIds: ['deepBreathing', 'anklePumps', 'calfRaise', 'marching', 'squat', 'gentleMobility', 'legUp'],
    tags: ['lymphFriendly', 'calmDay', 'mobility', 'noJumping', 'beginners'],
    alternatives: ['Zwemmen'],
  },
  {
    id: 'no-motivation-5',
    name: 'Geen zin-training — 5 min',
    durationMinutes: 5,
    description: 'Voor dagen waarop zelfs tien minuten ambitieus klinkt.',
    exerciseIds: ['sitToStand', 'wallPushup', 'marching', 'bandRow', 'deepBreathing'],
    tags: ['fullBody', 'beginners', 'calmDay', 'noJumping', 'withChair'],
  },
  {
    id: 'mobility-10',
    name: 'Mobiliteit — 10 min',
    durationMinutes: 10,
    description: 'Rustige mobiliteit voor nek, rug, heupen en enkels.',
    exerciseIds: [
      'neckShoulders',
      'thoracicRotation',
      'hipMobility',
      'ankleMobility',
      'catCow',
      'hamstringMobility',
    ],
    tags: ['mobility', 'calmDay', 'noJumping', 'beginners'],
  },
  {
    id: 'freeform',
    name: 'Vrije training',
    durationMinutes: 0,
    description: 'Voer zelf oefeningen, gewicht, sets en herhalingen in.',
    exerciseIds: [],
    tags: [],
    freeform: true,
  },
];

export const WORKOUT_BY_ID: Record<string, Workout> = Object.fromEntries(
  WORKOUTS.map((w) => [w.id, w]),
);

export const DURATION_FILTERS = [5, 10, 15, 20, 30];

export const TAG_FILTER_LABELS: Record<WorkoutTag, string> = {
  fullBody: 'Volledige lichaam',
  legs: 'Benen',
  upperBody: 'Bovenlichaam',
  core: 'Core',
  mobility: 'Mobiliteit',
  cardio: 'Conditie',
  noJumping: 'Zonder springen',
  withDumbbells: 'Met halters',
  withBands: 'Met elastieken',
  withJumpRope: 'Met springtouw',
  withChair: 'Met stoel',
  beginners: 'Beginners',
  lymphFriendly: 'Lymfevriendelijk',
  menopauseFriendly: 'Menopauzevriendelijk',
  calmDay: 'Rustige dag',
};
