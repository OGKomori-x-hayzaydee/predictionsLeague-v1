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
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-amber/20 text-brand-amber">
          <User size={18} weight="bold" />
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
      <label className="flex flex-col gap-1">
        <span className="font-outfit text-xs uppercase tracking-[0.12em] text-text-muted-3">Username</span>
        <span className="text-xs text-text-muted-2">Your unique handle across the platform</span>
        <span className="mt-2 flex items-center rounded-md border border-border-control bg-surface-card-2 focus-within:border-brand-teal">
          <span className="pl-3 font-outfit text-sm text-text-muted-3">@</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/^@/, ''))}
            className="w-full bg-transparent px-2 py-2 text-sm text-text-primary outline-none"
            autoComplete="username"
            spellCheck={false}
          />
        </span>
      </label>
      {error && <p className="mt-3 text-xs text-state-error-mid">{error}</p>}
    </Modal>
  );
}
