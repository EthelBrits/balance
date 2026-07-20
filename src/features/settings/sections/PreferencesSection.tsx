import { useStore } from '../../../store/useStore';
import { ChipSelect } from '../../../components/forms/ChipSelect';
import { Counter } from '../../../components/forms/Counter';
import {
  GOAL_LABELS,
  EQUIPMENT_LABELS,
  LIMITATION_LABELS,
  PREFERENCE_LABELS,
  TONE_LABELS,
  TONE_EXAMPLES,
} from '../../../data/copy/labels';
import type {
  EquipmentType,
  GoalType,
  LimitationType,
  PreferenceType,
  ToneType,
} from '../../../types';

const opts = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

export function GoalsToneSection() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="label-text">Toon van de feedback</p>
        <div className="space-y-2">
          {(Object.keys(TONE_LABELS) as ToneType[]).map((tone) => (
            <label
              key={tone}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                profile.tone === tone ? 'border-primary bg-primary-light/50' : 'border-sand'
              }`}
            >
              <input
                type="radio"
                name="tone"
                className="mt-1 h-4 w-4 text-primary"
                checked={profile.tone === tone}
                onChange={() => void updateProfile({ tone })}
              />
              <span>
                <span className="block font-heading font-medium text-text">{TONE_LABELS[tone]}</span>
                <span className="block text-sm text-text-muted">{TONE_EXAMPLES[tone]}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-text">Doelen (maximaal drie)</p>
        <ChipSelect
          ariaLabel="Doelen"
          options={opts<GoalType>(GOAL_LABELS)}
          selected={profile.goals}
          max={3}
          onChange={(goals) => void updateProfile({ goals })}
        />
      </div>

      <TargetsBlock />

      <div>
        <p className="label-text">Trainingsmateriaal</p>
        <ChipSelect
          ariaLabel="Materiaal"
          options={opts<EquipmentType>(EQUIPMENT_LABELS)}
          selected={profile.equipment}
          onChange={(equipment) => void updateProfile({ equipment })}
        />
      </div>

      <div>
        <p className="label-text">Voorkeuren</p>
        <ChipSelect
          ariaLabel="Voorkeuren"
          options={opts<PreferenceType>(PREFERENCE_LABELS)}
          selected={profile.preferences}
          onChange={(preferences) => void updateProfile({ preferences })}
        />
      </div>

      <div>
        <p className="label-text">Beperkingen en aanpassingen</p>
        <ChipSelect
          ariaLabel="Beperkingen"
          options={opts<LimitationType>(LIMITATION_LABELS)}
          selected={profile.limitations}
          onChange={(limitations) => void updateProfile({ limitations })}
        />
        <p className="mt-1 text-xs text-text-muted">
          Kies u lymfoedeem, activeer dan de bijhorende module hieronder bij “Modules”.
        </p>
      </div>
    </div>
  );
}

function TargetsBlock() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  if (!profile) return null;
  return (
    <div className="space-y-3 rounded-xl bg-bg p-4">
      <p className="label-text">Persoonlijke doelen per dag</p>
      <Row label="Waterdoel (glazen)">
        <Counter label="Waterdoel" value={profile.waterGoalGlasses} min={1} max={20} onChange={(v) => void updateProfile({ waterGoalGlasses: v })} />
      </Row>
      <Row label="Fruitdoel (porties)">
        <Counter label="Fruitdoel" value={profile.fruitGoalPortions} min={0} max={6} onChange={(v) => void updateProfile({ fruitGoalPortions: v })} />
      </Row>
      <Row label="Groentedoel (porties)">
        <Counter label="Groentedoel" value={profile.vegetableGoalPortions} min={0} max={6} onChange={(v) => void updateProfile({ vegetableGoalPortions: v })} />
      </Row>
      <Row label="Slaapdoel (uren)">
        <Counter label="Slaapdoel" value={profile.sleepGoalHours} min={4} max={12} step={0.5} onChange={(v) => void updateProfile({ sleepGoalHours: v })} />
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-text">{label}</span>
      {children}
    </div>
  );
}
