import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  X,
  Pause,
  Play,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Smartphone,
} from 'lucide-react';
import type { ExerciseLog } from '../../types';
import { WORKOUT_BY_ID } from '../../data/workouts/workouts';
import { EXERCISE_BY_ID } from '../../data/exercises/exercises';
import { EmptyState } from '../../components/EmptyState';
import { useStore } from '../../store/useStore';
import { useWakeLock } from '../../hooks/useWakeLock';
import { ExerciseFigure } from './ExerciseFigure';
import { WorkoutCompletion } from './player/WorkoutCompletion';
import { FreeformWorkout } from './player/FreeformWorkout';

type Phase = 'active' | 'freeform' | 'done';

export function WorkoutPlayerPage() {
  const { workoutId = '' } = useParams();
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const workout = WORKOUT_BY_ID[workoutId];

  const [phase, setPhase] = useState<Phase>(workout?.freeform ? 'freeform' : 'active');
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [showEasier, setShowEasier] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [freeformExercises, setFreeformExercises] = useState<ExerciseLog[]>([]);

  const lymphMode = profile?.limitations.includes('lymphedema') ?? false;
  useWakeLock(phase === 'active' && running);

  const exercises = useMemo(
    () => (workout ? workout.exerciseIds.map((id) => EXERCISE_BY_ID[id]).filter(Boolean) : []),
    [workout],
  );

  const feedback = useRef<() => void>(() => {});
  feedback.current = () => {
    if (soundOn && 'AudioContext' in window) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.frequency.value = 660;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch {
        // negeer audiofouten
      }
    }
    if ('vibrate' in navigator) navigator.vibrate?.(60);
  };

  useEffect(() => {
    if (phase !== 'active' || !running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, running]);

  if (!workout) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <EmptyState title="Training niet gevonden">
          <button className="btn-secondary" onClick={() => navigate('/training')}>
            Terug naar trainingen
          </button>
        </EmptyState>
      </div>
    );
  }

  const current = exercises[index];
  const total = exercises.length;

  function goTo(next: number) {
    setShowEasier(false);
    setSeconds(0);
    feedback.current();
    if (next >= total) {
      setPhase('done');
    } else if (next < 0) {
      setIndex(0);
    } else {
      setIndex(next);
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-5">
      {/* Kop met sluiten */}
      <div className="mb-4 flex items-center justify-between">
        <button className="btn-ghost" onClick={() => navigate('/training')} aria-label="Training sluiten">
          <X className="h-5 w-5" aria-hidden="true" /> Sluiten
        </button>
        <span className="font-heading text-sm text-text-muted">{workout.name}</span>
      </div>

      {phase === 'freeform' && (
        <FreeformWorkout
          onFinish={(list) => {
            setFreeformExercises(list);
            setPhase('done');
          }}
        />
      )}

      {phase === 'active' && current && (
        <>
          {/* Voortgang */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-text-muted">
              <span>
                Oefening {index + 1} van {total}
              </span>
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {exercises.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-primary' : 'bg-sand'}`}
                />
              ))}
            </div>
          </div>

          <div className="card flex flex-1 flex-col items-center text-center">
            <ExerciseFigure pose={current.pose} className="h-40 w-40 text-primary" />
            <h1 className="mt-4 font-heading text-2xl font-semibold text-text">{current.name}</h1>
            <p className="mt-1 text-text-muted">{current.dosage}</p>

            <div
              className="my-6 font-heading text-5xl font-semibold tabular-nums text-primary-dark"
              role="timer"
              aria-live="off"
            >
              {mm}:{ss}
            </div>

            <p className="text-sm text-text">{current.explanation}</p>
            <p className="mt-2 text-sm text-text-muted">
              Dit hoort u vooral te voelen in {current.feelIn}.
            </p>

            <button
              className="btn-ghost mt-3"
              onClick={() => setShowEasier((s) => !s)}
              aria-expanded={showEasier}
            >
              Makkelijker alternatief
            </button>
            {showEasier && (
              <p className="rounded-lg bg-primary-light/60 px-3 py-2 text-sm text-primary-dark">
                {current.easier}
              </p>
            )}
            {lymphMode && current.lymphFriendly && (
              <p className="mt-2 rounded-lg bg-sand/60 px-3 py-2 text-sm text-text-muted">
                {current.lymphFriendly}
              </p>
            )}
          </div>

          {/* Bediening */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              className="btn-secondary"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Vorige oefening"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <button className="btn-secondary" onClick={() => setRunning((r) => !r)}>
              {running ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
              {running ? 'Pauze' : 'Verder'}
            </button>

            <button className="btn-ghost" onClick={() => goTo(index + 1)} aria-label="Oefening overslaan">
              <SkipForward className="h-5 w-5" aria-hidden="true" /> Overslaan
            </button>

            <button className="btn-primary" onClick={() => goTo(index + 1)}>
              {index + 1 >= total ? 'Afronden' : 'Volgende'}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex justify-center gap-4 text-sm text-text-muted">
            <button className="tap-target inline-flex items-center gap-1" onClick={() => setSoundOn((s) => !s)}>
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Geluid {soundOn ? 'aan' : 'uit'}
            </button>
            <span className="inline-flex items-center gap-1">
              <Smartphone className="h-4 w-4" aria-hidden="true" /> Scherm blijft aan waar mogelijk
            </span>
          </div>
        </>
      )}

      {phase === 'done' && (
        <WorkoutCompletion
          workoutId={workout.id}
          defaultDuration={workout.durationMinutes}
          exercises={
            workout.freeform
              ? freeformExercises
              : workout.exerciseIds.map((id) => ({ exerciseId: id }))
          }
          onDone={() => navigate('/')}
        />
      )}
    </div>
  );
}
