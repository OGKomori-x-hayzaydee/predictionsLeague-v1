import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  PersonIcon,
  GearIcon,
  CalendarIcon,
  TrashIcon,
  CheckIcon,
  CopyIcon,
  DoubleArrowUpIcon,
} from '@radix-ui/react-icons';
import { showToast } from '../../services/notificationService';
import { ThemeContext } from '../../context/ThemeContext';
import { text, buttons } from '../../utils/themeUtils';
import leagueAPI from '../../services/api/leagueAPI';

// ─── Section Card ───────────────────────────────────────────
const SectionCard = ({ title, description, icon: Icon, children, accentColor = "teal" }) => {
  const { theme } = useContext(ThemeContext);

  const iconColors = {
    teal: theme === "dark" ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600",
    amber: theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600",
  };

  return (
    <motion.div
      className={`backdrop-blur-sm rounded-xl border transition-all duration-200 ${
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/40"
          : "border-slate-200 bg-white shadow-sm"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 p-5 sm:p-6 pb-0">
          {Icon && (
            <div className={`p-2 rounded-lg ${iconColors[accentColor] || iconColors.teal}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <div>
            <h3 className={`${text.primary[theme]} font-outfit font-semibold text-base sm:text-lg`}>
              {title}
            </h3>
            {description && (
              <p className={`${text.secondary[theme]} text-xs sm:text-sm mt-0.5 font-outfit`}>
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

const TOTAL_GAMEWEEKS = 38;

const LeagueManagementView = ({ leagueId, league, onBack, onRefreshLeagues }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [firstGameweekInput, setFirstGameweekInput] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { theme } = useContext(ThemeContext);

  if (!league) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-12"
      >
        <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
      </motion.div>
    );
  }

  useEffect(() => {
    setNameInput(league.name);
    setDescriptionInput(league.description);
    setFirstGameweekInput(league.firstGameweek || 1);

    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const data = await leagueAPI.getLeagueStandings(leagueId);
        const membersData = (data.standings || []).map((standing) => ({
          id: standing.id,
          name: standing.displayName,
          username: standing.username,
          joinedDate: standing.joinedAt,
          points: standing.points,
          predictions: standing.predictions,
          isAdmin: standing.isAdmin,
          email: standing.email || null
        }));
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        showToast('Failed to load members', 'error');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (leagueId) {
      fetchMembers();
    }
  }, [leagueId, league.name, league.description, league.firstGameweek]);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(league.joinCode);
    showToast('Invite code copied to clipboard!', 'success');
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      await leagueAPI.updateLeague(leagueId, {
        name: nameInput,
        description: descriptionInput,
        firstGameweek: Number(firstGameweekInput)
      });
      showToast('League settings updated successfully!', 'success');
      if (onRefreshLeagues) {
        onRefreshLeagues();
      }
    } catch (error) {
      console.error('Failed to update league:', error);
      showToast(`Failed to update league: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await leagueAPI.removeMember(leagueId, memberId);
      setMembers(members.filter(member => member.id !== memberId));
      showToast('Member removed from league', 'success');
    } catch (error) {
      console.error('Failed to remove member:', error);
      showToast(`Failed to remove member: ${error.message}`, 'error');
    }
  };

  const handlePromoteToAdmin = async (memberId) => {
    try {
      await leagueAPI.promoteMember(leagueId, memberId);
      setMembers(members.map(member =>
        member.id === memberId ? { ...member, isAdmin: true } : member
      ));
      showToast('Member promoted to admin', 'success');
    } catch (error) {
      console.error('Failed to promote member:', error);
      showToast(`Failed to promote member: ${error.message}`, 'error');
    }
  };

  const handleDeleteLeague = async () => {
    if (confirmDelete) {
      setIsLoading(true);
      try {
        await leagueAPI.deleteLeague(leagueId);
        showToast('League deleted successfully', 'success');
        if (onRefreshLeagues) {
          onRefreshLeagues();
        }
        onBack();
      } catch (error) {
        console.error('Failed to delete league:', error);
        showToast(`Failed to delete league: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${
            theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-800"
          } transition-colors group font-outfit`}
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to League</span>
        </button>

        <div className={`flex items-center gap-2 text-sm ${text.muted[theme]} font-outfit`}>
          <span>Managing:</span>
          <span className={`${text.primary[theme]} font-medium`}>{league.name}</span>
        </div>
      </motion.div>

      {/* Management Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative overflow-hidden rounded-2xl ${
          theme === "dark"
            ? "bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-slate-600/30"
            : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200 shadow-sm"
        } border backdrop-blur-sm`}
      >
        <div className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
            : "bg-gradient-to-br from-amber-500/5 to-orange-500/5"
        }`} />
        <div className="relative p-6">
          <h1 className={`text-2xl font-bold ${text.primary[theme]} font-dmSerif mb-1`}>
            League Management
          </h1>
          <p className={`${text.secondary[theme]} font-outfit`}>
            Control settings, manage members, and monitor your league
          </p>
        </div>
      </motion.div>

      {/* League Settings Section */}
      <SectionCard
        title="League Settings"
        description="Customize your league preferences"
        icon={GearIcon}
        accentColor="amber"
      >
        <div className="p-5 sm:p-6 pt-4">
          <div className="max-w-2xl space-y-6">
            <div>
              <label className={`block text-sm font-medium ${text.secondary[theme]} mb-2 font-outfit`}>
                League Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-amber-500/50 focus:border-amber-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-amber-500/50 focus:border-amber-500/50"
                } border rounded-xl px-4 py-3 font-outfit focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Enter league name..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${text.secondary[theme]} mb-2 font-outfit`}>
                Description
              </label>
              <textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                rows={4}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-amber-500/50 focus:border-amber-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-amber-500/50 focus:border-amber-500/50"
                } border rounded-xl px-4 py-3 font-outfit focus:outline-none focus:ring-2 transition-colors resize-none`}
                placeholder="Describe your league..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${text.secondary[theme]} mb-2 font-outfit`}>
                Count Points From
              </label>
              <select
                value={firstGameweekInput}
                onChange={(e) => setFirstGameweekInput(e.target.value)}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-slate-700/50 border-slate-600/50 text-white focus:ring-amber-500/50 focus:border-amber-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-500/50 focus:border-amber-500/50"
                } border rounded-xl px-4 py-3 font-outfit focus:outline-none focus:ring-2 transition-colors`}
              >
                {Array.from({ length: TOTAL_GAMEWEEKS }, (_, i) => i + 1).map((gw) => (
                  <option key={gw} value={gw}>
                    Gameweek {gw}
                  </option>
                ))}
              </select>
              <p className={`${text.muted[theme]} text-xs mt-1.5 font-outfit`}>
                Points will only count from this gameweek onwards
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                disabled={isLoading}
                className={`${buttons.primary[theme]} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium font-outfit flex items-center gap-2 shadow-lg ${
                  theme === "dark" ? "shadow-teal-600/20" : "shadow-teal-600/10"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Members Section */}
      <SectionCard
        title="Members"
        description={`${members.length} members in this league`}
        icon={PersonIcon}
        accentColor="teal"
      >
        {/* Invite Code Bar */}
        <div className={`mx-5 sm:mx-6 mt-4 ${
          theme === "dark"
            ? "bg-slate-700/50 border-slate-600/30"
            : "bg-slate-100 border-slate-200"
        } border rounded-xl px-4 py-2.5 flex items-center gap-3`}>
          <span className={`${text.secondary[theme]} text-sm font-outfit`}>Invite Code:</span>
          <span className={`${
            theme === "dark" ? "text-amber-400" : "text-amber-600"
          } font-mono font-medium text-lg`}>{league.joinCode}</span>
          <button
            onClick={handleCopyInviteCode}
            className={`${
              theme === "dark"
                ? "text-slate-400 hover:text-white hover:bg-slate-600/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            } transition-colors p-1 rounded`}
            title="Copy invite code"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === "dark" ? "border-slate-700/30" : "border-slate-200"}`}>
                <th className={`px-5 sm:px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Member</th>
                <th className={`px-5 sm:px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]} hidden sm:table-cell`}>Joined</th>
                <th className={`px-5 sm:px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Role</th>
                <th className={`px-5 sm:px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]} hidden sm:table-cell`}>Performance</th>
                <th className={`px-5 sm:px-6 py-4 text-right text-sm font-medium font-outfit ${text.muted[theme]}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "dark" ? "divide-slate-700/20" : "divide-slate-200"}`}>
              {members.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${
                    theme === "dark" ? "hover:bg-slate-700/20" : "hover:bg-slate-50"
                  } transition-colors`}
                >
                  <td className="px-5 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`${text.primary[theme]} font-medium font-outfit`}>{member.name}</div>
                        <div className={`${text.muted[theme]} text-sm font-outfit`}>{member.predictions} predictions</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 sm:px-6 py-4 text-sm ${text.secondary[theme]} hidden sm:table-cell`}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                      <span className="font-outfit">{format(new Date(member.joinedDate), 'MMM d, yyyy')}</span>
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-4">
                    {member.isAdmin ? (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-outfit ${
                        theme === "dark"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      } border`}>
                        Admin
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-outfit ${
                        theme === "dark"
                          ? "bg-slate-700/50 text-slate-300 border-slate-600/30"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      } border`}>
                        <PersonIcon className="w-3 h-3" />
                        Member
                      </span>
                    )}
                  </td>
                  <td className="px-5 sm:px-6 py-4 hidden sm:table-cell">
                    <div className={`${text.primary[theme]} font-semibold font-outfit`}>{member.points} pts</div>
                    <div className={`${text.muted[theme]} text-sm font-outfit`}>#{index + 1} position</div>
                  </td>
                  <td className="px-5 sm:px-6 py-4 text-right">
                    {!member.isAdmin && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePromoteToAdmin(member.id)}
                          className={`p-2 ${
                            theme === "dark"
                              ? "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                              : "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                          } rounded-lg transition-colors`}
                          title="Promote to admin"
                        >
                          <DoubleArrowUpIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className={`p-2 ${
                            theme === "dark"
                              ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                              : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                          } rounded-lg transition-colors`}
                          title="Remove member"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          theme === "dark"
            ? "bg-red-500/5 border-red-500/20"
            : "bg-red-50 border-red-200"
        } border rounded-xl p-6`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 ${
            theme === "dark" ? "bg-red-500/10" : "bg-red-100"
          } rounded-lg`}>
            <TrashIcon className={`w-5 h-5 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}>Danger Zone</h3>
            <p className={`${text.secondary[theme]} text-sm mb-4 font-outfit`}>
              Once you delete this league, there is no going back. All predictions, member data,
              and league history will be permanently removed from our servers.
            </p>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteLeague}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-outfit transition-all ${
                  confirmDelete
                    ? `bg-red-600 text-white shadow-lg ${
                        theme === "dark" ? "shadow-red-600/20" : "shadow-red-600/10"
                      }`
                    : `${
                        theme === "dark"
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                          : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                      } border`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : confirmDelete ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete League</span>
                  </>
                )}
              </motion.button>

              {confirmDelete && !isLoading && (
                <span className={`${
                  theme === "dark" ? "text-red-400" : "text-red-500"
                } text-sm animate-pulse font-outfit`}>
                  Click again to confirm deletion
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeagueManagementView;
