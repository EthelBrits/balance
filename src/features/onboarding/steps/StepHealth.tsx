import { AlertCircle } from 'lucide-react';
import { ChipSelect } from '../../../components/forms/ChipSelect';
import { LIMITATION_LABELS } from '../../../data/copy/labels';
import type { LimitationType } from '../../../types';
import type { OnboardingDraft } from '../onboardingTypes';

type Props = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

const LIMITATION_OPTIONS = (Object.keys(LIMITATION_LABELS) as LimitationType[]).map((value) => ({
  value,
  label: LIMITATION_LABELS[value],
}));

export function StepHealth({ draft, update }: Props) {
  const showLymphNote = draft.limitations.includes('lymphedema');
  return (
    <div className="space-y-5">
      <p className="text-sm text-text-muted">
        Vink aan wat voor u van toepassing is. Zo kunnen de trainingen zich hierop aanpassen. U
        hoeft niets in te vullen.
      </p>
      <ChipSelect
        ariaLabel="Gezondheid en aanpassingen"
        options={LIMITATION_OPTIONS}
        selected={draft.limitations}
        onChange={(limitations) => update({ limitations })}
      />

      {showLymphNote && (
        <div className="rounded-xl bg-primary-light/60 p-4 text-sm text-primary-dark">
          Er worden rustige, geleidelijke trainingsopties geactiveerd. Lange springtouwsessies
          worden niet automatisch voorgesteld, en u kunt dagelijks een zwaar gevoel of zwelling in
          het been noteren.
        </div>
      )}

      <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
        <p className="text-sm text-text">
          De app geeft algemene leefstijl- en beweeginformatie. Ze vervangt geen persoonlijk
          medisch advies. Stop bij pijn op de borst, uitgesproken kortademigheid, duizeligheid,
          plotse zwelling of andere alarmsymptomen.
        </p>
      </div>
    </div>
  );
}
