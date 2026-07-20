import { Field, NumberInput } from '../../../components/forms/Field';
import { WEEKDAY_LABELS } from '../../../data/copy/labels';
import type { OnboardingDraft } from '../onboardingTypes';

type Props = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

export function StepBasics({ draft, update }: Props) {
  return (
    <div className="space-y-5">
      <Field label="Voornaam of roepnaam">
        {(id) => (
          <input
            id={id}
            className="input-field"
            value={draft.name}
            autoComplete="given-name"
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Bijvoorbeeld: Anke"
          />
        )}
      </Field>

      <Field label="Geboortedatum" hint="U mag ook enkel uw leeftijd invullen.">
        {(id) => (
          <input
            id={id}
            type="date"
            className="input-field"
            value={draft.birthDate ?? ''}
            onChange={(e) => update({ birthDate: e.target.value || undefined })}
          />
        )}
      </Field>

      <Field label="Leeftijd (optioneel)">
        {(id) => (
          <NumberInput
            id={id}
            value={draft.age}
            onChange={(v) => update({ age: v })}
            suffix="jaar"
            min={0}
            max={120}
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Lengte">
          {(id) => (
            <NumberInput
              id={id}
              value={draft.heightCm}
              onChange={(v) => update({ heightCm: v })}
              suffix="cm"
              min={100}
              max={250}
            />
          )}
        </Field>
        <Field label="Huidig gewicht">
          {(id) => (
            <NumberInput
              id={id}
              value={draft.weightKg}
              onChange={(v) => update({ weightKg: v })}
              suffix="kg"
              min={30}
              max={300}
              step={0.1}
            />
          )}
        </Field>
        <Field label="Buikomtrek">
          {(id) => (
            <NumberInput
              id={id}
              value={draft.waistCm}
              onChange={(v) => update({ waistCm: v })}
              suffix="cm"
              min={40}
              max={200}
            />
          )}
        </Field>
        <Field label="Heupomtrek (optioneel)">
          {(id) => (
            <NumberInput
              id={id}
              value={draft.hipCm}
              onChange={(v) => update({ hipCm: v })}
              suffix="cm"
              min={40}
              max={200}
            />
          )}
        </Field>
      </div>

      <Field label="Rusthartslag (optioneel)">
        {(id) => (
          <NumberInput
            id={id}
            value={draft.restingHeartRate}
            onChange={(v) => update({ restingHeartRate: v })}
            suffix="slagen/min"
            min={30}
            max={150}
          />
        )}
      </Field>

      <Field label="Vaste weegdag" hint="Gewicht schommelt van dag tot dag. Eén vast weegmoment per week geeft meestal een duidelijker beeld.">
        {(id) => (
          <select
            id={id}
            className="input-field"
            value={draft.weighDay}
            onChange={(e) => update({ weighDay: Number(e.target.value) })}
          >
            {WEEKDAY_LABELS.map((label, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
    </div>
  );
}
