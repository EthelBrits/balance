import { Clock } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { ChipSelect } from '../../../components/forms/ChipSelect';
import { Counter } from '../../../components/forms/Counter';
import { ALCOHOL_MOMENTS } from '../../../data/copy/labels';
import type { ModuleType } from '../../../types';

export function ModulesSection() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  if (!profile) return null;

  const enabled = (m: ModuleType) => profile.enabledModules.includes(m);

  function toggleModule(m: ModuleType, on: boolean) {
    const next = on
      ? [...profile!.enabledModules, m]
      : profile!.enabledModules.filter((x) => x !== m);
    void updateProfile({ enabledModules: next });
  }

  const alcohol = profile.alcoholSettings;

  return (
    <div className="space-y-5">
      <ModuleToggle
        label="Alcohol"
        description="Registreer alcoholvrije dagen en aantal glazen, met een persoonlijk weekdoel."
        checked={enabled('alcohol')}
        onChange={(on) => toggleModule('alcohol', on)}
      />

      {enabled('alcohol') && (
        <div className="space-y-3 rounded-xl bg-bg p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-text">Gewenste alcoholvrije dagen per week</span>
            <Counter
              label="Alcoholvrije dagen"
              value={alcohol.weeklyGoalFreeDays}
              min={0}
              max={7}
              onChange={(v) => void updateProfile({ alcoholSettings: { ...alcohol, weeklyGoalFreeDays: v } })}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-text">Maximaal aantal glazen per week</span>
            <Counter
              label="Maximaal glazen per week"
              value={alcohol.maxGlassesPerWeek}
              min={0}
              max={30}
              onChange={(v) => void updateProfile({ alcoholSettings: { ...alcohol, maxGlassesPerWeek: v } })}
            />
          </div>
          <div>
            <p className="label-text">Typische momenten</p>
            <ChipSelect
              ariaLabel="Typische alcoholmomenten"
              options={ALCOHOL_MOMENTS.map((m) => ({ value: m, label: m }))}
              selected={alcohol.typicalMoments}
              onChange={(typicalMoments) => void updateProfile({ alcoholSettings: { ...alcohol, typicalMoments } })}
            />
          </div>
        </div>
      )}

      <ModuleToggle
        label="Zwaar gevoel / lymfoedeem"
        description="Activeer het dagelijkse veld voor een zwaar gevoel of zwelling en rustige trainingsopties."
        checked={enabled('lymphedema')}
        onChange={(on) => toggleModule('lymphedema', on)}
      />

      {/* Roken en vapen — enige 'Binnenkort'-item. */}
      <div className="rounded-xl border border-dashed border-sand p-4">
        <div className="mb-1 flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <span className="font-heading font-medium text-text">Roken en vapen</span>
          <span className="rounded-full bg-sand px-2 py-0.5 text-xs text-text-muted">Binnenkort</span>
        </div>
        <p className="text-sm text-text-muted">
          Roken en vapen worden in een latere versie toegevoegd.
        </p>
      </div>
    </div>
  );
}

function ModuleToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block font-heading font-medium text-text">{label}</span>
        <span className="block text-sm text-text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        className="mt-1 h-6 w-6 shrink-0 rounded border-sand text-primary focus:ring-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={`${label} in- of uitschakelen`}
      />
    </label>
  );
}
