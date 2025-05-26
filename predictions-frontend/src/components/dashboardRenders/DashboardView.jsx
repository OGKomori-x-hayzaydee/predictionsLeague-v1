import { InfoCircledIcon } from "@radix-ui/react-icons";
import StatCard from "../common/StatCard";
import UpcomingMatchesPanel from "../panels/UpcomingMatchesPanel";
import RecentPredictionsPanel from "../panels/RecentPredictionsPanel";
import LeaguesTable from "../tables/LeaguesTable";
// import ApiTestComponent from "../common/ApiTestComponent";

const DashboardView = ({
  upcomingMatches,
  recentPredictions,
  leagues,
  goToPredictions,
  navigateToSection,
}) => {
  // Helper function to format match data for the predictions modal
  const formatMatchForPrediction = (match) => {
    return {
      id: match.id,
      homeTeam: match.home,
      awayTeam: match.away,
      date: match.date,
      venue: match.venue || "Stadium", // Fallback if venue is not provided
      gameweek: match.gameweek || 36, // Fallback if gameweek is not provided
      competition: match.competition || "Premier League", // Fallback if competition is not provided
    };
  };

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
        <StatCard
          title="Weekly Points"
          value="76"
          subtitle="Rank: 1,245 this week"
          badge={{
            text: "+18 from GW35",
            type: "success",
          }}
        />

        <StatCard
          title="Accuracy Rate"
          value="68%"
          subtitle="41 correct predictions"
          badge={{
            text: "Last 10 GWs",
            type: "info",
          }}
        />

        <StatCard
          title="Available Chips"
          value="4"
          subtitle="Double Down ready to use"
          badge={{
            icon: <InfoCircledIcon />,
            type: "neutral",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Matches Panel */}
        <UpcomingMatchesPanel
          matches={upcomingMatches}
          onViewAll={() => navigateToSection("fixtures")}
          onPredictMatch={(match) =>
            goToPredictions(formatMatchForPrediction(match))
          }
        />

        {/* Recent Predictions Panel */}
        <RecentPredictionsPanel
          predictions={recentPredictions}
          onViewAll={() => navigateToSection("predictions")}
        />
      </div>

      {/* My Leagues */}
      <LeaguesTable
        leagues={leagues}
        onViewAll={() => navigateToSection("leagues")}
        onViewLeague={(leagueId) => navigateToSection("leagues", { leagueId })}
      />

      {/* <ApiTestComponent /> */}
    </>
  );
};

export default DashboardView;
