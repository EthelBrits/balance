import { Logo } from '../../../components/Logo';

export function StepWelcome() {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <Logo withSubtitle />
      <h2 className="font-heading text-2xl font-semibold text-text">Welkom bij Mijn Balans</h2>
      <p className="max-w-md text-text-muted">
        Gezonder leven hoeft niet perfect. Mijn Balans helpt u om kleine gewoontes zichtbaar te
        maken en stap voor stap vooruit te gaan.
      </p>
      <p className="text-sm text-text-muted">Kleine keuzes. Zichtbare vooruitgang.</p>
    </div>
  );
}
