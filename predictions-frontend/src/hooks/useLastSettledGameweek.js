import { useMemo, useState } from 'react';
import { useUserPredictions } from './useClientSideFixtures';
import { lastSettledGameweek } from '../utils/matchResult';
import { DEMO_PREDICTIONS } from '../components/record/recordDemoData';

/**
 * Last fully-scored gameweek for the dashboard results carousel.
 * Real data from GET /predictions/user; demo GW from Record's preview set
 * when nothing has been scored yet (or when the user opts into preview).
 */
export default function useLastSettledGameweek() {
  const { data, isLoading } = useUserPredictions({ status: 'all' });
  const [previewMode, setPreviewMode] = useState(false);

  const real = useMemo(() => lastSettledGameweek(data || []), [data]);
  const demo = useMemo(() => lastSettledGameweek(DEMO_PREDICTIONS), []);
  const hasReal = real.rows.length > 0;
  const usingDemo = previewMode || (!isLoading && !hasReal);
  const selected = usingDemo ? demo : real;

  return {
    gameweek: selected.gameweek,
    predictions: selected.rows,
    isLoading,
    hasReal,
    usingDemo,
    previewMode,
    setPreviewMode,
  };
}
