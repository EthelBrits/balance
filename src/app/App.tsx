import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { TodayPage } from '../features/dashboard/TodayPage';
import { TrainingPage } from '../features/workouts/TrainingPage';
import { WorkoutPlayerPage } from '../features/workouts/WorkoutPlayerPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { InsightsPage } from '../features/insights/InsightsPage';
import { ProfilePage } from '../features/settings/ProfilePage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { NotFoundPage } from './NotFoundPage';
import { AppGate } from './AppGate';

export function App() {
  return (
    <Routes>
      <Route element={<AppGate />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/training/speler/:workoutId" element={<WorkoutPlayerPage />} />
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
  );
}
