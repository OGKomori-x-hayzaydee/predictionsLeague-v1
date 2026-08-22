import { useState } from 'react';
import SettingsRow from '../settings/SettingsRow';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import { Button } from '../ui/buttons';
import LoadingState from '../common/LoadingState';
import useLeagueManage from '../../hooks/useLeagueManage';

const FIELD_CLASS =
  'w-full rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

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
        <Avatar name={name} src={member.avatar} size={32} animateFallback={false} />
        <span className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.45] md:gap-0">
          <span className="truncate text-caption text-text-secondary">
            {name}
            {member.isCurrentUser && <span className="ml-1 text-text-muted-3">· you</span>}
          </span>
          <span className="text-2xs leading-[1.45] text-text-muted-3 md:text-xs md:text-text-muted-1">
            {member.points ?? 0} pts
            {member.predictions != null ? ` · ${member.predictions} calls` : ''}
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-text-muted-1">
          {member.isAdmin ? 'Admin' : 'Member'}
        </span>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <span className="text-2xs text-state-error-mid sm:mr-auto">Remove {name} from this league?</span>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" pill={false} disabled={busy} onClick={onCancelRemove}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" pill={false} disabled={busy} onClick={() => onConfirmRemove(member)}>
              {busy ? 'Removing…' : 'Remove'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * League-admin panel — SettingsPage / AccountTab recipe: 780px column, dmSerif
 * head, SettingsRow stack, Card forms, inline danger confirm. Chrome (SlotBar /
 * league tabs) lives on LeaguesPage so this is a tab body, not a separate view.
 */
export default function LeagueManageView({ overview, onUpdated, onDeleted }) {
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
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-[780px] max-w-full flex-col gap-[22px] px-4 py-6 md:py-[30px]">
        <div className="hidden flex-col gap-1.5 md:flex">
          <h2 className="font-dmSerif text-3xl leading-[1.1] text-text-primary">Manage</h2>
          <p className="max-w-[46em] text-caption leading-[1.6] text-text-muted-2 [text-wrap:pretty]">
            Invite people, keep the roster, or close this league. Scoring and privacy were set when it was created.
          </p>
        </div>

        <div className="flex flex-col gap-2">
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
          <SettingsRow
            label="Close this league"
            detail="Removes every member, including you. It will disappear from everyone’s list."
            kind="value"
            value="…"
            danger
            onClick={() => setConfirmDelete(true)}
          />
        </div>

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

        <div className="flex flex-col gap-3">
          <KickerLabel as="div">League details</KickerLabel>
          <Card className="p-4 md:p-5">
            <form onSubmit={handleSave} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="League name"
                className={FIELD_CLASS}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Description"
                className={`${FIELD_CLASS} min-h-[5.5rem] resize-y`}
              />
              {saveError && <p className="text-xs text-state-error-mid">{saveError}</p>}
              <Button type="submit" variant="secondary" pill={false} size="sm" disabled={saving || !dirty || !name.trim()}>
                {saving ? 'Saving…' : 'Save details'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <KickerLabel as="div">Members</KickerLabel>
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
        </div>
      </div>
    </div>
  );
}
