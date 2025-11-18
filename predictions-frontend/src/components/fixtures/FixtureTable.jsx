import React, { useState, useContext } from "react";
import { format, parseISO } from "date-fns";
import { CaretSortIcon, CheckCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import EmptyFixtureState from "./EmptyFixtureState";
import { isPredictionDeadlinePassed } from "../../utils/dateUtils";
import { showToast } from "../../services/notificationService";

function FixtureTable({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const { theme } = useContext(ThemeContext);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter fixtures based on search query
  const filteredFixtures = fixtures.filter(fixture => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return fixture.homeTeam.toLowerCase().includes(query) ||
           fixture.awayTeam.toLowerCase().includes(query) ||
           fixture.venue.toLowerCase().includes(query) ||
           fixture.competition.toLowerCase().includes(query);
  });

  // Sort fixtures
  const sortedFixtures = [...filteredFixtures].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortField) {
      case 'date':
        aVal = new Date(a.date);
        bVal = new Date(b.date);
        break;
      case 'gameweek':
        aVal = a.gameweek;
        bVal = b.gameweek;
        break;
      case 'competition':
        aVal = a.competition;
        bVal = b.competition;
        break;
      case 'match':
        aVal = `${a.homeTeam} vs ${a.awayTeam}`;
        bVal = `${b.homeTeam} vs ${b.awayTeam}`;
        break;
      case 'predicted':
        aVal = a.predicted ? 1 : 0;
        bVal = b.predicted ? 1 : 0;
        break;
      default:
        aVal = new Date(a.date);
        bVal = new Date(b.date);
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  // Toggle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  return (
    <div className={`rounded-lg border overflow-hidden ${
      theme === "dark" 
        ? "bg-slate-800/50 border-slate-700/50" 
        : "bg-white border-slate-200"
    }`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
          <thead>
            <tr className={`border-b ${
              theme === "dark" 
                ? "border-slate-700/50 bg-slate-900/30" 
                : "border-slate-200 bg-slate-50"
            }`}>
              <th 
                className={`text-left py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-teal-300"
                    : "text-slate-600 hover:text-teal-600"
                }`}
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <CaretSortIcon className={`ml-1 ${
                    sortField === 'date' 
                      ? 'text-teal-300' 
                      : theme === "dark" ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-teal-300"
                    : "text-slate-600 hover:text-teal-600"
                }`}
                onClick={() => handleSort('gameweek')}
              >
                <div className="flex items-center">
                  GW
                  <CaretSortIcon className={`ml-1 ${
                    sortField === 'gameweek' 
                      ? 'text-teal-300' 
                      : theme === "dark" ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-teal-300"
                    : "text-slate-600 hover:text-teal-600"
                }`}
                onClick={() => handleSort('match')}
              >
                <div className="flex items-center">
                  Match
                  <CaretSortIcon className={`ml-1 ${
                    sortField === 'match' 
                      ? 'text-teal-300' 
                      : theme === "dark" ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-teal-300"
                    : "text-slate-600 hover:text-teal-600"
                }`}
                onClick={() => handleSort('competition')}
              >
                <div className="flex items-center">
                  Competition
                  <CaretSortIcon className={`ml-1 ${
                    sortField === 'competition' 
                      ? 'text-teal-300' 
                      : theme === "dark" ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </th>
              <th 
                className={`text-left py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-teal-300"
                    : "text-slate-600 hover:text-teal-600"
                }`}
                onClick={() => handleSort('predicted')}
              >
                <div className="flex items-center">
                  Status
                  <CaretSortIcon className={`ml-1 ${
                    sortField === 'predicted' 
                      ? 'text-teal-300' 
                      : theme === "dark" ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </th>
            </tr>
          </thead>          <tbody>
            {sortedFixtures.map(fixture => (
              <tr 
                key={fixture.id}
                className={`cursor-pointer transition-colors border-b ${
                  theme === "dark"
                    ? "hover:bg-slate-800/50 border-slate-700/50"
                    : "hover:bg-slate-50 border-slate-200"
                }`}
                onClick={() => {
                  if (isPredictionDeadlinePassed(fixture.date)) {
                    showToast('Deadline has passed for this match', 'error');
                    return;
                  }
                  onFixtureSelect(fixture);
                }}
              >
                <td className="py-3 px-4">
                  <div className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                    {format(parseISO(fixture.date), "MMM d, yyyy")}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {format(parseISO(fixture.date), "h:mm a")}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                    theme === "dark" 
                      ? "bg-slate-700/50 border border-slate-600/50 text-slate-300" 
                      : "bg-slate-100 border border-slate-300 text-slate-700"
                  }`}>
                    {fixture.gameweek}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                    {fixture.homeTeam} vs {fixture.awayTeam}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {fixture.venue}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                    fixture.competition === "Premier League" 
                      ? theme === "dark"
                        ? "bg-purple-800/30 text-purple-300" 
                        : "bg-purple-50 text-purple-700"
                      : theme === "dark"
                        ? "bg-amber-800/30 text-amber-300"
                        : "bg-amber-50 text-amber-700"
                  }`}>
                    {fixture.competition}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {fixture.predicted ? (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                      theme === "dark" 
                        ? "bg-indigo-800/30 text-indigo-300" 
                        : "bg-indigo-50 text-indigo-700"
                    }`}>
                      <CheckCircledIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Predicted</span>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                      theme === "dark" 
                        ? "bg-teal-800/30 text-teal-300" 
                        : "bg-teal-50 text-teal-700"
                    }`}>
                      <LightningBoltIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">To Predict</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>        </table>
      </div>
      {sortedFixtures.length === 0 && (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default FixtureTable;