import { GlassWater, Apple, Carrot } from 'lucide-react';
import type { DailyLog, UserProfile } from '../../../types';
import { Counter } from '../../../components/forms/Counter';
import { LogCard, OptionRow } from './LogCard';

type Props = {
  log: DailyLog;
  profile: UserProfile;
  update: (patch: Partial<DailyLog>) => void;
};

const PORTION_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
];

export function WaterCard({ log, profile, update }: Props) {
  const glasses = log.waterGlasses ?? 0;
  const goal = profile.waterGoalGlasses;
  return (
    <LogCard
      icon={GlassWater}
      title="Water"
      done={glasses >= goal}
      hint={`Doel: ${goal} glazen. Niet iedereen heeft exact dit aantal nodig; het is een richtlijn.`}
    >
      <div className="flex items-center justify-between gap-4">
        <Counter
          label="Glazen water"
          value={glasses}
          onChange={(v) => update({ waterGlasses: v })}
          max={20}
          suffix="glazen"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
        {Array.from({ length: Math.max(goal, glasses) }, (_, i) => (
          <span
            key={i}
            className={`h-6 w-4 rounded-sm border ${
              i < glasses ? 'border-primary bg-primary/70' : 'border-sand bg-transparent'
            }`}
          />
        ))}
      </div>
    </LogCard>
  );
}

export function FruitCard({ log, profile, update }: Props) {
  return (
    <LogCard
      icon={Apple}
      title="Fruit"
      done={(log.fruitPortions ?? 0) >= profile.fruitGoalPortions}
    >
      <OptionRow
        ariaLabel="Porties fruit"
        options={PORTION_OPTIONS}
        value={log.fruitPortions}
        onChange={(v) => update({ fruitPortions: v })}
      />
    </LogCard>
  );
}

export function VegetableCard({ log, profile, update }: Props) {
  return (
    <LogCard
      icon={Carrot}
      title="Groenten"
      done={(log.vegetablePortions ?? 0) >= profile.vegetableGoalPortions}
    >
      <OptionRow
        ariaLabel="Porties groenten"
        options={PORTION_OPTIONS}
        value={log.vegetablePortions}
        onChange={(v) => update({ vegetablePortions: v })}
      />
    </LogCard>
  );
}
