import { Lightbulb } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

export function InsightsPage() {
  return (
    <>
      <PageHeader title="Inzichten" subtitle="Rustige observaties uit uw eigen gegevens." />
      <EmptyState
        icon={Lightbulb}
        title="Er zijn nog wat meer dagen nodig"
        description="Inzichten verschijnen zodra er voldoende gegevens zijn om betrouwbare patronen te tonen."
      />
    </>
  );
}
