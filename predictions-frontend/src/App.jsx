import { Routes, Route, Navigate } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./context/ThemeContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./context/QueryContext";
import { ChipManagementProvider } from "./context/ChipManagementContext";
import DefaultRedirect from "./components/common/DefaultRedirect";
import PrivateRoute, { PublicRoute } from "./components/common/PrivateRoute";
import LoadingState from "./components/common/LoadingState";
import AuthErrorBoundary from "./components/auth/AuthErrorBoundary";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HowToPlay from "./pages/HowToPlay";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import OAuthOnboarding from "./pages/OAuthOnboarding";
import EmailVerification from "./pages/EmailVerification";
import { useAuth } from "./context/AuthContext";

// App router component that waits for initialization
const AppRouter = () => {
  const { isInitialized, hasInitializationError } = useAuth();

  // Show loading during initialization
  if (!isInitialized()) {
    return (
      <div className="min-h-screen bg-primary-500 flex items-center justify-center">
        <LoadingState message="Initializing application..." />
      </div>
    );
  }

  // Show error state if initialization failed
  if (hasInitializationError()) {
    return (
      <div className="min-h-screen bg-primary-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Failed to initialize application</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render main application routes
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/howToPlay" element={<HowToPlay />} />

      {/* Auth routes - only accessible when not authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* OAuth callback route - publicly accessible during auth process */}
      <Route 
        path="/auth/callback" 
        element={
          <AuthErrorBoundary>
            <OAuthCallback />
          </AuthErrorBoundary>
        } 
      />

      {/* Email verification route - shared by signup and OAuth */}
      <Route 
        path="/verify-email" 
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        } 
      />

      {/* Onboarding route */}
      <Route
        path="/auth/finish-onboarding"
        element={
          <AuthErrorBoundary>
            <OAuthOnboarding />
          </AuthErrorBoundary>
        }
      />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <DefaultRedirect />
          </PrivateRoute>
        }
      />
      <Route
        path="/home/:view"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Navigate to="/home/dashboard" replace />
          </PrivateRoute>
        }
      />

      {/* Catch all route */}
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
