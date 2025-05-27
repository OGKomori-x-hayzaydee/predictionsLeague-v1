import { motion } from "framer-motion";
import { Cross2Icon, EnterIcon, InfoCircledIcon } from "@radix-ui/react-icons";

const JoinLeagueForm = ({ 
  leagueCode, 
  onLeagueCodeChange, 
  onCancel, 
  onSubmit, 
  isLoading 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-teal-100 text-2xl font-outfit">Join a League</h2>
        <button 
          type="button"
          onClick={onCancel}
          className="text-white/60 hover:text-white p-1 rounded-full hover:bg-slate-600/20 transition-colors"
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="league-code" className="block text-white/70 text-sm mb-1">League Code</label>
          <input 
            id="league-code"
            type="text" 
            placeholder="Enter league invite code"
            value={leagueCode}
            onChange={(e) => onLeagueCodeChange(e.target.value)}
            required
            className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
        
        <div className="flex items-start p-3 bg-indigo-900/20 border border-indigo-700/20 rounded-lg text-sm">
          <InfoCircledIcon className="w-4 h-4 text-indigo-300 mr-2 shrink-0 mt-0.5" />
          <p className="text-indigo-200/90">Ask the league admin for the invite code, or search for public leagues in the Discover tab.</p>
        </div>
        
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-slate-400/30 text-white/80 hover:text-white rounded-md transition-colors hover:bg-slate-600/20"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center disabled:opacity-70"
          >
            <EnterIcon className="mr-1.5 w-4 h-4" />
            {isLoading ? 'Joining...' : 'Join League'}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default JoinLeagueForm;