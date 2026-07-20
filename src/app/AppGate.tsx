import { Outlet } from 'react-router-dom';

/**
 * Poortwachter voor de app. In fase 0 een eenvoudige doorgang;
 * vanaf fase 1 laadt deze het profiel en stuurt zo nodig naar onboarding.
 */
export function AppGate() {
  return <Outlet />;
}
