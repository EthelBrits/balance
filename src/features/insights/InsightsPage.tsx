import { EyeOff, Lightbulb } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { useStore } from '../../store/useStore';
import { computeInsights } from './insights';
import { FactCard } from './FactCard';

export function InsightsPage() {
  const dailyLogs = useStore((s) => s.dailyLogs);
  const measurements = useStore((s) => s.measurements);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const { insights, usableDays } = computeInsights(
    dailyLogs,
    measurements,
    settings.hiddenInsightIds,
  );

  function hide(id: string) {
    void updateSettings({ hiddenInsightIds: [...settings.hiddenInsightIds, id] });
  }

  const hiddenCount = settings.hiddenInsightIds.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inzichten"
        subtitle="Rustige observaties uit uw eigen gegevens. Verbanden, geen oorzaken."
      />

      <FactCard />

      {insights.length > 0 ? (
        <ul className="space-y-3">
          {insights.map((insight) => (
            <li key={insight.id} className="card flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="flex-1 text-text">{insight.text}</p>
              <button
                className="tap-target shrink-0 text-text-muted hover:text-accent"
                onClick={() => hide(insight.id)}
                aria-label="Dit inzicht verbergen"
                title="Verbergen"
              >
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card text-center text-text-muted">
          <p>
            {usableDays < 14
              ? 'Er zijn nog wat meer dagen nodig om betrouwbare patronen te tonen.'
              : 'Er zijn op dit moment geen duidelijke verbanden om te tonen. Dat is prima — blijf gerust registreren.'}
          </p>
          <p className="mt-2 text-xs">Tot nu toe {usableDays} dagen met gegevens.</p>
        </div>
      )}

      {hiddenCount > 0 && (
        <button
          className="btn-ghost text-sm"
          onClick={() => void updateSettings({ hiddenInsightIds: [] })}
        >
          {hiddenCount} verborgen inzicht{hiddenCount === 1 ? '' : 'en'} opnieuw tonen
        </button>
      )}

      <p className="text-xs text-text-muted">
        Inzichten worden alleen getoond bij voldoende gegevens en beschrijven verbanden, geen
        oorzaken. Ze vervangen geen medisch advies.
      </p>
    </div>
  );
}
