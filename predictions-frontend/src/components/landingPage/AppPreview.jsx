import React from "react";
import { Container } from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  HomeIcon,
  CalendarIcon,
  StackIcon,
  BarChartIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  CaretUpIcon,
  ClockIcon,
  MagicWandIcon,
  TargetIcon,
  LightningBoltIcon,
  RocketIcon,
  ChevronRightIcon,
  PlusIcon,
  EyeOpenIcon,
  DoubleArrowUpIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/logo.png";
import arsenalLogo from "../../assets/clubs/arsenal.svg";
import chelseaLogo from "../../assets/clubs/chelsea.svg";
import liverpoolLogo from "../../assets/clubs/liverpool.svg";
import mancityLogo from "../../assets/clubs/mancity.svg";
import spursLogo from "../../assets/clubs/spurs.svg";
import manutdLogo from "../../assets/clubs/manutd.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// --- Data for the mockup ---
const menuItems = [
  { label: "Dashboard", icon: <HomeIcon />, active: true },
  { label: "Fixtures", icon: <CalendarIcon /> },
  { label: "My Predictions", icon: <StackIcon /> },
  { label: "My Leagues", icon: <BarChartIcon /> },
  { label: "My Profile", icon: <PersonIcon /> },
  { label: "Settings", icon: <GearIcon /> },
];

const statCards = [
  {
    title: "Weekly Points",
    value: "42",
    subtitle: "This week",
    icon: <MagicWandIcon />,
    accent: "purple",
    trend: { value: "+8", direction: "up" },
  },
  {
    title: "Accuracy Rate",
    value: "68%",
    subtitle: "18 correct predictions",
    icon: <TargetIcon />,
    accent: "teal",
  },
  {
    title: "Available Chips",
    value: "3",
    subtitle: "1 on cooldown",
    icon: <LightningBoltIcon />,
    accent: "amber",
  },
  {
    title: "Global Rank",
    value: "#42",
    subtitle: "Top 5% worldwide",
    icon: <RocketIcon />,
    accent: "blue",
  },
];

const matches = [
  {
    home: "Arsenal",
    away: "Chelsea",
    homeLogo: arsenalLogo,
    awayLogo: chelseaLogo,
    date: "Sat 15 Feb",
    time: "15:00",
    gw: 26,
    predicted: true,
  },
  {
    home: "Liverpool",
    away: "Man City",
    homeLogo: liverpoolLogo,
    awayLogo: mancityLogo,
    date: "Sun 16 Feb",
    time: "16:30",
    gw: 26,
    predicted: false,
  },
  {
    home: "Spurs",
    away: "Man United",
    homeLogo: spursLogo,
    awayLogo: manutdLogo,
    date: "Sun 16 Feb",
    time: "14:00",
    gw: 26,
    predicted: false,
  },
];

const leagues = [
  { name: "Premier Predictors", rank: 2, total: 8 },
  { name: "Office League", rank: 1, total: 12 },
  { name: "Friends United", rank: 4, total: 6 },
];

// --- Accent color helpers ---
const accentBg = (accent, dark) => {
  const map = {
    purple: dark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200",
    teal: dark ? "bg-teal-500/10 border-teal-500/20" : "bg-teal-50 border-teal-200",
    amber: dark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200",
    blue: dark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200",
  };
  return map[accent] || map.teal;
};

const accentText = (accent, dark) => {
  const map = {
    purple: dark ? "text-purple-400" : "text-purple-600",
    teal: dark ? "text-teal-400" : "text-teal-600",
    amber: dark ? "text-amber-400" : "text-amber-600",
    blue: dark ? "text-blue-400" : "text-blue-600",
  };
  return map[accent] || map.teal;
};

// --- Sub-components ---

function MockSidebar({ dark }) {
  return (
    <div
      className={`hidden md:flex flex-col w-40 lg:w-44 flex-shrink-0 border-r py-3 lg:py-4 ${
        dark
          ? "bg-primary-500/90 border-slate-800"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-3 mb-5 lg:mb-6">
        <img src={logo} alt="Logo" className="h-5 lg:h-6 mr-1" />
        <span
          className={`text-xs lg:text-sm font-bold font-dmSerif ${
            dark ? "text-teal-100" : "text-teal-700"
          }`}
        >
          predictionsLeague
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-0.5">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center px-3 py-1.5 lg:py-2 text-2xs lg:text-xs font-outfit ${
              item.active
                ? dark
                  ? "bg-primary-600/60 text-teal-300 border-l-2 border-teal-400"
                  : "bg-teal-50 text-teal-700 border-l-2 border-teal-500"
                : dark
                ? "text-white/60"
                : "text-slate-500"
            }`}
          >
            <span className="mr-2 [&>svg]:w-3 [&>svg]:h-3">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className={`flex items-center px-3 py-1.5 mt-3 text-2xs lg:text-xs font-outfit ${
          dark ? "text-white/40" : "text-slate-400"
        }`}
      >
        <span className="mr-2 [&>svg]:w-3 [&>svg]:h-3">
          <ExitIcon />
        </span>
        Logout
      </div>
    </div>
  );
}

