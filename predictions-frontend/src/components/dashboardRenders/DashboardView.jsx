import React from "react";
import {
  InfoCircledIcon,
  LightningBoltIcon,
  PlusIcon,
  BarChartIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";

const DashboardView = ({ 
  upcomingMatches, 
  recentPredictions, 
  leagues, 
  goToPredictions,
  navigateToSection 
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
          Dashboard
        </h1>
        <span className="text-white/50 text-sm font-outfit">Gameweek 36</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-teal-200 font-outfit font-medium text-lg">
              Weekly Points
            </h3>
            <span className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-2 rounded-full">
              +18 from GW35
            </span>
          </div>
          <p className="text-3xl font-bold text-white font-dmSerif">76</p>
          <div className="text-white/60 text-sm mt-1 font-outfit">
            Rank: 1,245 this week
          </div>
        </div>

        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-teal-200 font-outfit font-medium text-lg">
              Accuracy Rate
            </h3>
            <span className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-2 rounded-full">
              Last 10 GWs
            </span>
          </div>
          <p className="text-3xl font-bold text-white font-dmSerif">68%</p>
          <div className="text-white/60 text-sm mt-1 font-outfit">
            41 correct predictions
          </div>
        </div>

        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-teal-200 font-outfit font-medium text-lg">
              Available Chips
            </h3>
            <span className="text-white/60 text-xs font-medium py-1 px-2 rounded-full">
              <InfoCircledIcon />
            </span>
          </div>
          <p className="text-3xl font-bold text-white font-dmSerif">4</p>
          <div className="text-white/60 text-sm mt-1 font-outfit">
            Double Down ready to use
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Matches */}
        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-teal-200 font-outfit font-medium text-lg">
              Upcoming Matches
            </h3>
            <button className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors">
              View all <CalendarIcon className="ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMatches.map((match) => {
              const matchDate = new Date(match.date);
              const formattedDate = `${matchDate.toLocaleDateString("en-GB", {
                weekday: "short",
              })} ${matchDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}`;
              const formattedTime = matchDate
                .toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .toLowerCase();

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between py-3 border-b border-primary-500/60 last:border-0"
                >
                  <div>
                    <div className="text-white font-outfit font-medium">
                      {match.home} vs {match.away}
                    </div>
                    <div className="text-white/60 text-xs">
                      {formattedDate} • {formattedTime}
                    </div>
                  </div>
                  {match.predicted ? (
                    <div className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-3 rounded-full flex items-center">
                      <LightningBoltIcon className="mr-1" /> Predicted
                    </div>
                  ) : (
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-3 rounded-full flex items-center transition-colors">
                      <PlusIcon className="mr-1" /> Predict Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-teal-200 font-outfit font-medium text-lg">
              Recent Predictions
            </h3>
            <button
              // onClick={}
              className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors"
            >
              View all <BarChartIcon className="ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between py-3 border-b border-primary-500/60 last:border-0"
              >
                <div>
                  <div className="text-white font-outfit font-medium">
                    {prediction.match}
                  </div>
                  <div className="text-white/60 text-xs">
                    GW{35 - (prediction.id - 1)}
                  </div>
                </div>
                <div
                  className={`rounded-full flex items-center ${
                    prediction.correct
                      ? "bg-green-700/20 text-green-300"
                      : "bg-red-700/20 text-red-300"
                  } text-xs font-medium py-1 px-3`}
                >
                  {prediction.points} points
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Leagues */}
      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 font-outfit">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-teal-200 font-outfit font-medium text-lg">
            My Leagues
          </h3>
          <button className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors">
            Join a League <PlusIcon className="ml-1" />
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
                    <button className="text-indigo-300 text-xs hover:text-indigo-200 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardView;