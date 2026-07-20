import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ExerciseLog } from '../../../types';
import { EXERCISES } from '../../../data/exercises/exercises';
import { NumberInput } from '../../../components/forms/Field';

/** Vrije training: de gebruiker voegt zelf oefeningen, sets en herhalingen toe. */
export function FreeformWorkout({ onFinish }: { onFinish: (exercises: ExerciseLog[]) => void }) {
  const [rows, setRows] = useState<ExerciseLog[]>([]);
  const [exerciseId, setExerciseId] = useState(EXERCISES[0].id);

  function addRow() {
    setRows((r) => [...r, { exerciseId, sets: undefined, reps: undefined, weightKg: undefined }]);
  }

  function updateRow(index: number, patch: Partial<ExerciseLog>) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1">
          <label className="label-text" htmlFor="freeform-exercise">
            Oefening toevoegen
          </label>
          <select
            id="freeform-exercise"
            className="input-field"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
          >
            {EXERCISES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-secondary" onClick={addRow}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Toevoegen
        </button>
      </div>

      <ul className="space-y-3">
        {rows.map((row, index) => {
          const ex = EXERCISES.find((e) => e.id === row.exerciseId);
          return (
            <li key={index} className="card">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-heading font-medium text-text">{ex?.name}</span>
                <button
                  className="tap-target text-text-muted hover:text-accent"
                  onClick={() => removeRow(index)}
                  aria-label="Oefening verwijderen"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="text-xs text-text-muted">
                  Sets
                  <NumberInput value={row.sets} onChange={(v) => updateRow(index, { sets: v })} min={0} max={20} />
                </label>
                <label className="text-xs text-text-muted">
                  Herhalingen
                  <NumberInput value={row.reps} onChange={(v) => updateRow(index, { reps: v })} min={0} max={100} />
                </label>
                <label className="text-xs text-text-muted">
                  Gewicht
                  <NumberInput value={row.weightKg} onChange={(v) => updateRow(index, { weightKg: v })} suffix="kg" min={0} step={0.5} />
                </label>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="btn-primary w-full" onClick={() => onFinish(rows)}>
        Training afronden
      </button>
    </div>
  );
}
