import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-5 p-6 text-center">
      <Logo withSubtitle />
      <h1 className="font-heading text-2xl font-semibold text-text">Pagina niet gevonden</h1>
      <p className="text-text-muted">Deze pagina bestaat niet. Ga terug naar het startscherm.</p>
      <Link to="/" className="btn-primary">
        Naar Vandaag
      </Link>
    </div>
  );
}
