import { useEffect, useMemo, useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import StatTile from '../components/ui/StatTile';
import Avatar from '../components/ui/Avatar';
import RecordTab from '../components/profile/RecordTab';
import TendencyTab from '../components/profile/TendencyTab';
import HonoursTab from '../components/profile/HonoursTab';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileSidebarContent from '../components/profile/ProfileSidebarContent';
import LoadingState from '../components/common/LoadingState';
import userAPI from '../services/api/userAPI';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { computeProfileStats, computeChipAlmanac } from '../utils/profileStats';
import { normalizeTeamName } from '../utils/teamUtils';
import { mergeProfile } from '../utils/profileOverrides';
import { SIDE_RAIL_GRID, MAIN_PANE_CLASS } from '../utils/layout';

const TABS = [
  { id: 'record', label: 'Record' },
  { id: 'tendency', label: 'Tendency' },
  { id: 'honours', label: 'Honours' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('record');
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([userAPI.getProfile(), userPredictionsAPI.getAllUserPredictions({ status: 'all' })])
      .then(([profileRes, predictionsRes]) => {
        if (cancelled) return;
        setProfile(mergeProfile(profileRes.user));
        setPredictions(predictionsRes.data || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => computeProfileStats(predictions), [predictions]);
  const chipAlmanac = useMemo(() => computeChipAlmanac(predictions), [predictions]);

  if (loading) {
    return (
      <div className="animate-rise-in">
        <SlotBar kicker="Profile" />
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  const favouriteTeam = profile?.favouriteTeam ? normalizeTeamName(profile.favouriteTeam) : null;
  const joinedLabel = (() => {
    if (!profile?.joinedAt) return null;
    const d = new Date(profile.joinedAt);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  })();
  const bioLine = [
    `${stats.totalCompleted} prediction${stats.totalCompleted === 1 ? '' : 's'} settled this season`,
    joinedLabel ? `joined ${joinedLabel}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const chipReturnPts = stats.breakdown.chipMultipliers.points;

  return (
    <div className="animate-rise-in">
      <SlotBar
        kicker="Profile"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        right={`${stats.totalCompleted} predictions settled`}
      />

      <div className={`md:grid md:min-h-0 ${SIDE_RAIL_GRID} md:items-stretch`}>
        <div className="min-w-0 px-4 py-5 md:px-[26px] md:py-[22px]">
          <div className={`${MAIN_PANE_CLASS} flex flex-col gap-5`}>
          <div className="flex items-start gap-5">
            <Avatar name={profile?.username || 'You'} src={profile?.profilePicture} size={64} />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="font-dmSerif text-2xl leading-tight text-text-primary">
                {profile?.username || 'Your profile'}
              </h1>
              <p className="text-caption leading-relaxed text-text-muted-1">{bioLine}</p>
              {favouriteTeam && (
                <span className="mt-0.5 flex w-fit items-center gap-1.5 rounded-full border border-border-card bg-surface-card-4 px-2.5 py-1 text-xs text-text-tertiary">
                  Follows {favouriteTeam}
                </span>
              )}
            </div>
          </div>

          <div className="mt-[18px] grid grid-cols-2 gap-[9px] sm:grid-cols-5">
            <StatTile label="Season points" value={stats.seasonPoints} />
            <StatTile label="Exact calls" value={stats.exactCalls} note={`${stats.exactCallsPct}% of total`} />
            <StatTile label="Avg / week" value={stats.avgPerWeek} />
            <StatTile
              label="Best week"
              value={stats.bestWeek ? `+${stats.bestWeek.points}` : '—'}
              note={stats.bestWeek ? `GW${stats.bestWeek.gameweek}` : undefined}
            />
            <StatTile
              label="Chip return"
              value={stats.chipsPlayed > 0 ? `${chipReturnPts >= 0 ? '+' : ''}${chipReturnPts}` : '—'}
              note={`${stats.chipsPlayed} played`}
              accent={stats.chipsPlayed > 0 && chipReturnPts < 0 ? 'var(--state-error)' : undefined}
            />
          </div>

          <div className="mt-[18px]">
            {activeTab === 'record' && <RecordTab stats={stats} predictions={predictions} />}
            {activeTab === 'tendency' && <TendencyTab predictions={predictions} />}
            {activeTab === 'honours' && <HonoursTab />}
          </div>

          <div className="mt-4 rounded-md border border-border-card bg-surface-card p-4 md:hidden">
            <ProfileSidebarContent chipAlmanac={chipAlmanac} />
          </div>
          </div>
        </div>

        <ProfileSidebar chipAlmanac={chipAlmanac} />
      </div>
    </div>
  );
}
