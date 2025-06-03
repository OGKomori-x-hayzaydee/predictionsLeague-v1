import { motion } from "framer-motion";
import { useContext } from "react";
import { Cross2Icon, EnterIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const JoinLeagueForm = ({
  leagueCode,
  onLeagueCodeChange,
  onCancel,
  onSubmit,
  isLoading,
}) => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-outfit ${
            isDarkMode ? "text-teal-100" : "text-teal-800"
          }`}
        >
          Join a League
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className={`p-1 rounded-full transition-colors ${
            isDarkMode
              ? "text-white/60 hover:text-white hover:bg-slate-600/20"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
          }`}
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {" "}
        <div>
          <label
            htmlFor="league-code"
            className={`block text-sm mb-1 ${
              isDarkMode ? "text-white/70" : "text-gray-700"
            }`}
          >
            League Code
          </label>
          <input
            id="league-code"
            type="text"
            placeholder="Enter league invite code"
            value={leagueCode}
            onChange={(e) => onLeagueCodeChange(e.target.value)}
            required
            className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
              isDarkMode
                ? "bg-slate-800/40 border-slate-600/30 text-white placeholder:text-white/40"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            }`}
          />
        </div>
        <div
          className={`flex items-start p-3 border rounded-lg text-sm ${
            isDarkMode
              ? "bg-indigo-900/20 border-indigo-700/20"
              : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <InfoCircledIcon
            className={`w-4 h-4 mr-2 shrink-0 mt-0.5 ${
              isDarkMode ? "text-indigo-300" : "text-indigo-600"
            }`}
          />
          <p className={isDarkMode ? "text-indigo-200/90" : "text-indigo-700"}>
            Ask the league admin for the invite code, or search for public
            leagues in the Discover tab.
          </p>
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 border rounded-md transition-colors ${
              isDarkMode
                ? "border-slate-400/30 text-white/80 hover:text-white hover:bg-slate-600/20"
                : "border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
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
            {isLoading ? "Joining..." : "Join League"}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default JoinLeagueForm;
