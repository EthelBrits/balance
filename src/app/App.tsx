import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { TodayPage } from '../features/dashboard/TodayPage';
import { TrainingPage } from '../features/workouts/TrainingPage';
import { InsightsPage } from '../features/insights/InsightsPage';
import { ProfilePage } from '../features/settings/ProfilePage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { PrivacyPage } from '../features/settings/PrivacyPage';
import { NotFoundPage } from './NotFoundPage';
import { AppGate } from './AppGate';
import { Loading } from '../components/Loading';

// Recharts is groot: laad de grafiekpagina apart in.
const ProgressPage = lazy(() =>
  import('../features/progress/ProgressPage').then((m) => ({ default: m.ProgressPage })),
);
const WorkoutPlayerPage = lazy(() =>
  import('../features/workouts/WorkoutPlayerPage').then((m) => ({ default: m.WorkoutPlayerPage })),
);

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AppGate />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/training/speler/:workoutId" element={<WorkoutPlayerPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route element={<Layout />}>
            <Route index element={<TodayPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/voortgang" element={<ProgressPage />} />
            <Route path="/inzichten" element={<InsightsPage />} />
            <Route path="/profiel" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
