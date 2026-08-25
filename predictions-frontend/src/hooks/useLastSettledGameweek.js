import { useMemo } from 'react';
import { useUserPredictions } from './useClientSideFixtures';
import { lastSettledGameweek } from '../utils/matchResult';

/**
 * Last fully-scored gameweek for the dashboard results carousel.
 * Real data only from GET /predictions/user.
 */
export default function useLastSettledGameweek() {
  const { data, isLoading } = useUserPredictions({ status: 'all' });
  const settled = useMemo(() => lastSettledGameweek(data || []), [data]);

  return {
    gameweek: settled.gameweek,
    predictions: settled.rows,
    isLoading,
  };
}
