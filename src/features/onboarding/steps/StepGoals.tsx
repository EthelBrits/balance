import { ChipSelect } from '../../../components/forms/ChipSelect';
import { GOAL_LABELS } from '../../../data/copy/labels';
import type { GoalType } from '../../../types';
import type { OnboardingDraft } from '../onboardingTypes';

type Props = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

const GOAL_OPTIONS = (Object.keys(GOAL_LABELS) as GoalType[]).map((value) => ({
  value,
  label: GOAL_LABELS[value],
}));

export function StepGoals({ draft, update }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Kies bij voorkeur niet alles tegelijk. Twee of drie doelen zijn meestal haalbaarder.
      </p>
      <ChipSelect
        ariaLabel="Doelen"
        options={GOAL_OPTIONS}
        selected={draft.goals}
        max={3}
        onChange={(goals) => update({ goals })}
      />
      <p className="text-xs text-text-muted">{draft.goals.length}/3 gekozen</p>
    </div>
  );
}
