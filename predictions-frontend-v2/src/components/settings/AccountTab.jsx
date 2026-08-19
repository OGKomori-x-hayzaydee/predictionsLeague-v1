import { useEffect, useState } from 'react';
import userAPI from '../../services/api/userAPI';
import { useAuth } from '../../context/AuthContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';
import { Button } from '../ui/buttons';
import LoadingState from '../common/LoadingState';

const FIELD_CLASS =
  'w-full rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

export default function AccountTab() {
  const { logout } = useAuth();
  const { preferences, updatePreference } = useUserPreferences();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    userAPI
      .getProfile()
      .then((res) => !cancelled && setProfile(res.user))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setChangingPassword(true);
    try {
      await userAPI.changePassword(passwordForm);
      setPasswordStatus({ type: 'success', message: 'Password updated.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err?.message || 'Could not update password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <LoadingState message="Loading account..." />;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Profile</KickerLabel>
        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <div>
            <dt className="text-text-muted-2">Display name</dt>
            <dd className="font-dmSerif text-lg text-text-primary">{profile?.username || '—'}</dd>
          </div>
          <div>
            <dt className="text-text-muted-2">Email</dt>
            <dd className="text-text-primary">{profile?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-text-muted-2">Favourite team</dt>
            <dd className="text-text-primary">{profile?.favouriteTeam || '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Privacy</KickerLabel>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-text-primary">
            Public fingerprint
            <span className="block text-xs text-text-muted-2">
              Let league members see your tendencies, not just your points.
            </span>
          </span>
          <input
            type="checkbox"
            checked={preferences.publicFingerprint ?? false}
            onChange={(e) => updatePreference('publicFingerprint', e.target.checked)}
            className="h-5 w-5 accent-brand-teal"
          />
        </label>
      </Card>

      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Change password</KickerLabel>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            required
            className={FIELD_CLASS}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder="New password"
            required
            className={FIELD_CLASS}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            required
            className={FIELD_CLASS}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />
          {passwordStatus && (
            <p className={`text-xs ${passwordStatus.type === 'error' ? 'text-state-error' : 'text-brand-teal'}`}>
              {passwordStatus.message}
            </p>
          )}
          <Button type="submit" variant="secondary" pill={false} size="sm" disabled={changingPassword}>
            {changingPassword ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" pill={false} onClick={logout}>Sign out</Button>
      </div>
    </div>
  );
}
