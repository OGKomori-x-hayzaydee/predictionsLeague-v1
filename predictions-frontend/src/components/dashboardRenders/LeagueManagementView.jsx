import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  PersonIcon,
  GearIcon,
  CalendarIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CopyIcon,
  DoubleArrowUpIcon,
} from '@radix-ui/react-icons';
import { showToast } from '../../services/notificationService';
import { ThemeContext } from '../../context/ThemeContext';
import { backgrounds, text, buttons, status } from '../../utils/themeUtils';
import leagueAPI from '../../services/api/leagueAPI';

const LeagueManagementView = ({ leagueId, league, onBack, onRefreshLeagues }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Get theme context
  const { theme } = useContext(ThemeContext);
  
  // Use the passed league object, with fallback if not provided
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
    // Initialize form inputs with league data
    setNameInput(league.name);
    setDescriptionInput(league.description);
    
    // Fetch league members using standings data (reusing same API as leaderboard)
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 [MEMBERS DEBUG] Fetching league standings for leagueId:', leagueId);
        const data = await leagueAPI.getLeagueStandings(leagueId);
        
        console.log('📊 [MEMBERS DEBUG] Raw standings response:', data);
        console.log('📊 [MEMBERS DEBUG] Standings array:', data.standings);
        
        // Transform standings data to member format
        // Backend now includes isAdmin in standings response
        const membersData = (data.standings || []).map((standing, index) => {
          console.log(`👤 [MEMBERS DEBUG] Processing member ${index + 1}:`, {
            id: standing.id,
            displayName: standing.displayName,
            isAdmin: standing.isAdmin,
            isAdminType: typeof standing.isAdmin,
            rawStanding: standing
          });
          
          return {
            id: standing.id,
            name: standing.displayName,
            username: standing.username,
            joinedDate: standing.joinedAt,
            points: standing.points,
            predictions: standing.predictions,
            isAdmin: standing.isAdmin, // Now provided by backend
            email: standing.email || null
          };
        });
        
        console.log('🎯 [MEMBERS DEBUG] Transformed members data:', membersData);
        console.log('🎯 [MEMBERS DEBUG] Admin members:', membersData.filter(m => m.isAdmin));
        console.log('🎯 [MEMBERS DEBUG] Regular members:', membersData.filter(m => !m.isAdmin));
        
        setMembers(membersData);
      } catch (error) {
        console.error('❌ [MEMBERS DEBUG] Failed to fetch members:', error);
        showToast('Failed to load members', 'error');
        // Fall back to empty array on error
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (leagueId) {
      fetchMembers();
    }
  }, [leagueId]);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(league.joinCode);
    showToast('Invite code copied to clipboard!', 'success');
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      await leagueAPI.updateLeague(leagueId, {
        name: nameInput,
        description: descriptionInput
      });
      showToast('League settings updated successfully!', 'success');
      // Refresh leagues list to update the data in parent components
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
        member.id === memberId ? {...member, isAdmin: true} : member
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
        // Refresh the leagues list to remove the deleted league
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
      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >        <button
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

      {/* League Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}        className={`relative overflow-hidden rounded-2xl ${
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
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${text.primary[theme]} font-outfit mb-1`}>
                League Management
              </h1>
              <p className={`${text.secondary[theme]} font-outfit`}>
                Control settings, manage members, and monitor your league
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex ${
          theme === "dark"
            ? "bg-slate-800/50 border-slate-700/30"
            : "bg-slate-100 border-slate-200"
        } rounded-2xl p-1 border`}
      >
        {[
          { id: 'members', label: 'Members', icon: PersonIcon },
          { id: 'settings', label: 'Settings', icon: GearIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium font-outfit transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-amber-600 text-white shadow-lg ${
                    theme === "dark" ? "shadow-amber-600/20" : "shadow-amber-600/10"
                  }`
                : `${
                    theme === "dark"
                      ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
                  }`
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'members' && (
            <MembersContent 
              members={members}
              league={league}
              onRemoveMember={handleRemoveMember}
              onPromoteToAdmin={handlePromoteToAdmin}
              onCopyInviteCode={handleCopyInviteCode}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsContent
              league={league}
              nameInput={nameInput}
              setNameInput={setNameInput}
              descriptionInput={descriptionInput}
              setDescriptionInput={setDescriptionInput}
              onSave={handleSaveSettings}
              isLoading={isLoading}
              onDeleteLeague={handleDeleteLeague}
              confirmDelete={confirmDelete}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Content Components
const MembersContent = ({ members, league, onRemoveMember, onPromoteToAdmin, onCopyInviteCode }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50"
          : "bg-white border-slate-200"
      } backdrop-blur-sm border rounded-2xl overflow-hidden shadow-sm`}
    >    <div className={`p-6 border-b ${
      theme === "dark" ? "border-slate-700/50" : "border-slate-200"
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-xl font-semibold ${text.primary[theme]} mb-1 font-outfit`}>League Members</h2>
          <p className={`${text.muted[theme]} text-sm font-outfit`}>{members.length} members in this league</p>
        </div>
        
        <div className="flex items-center space-x-3">          <div className={`${
            theme === "dark"
              ? "bg-slate-700/50 border-slate-600/30"
              : "bg-slate-100 border-slate-200"
          } border rounded-xl px-4 py-2 flex items-center gap-3`}>
            <span className={`${text.secondary[theme]} text-sm font-outfit`}>Invite Code:</span>
            <span className={`${
              theme === "dark" ? "text-amber-400" : "text-amber-600"
            } font-mono font-medium text-lg`}>{league.joinCode}</span>
            <button 
              onClick={onCopyInviteCode} 
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
        </div>
      </div>
    </div>
    
    <div className="overflow-x-auto">      <table className="w-full">
        <thead>
          <tr className={`border-b ${
            theme === "dark" ? "border-slate-700/30" : "border-slate-200"
          }`}>
            <th className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Member</th>
            <th className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Joined</th>
            <th className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Role</th>
            <th className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Performance</th>
            <th className={`px-6 py-4 text-right text-sm font-medium font-outfit ${text.muted[theme]}`}>Actions</th>
          </tr>
        </thead>        <tbody className={`divide-y ${
          theme === "dark" ? "divide-slate-700/20" : "divide-slate-200"
        }`}>
          {members.map((member, index) => (
            <motion.tr 
              key={member.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${
                theme === "dark" ? "hover:bg-slate-700/20" : "hover:bg-slate-50"
              } transition-colors`}
            >              <td className="px-6 py-4">
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
              <td className={`px-6 py-4 text-sm ${text.secondary[theme]}`}>
                <div className="flex items-center gap-2">
                  <CalendarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span className="font-outfit">{format(new Date(member.joinedDate), 'MMM d, yyyy')}</span>
                </div>
              </td>              <td className="px-6 py-4">
                {(() => {
                  console.log(`🎭 [ROLE DEBUG] Member ${member.name}:`, {
                    id: member.id,
                    isAdmin: member.isAdmin,
                    isAdminType: typeof member.isAdmin,
                    isAdminValue: member.isAdmin,
                    truthyCheck: !!member.isAdmin,
                    member: member
                  });
                  return member.isAdmin;
                })() ? (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-outfit ${
                    theme === "dark"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  } border`}>
                    {/* <Crown1Icon className="w-3 h-3" /> */}
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
              <td className="px-6 py-4">
                <div className={`${text.primary[theme]} font-semibold font-outfit`}>{member.points} pts</div>
                <div className={`${text.muted[theme]} text-sm font-outfit`}>#{index + 1} position</div>
              </td>              <td className="px-6 py-4 text-right">
                {!member.isAdmin && (
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onPromoteToAdmin(member.id)}
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
                      onClick={() => onRemoveMember(member.id)}
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
          ))}        </tbody>
      </table>
    </div>
  </motion.div>
  );
};

