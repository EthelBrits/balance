import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Exercise } from '../../data/exercises/types';
import { ExerciseFigure } from './ExerciseFigure';

/** Uitklapbare oefeningkaart met tekening en uitleg in gewone taal. */
export function ExerciseDetail({ exercise, lymphMode }: { exercise: Exercise; lymphMode?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-sand bg-surface">
      <button
        type="button"
        className="flex w-full items-center gap-3 p-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <ExerciseFigure pose={exercise.pose} className="h-9 w-9" />
        </span>
        <span className="flex-1">
          <span className="block font-heading font-medium text-text">{exercise.name}</span>
          <span className="block text-sm text-text-muted">{exercise.dosage}</span>
        </span>
        <ChevronDown
          className={`h-5 w-5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="space-y-2 border-t border-sand p-4 text-sm">
          <p className="text-text">{exercise.explanation}</p>
          <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <Row label="Herhalingen of tijd" value={exercise.dosage} />
            <Row label="Rust" value={exercise.rest} />
            <Row label="Makkelijker" value={exercise.easier} />
            <Row label="Moeilijker" value={exercise.harder} />
            <Row label="Dit hoort u vooral te voelen in" value={exercise.feelIn} />
            <Row label="Aandachtspunt" value={exercise.focus} />
          </dl>
          {lymphMode && exercise.lymphFriendly && (
            <p className="rounded-lg bg-primary-light/60 px-3 py-2 text-primary-dark">
              {exercise.lymphFriendly}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd className="text-text">{value}</dd>
    </div>
  );
}
