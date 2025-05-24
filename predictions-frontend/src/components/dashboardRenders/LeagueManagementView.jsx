import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PersonIcon, GearIcon, CalendarIcon, ClipboardIcon, TrashIcon, PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import { showToast } from '../../services/notificationService';
import { motion } from 'framer-motion';
import LeagueHeader from '../leagues/LeagueHeader';

const LeagueManagementView = ({ leagueId, onBack }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [leagueSettings, setLeagueSettings] = useState({});
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
  };

  useEffect(() => {
    // Initialize form inputs with league data
    setNameInput(league.name);
    setDescriptionInput(league.description);
    setTypeInput(league.type);
    
    // Mock fetch league members
    setMembers([
      { id: 1, name: 'Jane Cooper', joinedDate: '2022-08-01', isAdmin: true, points: 254 },
      { id: 2, name: 'Wade Warren', joinedDate: '2022-08-02', isAdmin: false, points: 198 },
      { id: 3, name: 'Esther Howard', joinedDate: '2022-08-03', isAdmin: false, points: 211 },
      { id: 4, name: 'Cameron Williamson', joinedDate: '2022-08-05', isAdmin: false, points: 187 },
      { id: 5, name: 'Brooklyn Simmons', joinedDate: '2022-08-10', isAdmin: false, points: 176 },
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
    // Mock remove member
    setMembers(members.filter(member => member.id !== memberId));
    showToast('Member removed from league', 'success');
  };

  const handlePromoteToAdmin = (memberId) => {
    // Mock promote to admin
    setMembers(members.map(member => 
      member.id === memberId ? {...member, isAdmin: true} : member
    ));
    showToast('Member promoted to admin', 'success');
  };

  const handleDeleteLeague = () => {
    if (confirmDelete) {
      setIsLoading(true);
      // Mock API call
      setTimeout(() => {
        setIsLoading(false);
        showToast('League deleted successfully', 'success');
        onBack();
      }, 1000);
    } else {
      setConfirmDelete(true);
    }
  };
  
  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="mr-1.5 w-4 h-4" />
        Back to League
      </button>
      
      <LeagueHeader league={league} />

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-slate-700/50">
          <button 
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'members' 
                ? 'bg-slate-700/30 text-white border-b-2 border-teal-500' 
                : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('members')}
          >
            <PersonIcon className="w-4 h-4 mr-2" />
            Members
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'settings' 
                ? 'bg-slate-700/30 text-white border-b-2 border-teal-500' 
                : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <GearIcon className="w-4 h-4 mr-2" />
            League Settings
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-medium">League Members ({members.length})</h2>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-700/50 border border-slate-600/50 rounded flex items-center p-2">
                    <span className="text-white/70 text-sm mr-2">Invite Code:</span>
                    <span className="text-teal-300 font-mono font-medium">{league.inviteCode}</span>
                    <button 
                      onClick={handleCopyInviteCode} 
                      className="ml-2 text-white/50 hover:text-white"
                      title="Copy invite code"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-teal-800/40 hover:bg-teal-800/60 border border-teal-600/30 rounded px-3 py-2 text-sm text-teal-300 flex items-center"
                  >
                    <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
                    Invite New Member
                  </motion.button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/50">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-white/70">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-white/70">Joined</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-white/70">Role</th>
                      <th className="px-3 py-3.5 text-left text-sm font-medium text-white/70">Points</th>
                      <th className="px-3 py-3.5 text-right text-sm font-medium text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-slate-700/10">
                        <td className="px-3 py-4 text-sm text-white">{member.name}</td>
                        <td className="px-3 py-4 text-sm text-white/70">
                          <div className="flex items-center">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                            {new Date(member.joinedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          {member.isAdmin ? (
                            <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-700/30">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-0.5 rounded-full border border-slate-600/30">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-white">{member.points}</td>
                        <td className="px-3 py-4 text-right text-sm whitespace-nowrap">
                          {!member.isAdmin && (
                            <>
                              <button 
                                onClick={() => handlePromoteToAdmin(member.id)}
                                className="text-indigo-400 hover:text-indigo-300 mr-3"
                              >
                                Make Admin
                              </button>
                              <button 
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-white text-lg font-medium mb-6">League Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    League Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Description
                  </label>
                  <textarea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    League Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="private"
                        checked={typeInput === 'private'}
                        onChange={() => setTypeInput('private')}
                        className="h-4 w-4 text-teal-500 focus:ring-teal-400"
                      />
                      <span className="ml-2 text-white">Private</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="public"
                        checked={typeInput === 'public'}
                        onChange={() => setTypeInput('public')}
                        className="h-4 w-4 text-teal-500 focus:ring-teal-400"
                      />
                      <span className="ml-2 text-white">Public</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDeleteLeague}
                    className={`flex items-center px-4 py-2 rounded-md text-sm ${
                      confirmDelete
                        ? 'bg-red-600 text-white'
                        : 'bg-red-900/30 text-red-400 border border-red-800/30'
                    }`}
                  >
                    {confirmDelete ? (
                      <>
                        <Cross2Icon className="w-3.5 h-3.5 mr-1.5" />
                        Confirm Delete
                      </>
                    ) : (
                      <>
                        <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
                        Delete League
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md text-sm flex items-center"
                  >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueManagementView;