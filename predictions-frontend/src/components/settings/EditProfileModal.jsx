import { useEffect, useState } from 'react';
import { User } from '@phosphor-icons/react';
import Modal from '../ui/Modal';
import { Button } from '../ui/buttons';
import userAPI from '../../services/api/userAPI';

export default function EditProfileModal({ open, onClose, username, onSaved }) {
  const [value, setValue] = useState(username || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setValue((username || '').replace(/^@/, ''));
    setError(null);
    setBusy(false);
  }, [open, username]);

  const handleSave = async () => {
    const next = value.trim().replace(/^@/, '');
    if (next.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await userAPI.updateUsername(next);
      onSaved?.(res.user);
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Could not update username.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Edit Profile"
      icon={
        <span className="flex size-11 items-center justify-center rounded-lg bg-brand-amber/20 text-brand-amber">
          <User size={20} weight="bold" />
        </span>
      }
      footer={
        <>
          <Button type="button" variant="secondary" pill={false} disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="urgent" pill={false} disabled={busy} onClick={handleSave}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </>
      }
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-outfit text-sm uppercase tracking-[0.12em] text-text-muted-3">Username</span>
        <span className="text-sm text-text-muted-2">Your unique handle across the platform</span>
        <span className="mt-2 flex items-center rounded-lg border border-border-control bg-surface-card-2 focus-within:border-brand-teal">
          <span className="pl-3.5 font-outfit text-base text-text-muted-3">@</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/^@/, ''))}
            className="w-full bg-transparent px-2 py-2.5 text-base text-text-primary outline-none"
            autoComplete="username"
            spellCheck={false}
          />
        </span>
      </label>
      {error && <p className="mt-4 text-sm text-state-error-mid">{error}</p>}
    </Modal>
  );
}
