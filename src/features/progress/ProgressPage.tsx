import { useState } from 'react';
import { Scale, Plus, CalendarClock } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useStore } from '../../store/useStore';
import { AddMeasurementForm } from './AddMeasurementForm';
import { PhotoSection } from './PhotoSection';
import { TrendChart } from './TrendChart';
import {
  RANGE_OPTIONS,
  type RangeKey,
  measurementSeries,
  logSeries,
  balanceSeries,
  alcoholFreeWeeklySeries,
  isWeighDay,
  daysSinceLastWaist,
} from './chartData';

export function ProgressPage() {
  const profile = useStore((s) => s.profile);
  const measurements = useStore((s) => s.measurements);
  const dailyLogs = useStore((s) => s.dailyLogs);

  const [range, setRange] = useState<RangeKey>('3m');
  const [showForm, setShowForm] = useState(false);

  if (!profile) return null;

  const weighDayNow = isWeighDay(profile);
  const waistDays = daysSinceLastWaist(measurements);
  const waistDue = waistDays === null || waistDays >= 28;
  const alcoholEnabled = profile.enabledModules.includes('alcohol');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voortgang"
        subtitle="Metingen en rustige trends over tijd."
        action={
          <button className="btn-secondary" onClick={() => setShowForm((s) => !s)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Meting toevoegen
          </button>
        }
      />

      {weighDayNow ? (
        <div className="card flex items-center gap-3 bg-primary-light/50">
          <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <p className="font-heading font-semibold text-primary-dark">Vandaag is uw weegdag</p>
            <p className="text-sm text-text-muted">
              Weeg bij voorkeur op een vast moment, bijvoorbeeld 's ochtends.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          Vandaag is geen weegmoment gepland. U kunt altijd een meting toevoegen via de knop
          hierboven.
        </p>
      )}

      {waistDue && (
        <div className="card flex items-center gap-3">
          <CalendarClock className="h-5 w-5 text-accent" aria-hidden="true" />
          <p className="text-sm text-text">
            Buikomtrek meet u doorgaans om de vier weken. Meet bij voorkeur telkens op dezelfde
            plaats en onder vergelijkbare omstandigheden.
          </p>
        </div>
      )}

      {(showForm || weighDayNow) && (
        <section className="card">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text">Meting toevoegen</h2>
          <AddMeasurementForm onSaved={() => setShowForm(false)} />
        </section>
      )}

      {/* Bereikfilter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Periode">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            aria-pressed={range === opt.key}
            onClick={() => setRange(opt.key)}
            className={`chip ${range === opt.key ? 'chip-active' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TrendChart
          title="Gewicht"
          unit="kg"
          points={measurementSeries(measurements, 'weightKg', range)}
          emptyHint="Voeg enkele wegingen toe om de trend te zien."
        />
        <TrendChart
          title="Buikomtrek"
          unit="cm"
          points={measurementSeries(measurements, 'waistCm', range)}
          emptyHint="Voeg enkele metingen toe om de trend te zien."
        />
        <TrendChart title="Weekbalans" unit="%" points={balanceSeries(dailyLogs, range)} domain={[0, 100]} />
        <TrendChart
          title="Actieve minuten"
          unit="min"
          kind="bar"
          points={logSeries(dailyLogs, 'activeMinutes', range)}
        />
        <TrendChart title="Energie" points={logSeries(dailyLogs, 'energy', range)} domain={[1, 5]} />
        <TrendChart title="Slaap" unit="uur" points={logSeries(dailyLogs, 'sleepHours', range)} />
        {alcoholEnabled && (
          <TrendChart
            title="Alcoholvrije dagen per week"
            unit="dagen"
            kind="bar"
            points={alcoholFreeWeeklySeries(dailyLogs, range)}
            domain={[0, 7]}
          />
        )}
      </div>

      <PhotoSection />
    </div>
  );
}
