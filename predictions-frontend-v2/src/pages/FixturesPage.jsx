import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import FixtureEditor from '../components/fixtures/FixtureEditor';
import { useFixtures } from '../hooks/useFixtures';

export default function FixturesPage() {
  const { fixtures, isLoading } = useFixtures();
  const [index, setIndex] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (index >= fixtures.length) setIndex(0);
  }, [fixtures.length, index]);

  const fixture = fixtures[index];

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
    queryClient.invalidateQueries({ queryKey: ['hybrid-fixtures'] });
  };

  return (
    <div className="animate-rise-in">
      <SlotBar
        kicker="Fixtures"
        reelNav={
          fixtures.length
            ? {
                counter: `${index + 1}/${fixtures.length}`,
                title: fixture ? `${fixture.homeTeam} v ${fixture.awayTeam}` : '',
                canPrev: index > 0,
                canNext: index < fixtures.length - 1,
                onPrev: () => setIndex((i) => Math.max(0, i - 1)),
                onNext: () => setIndex((i) => Math.min(fixtures.length - 1, i + 1)),
              }
            : undefined
        }
      />

      <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
        {isLoading && <LoadingState message="Loading fixtures..." />}
        {!isLoading && !fixture && (
          <p className="text-center text-sm text-text-muted-2">No fixtures to predict right now.</p>
        )}
        {!isLoading && fixture && <FixtureEditor fixture={fixture} onFiled={refetchAll} />}
      </div>
    </div>
  );
}
