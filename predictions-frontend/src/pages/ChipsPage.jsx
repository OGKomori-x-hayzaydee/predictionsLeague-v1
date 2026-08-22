import { useEffect, useState } from 'react';
import { Ticket } from '@phosphor-icons/react';
import SlotBar from '../components/ui/SlotBar';
import SegmentedControl from '../components/ui/SegmentedControl';
import StrategyTab from '../components/chips/StrategyTab';
import AlmanacTab from '../components/chips/AlmanacTab';
import { useChipManagement } from '../context/ChipManagementContext';
import { useChipPlan } from '../hooks/useChipPlan';
import { useNextMatch } from '../hooks/useNextMatch';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { DEMO_CHIP_PREDICTIONS } from '../components/chips/chipsDemoData';

const TABS = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'almanac', label: 'Almanac' },
];

export default function ChipsPage() {
  const [activeTab, setActiveTab] = useState('strategy');
  const [previewMode, setPreviewMode] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const { availableChips } = useChipManagement();
  const { plan } = useChipPlan();
  const { timeDisplay } = useNextMatch();

  useEffect(() => {
    let cancelled = false;
    userPredictionsAPI
      .getAllUserPredictions({ status: 'all' })
      .then((res) => !cancelled && setPredictions(res.data || []))
      .catch(() => !cancelled && setPredictions([]))
      .finally(() => !cancelled && setLoadingPredictions(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const plannedCount = Object.keys(plan).length;
  const inHandCount = availableChips.filter((c) => c.available).length;
  const slotRight = `${inHandCount} in hand · ${plannedCount} planned`;
  const almanacPredictions = previewMode ? DEMO_CHIP_PREDICTIONS : predictions;
  const isAlmanac = activeTab === 'almanac';

  return (
    <div className={`animate-rise-in ${isAlmanac ? 'flex flex-col lg:h-[calc(100dvh-var(--shell-nav-h))] lg:overflow-hidden' : ''}`}>
      <SlotBar kicker="CHIPS" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} right={slotRight} deadline={timeDisplay} />

      {previewMode && isAlmanac && (
        <div className="border-b border-brand-amber/40 bg-brand-amber/10 px-4 py-2 text-center font-outfit text-2xs tracking-wide text-brand-amber">
          EXAMPLE DATA
        </div>
      )}

      <div className="flex items-center gap-2 px-4 pt-4 lg:hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
          <div className="flex flex-col gap-1">
            <span className="font-outfit text-3xs tracking-[0.14em] text-brand-teal">CHIPS</span>
            <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary [text-wrap:pretty]">
              {activeTab === 'strategy' ? 'Plan your run-in' : 'Your chip audit'}
            </h2>
          </div>
          <SegmentedControl grow value={activeTab} onChange={setActiveTab} options={TABS} />
        </div>
        {isAlmanac && previewMode && (
          <button
            onClick={() => setPreviewMode(false)}
            aria-label="Exit example data"
            className="mt-auto inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-amber/50 text-brand-amber"
          >
            <Ticket size={14} />
          </button>
        )}
      </div>

      {activeTab === 'strategy' && (
        <div className="px-4 pb-6 pt-4 md:mx-auto md:w-full md:max-w-[1040px] md:px-[26px] md:py-5">
          <StrategyTab />
        </div>
      )}

      {isAlmanac && (
        <div className="min-h-0 lg:flex-1">
          <AlmanacTab
            predictions={almanacPredictions}
            previewMode={previewMode}
            loading={loadingPredictions && !previewMode}
            onBackToPlan={() => setActiveTab('strategy')}
            onPreview={predictions.length === 0 ? () => setPreviewMode(true) : undefined}
          />
        </div>
      )}
    </div>
  );
}
