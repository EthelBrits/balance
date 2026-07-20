import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';
import { useStore } from '../../store/useStore';
import { WORKOUTS, DURATION_FILTERS, TAG_FILTER_LABELS } from '../../data/workouts/workouts';
import type { WorkoutTag } from '../../data/workouts/types';
import { WorkoutCard } from './WorkoutCard';
import { StrengthProgress } from './StrengthProgress';
import { emptyFilters, matchesFilters, orderForProfile } from './filterWorkouts';

const ALL_TAGS = Object.keys(TAG_FILTER_LABELS) as WorkoutTag[];

export function TrainingPage() {
  const profile = useStore((s) => s.profile);
  const [filters, setFilters] = useState(emptyFilters);

  const lymphMode = profile?.limitations.includes('lymphedema') ?? false;

  const visible = useMemo(() => {
    const matched = WORKOUTS.filter((w) => matchesFilters(w, filters));
    return orderForProfile(matched, profile);
  }, [filters, profile]);

  function toggleTag(tag: WorkoutTag) {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function setDuration(minutes: number) {
    setFilters((f) => ({ ...f, duration: f.duration === minutes ? undefined : minutes }));
  }

  const hasFilters = filters.duration !== undefined || filters.tags.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        subtitle="Korte, haalbare sessies op uw tempo."
        action={
          hasFilters ? (
            <button className="btn-ghost" onClick={() => setFilters(emptyFilters())}>
              Filters wissen
            </button>
          ) : undefined
        }
      />

      {lymphMode && (
        <p className="rounded-xl bg-primary-light/60 px-4 py-3 text-sm text-primary-dark">
          Rustige en lymfevriendelijke trainingen worden voor u bovenaan getoond.
        </p>
      )}

      <section aria-label="Filters" className="space-y-3">
        <div>
          <p className="label-text">Tijd</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_FILTERS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                aria-pressed={filters.duration === minutes}
                onClick={() => setDuration(minutes)}
                className={`chip ${filters.duration === minutes ? 'chip-active' : ''}`}
              >
                {minutes === 30 ? '30+ min' : `${minutes} min`}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label-text">Type en materiaal</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={`chip ${filters.tags.includes(tag) ? 'chip-active' : ''}`}
              >
                {TAG_FILTER_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {visible.length === 0 ? (
          <EmptyState
            title="Geen training gevonden"
            description="Pas de filters aan om meer trainingen te zien."
          >
            <button className="btn-secondary" onClick={() => setFilters(emptyFilters())}>
              Filters wissen
            </button>
          </EmptyState>
        ) : (
          visible.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} lymphMode={lymphMode} />
          ))
        )}
      </div>

      <hr className="border-sand" />
      <StrengthProgress />
    </div>
  );
}
