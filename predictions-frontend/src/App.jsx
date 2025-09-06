import { Routes, Route, Navigate } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./context/ThemeContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./context/QueryContext";
import DefaultRedirect from "./components/common/DefaultRedirect";
import PrivateRoute, { PublicRoute } from "./components/common/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HowToPlay from "./pages/HowToPlay";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import OAuthOnboarding from "./pages/OAuthOnboarding";
import EmailVerification from "./pages/EmailVerification";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <UserPreferencesProvider>
          <AuthProvider>
            <Theme>
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
                <Route path="/auth/callback" element={<OAuthCallback />} />

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
                  path="/auth/oauth/complete"
                  element={<OAuthOnboarding />}
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
            </Theme>
          </AuthProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
