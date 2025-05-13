import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Container, Section, Button, Tabs, Text } from "@radix-ui/themes";
import { format, parseISO, isAfter } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import club logos
import arsenalLogo from "../assets/clubs/arsenal.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUtdLogo from "../assets/clubs/manutd.png";
import tottenhamLogo from "../assets/clubs/tottenham.png";

import {
  CalendarIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckIcon,
  ChevronDownIcon,
  InfoCircledIcon,
  PlusIcon,
  StarIcon,
  Cross2Icon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

export default function Matches() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedGameweek, setSelectedGameweek] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data - would be replaced by API calls
  const matches = [
    {
      id: 1,
      gameweek: 36,
      homeTeam: "Arsenal",
      awayTeam: "Tottenham",
      date: "2025-05-12T15:00:00",
      venue: "Emirates Stadium",
      predicted: true,
      result: null, // null means match hasn't happened yet
      status: "upcoming"
    },
    {
      id: 2,
      gameweek: 36,
      homeTeam: "Manchester City",
      awayTeam: "Manchester United",
      date: "2025-05-12T17:30:00",
      venue: "Etihad Stadium",
      predicted: false,
      result: null,
      status: "upcoming"
    },
    {
      id: 3,
      gameweek: 36,
      homeTeam: "Chelsea",
      awayTeam: "Liverpool",
      date: "2025-05-13T20:00:00",
      venue: "Stamford Bridge",
      predicted: false,
      result: null,
      status: "upcoming"
    },
    {
      id: 4,
      gameweek: 35,
      homeTeam: "Liverpool",
      awayTeam: "Tottenham",
      date: "2025-05-04T16:30:00",
      venue: "Anfield",
      predicted: true,
      result: { homeGoals: 3, awayGoals: 1 },
      status: "completed"
    },
    {
      id: 5,
      gameweek: 35,
      homeTeam: "Manchester United",
      awayTeam: "Arsenal",
      date: "2025-05-05T20:00:00",
      venue: "Old Trafford",
      predicted: true,
      result: { homeGoals: 1, awayGoals: 2 },
      status: "completed"
    },
    {
      id: 6,
      gameweek: 35,
      homeTeam: "Chelsea",
      awayTeam: "Manchester City",
      date: "2025-05-06T19:45:00",
      venue: "Stamford Bridge",
      predicted: true,
      result: { homeGoals: 0, awayGoals: 0 },
      status: "completed"
    },
  ];

  // Teams for filtering
  const teams = [
    "Arsenal", "Chelsea", "Liverpool", 
    "Manchester City", "Manchester United", "Tottenham", 
    "All Teams"
  ];

  // Gameweeks for filtering
  const gameweeks = Array.from({ length: 38 }, (_, i) => i + 1);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter matches based on selected tab and filters
  const filteredMatches = matches.filter(match => {
    // Filter by tab (upcoming/completed)
    if (activeTab === "upcoming" && match.status !== "upcoming") return false;
    if (activeTab === "completed" && match.status !== "completed") return false;
    
    // Filter by gameweek
    if (selectedGameweek !== "all" && match.gameweek !== parseInt(selectedGameweek)) return false;
    
    // Filter by team
    if (filterTeam !== "all" && match.homeTeam !== filterTeam && match.awayTeam !== filterTeam) return false;
    
    return true;
  });

  return (
    <>
      <Navbar />
      <Box className="relative overflow-hidden bg-primary-500 min-h-screen pt-24 pb-16">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-40 left-10 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, 15, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{
              x: [0, -20, 20, 0],
              y: [0, 20, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />
        </div>

        <Container size="3" className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <motion.h1
                className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Matches
              </motion.h1>
              <motion.p
                className="text-white/70 font-outfit max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                View all upcoming and completed fixtures featuring the Premier League's "Big Six" teams
              </motion.p>
            </div>

            {/* Tabs and filters */}
            <div className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-primary-400/20">
                <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                  <Tabs.List>
                    <Tabs.Trigger value="upcoming" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-400 data-[state=active]:text-teal-300 px-4 py-2 text-white/70 hover:text-white font-outfit">
                      Upcoming Matches
                    </Tabs.Trigger>
                    <Tabs.Trigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-400 data-[state=active]:text-teal-300 px-4 py-2 text-white/70 hover:text-white font-outfit">
                      Completed Matches
                    </Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>

                <div className="mt-4 md:mt-0 flex items-center">
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className="flex items-center text-sm text-teal-300 hover:text-teal-200 font-outfit mr-2"
                  >
                    <MagnifyingGlassIcon className="mr-1" />
                    Filter
                    <ChevronDownIcon className="ml-1" />
                  </button>

                  <span className="text-white/50">|</span>

                  <button className="ml-2 flex items-center text-sm text-teal-300 hover:text-teal-200 font-outfit">
                    <CalendarIcon className="mr-1" /> 
                    Download Calendar
                  </button>
                </div>
              </div>

              {/* Filters panel */}
              {showFilters && (
                <motion.div 
                  className="p-4 border-b border-primary-400/20 bg-primary-600/40"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1 font-outfit">Gameweek</label>
                      <select 
                        value={selectedGameweek} 
                        onChange={(e) => setSelectedGameweek(e.target.value)}
                        className="bg-primary-700/50 text-white border border-primary-400/30 rounded-md px-3 py-1.5 text-sm font-outfit w-full"
                      >
                        <option value="all">All Gameweeks</option>
                        {gameweeks.map(gw => (
                          <option key={gw} value={gw}>Gameweek {gw}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-1 font-outfit">Team</label>
                      <select 
                        value={filterTeam} 
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className="bg-primary-700/50 text-white border border-primary-400/30 rounded-md px-3 py-1.5 text-sm font-outfit w-full"
                      >
                        <option value="all">All Teams</option>
                        {teams.filter(team => team !== "All Teams").map(team => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button 
                        onClick={() => {
                          setFilterTeam("all");
                          setSelectedGameweek("all");
                        }}
                        className="bg-primary-700/50 hover:bg-primary-700/70 text-white/70 hover:text-white text-sm py-1.5 px-3 rounded-md font-outfit"
                      >
                        <Cross2Icon className="inline mr-1" /> 
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Matches display */}
            <div className="space-y-6">
              {isLoading ? (
                // Skeleton loaders
                <>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-5 w-24 bg-primary-500/50 rounded"></div>
                        <div className="h-5 w-32 bg-primary-500/50 rounded"></div>
                      </div>
                      <div className="flex justify-center items-center py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-500/50 rounded-full mr-3"></div>
                          <div className="h-6 w-24 bg-primary-500/50 rounded"></div>
                        </div>
                        <div className="mx-6">
                          <div className="h-8 w-16 bg-primary-500/50 rounded"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-6 w-24 bg-primary-500/50 rounded mr-3"></div>
                          <div className="h-10 w-10 bg-primary-500/50 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-8 w-36 bg-primary-500/50 rounded"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : filteredMatches.length > 0 ? (
                // Actual match cards
                filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                // No matches found
                <div className="bg-primary-600/40 rounded-lg p-8 border border-primary-400/20 text-center">
                  <InfoCircledIcon className="h-8 w-8 text-white/40 mx-auto mb-4" />
                  <h3 className="text-teal-200 text-xl font-dmSerif mb-2">No Matches Found</h3>
                  <p className="text-white/70 font-outfit">
                    Try adjusting your filters or check back later for more matches.
                  </p>
                </div>
              )}
            </div>

            {/* Load more button (if needed) */}
            {filteredMatches.length > 5 && (
              <div className="text-center mt-8">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-md transition-colors">
                  Load More
                </Button>
              </div>
            )}
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

// Match card component
function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  const isPast = match.status === "completed";
  const matchDate = parseISO(match.date);
  const formattedDate = format(matchDate, "EEEE, d MMMM yyyy");
  const formattedTime = format(matchDate, "h:mm a");
  
  // Updated function to use actual club logos
  const getTeamLogo = (team) => {
    // Map team names to their logo files
    const teamLogos = {
      "Arsenal": arsenalLogo,
      "Chelsea": chelseaLogo,
      "Liverpool": liverpoolLogo,
      "Manchester City": manCityLogo,
      "Manchester United": manUtdLogo,
      "Tottenham": tottenhamLogo
    };
    
    // Return the appropriate logo or a fallback
    return teamLogos[team] || `https://via.placeholder.com/40?text=${team.substring(0, 3)}`;
  };

  return (
    <motion.div 
      className="bg-primary-600/40 rounded-lg border border-primary-400/20 overflow-hidden hover:border-teal-500/30 transition-colors"
      layout
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <CalendarIcon className="mr-1" /> GW {match.gameweek}
            </span>
            
            {match.predicted && (
              <span className="ml-2 bg-indigo-700/20 text-indigo-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                <CheckIcon className="mr-1" /> Predicted
              </span>
            )}

            {isPast && match.result && match.result.homeGoals === match.result.awayGoals && (
              <span className="ml-2 bg-purple-700/20 text-purple-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                Draw
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-white/70 text-sm font-outfit">{formattedDate}</div>
            <div className="text-white/50 text-xs flex items-center justify-end mt-1">
              <ClockIcon className="mr-1" /> {formattedTime}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center py-4">
          <div className="flex flex-col items-center">
            <img 
              src={getTeamLogo(match.homeTeam)} 
              alt={match.homeTeam}
              className="h-16 w-16 object-contain mb-2" 
            />
            <span className="text-white font-medium font-outfit">{match.homeTeam}</span>
          </div>

          <div className="mx-8">
            {isPast ? (
              <div className="text-center font-dmSerif">
                <span className="text-3xl text-white font-bold">
                  {match.result.homeGoals} - {match.result.awayGoals}
                </span>
                <div className="text-white/50 text-xs mt-1 font-outfit">Final Score</div>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-xl text-white/70 font-outfit">vs</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <img 
              src={getTeamLogo(match.awayTeam)} 
              alt={match.awayTeam}
              className="h-16 w-16 object-contain mb-2" 
            />
            <span className="text-white font-medium font-outfit">{match.awayTeam}</span>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          {!isPast ? (
            !match.predicted ? (
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-4 rounded-md flex items-center transition-colors">
                <PlusIcon className="mr-1" /> Make Prediction
              </Button>
            ) : (
              <Button className="bg-indigo-700/50 hover:bg-indigo-700/70 text-white/90 text-sm py-1 px-4 rounded-md flex items-center transition-colors">
                Edit Prediction
              </Button>
            )
          ) : (
            <Button className="bg-teal-700/30 hover:bg-teal-700/50 text-teal-300 text-sm py-1 px-4 rounded-md flex items-center transition-colors">
              View Match Details
            </Button>
          )}
          
          <Button className="ml-2 bg-transparent hover:bg-primary-500/40 text-white/60 hover:text-white/90 text-sm py-1 px-2 rounded-md transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Less Info" : "More Info"}
            <ChevronDownIcon className={`ml-1 transition-transform duration-300 ${expanded ? "transform rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Expandable match details */}
      {expanded && (
        <motion.div 
          className="bg-primary-700/30 border-t border-primary-400/20 p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-teal-200 text-sm font-outfit font-medium mb-2">Match Details</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-white/50 mr-2">Venue:</span> {match.venue}
                </li>
                <li className="flex items-start">
                  <span className="text-white/50 mr-2">Competition:</span> Premier League
                </li>
                <li className="flex items-start">
                  <span className="text-white/50 mr-2">Importance:</span> 
                  <div className="flex">
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-yellow-400" />
                    <StarIcon className="text-white/30" />
                    <StarIcon className="text-white/30" />
                  </div>
                </li>
              </ul>
            </div>

            {!isPast ? (
              <div>
                <h4 className="text-teal-200 text-sm font-outfit font-medium mb-2">Prediction Deadline</h4>
                <div className="text-white/70 text-sm space-y-1">
                  <p>Submissions close 45 minutes before kickoff</p>
                  <div className="bg-indigo-900/30 border border-indigo-400/30 rounded-md px-3 py-2 mt-2 flex items-center">
                    <ClockIcon className="mr-2 text-indigo-300" />
                    <span className="text-indigo-200 font-medium">
                      {format(new Date(matchDate.getTime() - 45 * 60000), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-teal-200 text-sm font-outfit font-medium mb-2">Your Prediction</h4>
                <div className="bg-teal-900/30 border border-teal-400/30 rounded-md px-3 py-2 flex items-center">
                  <div className="mr-4">
                    <div className="text-white/50 text-xs mb-1">Your Score</div>
                    <div className="text-white font-medium">
                      {match.homeTeam.substring(0, 3)} 1 - 2 {match.awayTeam.substring(0, 3)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs mb-1">Points Earned</div>
                    <div className="text-teal-300 font-bold">+8 pts</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-primary-400/20 flex justify-center">
            <Button className="bg-transparent hover:bg-primary-500/40 text-indigo-300 hover:text-indigo-200 text-sm flex items-center transition-colors">
              View Full Match History <ChevronRightIcon className="ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}