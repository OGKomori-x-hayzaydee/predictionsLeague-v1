import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../utils/teamUtils";
import { ThemeContext } from "../../context/ThemeContext";

const FixtureCard = ({
  fixture,
  selected = false,
  onClick,
  teamLogos = {},
}) => {
  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Use getTeamLogo utility with fallback to context logos
  const getLogoSrc = (teamName) => {
    return teamLogos[teamName] || getTeamLogo(teamName);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(fixture)}
      className={`border rounded-lg p-3 ${
        theme === "dark"
          ? "hover:border-primary-600/40 bg-primary-700/20"
          : "border-slate-300 bg-white shadow-sm"
      } transition-all ${
        selected
          ? theme === "dark"
            ? "ring-2 ring-teal-400"
            : "ring-2 ring-teal-500"
          : ""
      }`}
    >
      {" "}
      <div
        className={`flex justify-between items-center text-xs ${
          theme === "dark" ? "text-white/60" : "text-slate-500"
        } mb-2`}
      >
        <span>{fixture.competition}</span>
        <span className="flex items-center">
          <ClockIcon className="mr-1 w-3 h-3" />
          {format(parseISO(fixture.date), "h:mm a")}
        </span>
      </div>
      <div className="flex items-center">
        <img
          src={getLogoSrc(fixture.homeTeam)}
          alt={fixture.homeTeam}
          className="w-10 h-10 object-contain"
        />{" "}
        <div className="mx-2 flex-grow">
          {" "}
          <div className="flex justify-between items-center">
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-slate-800"
              } font-medium`}
            >
              {fixture.homeTeam}
            </span>
            <span
              className={`${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              } font-outfit`}
            >
              vs
            </span>
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-slate-800"
              } font-medium`}
            >
              {fixture.awayTeam}
            </span>
          </div>
        </div>
        <img
          src={getLogoSrc(fixture.awayTeam)}
          alt={fixture.awayTeam}
          className="w-10 h-10 object-contain"
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div
          className={`text-xs ${
            theme === "dark" ? "text-white/60" : "text-slate-500"
          }`}
        >
          {fixture.venue}
        </div>
        <div
          className={`text-xs py-1 px-2 rounded ${
            fixture.predicted
              ? theme === "dark"
                ? "bg-indigo-900/30 text-indigo-300"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
              : theme === "dark"
              ? "bg-teal-900/30 text-teal-300"
              : "bg-teal-100 text-teal-700 border border-teal-200"
          }`}
        >
          {fixture.predicted ? "Prediction Made" : "Prediction Required"}
        </div>
      </div>
    </motion.div>
  );
};

export default FixtureCard;
