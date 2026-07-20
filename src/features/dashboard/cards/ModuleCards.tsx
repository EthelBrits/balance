import { Wine, AlertTriangle, PersonStanding } from 'lucide-react';
import type { DailyLog, LegFeeling, ToneType } from '../../../types';
import { LogCard, OptionRow } from './LogCard';
import { alcoholFeedback } from '../../../data/copy/tone';
import { countAlcoholFreeDays } from '../weekStats';

type AlcoholProps = {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
  allLogs: DailyLog[];
  tone: ToneType;
};

const GLASS_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
];

export function AlcoholCard({ log, update, allLogs, tone }: AlcoholProps) {
  const isFree = log.alcoholFree === true;
  const { thisWeek, lastWeek } = countAlcoholFreeDays(allLogs);

  return (
    <LogCard icon={Wine} title="Alcohol" done={isFree}>
      <label className="mb-3 flex items-center gap-3">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-sand text-primary focus:ring-primary"
          checked={isFree}
          onChange={(e) =>
            update({ alcoholFree: e.target.checked, alcoholGlasses: e.target.checked ? 0 : undefined })
          }
        />
        <span className="text-text">Alcoholvrije dag</span>
      </label>

      {!isFree && (
        <div>
          <p className="label-text">Aantal glazen</p>
          <OptionRow
            ariaLabel="Aantal glazen alcohol"
            options={GLASS_OPTIONS}
            value={log.alcoholGlasses}
            onChange={(v) => update({ alcoholGlasses: v })}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              className="input-field"
              placeholder="Aanleiding (optioneel)"
              aria-label="Aanleiding"
              value={log.alcoholTrigger ?? ''}
              onChange={(e) => update({ alcoholTrigger: e.target.value || undefined })}
            />
            <input
              className="input-field"
              placeholder="Alternatief (optioneel)"
              aria-label="Alternatief"
              value={log.alcoholAlternative ?? ''}
              onChange={(e) => update({ alcoholAlternative: e.target.value || undefined })}
            />
          </div>
        </div>
      )}

      <p className="mt-3 rounded-lg bg-sand/50 px-3 py-2 text-sm text-text-muted">
        {alcoholFeedback(tone, thisWeek, lastWeek)}
      </p>
    </LogCard>
  );
}

type LegProps = {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
};

const LEG_OPTIONS: { value: LegFeeling; label: string }[] = [
  { value: 'normal', label: 'Normaal' },
  { value: 'slightlyHeavy', label: 'Licht zwaar' },
  { value: 'heavy', label: 'Duidelijk zwaarder' },
  { value: 'moreSwollen', label: 'Meer zwelling dan gewoonlijk' },
];

export function LegCard({ log, update }: LegProps) {
  const showWarning = log.legFeeling === 'moreSwollen' || log.legFeeling === 'heavy';
  return (
    <LogCard icon={PersonStanding} title="Zwaar gevoel in het been" done={log.legFeeling === 'normal'}>
      <p className="mb-2 text-sm text-text">Hoe voelde uw been vandaag?</p>
      <OptionRow
        ariaLabel="Gevoel in het been"
        options={LEG_OPTIONS}
        value={log.legFeeling}
        onChange={(v) => update({ legFeeling: v })}
      />
      <input
        className="input-field mt-3"
        placeholder="Korte notitie (optioneel)"
        aria-label="Notitie over het been"
        value={log.legNote ?? ''}
        onChange={(e) => update({ legNote: e.target.value || undefined })}
      />
      {showWarning && (
        <div className="mt-3 flex gap-2 rounded-lg bg-warning/10 p-3 text-sm text-text">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          <span>
            Bij nieuwe, snel toenemende of pijnlijke zwelling is medische beoordeling aangewezen.
          </span>
        </div>
      )}
    </LogCard>
  );
}
