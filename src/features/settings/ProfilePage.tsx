import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Logo } from '../../components/Logo';
import { SettingsSection } from './SettingsSection';
import { PersonalSection } from './sections/PersonalSection';
import { GoalsToneSection } from './sections/PreferencesSection';
import { ModulesSection } from './sections/ModulesSection';
import { RemindersSection } from './sections/RemindersSection';
import { AppearanceSection } from './sections/AppearanceSection';
import { DataSection } from './sections/DataSection';

export function ProfilePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Profiel" subtitle="Uw gegevens, doelen en instellingen." />

      <SettingsSection title="Persoonlijke gegevens" defaultOpen>
        <PersonalSection />
      </SettingsSection>

      <SettingsSection title="Doelen, toon en voorkeuren">
        <GoalsToneSection />
      </SettingsSection>

      <SettingsSection title="Modules" description="Schakel optionele onderdelen in of uit.">
        <ModulesSection />
      </SettingsSection>

      <SettingsSection title="Meldingen">
        <RemindersSection />
      </SettingsSection>

      <SettingsSection title="Weergave">
        <AppearanceSection />
      </SettingsSection>

      <SettingsSection title="Gegevens: export, import en verwijderen">
        <DataSection />
      </SettingsSection>

      <Link
        to="/privacy"
        className="card flex items-center justify-between text-primary-dark hover:bg-primary-light/40"
      >
        <span className="flex items-center gap-2 font-heading font-medium">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" /> Privacy
        </span>
        <span aria-hidden="true">→</span>
      </Link>

      <div className="flex flex-col items-center gap-2 pt-4 text-center">
        <Logo withSubtitle />
        <p className="text-xs text-text-muted">Ontwikkeld door huisarts Dr. Ethel Brits.</p>
      </div>
    </div>
  );
}
