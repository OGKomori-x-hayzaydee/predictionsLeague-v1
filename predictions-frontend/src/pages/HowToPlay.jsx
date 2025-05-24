import React, { useState } from "react";
import { Box, Container, Tabs, Text } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";

export default function HowToPlay() {
  const [activeTab, setActiveTab] = useState("basics");

  return (
    <>
      <Navbar />
      <Box className="relative overflow-hidden bg-primary-500 min-h-screen">
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

        <Container size="3" className="relative z-10 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <motion.h1
                className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                how to play
              </motion.h1>
              <motion.p
                className="text-white/70 font-outfit max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                everything you need to know about predictionsLeague - from
                making your first prediction to winning the season
              </motion.p>
            </div>

            <div className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 p-6 md:p-8">
              {/* Tabs Navigation */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-primary-400/30 mb-8 pb-2 ">
                <TabButton
                  active={activeTab === "basics"}
                  onClick={() => setActiveTab("basics")}
                  label="Basics"
                />
                <TabButton
                  active={activeTab === "scoring"}
                  onClick={() => setActiveTab("scoring")}
                  label="Scoring System"
                />
                <TabButton
                  active={activeTab === "chips"}
                  onClick={() => setActiveTab("chips")}
                  label="Playing Chips"
                />
                <TabButton
                  active={activeTab === "awards"}
                  onClick={() => setActiveTab("awards")}
                  label="Seasonal Awards"
                />
                <TabButton
                  active={activeTab === "faq"}
                  onClick={() => setActiveTab("faq")}
                  label="FAQ"
                />
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Basics Tab */}
                {activeTab === "basics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Basic Structure Card */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <h3 className="text-teal-200 text-4xl font-dmSerif mb-4 flex items-center">
                          {/* <div className="bg-teal-900/50 p-2 rounded-full mr-3">
                           
                          </div> */}
                          Basic Structure
                        </h3>
                        <h4 className="text-teal-100 font-outfit font-medium mb-4">
                          How the game is organized
                        </h4>

                        <div className="space-y-4">
                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">1</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Six Matches Per Gameweek
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Players predict results for 6 matches each
                                gameweek (those involving the EPL's "Big Six"
                                teams).
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">2</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Submission Deadline
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predictions must be submitted 45min before
                                kickoff of each match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">3</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                League Standings
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                League standings are updated based on total
                                points accumulated.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">4</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Private Leagues
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Create or join private leagues to compete with
                                friends and colleagues.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Making Predictions Card */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <h3 className="text-teal-200 text-4xl font-dmSerif mb-4 flex items-center">
                          {/* <div className="bg-teal-900/50 p-2 rounded-full mr-3">
                          
                          </div> */}
                          Making Predictions
                        </h3>
                        <h4 className="text-teal-100 font-outfit font-medium mb-4">
                          How to submit your predictions
                        </h4>

                        <div className="space-y-4">
                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">1</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Match Outcome
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict the final score for each match (e.g.,
                                2-1, 0-0, 3-2).
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">2</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Goalscorers
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict which players will score in the match,
                                including own goals.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">3</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Save Drafts
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                You can save draft predictions and edit them
                                until the submission deadline.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">4</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Strategic Chips
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Apply special chips to maximize points in
                                specific matches or gameweeks.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-4 text-center">
                      <p className="text-teal-200 font-outfit">
                        Ready to make your first prediction?{" "}
                        <a
                          href="/login"
                          className="text-teal-300 hover:text-teal-200 font-medium"
                        >
                          Log in
                        </a>{" "}
                        or{" "}
                        <a
                          href="/signup"
                          className="text-teal-300 hover:text-teal-200 font-medium"
                        >
                          sign up
                        </a>{" "}
                        to get started!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Scoring System Tab */}
                {activeTab === "scoring" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Basic Points Card */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <h3 className="text-teal-200 text-4xl font-dmSerif mb-4">
                          Basic Points
                        </h3>
                        <h4 className="text-teal-100 font-outfit font-medium mb-4">
                          Points for match predictions
                        </h4>

                        <div className="space-y-4">
                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">5</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Correct winner
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict the right match winner.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">7</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Correct draw prediction
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Successfully predict that the match will end in
                                a draw.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">
                                10
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Exact scoreline
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict the precise final score of the match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">
                                15
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Exact scoreline with scorers
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict both the correct score and all
                                goalscorers correctly.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">2</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Correct goalscorer
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Each correctly predicted player who scores in
                                the match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-teal-700/20 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-teal-300 font-bold">4</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Correct own goal prediction
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Successfully predict an own goal in the match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-red-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-red-300 font-bold">-1</span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Incorrect prediction (2+ goal difference)
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Lose 1 point per goal difference when prediction
                                is off by 2+ goals.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bonus Points Card */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <h3 className="text-teal-200 text-4xl font-dmSerif mb-4">
                          Bonus Points
                        </h3>
                        <h4 className="text-teal-100 font-outfit font-medium mb-4">
                          Additional points for special predictions
                        </h4>

                        <div className="space-y-4">
                          <div className="flex">
                            <div className="bg-indigo-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-indigo-300 font-bold">
                                3
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Clean Sheet Bonus
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Correctly predict a team will keep a clean sheet
                                (no goals conceded).
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-indigo-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-indigo-300 font-bold">
                                5
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Comeback Kings
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Predict a team will win after being behind
                                during the match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-indigo-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-indigo-300 font-bold">
                                3
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                First/Last Scorer Special
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Correctly predict which player will score first
                                or last in the match.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-indigo-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-indigo-300 font-bold">
                                1.5x
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Derby Day Multiplier
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                All points are multiplied by 1.5 for predictions
                                on derby matches.
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="bg-indigo-700/30 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-indigo-300 font-bold">
                                10
                              </span>
                            </div>
                            <div>
                              <h5 className="text-teal-100 font-outfit font-medium mb-1">
                                Perfect Week
                              </h5>
                              <p className="text-white/70 font-outfit text-sm">
                                Get all six match outcomes correct in a single
                                gameweek.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-4">
                      <h4 className="text-teal-200 text-lg font-dmSerif mb-2">
                        Point Calculation Example
                      </h4>
                      <p className="text-white/70 font-outfit">
                        If you predict Manchester United 2-1 Liverpool with
                        Rashford and Fernandes as scorers, and the actual result
                        is Manchester United 2-1 Liverpool with Rashford and
                        Sancho scoring, you would earn: 10 points (exact
                        scoreline) + 2 points (correct goalscorer) = 12 points.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Playing Chips Tab */}
                {activeTab === "chips" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-teal-100 text-2xl font-dmSerif mb-3">
                        Power Up Your Predictions
                      </h3>
                      <p className="text-white/70 font-outfit">
                        Use strategic chips to maximize your points and gain an
                        edge over your competitors
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Double Down Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-teal-500/20 to-teal-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-teal-300 text-2xl font-bold">
                              2x
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            Double Down
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Available every gameweek
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Double all points earned from one selected match.
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Best used on matches where you have high confidence
                            in your prediction, especially if you've predicted
                            goalscorers correctly.
                          </p>
                        </div>
                      </div>

                      {/* Wildcard Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-purple-300 text-2xl font-bold">
                              3x
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            Wildcard
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Cooldown: 7 gameweeks between uses
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Triple all points earned from one selected match.
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Save this for matches where you're extremely
                            confident, or for derby matches where the points
                            multiplier is already in effect.
                          </p>
                        </div>
                      </div>

                      {/* Perfect Defense Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-blue-300 text-2xl font-bold">
                              🛡️
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            Defense++
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Cooldown: 5 gameweeks between uses
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Earn 10 bonus points if you correctly predict clean
                          sheets across all matches where you predicted them.
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Best used when several defensive teams are playing
                            against weaker attacking sides.
                          </p>
                        </div>
                      </div>

                      {/* Opportunist Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-amber-500/20 to-amber-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-amber-300 text-2xl font-bold">
                              ⏱️
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            Opportunist
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Limited use: Available twice per season
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Change all six predictions up to 30 minutes before the
                          first kickoff.
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Use when late team news significantly impacts your
                            predictions, such as key players being injured or
                            rested.
                          </p>
                        </div>
                      </div>

                      {/* Scorer Focus Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-green-300 text-2xl font-bold">
                              ⚽
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            Scorer Focus
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Cooldown: 5 gameweeks between uses
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Doubles all points from goalscorer predictions in one
                          match.
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Best used in high-scoring matches where you're
                            confident about multiple goalscorers.
                          </p>
                        </div>
                      </div>

                      {/* All-In Week Chip */}
                      <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20 hover:border-teal-500/30 transition-colors">
                        <div className="mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-red-300 text-2xl font-bold">
                              🎯
                            </span>
                          </div>
                          <h4 className="text-teal-200 text-3xl font-dmSerif">
                            All-In Week
                          </h4>
                          <div className="text-teal-300/70 text-xs font-outfit mt-1">
                            Limited use: Available twice per season
                          </div>
                        </div>

                        <p className="text-white/80 font-outfit mb-4">
                          Doubles the entire gameweek score (including
                          deductions).
                        </p>

                        <div className="bg-teal-900/30 rounded-md p-3">
                          <h5 className="text-teal-200 text-sm font-outfit font-medium mb-1">
                            Strategy Tip:
                          </h5>
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Use when you're confident across all matches in a
                            gameweek, but be careful as negative points are also
                            doubled.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-4">
                      <h4 className="text-teal-200 text-lg font-dmSerif mb-2">
                        Chip Management
                      </h4>
                      <p className="text-white/70 font-outfit">
                        You can use multiple chips every gameweek. Choose wisely
                        based on fixture difficulty and your confidence level.
                      </p>
                      <p className="text-white/70 font-outfit">
                        Track your chip usage and cooldown periods on the "My
                        Chips" section of your dashboard.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Seasonal Awards Tab */}
                {activeTab === "awards" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-teal-100 text-2xl font-dmSerif mb-3">
                        End of Season Recognition
                      </h3>
                      <p className="text-white/70 font-outfit">
                        Celebrate your prediction prowess with these prestigious awards
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Prediction Champion */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-br from-amber-400/30 to-amber-600/30 p-3 rounded-full mr-4">
                            <div className="text-amber-300 text-2xl font-bold">🏆</div>
                          </div>
                          <div>
                            <h4 className="text-teal-200 text-2xl font-dmSerif">Prediction Champion</h4>
                            <p className="text-teal-300/70 text-sm font-outfit">The ultimate achievement</p>
                          </div>
                        </div>
                        
                        <p className="text-white/80 font-outfit mb-4">
                          Awarded to the player who accumulates the highest total points across the entire season.
                        </p>
                        
                        <div className="bg-teal-900/30 rounded-md p-3">
                          <p className="text-teal-100/70 font-outfit text-sm">
                            The Prediction Champion receives special recognition on the leaderboard, a unique profile badge, and bragging rights until the next season.
                          </p>
                        </div>
                      </div>

                      {/* Oracle Award */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-br from-indigo-400/30 to-indigo-600/30 p-3 rounded-full mr-4">
                            <div className="text-indigo-300 text-2xl font-bold">🔮</div>
                          </div>
                          <div>
                            <h4 className="text-teal-200 text-2xl font-dmSerif">Oracle Award</h4>
                            <p className="text-teal-300/70 text-sm font-outfit">Master of exact predictions</p>
                          </div>
                        </div>
                        
                        <p className="text-white/80 font-outfit mb-4">
                          Presented to the player who correctly predicts the most exact scorelines throughout the season.
                        </p>
                        
                        <div className="bg-teal-900/30 rounded-md p-3">
                          <p className="text-teal-100/70 font-outfit text-sm">
                            This award recognizes uncanny accuracy in predicting precise match results, demonstrating exceptional football insight.
                          </p>
                        </div>
                      </div>

                      {/* Goalscorer Guru */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-br from-green-400/30 to-green-600/30 p-3 rounded-full mr-4">
                            <div className="text-green-300 text-2xl font-bold">⚽</div>
                          </div>
                          <div>
                            <h4 className="text-teal-200 text-2xl font-dmSerif">Goalscorer Guru</h4>
                            <p className="text-teal-300/70 text-sm font-outfit">The goal prediction expert</p>
                          </div>
                        </div>
                        
                        <p className="text-white/80 font-outfit mb-4">
                          Awarded to the player who correctly predicts the most goalscorers across all matches in the season.
                        </p>
                        
                        <div className="bg-teal-900/30 rounded-md p-3">
                          <p className="text-teal-100/70 font-outfit text-sm">
                            This award celebrates deep knowledge of player form, team tactics, and the ability to anticipate who will find the back of the net.
                          </p>
                        </div>
                      </div>

                      {/* Monthly Stars */}
                      <div className="bg-primary-600/40 rounded-lg p-6 border border-primary-400/20">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-br from-teal-400/30 to-teal-600/30 p-3 rounded-full mr-4">
                            <div className="text-teal-300 text-2xl font-bold">⭐</div>
                          </div>
                          <div>
                            <h4 className="text-teal-200 text-2xl font-dmSerif">Monthly Stars</h4>
                            <p className="text-teal-300/70 text-sm font-outfit">Regular recognition</p>
                          </div>
                        </div>
                        
                        <p className="text-white/80 font-outfit mb-4">
                          Recognition given to each month's top-performing predictor, celebrating consistent excellence.
                        </p>
                        
                        <div className="bg-teal-900/30 rounded-md p-3">
                          <p className="text-teal-100/70 font-outfit text-sm">
                            Monthly Stars receive temporary profile badges and are featured in the monthly prediction newsletter, providing regular opportunities for recognition throughout the season.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-4">
                      <h4 className="text-teal-200 text-lg font-dmSerif mb-2">Hall of Fame</h4>
                      <p className="text-white/70 font-outfit">
                        All award winners are permanently enshrined in the predictionsLeague Hall of Fame, celebrating the best predictors across seasons. Will your name be featured among the prediction elite?
                      </p>
                      <div className="mt-4 text-center">
                        <a href="/signup" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors font-outfit">
                          Start your journey to the top
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-teal-100 text-2xl font-dmSerif mb-3">Frequently Asked Questions</h3>
                      <p className="text-white/70 font-outfit">Common questions about the Predictions League</p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* FAQ Item */}
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="What teams are included in the 'Big Six'?"
                          answer="The 'Big Six' teams in the English Premier League are Manchester United, Manchester City, Liverpool, Chelsea, Arsenal, and Tottenham Hotspur. Each gameweek features predictions for matches involving these six teams."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="What happens if a match is postponed?"
                          answer="If a match is postponed, any predictions made for that match will be void and no points will be awarded. The match will be rescheduled, and you'll have the opportunity to submit fresh predictions before the new kickoff time."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="How are points calculated for own goals?"
                          answer="If you correctly predict that an own goal will occur in a match (without specifying which player), you'll earn 4 points. Note that own goals don't count toward the goalscorer predictions for the scoring team."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="Can I change my predictions after submitting them?"
                          answer="You can edit your predictions any time before the submission deadline (45 minutes before kickoff). After that deadline, your predictions are locked and cannot be changed unless you use an 'Opportunist' chip."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="How many private leagues can I join?"
                          answer="You can join up to 10 private leagues at a time. You can also create up to 3 private leagues to invite your friends, family, or colleagues to compete against each other."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="What happens if two players have the same number of points?"
                          answer="If two or more players have identical points at the end of the season, the tiebreaker will be: 1) Most exact score predictions, 2) Most correct goalscorer predictions, 3) Fewest negative points accumulated."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="How do I know which matches are derby matches?"
                          answer="Derby matches will be clearly labeled in the prediction interface with a special 'Derby Day' badge. These include traditional rivalries like Manchester United vs. Liverpool, Arsenal vs. Tottenham, and other historical derbies."
                        />
                      </div>
                      
                      <div className="bg-primary-600/40 rounded-lg border border-primary-400/20">
                        <FaqItem 
                          question="Can I use multiple chips in the same gameweek?"
                          answer="Yes, you can use multiple chips in a single gameweek. For example, you could use 'Double Down' on one match and 'Scorer Focus' on another. Just remember that chips with cooldown periods will start their countdown simultaneously."
                        />
                      </div>
                    </div>
                    
                    <div className="bg-teal-900/30 border border-teal-700/30 rounded-lg p-4 text-center">
                      <p className="text-teal-200 font-outfit">
                        Still have questions? <a href="/contact" className="text-teal-300 hover:text-teal-200 font-medium">Contact us</a> or join our <a href="/community" className="text-teal-300 hover:text-teal-200 font-medium">community forum</a> for more help!
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-lg font-outfit text-sm whitespace-nowrap transition-colors ${
        active
          ? "bg-teal-700/40 text-teal-100 border border-teal-500/40"
          : "text-white/70 hover:text-white hover:bg-primary-400/20"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

// FAQ Item Component
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-teal-100 font-outfit font-medium">{question}</h4>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-1">
          <p className="text-white/70 font-outfit text-sm">{answer}</p>
        </div>
      </div>
    </div>
  );
};
