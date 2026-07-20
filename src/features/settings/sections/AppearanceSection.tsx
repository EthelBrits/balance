import { useStore } from '../../../store/useStore';

const SCALES = [
  { value: 0.9, label: 'Kleiner' },
  { value: 1, label: 'Standaard' },
  { value: 1.15, label: 'Groter' },
  { value: 1.3, label: 'Grootst' },
];

export function AppearanceSection() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div className="space-y-3">
      <p className="label-text">Lettergrootte</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lettergrootte">
        {SCALES.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={settings.fontScale === s.value}
            onClick={() => void updateSettings({ fontScale: s.value })}
            className={`chip ${settings.fontScale === s.value ? 'chip-active' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-text-muted">
        De hele app past zich aan uw gekozen lettergrootte aan.
      </p>
    </div>
  );
}
