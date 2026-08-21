import { useState } from 'react';
import SlotBar from '../ui/SlotBar';
import SettingsRow from '../settings/SettingsRow';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import { Button } from '../ui/buttons';
import LoadingState from '../common/LoadingState';
import useLeagueManage from '../../hooks/useLeagueManage';

const FIELD_CLASS =
  'w-full min-h-11 rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

function publicityLabel(type) {
  if (type === 'PUBLIC') return 'Public';
  if (type === 'PRIVATE') return 'Private';
  return type || '—';
}

function MemberRow({ member, busy, pendingRemove, onPromote, onAskRemove, onCancelRemove, onConfirmRemove }) {
  const name = member.displayName || member.username || 'Member';
  const canAct = !member.isAdmin && !member.isCurrentUser;

  return (
    <div className="flex flex-col gap-3 rounded-14 border border-border-base bg-surface-card-3 px-[13px] py-[13px] md:rounded-12 md:bg-surface-header/60 md:px-[17px] md:py-[15px]">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={32} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-caption text-text-secondary">
            {name}
            {member.isCurrentUser && <span className="ml-1 text-text-muted-3">· you</span>}
          </span>
          <span className="font-outfit text-2xs text-text-muted-3">
            {member.points ?? 0} pts
            {member.predictions != null ? ` · ${member.predictions} calls` : ''}
          </span>
        </span>
        <KickerLabel className={member.isAdmin ? 'text-brand-teal' : 'text-text-muted-4'}>
          {member.isAdmin ? 'Admin' : 'Member'}
        </KickerLabel>
      </div>

      {canAct && pendingRemove !== member.id && (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" pill={false} disabled={busy} onClick={() => onPromote(member)}>
            Promote
          </Button>
          <Button size="sm" variant="ghost" pill={false} disabled={busy} onClick={() => onAskRemove(member.id)}>
            Remove
          </Button>
        </div>
      )}

      {canAct && pendingRemove === member.id && (
        <div className="flex items-center justify-end gap-2">
          <span className="mr-auto text-2xs text-state-error-mid">Remove {name} from this league?</span>
          <Button size="sm" variant="ghost" pill={false} disabled={busy} onClick={onCancelRemove}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" pill={false} disabled={busy} onClick={() => onConfirmRemove(member)}>
            {busy ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LeagueManageView({ overview, onBack, onUpdated, onDeleted }) {
  const manage = useLeagueManage(overview?.id);
  const [name, setName] = useState(overview?.name || '');
  const [description, setDescription] = useState(overview?.description || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const joinCode = overview?.joinCode;
  const dirty = name.trim() !== (overview?.name || '') || description !== (overview?.description || '');

  const handleCopyCode = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const next = { name: name.trim(), description };
      await manage.updateSettings(next);
      onUpdated?.(next);
    } catch (err) {
      setSaveError(err.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async (member) => {
    setActingId(member.id);
    try {
      await manage.promoteMember(member);
    } finally {
      setActingId(null);
    }
  };

  const handleRemove = async (member) => {
    setActingId(member.id);
    try {
      await manage.removeMember(member);
      setPendingRemove(null);
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await manage.deleteLeague(overview?.name);
      onDeleted?.();
    } catch (err) {
      setDeleteError(err.message || 'Could not close this league.');
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col animate-rise-in">
      <div className="hidden md:block">
        <SlotBar kicker="MANAGE" onBack={onBack} right={overview?.name} />
      </div>

      <div className="flex items-center gap-3 px-4 pt-4 md:hidden">
        <button
          onClick={onBack}
          aria-label="Back to league"
          className="flex size-11 shrink-0 items-center justify-center rounded-11 border border-border-control bg-surface-card-4/60 text-sm text-text-secondary"
        >
          &#8249;
        </button>
        <KickerLabel className="text-brand-teal">Manage</KickerLabel>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-[780px] max-w-full flex-col gap-[22px] px-4 py-6 md:py-[30px]">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary md:text-3xl md:leading-[1.1]">
              {overview?.name}
            </h2>
            <p className="max-w-[46em] text-caption leading-[1.6] text-text-muted-2 [text-wrap:pretty]">
              Invite people, keep the roster, or close this league. Scoring and privacy were set when it was created.
            </p>
          </div>

          <section className="flex flex-col gap-3">
            <KickerLabel as="div">League settings</KickerLabel>
            <Card className="p-4 md:p-5">
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-text-secondary">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={FIELD_CLASS}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-caption text-text-secondary">Description</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`${FIELD_CLASS} min-h-[5.5rem] resize-y`}
                  />
                </label>
                {saveError && <p className="text-xs text-state-error-mid">{saveError}</p>}
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary" pill={false} size="sm" disabled={saving || !dirty || !name.trim()}>
                    {saving ? 'Saving…' : 'Save settings'}
                  </Button>
                </div>
              </form>
            </Card>
            <SettingsRow
              label="Visibility"
              detail="Set when the league was created — public leagues have no join code"
              kind="value"
              value={publicityLabel(overview?.type)}
            />
            <SettingsRow
              label="Counts from"
              detail="Points only include sheets from this gameweek onward"
              kind="value"
              value={`GW ${overview?.firstGameweek ?? 1}`}
            />
          </section>

          <section className="flex flex-col gap-3">
            <KickerLabel as="div">Invite and roster</KickerLabel>
            {joinCode ? (
              <SettingsRow
                label="Join code"
                detail="Share this with people you want in the league"
                kind="value"
                value={copied ? 'Copied' : joinCode}
                onClick={handleCopyCode}
              />
            ) : (
              <SettingsRow
                label="Join code"
                detail="Public leagues don’t use a code"
                kind="value"
                value="—"
              />
            )}

            {manage.loading ? (
              <LoadingState message="Loading members…" />
            ) : manage.error ? (
              <p className="text-xs text-state-error-mid">{manage.error}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {manage.members.map((member) => (
                  <MemberRow
                    key={member.id || member.username}
                    member={member}
                    busy={actingId === member.id}
                    pendingRemove={pendingRemove}
                    onPromote={handlePromote}
                    onAskRemove={setPendingRemove}
                    onCancelRemove={() => setPendingRemove(null)}
                    onConfirmRemove={handleRemove}
                  />
                ))}
                {manage.members.length === 0 && (
                  <p className="text-sm text-text-muted-2">No members yet.</p>
                )}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <KickerLabel as="div" className="text-state-error-mid">Close league</KickerLabel>
            <SettingsRow
              label="Close this league"
              detail="Removes every member, including you. It will disappear from everyone’s list."
              kind="value"
              value="…"
              danger
              onClick={() => setConfirmDelete(true)}
            />
            {confirmDelete && (
              <Card className="flex flex-col gap-3 border-state-error/30 p-4 md:p-5">
                <KickerLabel as="div" className="text-state-error-mid">Close league</KickerLabel>
                <p className="text-sm text-text-secondary">
                  This removes every member from {overview?.name || 'this league'}, including you. There is no undo.
                </p>
                {deleteError && <p className="text-xs text-state-error-mid">{deleteError}</p>}
                <div className="flex justify-end gap-2">
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
                  <Button variant="danger" pill={false} onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Closing…' : 'Close league'}
                  </Button>
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
