import { Navigate } from "react-router-dom";
import { useUserPreferences } from "../../context/UserPreferencesContext";

const DefaultRedirect = () => {
  const { preferences } = useUserPreferences();
  
  // Redirect to the user's preferred default dashboard view
  return <Navigate to={`/home/${preferences.defaultDashboardView}`} replace />;
};

export default DefaultRedirect;
