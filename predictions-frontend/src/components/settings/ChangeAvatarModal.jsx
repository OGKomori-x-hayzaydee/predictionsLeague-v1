import { useEffect, useMemo, useState } from 'react';
import { ArrowsClockwise, Check, UploadSimple } from '@phosphor-icons/react';
import Modal from '../ui/Modal';
import { Button } from '../ui/buttons';
import { AVATAR_STYLES, dicebearDataUri, dicebearSvgFile, randomAvatarSeed } from '../../utils/dicebearAvatar';
import userAPI from '../../services/api/userAPI';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';

export default function ChangeAvatarModal({ open, onClose, username, onSaved }) {
  const [tab, setTab] = useState('generate');
  const [styleId, setStyleId] = useState('avataaars');
  const [seed, setSeed] = useState(username || 'player');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab('generate');
    setStyleId('avataaars');
    setSeed(username || randomAvatarSeed());
    setError(null);
    setBusy(false);
  }, [open, username]);

  const preview = useMemo(() => dicebearDataUri(styleId, seed, 192), [styleId, seed]);

  const persistFile = async (file) => {
    setBusy(true);
    setError(null);
    try {
      const res = await userAPI.uploadProfilePicture(file);
      onSaved?.(res.url || res.imageUrl);
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Could not save avatar.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveGenerated = () => persistFile(dicebearSvgFile(styleId, seed));

  const handlePickedFile = (file) => {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError('Image must be 5 MB or smaller.');
      return;
    }
    if (file.type && !ACCEPT.split(',').includes(file.type) && !file.type.startsWith('image/')) {
      setError('Use JPEG, PNG, WebP, GIF or SVG.');
      return;
    }
    persistFile(file);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Change avatar"
      footer={
        tab === 'generate' ? (
          <>
            <Button
              type="button"
              variant="secondary"
              pill={false}
              disabled={busy}
              onClick={() => setSeed(randomAvatarSeed())}
            >
              <ArrowsClockwise size={16} />
              Randomize
            </Button>
            <Button type="button" variant="urgent" pill={false} disabled={busy} onClick={handleSaveGenerated}>
              <Check size={16} weight="bold" />
              {busy ? 'Saving…' : 'Save'}
            </Button>
          </>
        ) : null
      }
    >
      <div className="flex gap-5 border-b border-border-base">
        {['generate', 'upload'].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setError(null);
            }}
            className={`pb-2 font-outfit text-sm capitalize transition-colors ${
              tab === id
                ? 'text-brand-amber shadow-[inset_0_-2px_0_0_var(--color-brand-amber)]'
                : 'text-text-muted-2 hover:text-text-primary'
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="flex flex-col items-center gap-5 pt-5">
          <img src={preview} alt="" className="size-32 rounded-full border border-border-card bg-surface-card-2 object-cover" />
          <div className="w-full">
            <p className="mb-2 font-outfit text-xs uppercase tracking-[0.12em] text-text-muted-3">Style</p>
            <div className="grid grid-cols-3 gap-2">
              {AVATAR_STYLES.map((style) => {
                const selected = style.id === styleId;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setStyleId(style.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 transition-colors ${
                      selected
                        ? 'border-brand-amber bg-brand-amber/10'
                        : 'border-border-card bg-surface-card-3 hover:border-border-control'
                    }`}
                  >
                    <img
                      src={dicebearDataUri(style.id, seed, 48)}
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                    <span className="font-outfit text-2xs text-text-secondary">{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handlePickedFile(e.dataTransfer.files?.[0]);
          }}
          className={`mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed px-4 py-10 text-center transition-colors ${
            dragOver ? 'border-brand-amber bg-brand-amber/10' : 'border-border-control bg-surface-card-2'
          }`}
        >
          <UploadSimple size={28} className="text-text-muted-2" />
          <span className="text-sm text-text-secondary">Tap to choose a photo</span>
          <span className="font-outfit text-xs text-text-muted-3">JPEG, PNG, WebP, or GIF — max 5 MB</span>
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              handlePickedFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
      )}

      {error && <p className="mt-3 text-xs text-state-error-mid">{error}</p>}
    </Modal>
  );
}
