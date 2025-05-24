import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cross2Icon, 
  PlusCircledIcon, 
  LockClosedIcon, 
  GlobeIcon 
} from "@radix-ui/react-icons";

const CreateLeagueForm = ({ onCancel, onSuccess }) => {
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
    
    // Here you would call your API to create the league
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error) {
      console.error("Error creating league:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-teal-100 text-2xl font-dmSerif">Create New League</h2>
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
          <label htmlFor="league-name" className="block text-white/70 text-sm mb-1">League Name</label>
          <input 
            id="league-name"
            name="name"
            type="text" 
            value={leagueData.name}
            onChange={handleChange}
            placeholder="Enter league name"
            required
            className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
        
        <div>
          <label className="block text-white/70 text-sm mb-1">League Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLeagueData(prev => ({ ...prev, type: "private" }))}
              className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center transition-all ${
                leagueData.type === "private" 
                  ? "bg-indigo-900/40 border border-indigo-700/30 text-indigo-300" 
                  : "bg-slate-800/30 border border-slate-600/20 text-white/60 hover:text-white/80"
              }`}
            >
              <LockClosedIcon className="mr-1.5 w-4 h-4" />
              Private
            </button>
            <button
              type="button"
              onClick={() => setLeagueData(prev => ({ ...prev, type: "public" }))}
              className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center transition-all ${
                leagueData.type === "public" 
                  ? "bg-teal-900/40 border border-teal-700/30 text-teal-300" 
                  : "bg-slate-800/30 border border-slate-600/20 text-white/60 hover:text-white/80"
              }`}
            >
              <GlobeIcon className="mr-1.5 w-4 h-4" />
              Public
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="league-description" className="block text-white/70 text-sm mb-1">Description</label>
          <textarea
            id="league-description"
            name="description"
            value={leagueData.description}
            onChange={handleChange}
            placeholder="About this league..."
            className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none h-20"
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
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-2">
              <label htmlFor="customize-scoring" className="text-white/80 text-sm">
                Customize scoring system
              </label>
              <p className="text-white/50 text-xs">
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
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-2">
              <label htmlFor="select-fixtures" className="text-white/80 text-sm">
                Select specific fixtures
              </label>
              <p className="text-white/50 text-xs">
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
            className="px-4 py-2 border border-slate-400/30 text-white/80 hover:text-white rounded-md transition-colors hover:bg-slate-600/20"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center disabled:opacity-70"
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