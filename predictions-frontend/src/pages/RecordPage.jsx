import { useEffect, useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import SeasonTab from '../components/record/SeasonTab';
import AllTimeTab from '../components/record/AllTimeTab';
import SearchTab from '../components/record/SearchTab';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { computeProfileStats } from '../utils/profileStats';

const TABS = [
  { id: 'season', label: 'Season' },
  { id: 'allTime', label: 'All-time' },
  { id: 'search', label: 'Search' },
];

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState('season');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    userPredictionsAPI
      .getAllUserPredictions({ status: 'all' })
      .then((res) => !cancelled && setPredictions(res.data || []))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="My Record" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {loading ? (
          <LoadingState message="Loading your record..." />
        ) : (
          <>
            {activeTab === 'season' && (
              <SeasonTab stats={computeProfileStats(predictions)} predictions={predictions} />
            )}
            {activeTab === 'allTime' && (
              <AllTimeTab stats={computeProfileStats(predictions)} predictions={predictions} />
            )}
            {activeTab === 'search' && <SearchTab predictions={predictions} />}
          </>
        )}
      </div>
    </div>
  );
}
