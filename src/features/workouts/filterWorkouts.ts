import type { UserProfile } from '../../types';
import type { Workout, WorkoutTag } from '../../data/workouts/types';
import { DURATION_FILTERS } from '../../data/workouts/workouts';

export type WorkoutFilters = {
  duration?: number;
  tags: WorkoutTag[];
};

export function emptyFilters(): WorkoutFilters {
  return { tags: [] };
}

/** Bepaalt of een training bij de gekozen filters past. */
export function matchesFilters(workout: Workout, filters: WorkoutFilters): boolean {
  if (workout.freeform) return filters.tags.length === 0 && filters.duration === undefined;
  if (filters.duration !== undefined) {
    // 30 betekent "30 of langer"; overige filters exact.
    const isLongest = filters.duration === DURATION_FILTERS[DURATION_FILTERS.length - 1];
    const ok = isLongest
      ? workout.durationMinutes >= filters.duration
      : workout.durationMinutes === filters.duration;
    if (!ok) return false;
  }
  return filters.tags.every((tag) => workout.tags.includes(tag));
}

/**
 * Sorteert trainingen zo dat rustige/lymfevriendelijke opties bovenaan komen
 * wanneer de gebruiker lymfoedeem heeft aangevinkt.
 */
export function orderForProfile(workouts: Workout[], profile: UserProfile | null): Workout[] {
  const hasLymph = profile?.limitations.includes('lymphedema');
  if (!hasLymph) return workouts;
  return [...workouts].sort((a, b) => {
    const score = (w: Workout) =>
      (w.tags.includes('lymphFriendly') ? -2 : 0) + (w.tags.includes('calmDay') ? -1 : 0);
    return score(a) - score(b);
  });
}

/** Waarschuwt of een training springen bevat terwijl het profiel dat afraadt. */
export function shouldSuggestNoJump(workout: Workout, profile: UserProfile | null): boolean {
  if (!profile) return false;
  const avoids =
    profile.limitations.includes('lymphedema') || profile.preferences.includes('noJumping');
  return avoids && workout.tags.includes('withJumpRope');
}
