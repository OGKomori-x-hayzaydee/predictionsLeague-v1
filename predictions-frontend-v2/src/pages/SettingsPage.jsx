import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import AccountTab from '../components/settings/AccountTab';
import AlertsTab from '../components/settings/AlertsTab';
import TeamsTab from '../components/settings/TeamsTab';
import ScoringTab from '../components/settings/ScoringTab';

const TABS = [
  { id: 'account', label: 'Account', Component: AccountTab },
  { id: 'alerts', label: 'Alerts', Component: AlertsTab },
  { id: 'teams', label: 'Teams', Component: TeamsTab },
  { id: 'scoring', label: 'Scoring', Component: ScoringTab },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const Active = TABS.find((t) => t.id === activeTab)?.Component ?? AccountTab;

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="Settings" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Active />
      </div>
    </div>
  );
}
