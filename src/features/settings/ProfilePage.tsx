import { User } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Profiel" subtitle="Uw gegevens, doelen en instellingen." />
      <EmptyState
        icon={User}
        title="Profiel volgt"
        description="Hier beheert u straks uw gegevens, doelen, modules en voorkeuren."
      />
    </>
  );
}
