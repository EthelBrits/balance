import { CalendarCheck } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function TodayPage() {
  return (
    <>
      <PageHeader title="Vandaag" subtitle="Uw dag in balans." />
      <EmptyState
        icon={CalendarCheck}
        title="Nog niets ingevuld"
        description="Hier verschijnen straks uw dagelijkse gewoontes en uw balansscore."
      />
    </>
  );
}
