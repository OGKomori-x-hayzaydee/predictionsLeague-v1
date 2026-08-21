import { useEffect, useState } from 'react';
import { Ticket } from '@phosphor-icons/react';
import SlotBar from '../components/ui/SlotBar';
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

  const previewButtonClass = previewMode
    ? 'border-brand-amber/50 text-brand-amber'
    : 'border-border-card text-text-muted-3 hover:text-brand-teal';

  return (
    <div className={`animate-rise-in ${isAlmanac ? 'flex flex-col md:h-[calc(100vh-var(--shell-nav-h))] md:overflow-hidden' : ''}`}>
      <div className="hidden items-center md:flex">
        <div className="flex-1">
          <SlotBar kicker="CHIPS" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} right={slotRight} deadline={timeDisplay} />
        </div>
        {isAlmanac && (
          <button
            onClick={() => setPreviewMode((v) => !v)}
            className={`mr-[22px] shrink-0 rounded-7 border px-2.5 py-1 font-outfit text-2xs tracking-wide transition-colors ${previewButtonClass}`}
          >
            {previewMode ? 'EXIT PREVIEW' : 'PREVIEW EXAMPLE DATA'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 pt-4 md:hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
          <div className="flex flex-col gap-1">
            <span className="font-outfit text-3xs tracking-[0.14em] text-brand-teal">CHIPS</span>
            <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary [text-wrap:pretty]">
              {activeTab === 'strategy' ? 'Plan your run-in' : 'Your chip audit'}
            </h2>
          </div>
          <div className="flex gap-[5px] rounded-11 border border-border-card bg-surface-card-4 p-[3px]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 rounded-sm px-1.5 py-2 font-outfit text-2xs tracking-[0.1em] transition-colors ${
                  t.id === activeTab ? 'bg-surface-nav-active text-brand-teal' : 'bg-transparent text-text-muted-2'
                }`}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {isAlmanac && (
          <button
            onClick={() => setPreviewMode((v) => !v)}
            aria-label="Toggle preview with example data"
            className={`mt-auto shrink-0 rounded-9 border p-2.5 ${previewMode ? 'border-brand-amber/50 text-brand-amber' : 'border-border-card text-text-muted-3'}`}
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
        <div className="min-h-0 md:flex-1">
          <AlmanacTab
            predictions={almanacPredictions}
            previewMode={previewMode}
            loading={loadingPredictions && !previewMode}
            onBackToPlan={() => setActiveTab('strategy')}
          />
        </div>
      )}
    </div>
  );
}
