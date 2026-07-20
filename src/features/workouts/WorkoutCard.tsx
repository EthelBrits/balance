import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, ChevronDown, AlertTriangle } from 'lucide-react';
import type { Workout } from '../../data/workouts/types';
import { TAG_FILTER_LABELS } from '../../data/workouts/workouts';
import { EXERCISE_BY_ID } from '../../data/exercises/exercises';
import { ExerciseDetail } from './ExerciseDetail';

export function WorkoutCard({ workout, lymphMode }: { workout: Workout; lymphMode?: boolean }) {
  const navigate = useNavigate();
  const [showExercises, setShowExercises] = useState(false);

  return (
    <article className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-text">{workout.name}</h3>
          <p className="mt-1 text-sm text-text-muted">{workout.description}</p>
        </div>
        {workout.durationMinutes > 0 && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-sand px-3 py-1 text-sm text-text-muted">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {workout.durationMinutes} min
          </span>
        )}
      </div>

      {workout.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {workout.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs text-primary-dark">
              {TAG_FILTER_LABELS[tag]}
            </li>
          ))}
        </ul>
      )}

      {workout.warning && (
        <div className="mt-3 flex gap-2 rounded-lg bg-warning/10 p-3 text-sm text-text">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          <span>{workout.warning}</span>
        </div>
      )}

      {workout.alternatives && workout.alternatives.length > 0 && (
        <p className="mt-3 text-sm text-text-muted">
          Alternatief: {workout.alternatives.join(' · ')}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="btn-primary" onClick={() => navigate(`/training/speler/${workout.id}`)}>
          <Play className="h-4 w-4" aria-hidden="true" />
          {workout.freeform ? 'Vrije training starten' : 'Start training'}
        </button>
        {!workout.freeform && (
          <button
            className="btn-ghost"
            aria-expanded={showExercises}
            onClick={() => setShowExercises((s) => !s)}
          >
            Oefeningen bekijken
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showExercises ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {showExercises && (
        <div className="mt-4 space-y-2">
          {workout.exerciseIds.map((id) => {
            const exercise = EXERCISE_BY_ID[id];
            return exercise ? (
              <ExerciseDetail key={id} exercise={exercise} lymphMode={lymphMode} />
            ) : null;
          })}
        </div>
      )}
    </article>
  );
}
