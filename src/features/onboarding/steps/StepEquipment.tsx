import { ChipSelect } from '../../../components/forms/ChipSelect';
import { EQUIPMENT_LABELS, PREFERENCE_LABELS } from '../../../data/copy/labels';
import type { EquipmentType, PreferenceType } from '../../../types';
import type { OnboardingDraft } from '../onboardingTypes';

type Props = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

const EQUIPMENT_OPTIONS = (Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((value) => ({
  value,
  label: EQUIPMENT_LABELS[value],
}));

const PREFERENCE_OPTIONS = (Object.keys(PREFERENCE_LABELS) as PreferenceType[]).map((value) => ({
  value,
  label: PREFERENCE_LABELS[value],
}));

const DURATIONS = [5, 10, 15, 20, 30, 45];

export function StepEquipment({ draft, update }: Props) {
  function toggleDuration(minutes: number) {
    const has = draft.preferredDurations.includes(minutes);
    update({
      preferredDurations: has
        ? draft.preferredDurations.filter((d) => d !== minutes)
        : [...draft.preferredDurations, minutes],
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-heading font-medium text-text">Welk materiaal heeft u?</h3>
        <ChipSelect
          ariaLabel="Materiaal"
          options={EQUIPMENT_OPTIONS}
          selected={draft.equipment}
          onChange={(equipment) => update({ equipment })}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-medium text-text">Hoeveel tijd heeft u meestal?</h3>
        <div role="group" aria-label="Voorkeursduur" className="flex flex-wrap gap-2">
          {DURATIONS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              aria-pressed={draft.preferredDurations.includes(minutes)}
              onClick={() => toggleDuration(minutes)}
              className={`chip ${
                draft.preferredDurations.includes(minutes) ? 'chip-active' : ''
              }`}
            >
              {minutes === 45 ? '45+ min' : `${minutes} min`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-medium text-text">Waar heeft u zin in?</h3>
        <ChipSelect
          ariaLabel="Voorkeuren"
          options={PREFERENCE_OPTIONS}
          selected={draft.preferences}
          onChange={(preferences) => update({ preferences })}
        />
      </div>
    </div>
  );
}
