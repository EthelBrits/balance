import { Dumbbell } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function TrainingPage() {
  return (
    <>
      <PageHeader title="Training" subtitle="Korte, haalbare sessies op uw tempo." />
      <EmptyState
        icon={Dumbbell}
        title="Trainingen komen eraan"
        description="Hier vindt u straks een bibliotheek met rustige, opbouwende trainingen."
      />
    </>
  );
}