const SettingsContent = ({ 
  league, 
  nameInput, 
  setNameInput, 
  descriptionInput, 
  setDescriptionInput, 
  onSave, 
  isLoading,
  onDeleteLeague,
  confirmDelete
}) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50"
          : "bg-white border-slate-200"
      } backdrop-blur-sm border rounded-2xl p-6 shadow-sm`}
    >    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${text.primary[theme]} mb-1 font-outfit`}>League Settings</h2>
        <p className={`${text.muted[theme]} text-sm font-outfit`}>Customize your league preferences and visibility</p>
      </div>
        <div className="space-y-6">
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
          <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={isLoading}
            className={`${buttons.primary[theme]} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium font-outfit flex items-center gap-2 shadow-lg ${
              theme === "dark" ? "shadow-amber-600/20" : "shadow-amber-600/10"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="font-outfit">Saving...</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span className="font-outfit">Save Settings</span>
              </>
            )}          </motion.button>
        </div>
        
        {/* Danger Zone Section */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
          <div className={`${
            theme === "dark"
              ? "bg-red-500/5 border-red-500/20"
              : "bg-red-50 border-red-200"
          } border rounded-xl p-6`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 ${
                theme === "dark"
                  ? "bg-red-500/10"
                  : "bg-red-100"
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
                    onClick={onDeleteLeague}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-outfit transition-all ${
                      confirmDelete
                        ? `${status.error[theme]} shadow-lg ${
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
                        <span className="font-outfit">Deleting...</span>
                      </>
                    ) : confirmDelete ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span className="font-outfit">Confirm Delete</span>
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-4 h-4" />
                        <span className="font-outfit">Delete League</span>
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
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

export default LeagueManagementView;