import { useEffect, useState } from 'react';
import userAPI from '../services/api/userAPI';
import SlotBar from '../components/ui/SlotBar';
import SegmentedControl from '../components/ui/SegmentedControl';
import AccountTab from '../components/settings/AccountTab';
import AlertsTab from '../components/settings/AlertsTab';
import ScoringTab from '../components/settings/ScoringTab';
import { mergeProfile } from '../utils/profileOverrides';

const TABS = [
  {
    id: 'account',
    deskLabel: 'Account',
    head: 'Account',
    sub: 'Who you are across every league you join. Names are visible to league members; the email is only ever used for sign-in and the weekly summary.',
    Component: AccountTab,
  },
  {
    id: 'notifications',
    deskLabel: 'Notifications',
    head: 'Notifications',
    sub: 'Nothing here is on by default except the deadline nudge — the one message that has ever saved a sheet.',
    Component: AlertsTab,
  },
  {
    id: 'scoring',
    deskLabel: 'Scoring',
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
      <SlotBar
        kicker="SETTINGS"
        tabs={TABS.map((t) => ({ id: t.id, label: t.deskLabel }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        right={profile?.email || undefined}
      />

      <div className="form-max mx-auto flex w-full flex-col gap-8 px-5 py-8 lg:py-10">
        <div className="lg:hidden">
          <SegmentedControl
            grow
            value={activeTab}
            onChange={setActiveTab}
            options={TABS.map((t) => ({ id: t.id, label: t.deskLabel }))}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-dmSerif text-3xl leading-[1.1] text-text-primary">{active.head}</h2>
          <p className="max-w-[46em] text-base leading-relaxed text-text-muted">{active.sub}</p>
        </div>
        <Active profile={profile} loading={profileLoading} onProfileChange={setProfile} />
      </div>
    </div>
  );
}
