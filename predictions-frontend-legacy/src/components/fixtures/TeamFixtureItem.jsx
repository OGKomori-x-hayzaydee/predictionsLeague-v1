import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { normalizeTeamName, getTeamLogo } from "../../utils/teamUtils";
import { getLogoUrl } from "../../utils/logoCache";
import { teamLogos } from "../../data/sampleData";
import { isPredictionDeadlinePassed } from "../../utils/dateUtils";
import { showToast } from "../../services/notificationService";

const TeamFixtureItem = ({ fixture, team, onFixtureSelect }) => {
  // Get team logo from context, cache or use placeholder
  const getTeamLogoSrc = (teamName) => {
    // Use the getLogoUrl helper first to try all variants with context logos
    if (teamLogos) {
      const logoUrl = getLogoUrl(teamName, teamLogos, normalizeTeamName);

      // If we got a non-placeholder logo, use it
      if (!logoUrl.includes("placeholder")) {
        return logoUrl;
      }
    }

    // Fall back to the utility function which uses local assets
    return getTeamLogo(teamName);
  };

  return (
    <div
      className="p-3 hover:bg-primary-700/20 cursor-pointer transition-colors"
      onClick={() => {
        if (isPredictionDeadlinePassed(fixture.date)) {
          showToast('Deadline has passed for this match', 'error');
          return;
        }
        onFixtureSelect(fixture);
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs text-white/50">
          {format(parseISO(fixture.date), "EEEE, MMM d")}
        </div>
        <div className="flex items-center text-xs text-white/60">
          <ClockIcon className="mr-1 w-3 h-3" />
          {format(parseISO(fixture.date), "h:mm a")}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center flex-1 justify-end">
          <img
            src={getTeamLogoSrc(fixture.homeTeam)}
            alt={fixture.homeTeam}
            className="w-5 h-5 object-contain mx-1"
          />
          <span
            className={`text-sm font-medium ${
              fixture.homeTeam === team ? "text-teal-300" : "text-white/80"
            }`}
          >
            {fixture.homeTeam}
          </span>
        </div>
        <div className="text-white/50 mx-2">vs</div>
        <div className="flex items-center flex-1">
          <img
            src={getTeamLogoSrc(fixture.awayTeam)}
            alt={fixture.awayTeam}
            className="w-5 h-5 object-contain mx-1"
          />
          <span
            className={`text-sm font-medium ${
              fixture.awayTeam === team ? "text-teal-300" : "text-white/80"
            }`}
          >
            {fixture.awayTeam}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamFixtureItem;