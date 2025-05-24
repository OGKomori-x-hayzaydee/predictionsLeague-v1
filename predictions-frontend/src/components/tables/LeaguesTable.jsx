import React from "react";
import { BarChartIcon } from "@radix-ui/react-icons";

const LeaguesTable = ({ leagues, onViewAll, onViewLeague }) => {
  return (
    <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 font-outfit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-teal-200 font-outfit font-medium text-lg">
          My Leagues
        </h3>
        <button 
          onClick={onViewAll}
          className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors"
        >
          View all <BarChartIcon className="ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/50 text-sm border-b border-primary-500/60">
              <th className="py-2 px-3 font-medium">League</th>
              <th className="py-2 px-3 font-medium">Position</th>
              <th className="py-2 px-3 font-medium">Members</th>
              <th className="py-2 px-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {leagues.map((league) => (
              <tr
                key={league.id}
                className="border-b border-primary-500/40 last:border-0"
              >
                <td className="py-3 px-3 text-white">{league.name}</td>
                <td className="py-3 px-3">
                  <span className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-2 rounded-full">
                    #{league.position}
                  </span>
                </td>
                <td className="py-3 px-3 text-white/70">{league.members}</td>
                <td className="py-3 px-3">
                  <button 
                    onClick={() => onViewLeague(league.id)}
                    className="text-indigo-300 text-xs hover:text-indigo-200 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaguesTable;