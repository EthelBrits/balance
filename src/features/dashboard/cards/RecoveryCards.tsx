import { Moon, BatteryCharging, Coffee, Waves } from 'lucide-react';
import type { DailyLog, EnergyLevel, SleepQuality, StressLevel, UserProfile } from '../../../types';
import { NumberInput } from '../../../components/forms/Field';
import { LogCard, OptionRow } from './LogCard';

type Props = {
  log: DailyLog;
  profile: UserProfile;
  update: (patch: Partial<DailyLog>) => void;
};

const QUALITY_OPTIONS = [
  { value: 1 as SleepQuality, label: 'Slecht' },
  { value: 2 as SleepQuality, label: 'Matig' },
  { value: 3 as SleepQuality, label: 'Goed' },
];

const ENERGY_OPTIONS = [
  { value: 1 as EnergyLevel, label: '1 · uitgeput' },
  { value: 2 as EnergyLevel, label: '2 · weinig' },
  { value: 3 as EnergyLevel, label: '3 · redelijk' },
  { value: 4 as EnergyLevel, label: '4 · goed' },
  { value: 5 as EnergyLevel, label: '5 · veel' },
];

const STRESS_OPTIONS = [
  { value: 1 as StressLevel, label: '1 · rustig' },
  { value: 2 as StressLevel, label: '2' },
  { value: 3 as StressLevel, label: '3' },
  { value: 4 as StressLevel, label: '4' },
  { value: 5 as StressLevel, label: '5 · gespannen' },
];

export function SleepCard({ log, profile, update }: Props) {
  return (
    <LogCard
      icon={Moon}
      title="Slaap"
      done={(log.sleepHours ?? 0) >= profile.sleepGoalHours}
    >
      <div className="max-w-[12rem]">
        <NumberInput
          ariaLabel="Aantal uren slaap"
          value={log.sleepHours}
          onChange={(v) => update({ sleepHours: v })}
          suffix="uur"
          min={0}
          max={16}
          step={0.5}
        />
      </div>
      <div className="mt-3">
        <p className="label-text">Kwaliteit</p>
        <OptionRow
          ariaLabel="Slaapkwaliteit"
          options={QUALITY_OPTIONS}
          value={log.sleepQuality}
          onChange={(v) => update({ sleepQuality: v })}
        />
      </div>
    </LogCard>
  );
}

export function EnergyCard({ log, update }: Props) {
  return (
    <LogCard icon={BatteryCharging} title="Energie" done={log.energy !== undefined}>
      <OptionRow
        ariaLabel="Energieniveau"
        options={ENERGY_OPTIONS}
        value={log.energy}
        onChange={(v) => update({ energy: v })}
      />
    </LogCard>
  );
}

export function StressCard({ log, update }: Props) {
  return (
    <LogCard icon={Waves} title="Rust en spanning" done={log.stress !== undefined}>
      <OptionRow
        ariaLabel="Stressniveau"
        options={STRESS_OPTIONS}
        value={log.stress}
        onChange={(v) => update({ stress: v })}
      />
    </LogCard>
  );
}

export function RecoveryMomentCard({ log, update }: Props) {
  return (
    <LogCard icon={Coffee} title="Herstelmoment" done={log.recoveryMoment === true}>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border-sand text-primary focus:ring-primary"
          checked={log.recoveryMoment === true}
          onChange={(e) => update({ recoveryMoment: e.target.checked })}
        />
        <span className="text-text">
          Ik nam vandaag bewust rust.
          <span className="mt-1 block text-xs text-text-muted">
            Bijvoorbeeld een korte wandeling, lezen, ademhaling, ontspanning of niets gepland.
          </span>
        </span>
      </label>
    </LogCard>
  );
}
