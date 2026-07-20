import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Loading } from '../components/Loading';

/**
 * Poortwachter: laadt de opslag, past de lettergrootte toe en stuurt naar de
 * onboarding zolang die niet is afgerond.
 */
export function AppGate() {
  const loaded = useStore((s) => s.loaded);
  const init = useStore((s) => s.init);
  const profile = useStore((s) => s.profile);
  const fontScale = useStore((s) => s.settings.fontScale);
  const location = useLocation();

  useEffect(() => {
    if (!loaded) void init();
  }, [loaded, init]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  if (!loaded) {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!profile?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
