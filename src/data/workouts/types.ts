export type WorkoutTag =
  | 'fullBody'
  | 'legs'
  | 'upperBody'
  | 'core'
  | 'mobility'
  | 'cardio'
  | 'noJumping'
  | 'withDumbbells'
  | 'withBands'
  | 'withJumpRope'
  | 'withChair'
  | 'beginners'
  | 'lymphFriendly'
  | 'menopauseFriendly'
  | 'calmDay';

export type Workout = {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
  exerciseIds: string[];
  tags: WorkoutTag[];
  /** Alternatieven, bv. zwemmen of wandelen. */
  alternatives?: string[];
  /** Waarschuwing bovenaan (bv. bij springen). */
  warning?: string;
  /** Vrije training: gebruiker voert zelf oefeningen in. */
  freeform?: boolean;
};
