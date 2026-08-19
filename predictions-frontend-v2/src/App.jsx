import { Routes, Route, Navigate } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryProvider } from './context/QueryContext';
import { ChipManagementProvider } from './context/ChipManagementContext';
import DefaultRedirect from './components/common/DefaultRedirect';
import PrivateRoute, { PublicRoute } from './components/common/PrivateRoute';
import LoadingState from './components/common/LoadingState';
import AuthErrorBoundary from './components/auth/AuthErrorBoundary';
import AppShell from './components/layout/AppShell';

// Bridged as-is from predictions-frontend — landing/auth is out of scope
// for the v2 reskin, which only concerns the authenticated app itself.
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowToPlay from './pages/HowToPlay';
import OAuthCallback from './pages/OAuthCallback';
import OAuthOnboarding from './pages/OAuthOnboarding';
import EmailVerification from './pages/EmailVerification';

import DashboardPage from './pages/DashboardPage';
import FixturesPage from './pages/FixturesPage';
import RecordPage from './pages/RecordPage';
import ChipsPage from './pages/ChipsPage';
import LeaguesPage from './pages/LeaguesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const AppRouter = () => {
  const { isInitialized, hasInitializationError } = useAuth();

  if (!isInitialized()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-app">
        <LoadingState message="Initializing application..." />
      </div>
    );
  }

  if (hasInitializationError()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-app">
        <div className="text-center">
          <p className="mb-4 text-state-error">Failed to initialize application</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-state-error px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public / auth — bridged from predictions-frontend, untouched by the reskin */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/howToPlay" element={<HowToPlay />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route
        path="/auth/callback"
        element={
          <AuthErrorBoundary>
            <OAuthCallback />
          </AuthErrorBoundary>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/finish-onboarding"
        element={
          <AuthErrorBoundary>
            <OAuthOnboarding />
          </AuthErrorBoundary>
        }
      />

      {/* Authenticated app — the v2 reskin */}
      <Route
        element={
          <PrivateRoute>
            <AppShell />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/chips" element={<ChipsPage />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/home" element={<PrivateRoute><DefaultRedirect /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <UserPreferencesProvider>
          <AuthProvider>
            <ChipManagementProvider>
              <Theme>
                <AppRouter />
              </Theme>
            </ChipManagementProvider>
          </AuthProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
