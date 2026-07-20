import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ExerciseLog, WorkoutLog } from '../../../types';
import { OptionRow } from '../../dashboard/cards/LogCard';
import { NumberInput } from '../../../components/forms/Field';
import { useStore } from '../../../store/useStore';
import { createId } from '../../../utils/id';
import { todayISO } from '../../../utils/date';
import { workoutDone } from '../../../data/copy/tone';

type Props = {
  workoutId: string;
  defaultDuration: number;
  exercises: ExerciseLog[];
  onDone: () => void;
};

const EFFORT_OPTIONS = [
  { value: 'light' as const, label: 'Licht' },
  { value: 'moderate' as const, label: 'Gemiddeld' },
  { value: 'hard' as const, label: 'Stevig' },
];

const ENERGY_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }));

export function WorkoutCompletion({ workoutId, defaultDuration, exercises, onDone }: Props) {
  const profile = useStore((s) => s.profile);
  const saveWorkout = useStore((s) => s.saveWorkout);
  const updateDailyLog = useStore((s) => s.updateDailyLog);

  const [duration, setDuration] = useState<number | undefined>(defaultDuration || undefined);
  const [effort, setEffort] = useState<'light' | 'moderate' | 'hard'>('moderate');
  const [energyAfter, setEnergyAfter] = useState<number | undefined>();
  const [pain, setPain] = useState(false);
  const [swelling, setSwelling] = useState(false);
  const [note, setNote] = useState('');
  const [showMore, setShowMore] = useState(false);

  const lymphMode = profile?.limitations.includes('lymphedema') ?? false;

  async function save() {
    const date = todayISO();
    const log: WorkoutLog = {
      id: createId(),
      workoutId: workoutId === 'freeform' ? undefined : workoutId,
      date,
      durationMinutes: duration ?? 0,
      exercises,
      effort,
      energyAfter,
      pain: pain || undefined,
      swellingChange: swelling || undefined,
      note: note.trim() || undefined,
    };
    await saveWorkout(log);
    await updateDailyLog(date, {
      trainingCompleted: true,
      trainingDurationMinutes: duration,
      trainingEffort: effort,
    });
    onDone();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-xl bg-primary-light/60 p-4 text-primary-dark">
        <Check className="h-5 w-5" aria-hidden="true" />
        <p>{profile ? workoutDone(profile.tone) : 'Training voltooid.'}</p>
      </div>

      <div className="max-w-[10rem]">
        <p className="label-text">Duur (uw werkelijke tijd)</p>
        <NumberInput
          ariaLabel="Duur in minuten"
          value={duration}
          onChange={setDuration}
          suffix="min"
          min={0}
          max={300}
        />
      </div>

      <div>
        <p className="label-text">Hoe zwaar voelde het?</p>
        <OptionRow
          ariaLabel="Hoe zwaar voelde het"
          options={EFFORT_OPTIONS}
          value={effort}
          onChange={setEffort}
        />
      </div>

      {lymphMode && (
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-sand text-primary"
            checked={swelling}
            onChange={(e) => setSwelling(e.target.checked)}
          />
          <span className="text-text">Ik merkte meer zwelling of een zwaarder gevoel.</span>
        </label>
      )}

      <button
        type="button"
        className="btn-ghost text-sm"
        aria-expanded={showMore}
        onClick={() => setShowMore((s) => !s)}
      >
        {showMore ? 'Minder tonen' : 'Meer noteren (optioneel)'}
      </button>

      {showMore && (
        <div className="space-y-4">
          <div>
            <p className="label-text">Energie na de training (optioneel)</p>
            <OptionRow
              ariaLabel="Energie na de training"
              options={ENERGY_OPTIONS}
              value={energyAfter}
              onChange={setEnergyAfter}
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-sand text-primary"
              checked={pain}
              onChange={(e) => setPain(e.target.checked)}
            />
            <span className="text-text">Ik had pijn tijdens of na de training.</span>
          </label>

          <div>
            <p className="label-text">Korte notitie (optioneel)</p>
            <textarea
              className="input-field"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hoe ging het?"
            />
          </div>
        </div>
      )}

      <button className="btn-primary w-full" onClick={save}>
        Training opslaan
      </button>
    </div>
  );
}
