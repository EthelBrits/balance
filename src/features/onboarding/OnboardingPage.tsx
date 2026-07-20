import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';

/** Fase 0: eenvoudige welkomstpagina. De volledige onboarding komt in fase 1. */
export function OnboardingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo withSubtitle />
      <h1 className="font-heading text-2xl font-semibold text-text">Welkom bij Mijn Balans</h1>
      <p className="text-text-muted">
        Gezonder leven hoeft niet perfect. Mijn Balans helpt u om kleine gewoontes zichtbaar te
        maken en stap voor stap vooruit te gaan.
      </p>
      <Link to="/" className="btn-primary">
        Start mijn balans
      </Link>
      <p className="text-xs text-text-muted">Ontwikkeld door huisarts Dr. Ethel Brits.</p>
    </div>
  );
}
