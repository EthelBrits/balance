import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function WorkoutPlayerPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="Trainingsspeler" />
      <EmptyState title="De trainingsspeler wordt in een latere fase gebouwd.">
        <button className="btn-secondary" onClick={() => navigate('/training')}>
          Terug naar trainingen
        </button>
      </EmptyState>
    </div>
  );
}