function MockStatusBar({ dark }) {
  return (
    <div
      className={`flex items-center justify-between px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border-b ${
        dark
          ? "bg-primary-500/90 border-slate-800"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      {/* User */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="h-5 w-5 sm:h-6 sm:w-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xs sm:text-xs font-medium">
          P
        </div>
        <div>
          <p
            className={`text-2xs sm:text-xs font-medium font-outfit ${
              dark ? "text-teal-100" : "text-teal-700"
            }`}
          >
            ProPredictor
          </p>
          <div
            className={`flex items-center text-2xs ${
              dark ? "text-white/50" : "text-slate-500"
            }`}
          >
            <span>Rank: #42</span>
            <span className={`flex items-center ml-1 ${dark ? "text-green-400" : "text-green-600"}`}>
              <CaretUpIcon className="w-2 h-2" /> 3
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        <div className="flex flex-col items-center">
          <span
            className={`text-2xs ${
              dark ? "text-white/50" : "text-slate-500"
            } font-outfit uppercase tracking-wide leading-none`}
          >
            Points
          </span>
          <span
            className={`text-xs sm:text-sm font-bold font-dmSerif ${
              dark ? "text-teal-200" : "text-teal-600"
            }`}
          >
            1,247
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={`text-2xs ${
              dark ? "text-white/50" : "text-slate-500"
            } font-outfit uppercase tracking-wide leading-none`}
          >
            Predictions
          </span>
          <span
            className={`text-xs sm:text-sm font-bold font-dmSerif ${
              dark ? "text-teal-200" : "text-teal-600"
            }`}
          >
            28
          </span>
        </div>
        <div className="hidden lg:flex flex-col items-center">
          <span
            className={`text-2xs ${
              dark ? "text-white/50" : "text-slate-500"
            } font-outfit uppercase tracking-wide leading-none`}
          >
            Next Match
          </span>
          <span
            className={`text-xs sm:text-sm font-bold font-dmSerif flex items-center ${
              dark ? "text-teal-200" : "text-teal-600"
            }`}
          >
            <ClockIcon className="w-2.5 h-2.5 mr-0.5" /> 2d 14h
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-indigo-600 text-white text-2xs sm:text-xs py-1 px-2 sm:px-3 rounded flex items-center font-outfit font-medium">
        <span className="hidden sm:inline">Make Predictions</span>
        <span className="sm:hidden">Predict</span>
        <span className="ml-1 sm:ml-1.5 bg-white text-indigo-600 rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center text-2xs font-bold">
          3
        </span>
      </div>
    </div>
  );
}

function MockStatCard({ stat, dark }) {
  return (
    <div
      className={`rounded-lg p-2 sm:p-2.5 lg:p-3 border ${
        dark
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
        <div
          className={`p-0.5 sm:p-1 rounded border flex items-center justify-center [&>svg]:w-2.5 [&>svg]:h-2.5 ${accentBg(
            stat.accent,
            dark
          )}`}
        >
          <span className={accentText(stat.accent, dark)}>{stat.icon}</span>
        </div>
        <span
          className={`text-2xs lg:text-xs font-outfit font-medium ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {stat.title}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <p
          className={`text-base sm:text-lg lg:text-xl font-bold font-dmSerif leading-none ${
            dark ? "text-white" : "text-slate-800"
          }`}
        >
          {stat.value}
        </p>
        {stat.trend && (
          <span
            className={`flex items-center text-2xs px-1 py-0.5 rounded ${
              dark
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <DoubleArrowUpIcon className="w-2 h-2" />
            {stat.trend.value}
          </span>
        )}
      </div>
      <p
        className={`text-2xs font-outfit mt-0.5 ${
          dark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {stat.subtitle}
      </p>
    </div>
  );
}

function MockMatchRow({ match, dark }) {
  return (
    <div
      className={`rounded p-1.5 sm:p-2 border ${
        dark
          ? "bg-slate-700/20 border-slate-600/20"
          : "bg-slate-50/50 border-slate-200/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Teams */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
            <img src={match.homeLogo} alt={match.home} className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 object-contain" />
            <span
              className={`text-2xs sm:text-xs font-outfit font-medium truncate ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              {match.home}
            </span>
            <span
              className={`text-2xs sm:text-xs font-outfit ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              vs
            </span>
            <span
              className={`text-2xs sm:text-xs font-outfit font-medium truncate ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              {match.away}
            </span>
            <img src={match.awayLogo} alt={match.away} className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 object-contain" />
            {match.predicted && (
              <span
                className={`hidden sm:inline-flex items-center gap-0.5 text-2xs font-medium py-0.5 px-1 rounded-full border ${
                  dark
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}
              >
                <LightningBoltIcon className="w-2 h-2" />
                Predicted
              </span>
            )}
          </div>
          {/* Meta */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-2xs ${
              dark ? "text-slate-400" : "text-slate-500"
            } font-outfit`}
          >
            <span className="flex items-center gap-0.5">
              <CalendarIcon className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">{match.date}</span>
              <span className="sm:hidden">{match.date.split(" ").slice(1).join(" ")}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <ClockIcon className="w-2.5 h-2.5" />
              {match.time}
            </span>
            <span
              className={`px-1 py-0.5 rounded text-2xs ${
                dark ? "bg-slate-600/30" : "bg-slate-200/70"
              }`}
            >
              GW{match.gw}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div
          className={`flex items-center gap-0.5 sm:gap-1 border rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-2xs font-medium flex-shrink-0 ml-2 ${
            match.predicted
              ? dark
                ? "bg-indigo-600/20 text-indigo-200 border-indigo-500/30"
                : "bg-indigo-50 text-indigo-600 border-indigo-200"
              : dark
              ? "bg-teal-600/20 text-emerald-200 border-emerald-500/30"
              : "bg-teal-50 text-teal-600 border-teal-200"
          }`}
        >
          {match.predicted ? (
            <>
              <EyeOpenIcon className="w-2.5 h-2.5 hidden sm:block" />
              <span className="hidden sm:inline">View</span>
              <span className="sm:hidden text-2xs">View</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-2.5 h-2.5 hidden sm:block" />
              <span className="hidden sm:inline">Predict</span>
              <span className="sm:hidden text-2xs">+</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MockLeaguesPanel({ dark }) {
  return (
    <div
      className={`hidden lg:block rounded-lg p-2.5 lg:p-3 border ${
        dark
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2 lg:mb-3">
        <div
          className={`p-0.5 sm:p-1 rounded border flex items-center justify-center ${
            dark
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}
        >
          <BarChartIcon
            className={`w-2.5 h-2.5 ${dark ? "text-teal-400" : "text-teal-600"}`}
          />
        </div>
        <span
          className={`text-2xs lg:text-xs font-outfit font-semibold ${
            dark ? "text-teal-200" : "text-teal-700"
          }`}
        >
          My Leagues
        </span>
      </div>

      {/* Leagues */}
      <div className="space-y-1.5">
        {leagues.map((league) => (
          <div
            key={league.name}
            className={`flex items-center justify-between rounded p-1.5 lg:p-2 ${
              dark ? "bg-slate-700/20" : "bg-slate-50"
            }`}
          >
            <span
              className={`text-2xs font-outfit font-medium truncate ${
                dark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {league.name}
            </span>
            <span
              className={`text-2xs font-outfit flex-shrink-0 ml-2 ${
                league.rank === 1
                  ? dark
                    ? "text-amber-400"
                    : "text-amber-600"
                  : dark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              #{league.rank}
              <span className={dark ? "text-slate-500" : "text-slate-400"}>
                /{league.total}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export default function AppPreview() {
  const { isDarkMode } = useTheme();
  const dark = isDarkMode;

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-slate-50 dark:bg-primary-700 transition-colors duration-300 overflow-hidden">
      <Container size="4" className="px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3 sm:mb-4">
            See it in action
          </p>
          <h2 className="font-dmSerif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-white mb-3 sm:mb-4">
            Your prediction dashboard
          </h2>
          <p className="font-outfit text-sm sm:text-base md:text-lg text-light-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            Track your predictions, monitor live scores, and climb the
            leaderboard — all in one place.
          </p>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Browser chrome */}
          <div
            className={`rounded-t-xl border border-b-0 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 ${
              dark
                ? "bg-primary-600 border-white/10"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            <div className="flex gap-1 sm:gap-1.5">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400/80" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80" />
            </div>
            <div
              className={`flex-1 mx-2 sm:mx-4 rounded-md px-2 sm:px-3 py-0.5 sm:py-1 text-2xs sm:text-xs font-outfit ${
                dark
                  ? "bg-primary-700/80 text-slate-400"
                  : "bg-white text-slate-400"
              }`}
            >
              predictionsleague.app/dashboard
            </div>
          </div>

          {/* App preview content */}
          <div
            className={`rounded-b-xl border overflow-hidden ${
              dark
                ? "border-white/10 shadow-2xl shadow-black/30"
                : "border-slate-200 shadow-xl shadow-slate-200/50"
            }`}
          >
            {/* Dashboard layout: sidebar + main */}
            <div className="flex">
              {/* Sidebar */}
              <MockSidebar dark={dark} />

              {/* Main content */}
              <div className={`flex-1 min-w-0 ${dark ? "bg-primary-800" : "bg-white"}`}>
                {/* Status bar */}
                <MockStatusBar dark={dark} />

                {/* Dashboard content */}
                <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
                  {/* Welcome + Progress */}
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold font-dmSerif mb-0.5 ${
                        dark ? "text-teal-100" : "text-teal-700"
                      }`}
                    >
                      Welcome back
                    </h3>
                    <p
                      className={`text-2xs font-outfit mb-1.5 sm:mb-2 ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Let's check your performance
                    </p>
                    <div
                      className={`rounded-lg p-2 border ${
                        dark
                          ? "bg-slate-800/30 border-slate-700/50"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-2xs font-medium font-outfit ${
                            dark ? "text-white/80" : "text-slate-700"
                          }`}
                        >
                          Season Progress
                        </span>
                        <span
                          className={`text-2xs font-semibold font-outfit ${
                            dark ? "text-teal-400" : "text-teal-600"
                          }`}
                        >
                          GW 26 of 38
                        </span>
                      </div>
                      <div
                        className={`w-full rounded-full h-1 sm:h-1.5 ${
                          dark ? "bg-slate-700/50" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full rounded-full"
                          style={{ width: "68%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
                    {statCards.map((stat) => (
                      <MockStatCard key={stat.title} stat={stat} dark={dark} />
                    ))}
                  </div>

                  {/* Content area: Matches + Leagues */}
                  <div className="flex gap-2 sm:gap-3">
                    {/* Upcoming Matches Panel */}
                    <div
                      className={`flex-1 min-w-0 rounded-lg p-2 sm:p-2.5 lg:p-3 border ${
                        dark
                          ? "bg-slate-800/40 border-slate-700/50"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {/* Panel header */}
                      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <div
                            className={`p-0.5 sm:p-1 rounded border flex items-center justify-center ${
                              dark
                                ? "bg-teal-500/10 border-teal-500/20"
                                : "bg-teal-50 border-teal-200"
                            }`}
                          >
                            <CalendarIcon
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                dark ? "text-teal-400" : "text-teal-600"
                              }`}
                            />
                          </div>
                          <div>
                            <span
                              className={`text-2xs sm:text-xs font-outfit font-semibold ${
                                dark ? "text-teal-200" : "text-teal-700"
                              }`}
                            >
                              Upcoming Matches
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 border rounded text-2xs ${
                            dark
                              ? "bg-slate-700/50 border-slate-600/30 text-slate-300"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="hidden sm:inline">View all</span>
                          <span className="sm:hidden">All</span>
                          <ChevronRightIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        </div>
                      </div>

                      {/* Match rows */}
                      <div className="space-y-1 sm:space-y-1.5">
                        {matches.map((match) => (
                          <MockMatchRow
                            key={`${match.home}-${match.away}`}
                            match={match}
                            dark={dark}
                          />
                        ))}
                      </div>
                    </div>

                    {/* My Leagues */}
                    <MockLeaguesPanel dark={dark} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle glow behind the mockup */}
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-b from-teal-light/5 via-transparent to-indigo-light/5 dark:from-teal-dark/10 dark:to-indigo-dark/10 blur-xl" />
        </motion.div>
      </Container>
    </section>
  );
}
