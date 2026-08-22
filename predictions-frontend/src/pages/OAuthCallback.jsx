import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOAuthCallback } from '../hooks/useOAuthCallback';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/common/LoadingState';
import Button from '../components/ui/buttons/Button';
import PageError from '../components/ui/PageError';

export default function OAuthCallback() {
  const { isProcessing, error } = useOAuthCallback();
  const { getRequiredRoute } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isProcessing && !error) {
      const requiredRoute = getRequiredRoute();
      navigate(requiredRoute || '/dashboard', { replace: true });
    }
  }, [isProcessing, error, getRequiredRoute, navigate]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-app px-4">
        <PageError
          title="Couldn't finish sign-in"
          body={error}
          onRetry={() => navigate('/login')}
          onHome={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface-app px-4">
      <LoadingState message={isProcessing ? 'Stamping your slip…' : 'Redirecting…'} />
      <Link to="/login">
        <Button variant="ghost">Back to login</Button>
      </Link>
    </div>
  );
}
