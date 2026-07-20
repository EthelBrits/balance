import type { FigurePose } from '../../features/workouts/ExerciseFigure';

export type Exercise = {
  id: string;
  name: string;
  pose: FigurePose;
  /** Korte uitleg in gewone taal. */
  explanation: string;
  /** Herhalingen of tijd. */
  dosage: string;
  rest: string;
  easier: string;
  harder: string;
  /** "Dit hoort u vooral te voelen in…" */
  feelIn: string;
  focus: string;
  /** Optionele lymfevriendelijke aanpassing. */
  lymphFriendly?: string;
};
