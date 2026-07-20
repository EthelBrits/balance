import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { createDefaultProfile } from '../../utils/defaults';
import { createId } from '../../utils/id';
import { todayISO, ageFromBirthDate } from '../../utils/date';
import type { BodyMeasurement, ModuleType, UserProfile } from '../../types';
import { emptyDraft, type OnboardingDraft } from './onboardingTypes';
import { StepWelcome } from './steps/StepWelcome';
import { StepBasics } from './steps/StepBasics';
import { StepGoals } from './steps/StepGoals';
import { StepEquipment } from './steps/StepEquipment';
import { StepHealth } from './steps/StepHealth';

const STEP_TITLES = [
  'Welkom',
  'Basisgegevens',
  'Uw doelen',
  'Materiaal en voorkeuren',
  'Gezondheid en aanpassingen',
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const saveProfile = useStore((s) => s.saveProfile);
  const saveMeasurement = useStore((s) => s.saveMeasurement);
  const existingProfile = useStore((s) => s.profile);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(emptyDraft);

  const update = (patch: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const isLast = step === STEP_TITLES.length - 1;
  const canProceed = step !== 1 || draft.name.trim().length > 0;

  async function finish() {
    const base: UserProfile = existingProfile ?? createDefaultProfile();
    const enabledModules: ModuleType[] = [];
    if (draft.goals.includes('lessAlcohol')) enabledModules.push('alcohol');
    if (draft.limitations.includes('lymphedema')) enabledModules.push('lymphedema');

    const age =
      draft.age ?? (draft.birthDate ? ageFromBirthDate(draft.birthDate) : undefined);

    const profile: UserProfile = {
      ...base,
      name: draft.name.trim() || 'daar',
      birthDate: draft.birthDate,
      age,
      heightCm: draft.heightCm,
      weighDay: draft.weighDay,
      goals: draft.goals,
      equipment: draft.equipment,
      preferences: draft.preferences,
      preferredDurations: draft.preferredDurations,
      limitations: draft.limitations,
      enabledModules,
      onboardingCompleted: true,
    };
    await saveProfile(profile);

    if (
      draft.weightKg !== undefined ||
      draft.waistCm !== undefined ||
      draft.hipCm !== undefined ||
      draft.restingHeartRate !== undefined
    ) {
      const measurement: BodyMeasurement = {
        id: createId(),
        date: todayISO(),
        weightKg: draft.weightKg,
        waistCm: draft.waistCm,
        hipCm: draft.hipCm,
        restingHeartRate: draft.restingHeartRate,
      };
      await saveMeasurement(measurement);
    }

    navigate('/', { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      {/* Voortgangsbalk */}
      <div className="mb-6 flex items-center gap-2" aria-hidden="true">
        {STEP_TITLES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-sand'
            }`}
          />
        ))}
      </div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">
        Stap {step + 1} van {STEP_TITLES.length}
      </p>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-text">{STEP_TITLES[step]}</h1>

      <div className="flex-1">
        {step === 0 && <StepWelcome />}
        {step === 1 && <StepBasics draft={draft} update={update} />}
        {step === 2 && <StepGoals draft={draft} update={update} />}
        {step === 3 && <StepEquipment draft={draft} update={update} />}
        {step === 4 && <StepHealth draft={draft} update={update} />}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button className="btn-ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Terug
          </button>
        ) : (
          <span />
        )}

        {isLast ? (
          <button className="btn-primary" onClick={finish}>
            Klaar — naar mijn balans
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
          >
            {step === 0 ? 'Start mijn balans' : 'Volgende'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {step === 0 && (
        <p className="mt-4 text-center text-xs text-text-muted">
          Ontwikkeld door huisarts Dr. Ethel Brits.
        </p>
      )}
    </div>
  );
}
