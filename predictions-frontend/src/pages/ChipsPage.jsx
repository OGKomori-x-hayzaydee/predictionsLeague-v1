import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import StrategyTab from '../components/chips/StrategyTab';
import AlmanacTab from '../components/chips/AlmanacTab';
import { useChipManagement } from '../context/ChipManagementContext';
import { useChipPlan } from '../hooks/useChipPlan';
import { useNextMatch } from '../hooks/useNextMatch';

const TABS = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'almanac', label: 'Almanac' },
];

export default function ChipsPage() {
  const [activeTab, setActiveTab] = useState('strategy');
  const { availableChips } = useChipManagement();
  const { plan } = useChipPlan();
  const { timeDisplay } = useNextMatch();

  const plannedCount = Object.keys(plan).length;
  const inHandCount = availableChips.filter((c) => c.available).length;
  const slotRight = `${inHandCount} in hand · ${plannedCount} planned`;

  return (
    <div className="animate-rise-in">
      {/* Desktop — foundation spec §5.2 slot bar in tabs mode */}
      <div className="hidden md:block">
        <SlotBar kicker="CHIPS" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} right={slotRight} deadline={timeDisplay} />
      </div>

      {/* Mobile — Spine.dc.html mobile Chips screen (template lines 2869-3038).
          No shell-level slot bar on mobile (foundation spec §6.1); tab
          context is an in-content pill strip, matching Settings/Record. */}
      <div className="flex flex-col gap-[14px] px-4 pt-4 md:hidden">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-3xs tracking-[0.14em] text-brand-teal">CHIPS</span>
          <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary [text-wrap:pretty]">
            {activeTab === 'strategy' ? 'Plan your run-in' : 'Your chip audit'}
          </h2>
        </div>

        <div className="flex gap-[5px] rounded-11 border border-border-card bg-surface-card-4 p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-sm px-1.5 py-2 font-mono text-2xs tracking-[0.1em] transition-colors ${
                t.id === activeTab ? 'bg-surface-nav-active text-brand-teal' : 'bg-transparent text-text-muted-2'
              }`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content mounts once — StrategyTab branches desktop/mobile markup
          internally via CSS (it owns the DndContext + the real chip-plan
          state), so it must not be mounted a second time here. */}
      <div className="px-4 pb-6 pt-4 md:mx-auto md:w-full md:max-w-[1040px] md:px-[26px] md:py-5">
        {activeTab === 'strategy' && <StrategyTab />}
        {activeTab === 'almanac' && <AlmanacTab />}
      </div>
    </div>
  );
}
