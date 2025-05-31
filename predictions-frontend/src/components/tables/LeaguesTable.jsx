import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  BarChartIcon,
  PersonIcon,
  ChevronRightIcon,
  MagicWandIcon,
  GlobeIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const LeaguesTable = ({ leagues, onViewAll, onViewLeague }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200 font-outfit`}
    >
      {" "}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              theme === "dark"
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <BarChartIcon
              className={`w-4 h-4 ${
                theme === "dark" ? "text-amber-400" : "text-amber-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`${
                theme === "dark" ? "text-teal-200" : "text-teal-700"
              } font-outfit font-semibold text-base`}
            >
              My Leagues
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              } text-xs`}
            >
              Your current league standings
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition-all duration-200 ${
            theme === "dark"
              ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 text-slate-300 hover:text-white"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
          }`}
        >
          View all
          <ChevronRightIcon className="w-3 h-3" />
        </motion.button>
      </div>
      <div className="space-y-2">
        {leagues.map((league, index) => (
          <motion.div
            key={league.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative rounded-lg p-3 border transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-slate-700/20 hover:bg-slate-700/40 border-slate-600/20 hover:border-slate-500/40"
                : "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200/50 hover:border-slate-300/50"
            }`}
            onClick={() => onViewLeague(league.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* League Avatar */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold border ${
                    league.type === "private"
                      ? theme === "dark"
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                        : "bg-indigo-50 text-indigo-600 border-indigo-200"
                      : theme === "dark"
                      ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                      : "bg-teal-50 text-teal-600 border-teal-200"
                  }`}
                >
                  {league.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4
                      className={`${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      } font-medium text-sm truncate`}
                    >
                      {league.name}
                    </h4>
                    <div className="flex items-center gap-0.5">
                      {league.type === "private" ? (
                        <LockClosedIcon
                          className={`w-2.5 h-2.5 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        />
                      ) : (
                        <GlobeIcon
                          className={`w-2.5 h-2.5 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        />
                      )}
                      {league.isAdmin && (
                        <MagicWandIcon
                          className={`w-2.5 h-2.5 ${
                            theme === "dark"
                              ? "text-amber-400"
                              : "text-amber-500"
                          }`}
                          title="Admin"
                        />
                      )}
                    </div>{" "}
                  </div>

                  <div
                    className={`flex items-center gap-3 text-xs ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <PersonIcon className="w-3 h-3" />
                      <span>{league.members} members</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {/* Position Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${
                    league.position <= 3
                      ? theme === "dark"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                      : league.position <= 10
                      ? theme === "dark"
                        ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                        : "bg-teal-50 text-teal-600 border-teal-200"
                      : theme === "dark"
                      ? "bg-slate-600/20 text-slate-300 border-slate-600/20"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}
                >
                  {league.position <= 3 && (
                    <MagicWandIcon className="w-3 h-3" />
                  )}
                  <span className="font-semibold text-xs">
                    #{league.position}
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        ))}
      </div>{" "}
      {leagues.length === 0 && (
        <div className="text-center py-6">
          <MagicWandIcon
            className={`w-10 h-10 mx-auto mb-2 ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}
          />
          <h4
            className={`${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            } font-medium mb-1.5 text-sm`}
          >
            No leagues joined
          </h4>
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } text-xs`}
          >
            Join or create a league to compete with friends!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className={`mt-3 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all duration-200 ${
              theme === "dark"
                ? "bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border-teal-500/30"
                : "bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200"
            }`}
          >
            Explore Leagues
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default LeaguesTable;
