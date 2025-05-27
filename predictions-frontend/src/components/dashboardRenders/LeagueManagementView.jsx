import { useState, useEffect } from 'react';
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
  EyeClosedIcon,
} from '@radix-ui/react-icons';
import { showToast } from '../../services/notificationService';

const LeagueManagementView = ({ leagueId, onBack }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [typeInput, setTypeInput] = useState('private');
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Mock data for development
  const league = {
    id: leagueId,
    name: `Fantasy Premier League 22/23`,
    description: "Our friendly competition for the 2022/2023 Premier League season. Make your predictions for each match day and climb the leaderboard!",
    type: 'private',
    isAdmin: true,
    members: 12,
    lastUpdate: new Date(),
    inviteCode: 'FNPL2223',
    createdDate: new Date('2022-08-01')
  };

  useEffect(() => {
    // Initialize form inputs with league data
    setNameInput(league.name);
    setDescriptionInput(league.description);
    setTypeInput(league.type);
    
    // Mock fetch league members
    setMembers([
      { id: 1, name: 'Jane Cooper', joinedDate: '2022-08-01', isAdmin: true, points: 254, predictions: 15 },
      { id: 2, name: 'Wade Warren', joinedDate: '2022-08-02', isAdmin: false, points: 198, predictions: 12 },
      { id: 3, name: 'Esther Howard', joinedDate: '2022-08-03', isAdmin: false, points: 211, predictions: 14 },
      { id: 4, name: 'Cameron Williamson', joinedDate: '2022-08-05', isAdmin: false, points: 187, predictions: 11 },
      { id: 5, name: 'Brooklyn Simmons', joinedDate: '2022-08-10', isAdmin: false, points: 176, predictions: 9 },
    ]);
  }, [leagueId]);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(league.inviteCode);
    showToast('Invite code copied to clipboard!', 'success');
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      showToast('League settings updated successfully!', 'success');
    }, 800);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(member => member.id !== memberId));
    showToast('Member removed from league', 'success');
  };

  const handlePromoteToAdmin = (memberId) => {
    setMembers(members.map(member => 
      member.id === memberId ? {...member, isAdmin: true} : member
    ));
    showToast('Member promoted to admin', 'success');
  };

  const handleDeleteLeague = () => {
    if (confirmDelete) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast('League deleted successfully', 'success');
        onBack();
      }, 1000);
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
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to League</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Managing:</span>
          <span className="text-white font-medium">{league.name}</span>
        </div>
      </motion.div>

      {/* League Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              {/* <Crown1Icon className="w-8 h-8 text-amber-400" /> */}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-outfit mb-1">
                League Management
              </h1>
              <p className="text-slate-300">
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
        className="flex bg-slate-800/50 rounded-2xl p-1 border border-slate-700/30"
      >
        {[
          { id: 'members', label: 'Members', icon: PersonIcon },
          { id: 'settings', label: 'Settings', icon: GearIcon },
          { id: 'danger', label: 'Danger Zone', icon: ExclamationTriangleIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
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
              typeInput={typeInput}
              setTypeInput={setTypeInput}
              onSave={handleSaveSettings}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'danger' && (
            <DangerZoneContent
              onDeleteLeague={handleDeleteLeague}
              confirmDelete={confirmDelete}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Content Components
const MembersContent = ({ members, league, onRemoveMember, onPromoteToAdmin, onCopyInviteCode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden"
  >
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">League Members</h2>
          <p className="text-slate-400 text-sm">{members.length} members in this league</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="text-slate-300 text-sm">Invite Code:</span>
            <span className="text-amber-400 font-mono font-medium text-lg">{league.inviteCode}</span>
            <button 
              onClick={onCopyInviteCode} 
              className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-600/50 rounded"
              title="Copy invite code"
            >
              <CopyIcon className="w-4 h-4" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-amber-600/20"
          >
            <PlusIcon className="w-4 h-4" />
            Invite Member
          </motion.button>
        </div>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/30">
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Member</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Joined</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Role</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Performance</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/20">
          {members.map((member, index) => (
            <motion.tr 
              key={member.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-slate-700/20 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-slate-400 text-sm">{member.predictions} predictions</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  {format(new Date(member.joinedDate), 'MMM d, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4">
                {member.isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {/* <Crown1Icon className="w-3 h-3" /> */}
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30">
                    <PersonIcon className="w-3 h-3" />
                    Member
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-white font-semibold">{member.points} pts</div>
                <div className="text-slate-400 text-sm">#{index + 1} position</div>
              </td>
              <td className="px-6 py-4 text-right">
                {!member.isAdmin && (
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onPromoteToAdmin(member.id)}
                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Promote to admin"
                    >
                      {/* <ShieldIcon className="w-4 h-4" /> */}
                    </button>
                    <button 
                      onClick={() => onRemoveMember(member.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
  </motion.div>
);

const SettingsContent = ({ 
  league, 
  nameInput, 
  setNameInput, 
  descriptionInput, 
  setDescriptionInput, 
  typeInput, 
  setTypeInput, 
  onSave, 
  isLoading 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
  >
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">League Settings</h2>
        <p className="text-slate-400 text-sm">Customize your league preferences and visibility</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            League Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
            placeholder="Enter league name..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            rows={4}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors resize-none"
            placeholder="Describe your league..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            League Visibility
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative cursor-pointer">
              <input
                type="radio"
                value="private"
                checked={typeInput === 'private'}
                onChange={() => setTypeInput('private')}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                typeInput === 'private'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50'
              }`}>
                <div className="flex items-center gap-3">
                  <EyeClosedIcon className={`w-5 h-5 ${typeInput === 'private' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div>
                    <div className={`font-medium ${typeInput === 'private' ? 'text-amber-400' : 'text-white'}`}>
                      Private
                    </div>
                    <div className="text-sm text-slate-400">Invite only</div>
                  </div>
                </div>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input
                type="radio"
                value="public"
                checked={typeInput === 'public'}
                onChange={() => setTypeInput('public')}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                typeInput === 'public'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50'
              }`}>
                <div className="flex items-center gap-3">
                  <PersonIcon className={`w-5 h-5 ${typeInput === 'public' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div>
                    <div className={`font-medium ${typeInput === 'public' ? 'text-amber-400' : 'text-white'}`}>
                      Public
                    </div>
                    <div className="text-sm text-slate-400">Anyone can join</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-amber-600/20"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Save Settings
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const DangerZoneContent = ({ onDeleteLeague, confirmDelete, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden"
  >
    <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-b border-red-500/20 p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Danger Zone</h2>
          <p className="text-slate-300 text-sm">Irreversible and destructive actions</p>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrashIcon className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Delete League</h3>
              <p className="text-slate-300 text-sm mb-4">
                Once you delete this league, there is no going back. All predictions, member data, 
                and league history will be permanently removed from our servers.
              </p>
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDeleteLeague}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : confirmDelete ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Confirm Delete
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4" />
                      Delete League
                    </>
                  )}
                </motion.button>
                
                {confirmDelete && !isLoading && (
                  <span className="text-red-400 text-sm animate-pulse">
                    Click again to confirm deletion
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default LeagueManagementView;