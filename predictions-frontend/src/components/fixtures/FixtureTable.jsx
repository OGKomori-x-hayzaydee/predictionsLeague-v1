import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { CaretSortIcon, CheckCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons";

function FixtureTable({ fixtures, onFixtureSelect, searchQuery = "" }) {
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
    <div className="bg-primary-800/30 rounded-lg border border-primary-700/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-700/30 bg-primary-900/30">
              <th 
                className="text-left py-3 px-4 font-medium text-white/70 text-sm cursor-pointer hover:text-teal-300"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <CaretSortIcon className={`ml-1 ${sortField === 'date' ? 'text-teal-300' : 'text-white/40'}`} />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-white/70 text-sm cursor-pointer hover:text-teal-300"
                onClick={() => handleSort('gameweek')}
              >
                <div className="flex items-center">
                  GW
                  <CaretSortIcon className={`ml-1 ${sortField === 'gameweek' ? 'text-teal-300' : 'text-white/40'}`} />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-white/70 text-sm cursor-pointer hover:text-teal-300"
                onClick={() => handleSort('match')}
              >
                <div className="flex items-center">
                  Match
                  <CaretSortIcon className={`ml-1 ${sortField === 'match' ? 'text-teal-300' : 'text-white/40'}`} />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-white/70 text-sm cursor-pointer hover:text-teal-300"
                onClick={() => handleSort('competition')}
              >
                <div className="flex items-center">
                  Competition
                  <CaretSortIcon className={`ml-1 ${sortField === 'competition' ? 'text-teal-300' : 'text-white/40'}`} />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-white/70 text-sm cursor-pointer hover:text-teal-300"
                onClick={() => handleSort('predicted')}
              >
                <div className="flex items-center">
                  Status
                  <CaretSortIcon className={`ml-1 ${sortField === 'predicted' ? 'text-teal-300' : 'text-white/40'}`} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFixtures.map(fixture => (
              <tr 
                key={fixture.id}
                className="border-b border-primary-700/20 hover:bg-primary-700/30 cursor-pointer transition-colors"
                onClick={() => onFixtureSelect(fixture)}
              >
                <td className="py-2 px-4">
                  <div className="text-white/90">{format(parseISO(fixture.date), "MMM d, yyyy")}</div>
                  <div className="text-white/60 text-xs">{format(parseISO(fixture.date), "h:mm a")}</div>
                </td>
                <td className="py-2 px-4">
                  <div className="bg-primary-700/30 text-white/80 text-xs px-2 py-0.5 rounded inline-block">
                    {fixture.gameweek}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="text-white font-medium">{fixture.homeTeam} vs {fixture.awayTeam}</div>
                  <div className="text-white/60 text-xs">{fixture.venue}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                    fixture.competition === "Premier League" 
                      ? "bg-purple-900/30 text-purple-300" 
                      : "bg-amber-900/30 text-amber-300"
                  }`}>
                    {fixture.competition}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {fixture.predicted ? (
                    <div className="flex items-center text-indigo-300">
                      <CheckCircledIcon className="mr-1 w-3.5 h-3.5" />
                      <span>Predicted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-teal-300">
                      <LightningBoltIcon className="mr-1 w-3.5 h-3.5" />
                      <span>To Predict</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedFixtures.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-white/50 text-lg mb-2">No fixtures found</div>
          <div className="text-white/40 text-sm">Try adjusting your search query</div>
        </div>
      )}
    </div>
  );
}

export default FixtureTable;