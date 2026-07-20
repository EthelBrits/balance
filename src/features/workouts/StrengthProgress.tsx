import { useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { STRENGTH_TEST_LABELS, STRENGTH_TEST_UNITS } from '../../data/copy/labels';
import type { StrengthTestResult, StrengthTestType } from '../../types';
import { ChipSelect } from '../../components/forms/ChipSelect';
import { NumberInput } from '../../components/forms/Field';
import { createId } from '../../utils/id';
import { todayISO, formatShort, daysBetween } from '../../utils/date';

const ALL_TESTS = Object.keys(STRENGTH_TEST_LABELS) as StrengthTestType[];

/** Vergelijkt de nieuwste meting met een meting van ~4 weken geleden. */
function progressText(results: StrengthTestResult[], unit: string): string | null {
  if (results.length < 2) return null;
  const sorted = [...results].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  // Zoek de meting die het dichtst bij 28 dagen eerder ligt.
  const earlier = sorted
    .slice(0, -1)
    .filter((r) => daysBetween(latest.date, r.date) >= 14)
    .sort((a, b) => Math.abs(daysBetween(latest.date, a.date) - 28) - Math.abs(daysBetween(latest.date, b.date) - 28))[0];
  if (!earlier) return null;
  const diff = Math.round((latest.value - earlier.value) * 10) / 10;
  if (diff === 0) return 'Ongeveer gelijk gebleven ten opzichte van enkele weken geleden.';
  const richer = diff > 0 ? 'meer' : 'minder';
  return `U doet nu ${Math.abs(diff)} ${unit} ${richer} dan ongeveer vier weken geleden.`;
}

export function StrengthProgress() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const strengthTests = useStore((s) => s.strengthTests);
  const saveStrengthTest = useStore((s) => s.saveStrengthTest);

  const selected = settings.selectedStrengthTests;
  const [drafts, setDrafts] = useState<Partial<Record<StrengthTestType, number>>>({});

  function record(test: StrengthTestType) {
    const value = drafts[test];
    if (value === undefined) return;
    const result: StrengthTestResult = {
      id: createId(),
      testType: test,
      date: todayISO(),
      value,
      unit: STRENGTH_TEST_UNITS[test],
    };
    void saveStrengthTest(result);
    setDrafts((d) => ({ ...d, [test]: undefined }));
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold text-text">Krachtprogressie</h2>
        <p className="mt-1 text-sm text-text-muted">
          Kies maximaal drie persoonlijke tests. Hertesten om de vier weken geeft meestal een
          duidelijker beeld dan dagelijks meten.
        </p>
      </div>

      <ChipSelect
        ariaLabel="Persoonlijke tests"
        options={ALL_TESTS.map((t) => ({ value: t, label: STRENGTH_TEST_LABELS[t] }))}
        selected={selected}
        max={3}
        onChange={(next) => void updateSettings({ selectedStrengthTests: next })}
      />

      {selected.length === 0 && (
        <p className="text-sm text-text-muted">Nog geen tests gekozen.</p>
      )}

      <div className="space-y-3">
        {selected.map((test) => {
          const results = strengthTests.filter((r) => r.testType === test);
          const latest = [...results].sort((a, b) => b.date.localeCompare(a.date))[0];
          const unit = STRENGTH_TEST_UNITS[test];
          const text = progressText(results, unit);
          return (
            <div key={test} className="card">
              <div className="mb-3 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-heading font-semibold text-text">
                  {STRENGTH_TEST_LABELS[test]}
                </h3>
              </div>
              {latest && (
                <p className="text-sm text-text-muted">
                  Laatste meting: <span className="font-medium text-text">{latest.value} {unit}</span>{' '}
                  op {formatShort(latest.date)}
                </p>
              )}
              {text && (
                <p className="mt-2 rounded-lg bg-primary-light/60 px-3 py-2 text-sm text-primary-dark">
                  {text}
                </p>
              )}
              <div className="mt-3 flex items-end gap-2">
                <div className="max-w-[8rem]">
                  <NumberInput
                    ariaLabel={`Nieuwe waarde voor ${STRENGTH_TEST_LABELS[test]}`}
                    value={drafts[test]}
                    onChange={(v) => setDrafts((d) => ({ ...d, [test]: v }))}
                    suffix={unit}
                    min={0}
                  />
                </div>
                <button className="btn-secondary" onClick={() => record(test)} disabled={drafts[test] === undefined}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Vastleggen
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
