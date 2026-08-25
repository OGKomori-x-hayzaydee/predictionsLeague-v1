import { useState } from 'react';
import userAPI from '../../services/api/userAPI';
import { useAuth } from '../../context/AuthContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import SettingsRow from './SettingsRow';
import ProfileCard from './ProfileCard';
import ChangeAvatarModal from './ChangeAvatarModal';
import EditProfileModal from './EditProfileModal';
import Modal from '../ui/Modal';
import { Button } from '../ui/buttons';
import LoadingState from '../common/LoadingState';

const CURRENT_SEASON = '2025/26';

export default function AccountTab({ profile, loading, onProfileChange }) {
  const { logout, updateUser, oauthData, isOAuthUser } = useAuth();
  const { preferences, updatePreference } = useUserPreferences();

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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
    <div className="flex flex-col gap-8">
      <ProfileCard
        profile={{
          ...profile,
          linkedGoogle: profile?.linkedGoogle || Boolean(oauthData?.provider) || Boolean(isOAuthUser?.()),
        }}
        onChangeAvatar={() => setAvatarOpen(true)}
        onEditProfile={() => setEditOpen(true)}
      />

      <ChangeAvatarModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        username={profile?.username}
        onSaved={(url) => {
          onProfileChange?.((prev) => ({ ...(prev || {}), profilePicture: url, avatar: url }));
          updateUser({ avatar: url, profilePicture: url });
        }}
      />
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        username={profile?.username}
        onSaved={(next) => {
          onProfileChange?.((prev) => ({ ...(prev || {}), ...next }));
          updateUser({ username: next?.username });
        }}
      />

      <div className="flex flex-col gap-3">
        <SettingsRow size="lg" label="Season" detail="The season currently being scored" kind="value" value={CURRENT_SEASON} />
        <SettingsRow
          size="lg"
          label="Public fingerprint"
          detail="Let league members see your tendencies, not just your points"
          kind="toggle"
          checked={!!preferences.publicFingerprint}
          onToggle={(v) => updatePreference('publicFingerprint', v)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-text-muted-2">Removes your sheets from every league, permanently.</p>
        <Button variant="danger" pill={false} onClick={() => setConfirmDelete(true)}>
          Delete account
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => {
          if (!deleting) {
            setConfirmDelete(false);
            setDeleteError(null);
          }
        }}
        busy={deleting}
        title="Delete account"
        footer={
          <>
            <Button
              variant="ghost"
              pill={false}
              onClick={() => {
                setConfirmDelete(false);
                setDeleteError(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="danger" pill={false} onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete my account'}
            </Button>
          </>
        }
      >
        <p className="text-base text-text-secondary">
          This removes your sheets from every league you&apos;re in, permanently. This can&apos;t be undone.
        </p>
        {deleteError && <p className="mt-3 text-sm text-state-error-mid">{deleteError}</p>}
      </Modal>

      <div className="flex items-center justify-between">
        <Button variant="ghost" pill={false} size="lg" onClick={logout}>Sign out</Button>
      </div>
    </div>
  );
}
