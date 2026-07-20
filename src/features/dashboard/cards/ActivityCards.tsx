import { Footprints, Dumbbell } from 'lucide-react';
import type { DailyLog } from '../../../types';
import { NumberInput } from '../../../components/forms/Field';
import { LogCard, OptionRow } from './LogCard';
import { ACTIVE_MINUTES_TARGET } from '../balanceScore';

type Props = {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
};

const MOVE_OPTIONS = [
  { value: 0, label: 'Geen' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 45, label: '45+' },
];

const EFFORT_OPTIONS = [
  { value: 'light' as const, label: 'Licht' },
  { value: 'moderate' as const, label: 'Gemiddeld' },
  { value: 'hard' as const, label: 'Stevig' },
];

export function MovementCard({ log, update }: Props) {
  return (
    <LogCard
      icon={Footprints}
      title="Beweging"
      done={(log.activeMinutes ?? 0) >= ACTIVE_MINUTES_TARGET}
      hint="Bijvoorbeeld wandelen, fietsen of tuinieren."
    >
      <OptionRow
        ariaLabel="Actieve minuten"
        options={MOVE_OPTIONS}
        value={log.activeMinutes}
        onChange={(v) => update({ activeMinutes: v })}
      />
      <div className="mt-3 max-w-[12rem]">
        <NumberInput
          ariaLabel="Actieve minuten handmatig"
          value={log.activeMinutes}
          onChange={(v) => update({ activeMinutes: v })}
          suffix="min"
          min={0}
          max={600}
        />
      </div>
    </LogCard>
  );
}

export function TrainingCard({ log, update }: Props) {
  const completed = log.trainingCompleted === true;
  return (
    <LogCard icon={Dumbbell} title="Training" done={completed}>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-sand text-primary focus:ring-primary"
          checked={completed}
          onChange={(e) => update({ trainingCompleted: e.target.checked })}
        />
        <span className="text-text">Ik heb vandaag een training voltooid.</span>
      </label>

      {completed && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="label-text">Zwaarte</p>
            <OptionRow
              ariaLabel="Zwaarte van de training"
              options={EFFORT_OPTIONS}
              value={log.trainingEffort}
              onChange={(v) => update({ trainingEffort: v })}
            />
          </div>
          <div className="max-w-[12rem]">
            <p className="label-text">Duur</p>
            <NumberInput
              ariaLabel="Duur van de training in minuten"
              value={log.trainingDurationMinutes}
              onChange={(v) => update({ trainingDurationMinutes: v })}
              suffix="min"
              min={0}
              max={300}
            />
          </div>
        </div>
      )}
    </LogCard>
  );
}
