import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import PlanTab from '../components/chips/PlanTab';
import AlmanacTab from '../components/chips/AlmanacTab';

const TABS = [
  { id: 'plan', label: 'Plan' },
  { id: 'almanac', label: 'Almanac' },
];

export default function ChipsPage() {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="Chips" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'almanac' && <AlmanacTab />}
      </div>
    </div>
  );
}
