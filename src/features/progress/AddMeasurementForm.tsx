import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { BodyMeasurement } from '../../types';
import { NumberInput } from '../../components/forms/Field';
import { useStore } from '../../store/useStore';
import { createId } from '../../utils/id';
import { todayISO } from '../../utils/date';
import { isWeighDay } from './chartData';
import { extraWeighNotice } from '../../data/copy/tone';

export function AddMeasurementForm({ onSaved }: { onSaved?: () => void }) {
  const profile = useStore((s) => s.profile);
  const measurements = useStore((s) => s.measurements);
  const saveMeasurement = useStore((s) => s.saveMeasurement);

  const [values, setValues] = useState<Partial<BodyMeasurement>>({});
  const [showMore, setShowMore] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (patch: Partial<BodyMeasurement>) => {
    setValues((v) => ({ ...v, ...patch }));
    setSaved(false);
  };

  const weighDayNow = profile ? isWeighDay(profile) : true;
  // Toon een rustige regel wanneer er deze week al een gewicht is en het niet de weegdag is.
  const recentWeightThisWeek = measurements.some(
    (m) => m.weightKg !== undefined && m.date >= isoDaysAgo(6),
  );
  const showExtraNotice =
    values.weightKg !== undefined && !weighDayNow && recentWeightThisWeek;

  async function save() {
    const hasValue = Object.values(values).some((v) => v !== undefined && v !== '');
    if (!hasValue) return;
    const measurement: BodyMeasurement = {
      id: createId(),
      date: todayISO(),
      ...values,
    };
    await saveMeasurement(measurement);
    setValues({});
    setSaved(true);
    onSaved?.();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="label-text">Gewicht</span>
          <NumberInput
            value={values.weightKg}
            onChange={(v) => set({ weightKg: v })}
            suffix="kg"
            min={30}
            max={300}
            step={0.1}
          />
        </label>
        <label className="text-sm">
          <span className="label-text">Buikomtrek</span>
          <NumberInput
            value={values.waistCm}
            onChange={(v) => set({ waistCm: v })}
            suffix="cm"
            min={40}
            max={200}
          />
        </label>
      </div>

      {showExtraNotice && (
        <p className="rounded-lg bg-sand/60 px-3 py-2 text-sm text-text-muted">{extraWeighNotice()}</p>
      )}

      <button
        type="button"
        className="btn-ghost text-sm"
        aria-expanded={showMore}
        onClick={() => setShowMore((s) => !s)}
      >
        Meer metingen
        <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {showMore && (
        <div className="grid grid-cols-2 gap-4">
          <Opt label="Heupomtrek" suffix="cm" value={values.hipCm} onChange={(v) => set({ hipCm: v })} />
          <Opt label="Bovenbeen links" suffix="cm" value={values.thighLeftCm} onChange={(v) => set({ thighLeftCm: v })} />
          <Opt label="Bovenbeen rechts" suffix="cm" value={values.thighRightCm} onChange={(v) => set({ thighRightCm: v })} />
          <Opt label="Bovenarm" suffix="cm" value={values.upperArmCm} onChange={(v) => set({ upperArmCm: v })} />
          <Opt label="Rusthartslag" suffix="/min" value={values.restingHeartRate} onChange={(v) => set({ restingHeartRate: v })} />
          <Opt label="Bovendruk" suffix="mmHg" value={values.systolic} onChange={(v) => set({ systolic: v })} />
          <Opt label="Onderdruk" suffix="mmHg" value={values.diastolic} onChange={(v) => set({ diastolic: v })} />
        </div>
      )}

      <label className="block text-sm">
        <span className="label-text">Notitie (optioneel)</span>
        <input
          className="input-field"
          value={values.note ?? ''}
          onChange={(e) => set({ note: e.target.value || undefined })}
        />
      </label>

      <button className="btn-primary w-full" onClick={save}>
        Meting opslaan
      </button>
      {saved && <p className="text-center text-sm text-success">Opgeslagen.</p>}
    </div>
  );
}

function Opt({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <label className="text-sm">
      <span className="label-text">{label}</span>
      <NumberInput value={value} onChange={onChange} suffix={suffix} min={0} />
    </label>
  );
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
