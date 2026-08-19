import { useEffect, useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import StatTile from '../components/ui/StatTile';
import Avatar from '../components/ui/Avatar';
import RecordTab from '../components/profile/RecordTab';
import TendencyTab from '../components/profile/TendencyTab';
import HonoursTab from '../components/profile/HonoursTab';
import LoadingState from '../components/common/LoadingState';
import userAPI from '../services/api/userAPI';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { computeProfileStats } from '../utils/profileStats';

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
        setProfile(profileRes.user);
        setPredictions(predictionsRes.data || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-rise-in">
        <SlotBar kicker="Profile" />
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  const stats = computeProfileStats(predictions);

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="Profile" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={profile?.username || 'You'} size={56} />
          <div>
            <h1 className="font-dmSerif text-2xl text-text-primary">{profile?.username || 'Your profile'}</h1>
            <p className="text-sm text-text-muted-2">
              {profile?.favouriteTeam ? `Follows ${profile.favouriteTeam} · ` : ''}
              {stats.totalCompleted} predictions settled this season
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatTile label="Season points" value={stats.seasonPoints} />
          <StatTile label="Exact calls" value={stats.exactCalls} note={`${stats.exactCallsPct}% of total`} />
          <StatTile label="Avg / week" value={stats.avgPerWeek} />
          <StatTile
            label="Best week"
            value={stats.bestWeek ? `+${stats.bestWeek.points}` : '—'}
            note={stats.bestWeek ? `GW${stats.bestWeek.gameweek}` : undefined}
          />
          <StatTile label="Chips played" value={stats.chipsPlayed} />
        </div>

        {activeTab === 'record' && <RecordTab stats={stats} />}
        {activeTab === 'tendency' && <TendencyTab predictions={predictions} />}
        {activeTab === 'honours' && <HonoursTab />}
      </div>
    </div>
  );
}
