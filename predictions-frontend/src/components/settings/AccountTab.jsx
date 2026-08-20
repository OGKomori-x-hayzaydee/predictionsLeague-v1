import { useState } from 'react';
import userAPI from '../../services/api/userAPI';
import { useAuth } from '../../context/AuthContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import SettingsRow from './SettingsRow';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';
import { Button } from '../ui/buttons';
import LoadingState from '../common/LoadingState';

// The prototype has no concept of season rollover data in this app yet — this
// is just the current league season label (same literal string already used
// on the marketing hero, components/landingPage/HeroSection.jsx), not a
// per-user derived value.
const CURRENT_SEASON = '2025/26';

const FIELD_CLASS =
  'w-full rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

export default function AccountTab({ profile, loading }) {
  const { logout } = useAuth();
  const { preferences, updatePreference } = useUserPreferences();

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await userAPI.deleteAccount();
      await logout();
    } catch (err) {
      setDeleteError(err?.message || 'Could not delete account.');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState message="Loading account..." />;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <SettingsRow label="Display name" detail="Shown across every league you join" kind="value" value={profile?.username || '—'} />
        <SettingsRow label="Email" detail="Used for sign-in and weekly summaries" kind="value" value={profile?.email || '—'} />
        <SettingsRow label="Season" detail="The season currently being scored" kind="value" value={CURRENT_SEASON} />
        <SettingsRow
          label="Public fingerprint"
          detail="Let league members see your tendencies, not just your points"
          kind="toggle"
          checked={!!preferences.publicFingerprint}
          onToggle={(v) => updatePreference('publicFingerprint', v)}
        />
        <SettingsRow
          label="Delete account"
          detail="Removes your sheets from every league, permanently"
          kind="value"
          value="…"
          danger
          onClick={() => setConfirmDelete(true)}
        />
      </div>

      {confirmDelete && (
        <Card className="flex flex-col gap-3 border-state-error/30 p-4 md:p-5">
          <KickerLabel as="div" className="text-state-error-mid">Delete account</KickerLabel>
          <p className="text-sm text-text-secondary">
            This removes your sheets from every league you're in, permanently. This can't be undone.
          </p>
          {deleteError && <p className="text-xs text-state-error-mid">{deleteError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" pill={false} onClick={() => { setConfirmDelete(false); setDeleteError(null); }} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" pill={false} onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete my account'}
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <KickerLabel as="div">Change password</KickerLabel>
        <Card className="p-4 md:p-5">
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
              <p className={`text-xs ${passwordStatus.type === 'error' ? 'text-state-error-mid' : 'text-brand-teal'}`}>
                {passwordStatus.message}
              </p>
            )}
            <Button type="submit" variant="secondary" pill={false} size="sm" disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" pill={false} onClick={logout}>Sign out</Button>
      </div>
    </div>
  );
}
