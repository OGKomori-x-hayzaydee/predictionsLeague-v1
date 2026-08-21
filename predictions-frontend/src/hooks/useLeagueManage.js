import { useCallback, useEffect, useState } from 'react';
import leagueAPI from '../services/api/leagueAPI.js';
import { notificationManager } from '../services/notificationService.js';

function sortMembers(list) {
  return [...list].sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
}

function memberLabel(member) {
  return member?.displayName || member?.username || 'Member';
}

function notifyError(message) {
  notificationManager.notify({
    type: 'error',
    message,
    icon: 'users',
    trackAsActivity: false,
  });
}

export default function useLeagueManage(leagueId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!leagueId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await leagueAPI.getLeagueStandings(leagueId);
      setMembers(sortMembers(Array.from(data?.standings || [])));
    } catch (err) {
      setError(err.message || 'Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const updateSettings = async ({ name, description }) => {
    try {
      await leagueAPI.updateLeague(leagueId, { name, description });
      notificationManager.leagues.updateSuccess(name);
    } catch (err) {
      notifyError(err.message || 'Failed to update league');
      throw err;
    }
  };

  const promoteMember = async (member) => {
    try {
      await leagueAPI.promoteMember(leagueId, member.id);
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isAdmin: true } : m)),
      );
      notificationManager.leagues.promoteSuccess(memberLabel(member));
    } catch (err) {
      notifyError(err.message || 'Failed to promote member');
      throw err;
    }
  };

  const removeMember = async (member) => {
    try {
      await leagueAPI.removeMember(leagueId, member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      notificationManager.leagues.removeSuccess(memberLabel(member));
    } catch (err) {
      notifyError(err.message || 'Failed to remove member');
      throw err;
    }
  };

  const deleteLeague = async (leagueName) => {
    try {
      await leagueAPI.deleteLeague(leagueId);
      notificationManager.leagues.deleteSuccess(leagueName || 'League');
    } catch (err) {
      notifyError(err.message || 'Failed to close league');
      throw err;
    }
  };

  return {
    members,
    loading,
    error,
    updateSettings,
    promoteMember,
    removeMember,
    deleteLeague,
    refreshMembers: fetchMembers,
  };
}
