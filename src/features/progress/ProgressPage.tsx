import { LineChart } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function ProgressPage() {
  return (
    <>
      <PageHeader title="Voortgang" subtitle="Metingen en trends over tijd." />
      <EmptyState
        icon={LineChart}
        title="Nog geen metingen"
        description="Zodra u gewicht of buikomtrek registreert, verschijnen hier rustige trendlijnen."
      />
    </>
  );
}
