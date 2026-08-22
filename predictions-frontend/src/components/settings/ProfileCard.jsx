import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import { Button } from '../ui/buttons';
import { PencilSimple } from '@phosphor-icons/react';

function GoogleMark() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border-card bg-surface-card-4 px-1.5 py-0.5 font-outfit text-2xs text-text-secondary">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.12-1.43.36-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.76 1.18 5.38l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
      </svg>
      Google
    </span>
  );
}

export default function ProfileCard({ profile, onChangeAvatar, onEditProfile }) {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() || profile?.username || 'You';
  const handle = profile?.username ? `@${profile.username.replace(/^@/, '')}` : '—';

  return (
    <div className="flex flex-col gap-2">
      <KickerLabel as="div" className="tracking-[0.16em] text-white">
        Profile
      </KickerLabel>
      <div className="overflow-hidden rounded-[16px] border border-border-card bg-surface-card">
        <div
          className="h-[88px] w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-brand-amber) 22%, transparent) 0 1px, transparent 1px 8px)',
            backgroundColor: 'var(--color-surface-card-2, #0e1624)',
          }}
        />
        <div className="relative flex flex-col gap-4 px-5 pb-5 pt-0 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-4">
            <div className="-mt-10 flex shrink-0 flex-col items-center gap-1.5">
              <span className="rounded-full border-[3px] border-surface-card">
                <Avatar
                  name={profile?.username || fullName}
                  src={profile?.profilePicture}
                  size={84}
                />
              </span>
              <button
                type="button"
                onClick={onChangeAvatar}
                className="font-outfit text-xs text-brand-amber transition-colors hover:text-brand-amber-mid"
              >
                Change avatar
              </button>
            </div>
            <div className="min-w-0 pb-1">
              <h3 className="truncate font-dmSerif text-2xl leading-tight text-text-primary">{fullName}</h3>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-outfit text-xs text-text-muted-2">
                <span className="truncate">{handle}</span>
                {profile?.email && (
                  <>
                    <span className="text-text-muted-4">·</span>
                    <span className="truncate">{profile.email}</span>
                  </>
                )}
                {profile?.linkedGoogle && <GoogleMark />}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            pill={false}
            size="sm"
            onClick={onEditProfile}
            className="self-end uppercase tracking-[0.08em]"
          >
            <PencilSimple size={14} weight="bold" />
            Edit profile
          </Button>
        </div>
      </div>
    </div>
  );
}
