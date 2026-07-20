import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

const POINTS = [
  'Uw gegevens blijven in deze versie lokaal op dit toestel.',
  'Er is geen verplichte account nodig.',
  'Er gaan geen gezondheidsgegevens naar een server.',
  'Er is geen reclame.',
  'Uw gegevens worden niet verkocht.',
  'Exporteren en wissen kan altijd.',
  'Bij het wissen van uw browsergegevens kunnen lokale gegevens verloren gaan.',
  'Regelmatig exporteren wordt daarom aanbevolen.',
];

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profiel" className="btn-ghost mb-4">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Terug naar profiel
      </Link>
      <PageHeader title="Privacy" subtitle="Hoe Mijn Balans met uw gegevens omgaat." />
      <div className="card">
        <div className="mb-4 flex items-center gap-2 text-primary">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          <span className="font-heading font-semibold text-primary-dark">Lokaal en privé</span>
        </div>
        <ul className="space-y-2">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-text">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-text-muted">Ontwikkeld door huisarts Dr. Ethel Brits.</p>
    </div>
  );
}
