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
import SelectTeam from "./pages/onboarding/SelectTeam";


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
                <Route 
                  path="/auth/oauth/callback" 
                  element={<OAuthCallback />} 
                />
                
                {/* Onboarding routes - protected but accessible during initial setup */}
                <Route 
                  path="/onboarding/select-team" 
                  element={
                    <PrivateRoute>
                      <SelectTeam />
                    </PrivateRoute>
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
            </Theme>
          </AuthProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
