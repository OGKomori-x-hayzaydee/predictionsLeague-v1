import { useEffect, useState } from 'react';
import userAPI from '../services/api/userAPI';
import SlotBar from '../components/ui/SlotBar';
import AccountTab from '../components/settings/AccountTab';
import AlertsTab from '../components/settings/AlertsTab';
import ScoringTab from '../components/settings/ScoringTab';
import { mergeProfile } from '../utils/profileOverrides';

// Spine.dc.html buildSettings() heads{} (script ~line 5292) — verbatim copy.
// Tab id "notifications" matches this app's preferences.notifications shape;
// the prototype only abbreviates the label on the mobile pill strip
// (buildSettingsMobile(), script ~line 5723 — "ALERTS" vs desktop "Notifications").
const TABS = [
  {
    id: 'account',
    deskLabel: 'Account',
    mobLabel: 'ACCOUNT',
    head: 'Account',
    sub: 'Who you are across every league you join. Names are visible to league members; the email is only ever used for sign-in and the weekly summary.',
    Component: AccountTab,
  },
  {
    id: 'notifications',
    deskLabel: 'Notifications',
    mobLabel: 'ALERTS',
    head: 'Notifications',
    sub: 'Nothing here is on by default except the deadline nudge — the one message that has ever saved a sheet.',
    Component: AlertsTab,
  },
  {
    id: 'scoring',
    deskLabel: 'Scoring',
    mobLabel: 'SCORING',
    head: 'Scoring',
    sub: 'The whole scheme, in one place. Read-only — your leagues share one rule set so a point means the same thing everywhere.',
    Component: ScoringTab,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    userAPI
      .getProfile()
      .then((res) => !cancelled && setProfile(mergeProfile(res.user)))
      .catch(() => {})
      .finally(() => !cancelled && setProfileLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const Active = active.Component;

  return (
    <div className="animate-rise-in">
      {/* Desktop — foundation spec §5.2 slot bar in tabs mode; §5.3 single-column content, centered */}
      <div className="hidden md:block">
        <SlotBar
          kicker="SETTINGS"
          tabs={TABS.map((t) => ({ id: t.id, label: t.deskLabel }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          right={profile?.email || undefined}
        />
        <div className="mx-auto flex w-[840px] max-w-full flex-col gap-8 px-5 py-10">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-dmSerif text-4xl leading-[1.1] text-text-primary">{active.head}</h2>
            <p className="max-w-[46em] text-base leading-[1.65] text-text-muted-2 [text-wrap:pretty]">{active.sub}</p>
          </div>
          <Active profile={profile} loading={profileLoading} onProfileChange={setProfile} />
        </div>
      </div>

      {/* Mobile — Spine.dc.html mobile settings, template lines 3228-3306. No shell-level
          slot bar on mobile (foundation spec §6.1); tab context is an in-content pill strip. */}
      <div className="flex flex-col gap-5 px-5 pb-8 pt-5 md:hidden">
        <div className="flex flex-col gap-2">
          <h2 className="font-dmSerif text-3xl leading-[1.15] text-text-primary">{active.head}</h2>
          <span className="text-sm leading-[1.65] text-text-muted-2 [text-wrap:pretty]">{active.sub}</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto rounded-12 border border-border-card bg-surface-card-4 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`min-w-[92px] flex-1 shrink-0 whitespace-nowrap rounded-md px-2.5 py-3 font-mono text-2xs tracking-[0.08em] transition-colors ${
                t.id === activeTab ? 'bg-surface-nav-active text-brand-teal' : 'bg-transparent text-text-muted-2'
              }`}
            >
              {t.mobLabel}
            </button>
          ))}
        </div>

        <Active profile={profile} loading={profileLoading} onProfileChange={setProfile} />
      </div>
    </div>
  );
}
