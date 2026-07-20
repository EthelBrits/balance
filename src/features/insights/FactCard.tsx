import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { factForDate } from '../../data/facts/factOfDay';
import { todayISO } from '../../utils/date';

/** "Even weten" — maximaal één per dag, tenzij de gebruiker bewust doorklikt. */
export function FactCard() {
  const [offset, setOffset] = useState(0);
  const fact = factForDate(todayISO(), offset);

  return (
    <section className="card bg-primary-light/40">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="font-heading font-semibold text-primary-dark">Even weten</h2>
      </div>
      <p className="text-text">{fact.text}</p>
      <button
        className="btn-ghost mt-3 text-sm"
        onClick={() => setOffset((o) => o + 1)}
        aria-label="Toon een volgend weetje"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Nog een weetje
      </button>
    </section>
  );
}
