import { Navigate } from 'react-router-dom';

export default function DefaultRedirect() {
  return <Navigate to="/dashboard" replace />;
}
