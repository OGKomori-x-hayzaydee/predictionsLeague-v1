import { useEffect, useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import Card from '../components/ui/Card';
import KickerLabel from '../components/ui/KickerLabel';
import { Button } from '../components/ui/buttons';
import LoadingState from '../components/common/LoadingState';
import Podium from '../components/leagues/Podium';
import StandingsTable from '../components/leagues/StandingsTable';
import useLeagues from '../hooks/useLeagues';
import leagueAPI from '../services/api/leagueAPI';

function LeagueCard({ league, onOpen }) {
  return (
    <button
      onClick={() => onOpen(league)}
      className="flex flex-col gap-2 rounded-md border border-border-card bg-surface-card-2 p-4 text-left transition-colors hover:border-border-control"
    >
      <span className="font-dmSerif text-lg text-text-primary">{league.name}</span>
      <span className="font-mono text-xs text-text-muted-2">{league.members} members</span>
      <span className="mt-1 text-sm text-text-secondary">
        #{league.position ?? '—'} · {league.points ?? 0} pts
      </span>
    </button>
  );
}

function JoinCreateForm({ onJoin, onCreate }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const inputClass =
    'rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="p-4">
        <KickerLabel as="div" className="mb-2">Join a league</KickerLabel>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              await onJoin(code);
              setCode('');
            } catch (err) {
              setError(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <input placeholder="Join code" value={code} onChange={(e) => setCode(e.target.value)} className={`flex-1 ${inputClass}`} />
          <Button type="submit" size="sm" pill={false} disabled={busy || !code}>Join</Button>
        </form>
      </Card>
      <Card className="p-4">
        <KickerLabel as="div" className="mb-2">Create a league</KickerLabel>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              await onCreate(name);
              setName('');
            } catch (err) {
              setError(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <input placeholder="League name" value={name} onChange={(e) => setName(e.target.value)} className={`flex-1 ${inputClass}`} />
          <Button type="submit" size="sm" variant="secondary" pill={false} disabled={busy || !name}>Create</Button>
        </form>
      </Card>
      {error && <p className="text-xs text-state-error sm:col-span-2">{error}</p>}
    </div>
  );
}

export default function LeaguesPage() {
  const { myLeagues, isLoading, joinLeague, createLeague, refreshMyLeagues } = useLeagues();
  const [selected, setSelected] = useState(null);
  const [standings, setStandings] = useState(null);
  const [standingsLoading, setStandingsLoading] = useState(false);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setStandingsLoading(true);
    leagueAPI
      .getLeagueStandings(selected.id)
      .then((res) => !cancelled && setStandings(res.standings || []))
      .catch(() => !cancelled && setStandings([]))
      .finally(() => !cancelled && setStandingsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="Leagues" onBack={selected ? () => setSelected(null) : undefined} />

      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {!selected && (
          <div className="space-y-6">
            <JoinCreateForm
              onJoin={async (code) => {
                await leagueAPI.joinLeague(code);
                refreshMyLeagues();
              }}
              onCreate={async (name) => {
                await createLeague({ name, isPrivate: true, firstGameweek: 1 });
              }}
            />

            <div>
              <KickerLabel as="div" className="mb-3">Your leagues</KickerLabel>
              {isLoading && <LoadingState message="Loading leagues..." />}
              {!isLoading && myLeagues.length === 0 && (
                <p className="text-sm text-text-muted-2">You haven&apos;t joined a league yet.</p>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {myLeagues.map((league) => (
                  <LeagueCard key={league.id} league={league} onOpen={setSelected} />
                ))}
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div>
            <h1 className="font-dmSerif text-2xl text-text-primary">{selected.name}</h1>
            {standingsLoading && <LoadingState message="Loading standings..." />}
            {!standingsLoading && standings && (
              <>
                <Podium standings={standings} />
                <Card className="overflow-hidden p-0">
                  <StandingsTable standings={standings} />
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
