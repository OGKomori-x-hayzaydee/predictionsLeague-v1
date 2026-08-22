import { useEffect, useState } from 'react';
import userAPI from '../services/api/userAPI';
import SlotBar from '../components/ui/SlotBar';
import AccountTab from '../components/settings/AccountTab';
import AlertsTab from '../components/settings/AlertsTab';
import TeamsTab from '../components/settings/TeamsTab';
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
    id: 'teams',
    deskLabel: 'Teams',
    mobLabel: 'TEAMS',
    head: 'Teams',
    sub: 'Followed teams pin their fixtures to the top of the reel and colour their crest in the grid. It changes ordering only, never scoring.',
    Component: TeamsTab,
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
      {/* Desktop — foundation spec §5.2 slot bar in tabs mode; §5.3 single-column content, 780px centered */}
      <div className="hidden md:block">
        <SlotBar
          kicker="SETTINGS"
          tabs={TABS.map((t) => ({ id: t.id, label: t.deskLabel }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          right={profile?.email || undefined}
        />
        <div className="mx-auto flex w-[780px] max-w-full flex-col gap-[22px] px-4 py-[30px]">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-dmSerif text-3xl leading-[1.1] text-text-primary">{active.head}</h2>
            <p className="max-w-[46em] text-caption leading-[1.6] text-text-muted-2 [text-wrap:pretty]">{active.sub}</p>
          </div>
          <Active profile={profile} loading={profileLoading} onProfileChange={setProfile} />
        </div>
      </div>

      {/* Mobile — Spine.dc.html mobile settings, template lines 3228-3306. No shell-level
          slot bar on mobile (foundation spec §6.1); tab context is an in-content pill strip. */}
      <div className="flex flex-col gap-[13px] px-4 pb-6 pt-4 md:hidden">
        <div className="flex flex-col gap-[5px]">
          <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary">{active.head}</h2>
          <span className="text-xs leading-[1.6] text-text-muted-2 [text-wrap:pretty]">{active.sub}</span>
        </div>

        <div className="flex gap-[5px] overflow-x-auto rounded-11 border border-border-card bg-surface-card-4 p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`min-w-[74px] flex-1 shrink-0 whitespace-nowrap rounded-sm px-1.5 py-[9px] font-mono text-3xs tracking-[0.08em] transition-colors ${
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
