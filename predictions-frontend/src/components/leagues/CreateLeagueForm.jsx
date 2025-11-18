import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { 
  Cross2Icon, 
  PlusCircledIcon, 
  LockClosedIcon, 
  GlobeIcon 
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text, buttons } from "../../utils/themeUtils";
import useLeagues from "../../hooks/useLeagues";

const CreateLeagueForm = ({ onCancel, onSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const { createLeague } = useLeagues();
  const [leagueData, setLeagueData] = useState({
    name: "",
    type: "private",
    description: "",
    customizeScoring: false,
    selectFixtures: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeagueData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Transform form data to match API expectations
      const apiData = {
        name: leagueData.name,
        description: leagueData.description,
        isPrivate: leagueData.type === "private"
      };
      
      const league = await createLeague(apiData);
      console.log('League creation completed:', league);
      onSuccess(); // This will close the modal and the state should already be updated
    } catch (error) {
      console.error("Error creating league:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
    return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${
          theme === "dark" ? "text-teal-100" : "text-teal-700"
        } text-2xl font-outfit`}>Create New League</h2>
        <button 
          type="button"
          onClick={onCancel}
          className={`${
            theme === "dark"
              ? "text-white/60 hover:text-white hover:bg-slate-600/20"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          } p-1 rounded-full transition-colors`}
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="league-name" className={`block ${text.secondary[theme]} text-sm mb-1 font-outfit`}>League Name</label>
          <input 
            id="league-name"
            name="name"
            type="text" 
            value={leagueData.name}
            onChange={handleChange}
            placeholder="Enter league name"
            required
            className={`w-full ${
              theme === "dark"
                ? "bg-slate-800/40 border-slate-600/30 text-white placeholder:text-white/40 focus:ring-teal-500/50"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-teal-500/50"
            } border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-colors font-outfit`}
          />
        </div>        
        <div>
          <label className={`block ${text.secondary[theme]} text-sm mb-1 font-outfit`}>League Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLeagueData(prev => ({ ...prev, type: "private" }))}
              className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center transition-all font-outfit ${
                leagueData.type === "private" 
                  ? theme === "dark"
                    ? "bg-indigo-900/40 border border-indigo-700/30 text-indigo-300" 
                    : "bg-indigo-100 border border-indigo-300 text-indigo-700"
                  : theme === "dark"
                    ? "bg-slate-800/30 border border-slate-600/20 text-white/60 hover:text-white/80"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
            >
              <LockClosedIcon className="mr-1.5 w-4 h-4" />
              Private
            </button>
            <button
              type="button"
              onClick={() => setLeagueData(prev => ({ ...prev, type: "public" }))}
              className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center transition-all font-outfit ${
                leagueData.type === "public" 
                  ? theme === "dark"
                    ? "bg-teal-900/40 border border-teal-700/30 text-teal-300" 
                    : "bg-teal-100 border border-teal-300 text-teal-700"
                  : theme === "dark"
                    ? "bg-slate-800/30 border border-slate-600/20 text-white/60 hover:text-white/80"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
            >
              <GlobeIcon className="mr-1.5 w-4 h-4" />
              Public
            </button>
          </div>
        </div>        
        <div>
          <label htmlFor="league-description" className={`block ${text.secondary[theme]} text-sm mb-1 font-outfit`}>Description</label>
          <textarea
            id="league-description"
            name="description"
            value={leagueData.description}
            onChange={handleChange}
            placeholder="About this league..."
            className={`w-full ${
              theme === "dark"
                ? "bg-slate-800/40 border-slate-600/30 text-white placeholder:text-white/40 focus:ring-teal-500/50"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-teal-500/50"
            } border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-colors resize-none h-20 font-outfit`}
          ></textarea>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start mb-2">
            <div className="flex h-5 items-center">
              <input
                id="customize-scoring"
                name="customizeScoring"
                type="checkbox"
                checked={leagueData.customizeScoring}
                onChange={handleChange}
                className={`h-4 w-4 rounded ${
                  theme === "dark"
                    ? "border-slate-300 text-teal-600 focus:ring-teal-500"
                    : "border-slate-300 text-teal-600 focus:ring-teal-500"
                }`}
              />
            </div>
            <div className="ml-2">
              <label htmlFor="customize-scoring" className={`${text.primary[theme]} text-sm font-outfit`}>
                Customize scoring system
              </label>
              <p className={`${text.muted[theme]} text-xs font-outfit`}>
                Define your own point values for correct predictions
              </p>
            </div>
          </div>          
          <div className="flex items-start mb-2">
            <div className="flex h-5 items-center">
              <input
                id="select-fixtures"
                name="selectFixtures"
                type="checkbox"
                checked={leagueData.selectFixtures}
                onChange={handleChange}
                className={`h-4 w-4 rounded ${
                  theme === "dark"
                    ? "border-slate-300 text-teal-600 focus:ring-teal-500"
                    : "border-slate-300 text-teal-600 focus:ring-teal-500"
                }`}
              />
            </div>
            <div className="ml-2">
              <label htmlFor="select-fixtures" className={`${text.primary[theme]} text-sm font-outfit`}>
                Select specific fixtures
              </label>
              <p className={`${text.muted[theme]} text-xs font-outfit`}>
                Choose which matches your league will predict each gameweek
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`px-4 py-2 border ${
              theme === "dark"
                ? "border-slate-400/30 text-white/80 hover:text-white hover:bg-slate-600/20"
                : "border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            } rounded-md transition-colors font-outfit`}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 ${buttons.primary[theme]} text-white rounded-md transition-colors flex items-center disabled:opacity-70 font-outfit shadow-lg ${
              theme === "dark" ? "shadow-teal-600/20" : "shadow-teal-600/10"
            }`}
          >
            <PlusCircledIcon className="mr-1.5 w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create League"}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default CreateLeagueForm;