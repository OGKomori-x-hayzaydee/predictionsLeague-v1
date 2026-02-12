import React from "react";
import { Container } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

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

export default function AppPreview() {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 dark:bg-primary-700 transition-colors duration-300 overflow-hidden">
      <Container size="4" className="px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-4">
            See it in action
          </p>
          <h2 className="font-dmSerif text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-white mb-4">
            Your prediction dashboard
          </h2>
          <p className="font-outfit text-base md:text-lg text-light-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
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
            className={`rounded-t-xl border border-b-0 px-4 py-3 flex items-center gap-2 ${
              isDarkMode
                ? "bg-primary-600 border-white/10"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <div
              className={`flex-1 mx-4 rounded-md px-3 py-1 text-xs font-outfit ${
                isDarkMode
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
              isDarkMode
                ? "border-white/10 shadow-2xl shadow-black/30"
                : "border-slate-200 shadow-xl shadow-slate-200/50"
            }`}
          >
            {/* Stylized dashboard mockup */}
            <div
              className={`p-6 md:p-8 ${
                isDarkMode ? "bg-primary-500" : "bg-white"
              }`}
            >
              {/* Top bar mockup */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      isDarkMode ? "bg-teal-900/50" : "bg-teal-50"
                    }`}
                  />
                  <div>
                    <div
                      className={`h-3 w-24 rounded-full ${
                        isDarkMode ? "bg-slate-600" : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-2 w-16 rounded-full mt-1.5 ${
                        isDarkMode ? "bg-slate-700" : "bg-slate-100"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-8 w-20 rounded-lg ${
                      isDarkMode ? "bg-teal-900/40" : "bg-teal-50"
                    }`}
                  />
                  <div
                    className={`h-8 w-20 rounded-lg ${
                      isDarkMode ? "bg-indigo-900/40" : "bg-indigo-50"
                    }`}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Points", value: "1,247", accent: "teal" },
                  { label: "Rank", value: "#42", accent: "indigo" },
                  { label: "Accuracy", value: "38%", accent: "emerald" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl p-4 text-center ${
                      isDarkMode
                        ? "bg-primary-700/50 border border-white/5"
                        : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <p
                      className={`text-xl md:text-2xl font-bold font-dmSerif ${
                        isDarkMode ? "text-white" : "text-light-text"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs font-outfit mt-1 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Match predictions row */}
              <div className="space-y-3">
                {[
                  {
                    home: "Arsenal",
                    away: "Chelsea",
                    score: "2 - 1",
                    status: "Correct",
                    statusColor: "emerald",
                  },
                  {
                    home: "Liverpool",
                    away: "Man City",
                    score: "1 - 1",
                    status: "Partial",
                    statusColor: "amber",
                  },
                  {
                    home: "Spurs",
                    away: "Man United",
                    score: "0 - 2",
                    status: "Pending",
                    statusColor: "slate",
                  },
                ].map((match) => (
                  <div
                    key={`${match.home}-${match.away}`}
                    className={`flex items-center justify-between rounded-xl p-4 ${
                      isDarkMode
                        ? "bg-primary-700/30 border border-white/5"
                        : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          isDarkMode ? "bg-slate-600" : "bg-slate-200"
                        }`}
                      />
                      <span
                        className={`font-outfit text-sm ${
                          isDarkMode ? "text-slate-200" : "text-light-text"
                        }`}
                      >
                        {match.home}
                      </span>
                    </div>
                    <span
                      className={`font-dmSerif text-base font-bold mx-4 ${
                        isDarkMode ? "text-white" : "text-light-text"
                      }`}
                    >
                      {match.score}
                    </span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span
                        className={`font-outfit text-sm ${
                          isDarkMode ? "text-slate-200" : "text-light-text"
                        }`}
                      >
                        {match.away}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full ${
                          isDarkMode ? "bg-slate-600" : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <span
                      className={`ml-4 text-xs font-medium font-outfit px-2.5 py-1 rounded-full ${
                        match.statusColor === "emerald"
                          ? isDarkMode
                            ? "bg-emerald-900/30 text-emerald-dark"
                            : "bg-emerald-50 text-emerald-light"
                          : match.statusColor === "amber"
                          ? isDarkMode
                            ? "bg-amber-900/30 text-amber-dark"
                            : "bg-amber-50 text-amber-light"
                          : isDarkMode
                          ? "bg-slate-700/50 text-slate-400"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                ))}
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
