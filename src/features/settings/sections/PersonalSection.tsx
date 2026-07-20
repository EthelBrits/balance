import { useStore } from '../../../store/useStore';
import { Field, NumberInput } from '../../../components/forms/Field';
import { WEEKDAY_LABELS } from '../../../data/copy/labels';

export function PersonalSection() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <Field label="Voornaam of roepnaam">
        {(id) => (
          <input
            id={id}
            className="input-field"
            value={profile.name === 'daar' ? '' : profile.name}
            onChange={(e) => void updateProfile({ name: e.target.value || 'daar' })}
          />
        )}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Leeftijd">
          {(id) => (
            <NumberInput id={id} value={profile.age} onChange={(v) => void updateProfile({ age: v })} suffix="jaar" min={0} max={120} />
          )}
        </Field>
        <Field label="Lengte">
          {(id) => (
            <NumberInput id={id} value={profile.heightCm} onChange={(v) => void updateProfile({ heightCm: v })} suffix="cm" min={100} max={250} />
          )}
        </Field>
      </div>
      <Field label="Vaste weegdag">
        {(id) => (
          <select
            id={id}
            className="input-field"
            value={profile.weighDay}
            onChange={(e) => void updateProfile({ weighDay: Number(e.target.value) })}
          >
            {WEEKDAY_LABELS.map((label, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field
        label="Weegfrequentie"
        hint="Wekelijks wegen geeft meestal een rustiger beeld. Dagelijks blijft mogelijk."
      >
        {(id) => (
          <select
            id={id}
            className="input-field"
            value={profile.weighFrequency}
            onChange={(e) => void updateProfile({ weighFrequency: e.target.value as 'weekly' | 'daily' })}
          >
            <option value="weekly">Wekelijks</option>
            <option value="daily">Dagelijks</option>
          </select>
        )}
      </Field>
    </div>
  );
}
