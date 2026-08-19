import React, { useContext } from "react";
import { motion } from "framer-motion";
import { PersonIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const ProfileLeagues = ({ leagues = [], isLoading = false, onViewAll }) => {
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className={`h-16 ${
                theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
              } rounded-lg`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className={`text-center py-6 ${text.muted[theme]}`}>
        <PersonIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="font-outfit text-sm">No leagues joined yet</p>
        <p className="font-outfit text-xs mt-1">
          Join a league to compete with friends
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leagues.slice(0, 4).map((league, index) => (
        <motion.div
          key={league.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-slate-700/20 border-slate-600/30 hover:bg-slate-700/40"
              : "bg-slate-50/50 border-slate-200/50 hover:bg-slate-100/70"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                theme === "dark"
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <span className="text-xs font-bold font-outfit">
                #{league.position || "-"}
              </span>
            </div>
            <div className="min-w-0">
              <p
                className={`${text.primary[theme]} font-outfit font-medium text-sm truncate`}
              >
                {league.name}
              </p>
              <p className={`${text.muted[theme]} font-outfit text-xs`}>
                {league.members || 0} members
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p
              className={`${text.primary[theme]} font-dmSerif font-bold text-sm`}
            >
              {league.points || 0}
            </p>
            <p className={`${text.muted[theme]} font-outfit text-xs`}>pts</p>
          </div>
        </motion.div>
      ))}

      {onViewAll && leagues.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onViewAll}
          className={`w-full py-2 mt-1 rounded-lg text-xs font-medium font-outfit transition-colors ${
            theme === "dark"
              ? "text-teal-400 hover:bg-teal-500/10"
              : "text-teal-600 hover:bg-teal-50"
          }`}
        >
          View All Leagues →
        </motion.button>
      )}
    </div>
  );
};

export default ProfileLeagues;
