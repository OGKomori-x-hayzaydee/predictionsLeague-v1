import React, { useState, useEffect, useRef } from "react";
import { Container } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";

const sections = [
  { id: "basics", label: "Basics" },
  { id: "scoring", label: "Scoring" },
  { id: "chips", label: "Chips" },
  { id: "awards", label: "Awards" },
  { id: "faq", label: "FAQ" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Anchor Nav ──────────────────────────────────────────────────────────────

function AnchorNav({ activeId }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-[72px] z-40 bg-white/90 dark:bg-primary-800/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <Container size="4" className="px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-outfit whitespace-nowrap transition-colors ${
                activeId === s.id
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-light dark:text-teal-dark"
                  : "text-light-text-secondary dark:text-slate-400 hover:text-light-text dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Container>
    </nav>
  );
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden transition-colors duration-300">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 bg-white dark:bg-primary-800/60 hover:bg-slate-50 dark:hover:bg-primary-700/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-light-text dark:text-white font-outfit font-medium text-base">
          {question}
        </h4>
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M1 1L7 7L13 1"
            className="stroke-light-text-secondary dark:stroke-teal-dark"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 bg-white dark:bg-primary-800/60">
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Point Row ───────────────────────────────────────────────────────────────

function PointRow({ points, label, description, variant = "teal" }) {
  const colors = {
    teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-light dark:text-teal-dark",
    indigo:
      "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-light dark:text-indigo-dark",
    red: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
  };

  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm font-outfit ${colors[variant]}`}
      >
        {points}
      </div>
      <div>
        <h5 className="text-light-text dark:text-white font-outfit font-medium text-sm">
          {label}
        </h5>
        <p className="text-light-text-secondary dark:text-slate-400 font-outfit text-sm mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HowToPlay() {
  const [activeSection, setActiveSection] = useState("basics");
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-130px 0px -40% 0px", threshold: 0.1 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        sectionRefs.current[s.id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-primary-800 min-h-screen transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-36 md:pb-20 bg-white dark:bg-primary-800 transition-colors duration-300">
        <Container size="4" className="px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-4"
              variants={fadeUp}
            >
              Learn the game
            </motion.p>
            <motion.h1
              className="text-light-text dark:text-white text-4xl md:text-5xl lg:text-6xl font-bold font-dmSerif mb-6 leading-[1.1]"
              variants={fadeUp}
            >
              How to Play
            </motion.h1>
            <motion.p
              className="text-light-text-secondary dark:text-slate-300 font-outfit text-lg max-w-xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              Everything you need to know — from your first prediction to
              lifting the season trophy.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Anchor nav */}
      <AnchorNav activeId={activeSection} />

      {/* ── Basics ── */}
      <section
        id="basics"
        className="py-16 md:py-24 bg-white dark:bg-primary-800 transition-colors duration-300"
      >
        <Container size="4" className="px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div className="mb-12" variants={fadeUp}>
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3">
                The Fundamentals
              </p>
              <h2 className="font-dmSerif text-3xl md:text-4xl text-light-text dark:text-white">
                How It Works
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              {/* Game Structure */}
              <motion.div variants={fadeUp}>
                <h3 className="font-dmSerif text-xl text-light-text dark:text-white mb-6">
                  Game Structure
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      num: "1",
                      title: "Six Matches Per Gameweek",
                      desc: 'Predict results for matches involving the EPL\'s "Big Six" — Arsenal, Chelsea, Liverpool, Man City, Man United, and Spurs.',
                    },
                    {
                      num: "2",
                      title: "Submission Deadline",
                      desc: "Predictions lock 45 minutes before each match's kickoff.",
                    },
                    {
                      num: "3",
                      title: "Leagues & Standings",
                      desc: "Create or join private leagues and compete on the global leaderboard.",
                    },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-light dark:text-teal-dark font-bold text-sm font-outfit">
                          {item.num}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-light-text dark:text-white font-outfit font-medium text-sm">
                          {item.title}
                        </h5>
                        <p className="text-light-text-secondary dark:text-slate-400 font-outfit text-sm mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Making Predictions */}
              <motion.div variants={fadeUp}>
                <h3 className="font-dmSerif text-xl text-light-text dark:text-white mb-6">
                  Making Predictions
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      num: "1",
                      title: "Predict the Scoreline",
                      desc: "Enter the final score for each match (e.g. 2-1, 0-0).",
                    },
                    {
                      num: "2",
                      title: "Pick Goalscorers",
                      desc: "Select which players will score, including own goals.",
                    },
                    {
                      num: "3",
                      title: "Deploy Chips",
                      desc: "Apply special chips to maximise points on matches you're confident about.",
                    },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-light dark:text-indigo-dark font-bold text-sm font-outfit">
                          {item.num}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-light-text dark:text-white font-outfit font-medium text-sm">
                          {item.title}
                        </h5>
                        <p className="text-light-text-secondary dark:text-slate-400 font-outfit text-sm mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Scoring ── */}
      <section
        id="scoring"
        className="py-16 md:py-24 bg-slate-50 dark:bg-primary-700 transition-colors duration-300"
      >
        <Container size="4" className="px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div className="mb-12" variants={fadeUp}>
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3">
                Points Breakdown
              </p>
              <h2 className="font-dmSerif text-3xl md:text-4xl text-light-text dark:text-white">
                Scoring System
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              {/* Basic Points */}
              <motion.div
                className="bg-white dark:bg-primary-800/60 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-white/10"
                variants={fadeUp}
              >
                <h3 className="font-dmSerif text-xl text-light-text dark:text-white mb-6">
                  Match Points
                </h3>
                <div className="space-y-5">
                  <PointRow
                    points="5"
                    label="Correct winner"
                    description="Predict the right match winner."
                  />
                  <PointRow
                    points="7"
                    label="Correct draw"
                    description="Successfully predict a draw."
                  />
                  <PointRow
                    points="10"
                    label="Exact scoreline"
                    description="Nail the precise final score."
                  />
                  <PointRow
                    points="15"
                    label="Exact score + all scorers"
                    description="Correct score and every goalscorer."
                  />
                  <PointRow
                    points="2"
                    label="Correct goalscorer"
                    description="Per correctly predicted scorer."
                  />
                  <PointRow
                    points="-X"
                    label="Goal difference penalty"
                    description="If your predicted total goals are 3+ away from the actual total, you lose (difference - 2) points."
                    variant="red"
                  />
                </div>
              </motion.div>

              {/* Bonus Points */}
              <motion.div
                className="bg-white dark:bg-primary-800/60 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-white/10"
                variants={fadeUp}
              >
                <h3 className="font-dmSerif text-xl text-light-text dark:text-white mb-6">
                  Bonus Points
                </h3>
                <div className="space-y-5">
                  <PointRow
                    points="+5"
                    label="Defense++ clean sheet"
                    description="+5 bonus points per correctly predicted clean sheet when the Defense++ chip is active."
                    variant="indigo"
                  />
                </div>
              </motion.div>
            </div>

            {/* Example callout */}
            <motion.div
              className="mt-8 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-5"
              variants={fadeUp}
            >
              <h4 className="text-teal-light dark:text-teal-dark text-sm font-outfit font-semibold mb-2">
                Example
              </h4>
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm leading-relaxed">
                Predict Man United 2-1 Liverpool with Rashford and Fernandes
                scoring. Actual result: 2-1 with Rashford and Sancho. You earn
                10 (exact score) + 2 (Rashford) = <strong>12 points</strong>.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── Chips ── */}
      <section
        id="chips"
        className="py-16 md:py-24 bg-white dark:bg-primary-800 transition-colors duration-300"
      >
        <Container size="4" className="px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div className="mb-12" variants={fadeUp}>
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3">
                Strategic Power-Ups
              </p>
              <h2 className="font-dmSerif text-3xl md:text-4xl text-light-text dark:text-white mb-3">
                Playing Chips
              </h2>
              <p className="font-outfit text-base text-light-text-secondary dark:text-slate-300 max-w-2xl">
                Deploy chips to amplify your points at critical moments. You can
                use multiple chips per gameweek.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Double Down",
                  multiplier: "2x",
                  color: "teal",
                  availability: "Every gameweek",
                  desc: "Double all points from one selected match.",
                  tip: "Use on matches where you're most confident in your full prediction.",
                },
                {
                  name: "Wildcard",
                  multiplier: "3x",
                  color: "indigo",
                  availability: "7 GW cooldown",
                  desc: "Triple all points from one selected match.",
                  tip: "Stack with Derby Day multiplier for maximum effect.",
                },
                {
                  name: "Defense++",
                  multiplier: "Shield",
                  color: "blue",
                  availability: "5 GW cooldown",
                  desc: "Earn +5 bonus points per correctly predicted clean sheet across your predictions.",
                  tip: "Best when defensive teams face weaker attacks.",
                },
                {
                  name: "Scorer Focus",
                  multiplier: "Goals",
                  color: "emerald",
                  availability: "5 GW cooldown",
                  desc: "Double all goalscorer prediction points in one match.",
                  tip: "Best for high-scoring fixtures with in-form strikers.",
                },
                {
                  name: "All-In Week",
                  multiplier: "Full",
                  color: "red",
                  availability: "4 times per season",
                  desc: "Double the entire gameweek score — including deductions.",
                  tip: "High risk, high reward. Only use when confident across all matches.",
                },
              ].map((chip) => {
                const colorMap = {
                  teal: {
                    badge:
                      "bg-teal-50 dark:bg-teal-900/30 text-teal-light dark:text-teal-dark",
                    tip: "bg-teal-50 dark:bg-teal-900/20",
                  },
                  indigo: {
                    badge:
                      "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-light dark:text-indigo-dark",
                    tip: "bg-indigo-50 dark:bg-indigo-900/20",
                  },
                  blue: {
                    badge:
                      "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400",
                    tip: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  emerald: {
                    badge:
                      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-light dark:text-emerald-dark",
                    tip: "bg-emerald-50 dark:bg-emerald-900/20",
                  },
                  red: {
                    badge:
                      "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
                    tip: "bg-red-50 dark:bg-red-900/20",
                  },
                };
                const c = colorMap[chip.color];

                return (
                  <motion.div
                    key={chip.name}
                    className="bg-slate-50 dark:bg-primary-700/50 rounded-xl p-6 border border-slate-200 dark:border-white/10 transition-colors duration-300"
                    variants={fadeUp}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs font-outfit ${c.badge}`}
                      >
                        {chip.multiplier}
                      </div>
                      <div>
                        <h4 className="font-dmSerif text-lg text-light-text dark:text-white">
                          {chip.name}
                        </h4>
                        <p className="text-xs font-outfit text-light-text-secondary dark:text-slate-400">
                          {chip.availability}
                        </p>
                      </div>
                    </div>
                    <p className="font-outfit text-sm text-light-text-secondary dark:text-slate-300 mb-4 leading-relaxed">
                      {chip.desc}
                    </p>
                    <div className={`rounded-lg p-3 ${c.tip}`}>
                      <p className="font-outfit text-xs text-light-text-secondary dark:text-slate-300">
                        <span className="font-semibold">Tip:</span> {chip.tip}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Awards ── */}
      <section
        id="awards"
        className="py-16 md:py-24 bg-slate-50 dark:bg-primary-700 transition-colors duration-300"
      >
        <Container size="4" className="px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div className="mb-12" variants={fadeUp}>
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3">
                End-of-Season Recognition
              </p>
              <h2 className="font-dmSerif text-3xl md:text-4xl text-light-text dark:text-white">
                Seasonal Awards
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Prediction Champion",
                  emoji: "trophy",
                  color: "amber",
                  desc: "Highest total points across the entire season.",
                  detail:
                    "Earns a unique profile badge and Hall of Fame entry.",
                },
                {
                  title: "Oracle Award",
                  emoji: "crystal",
                  color: "indigo",
                  desc: "Most exact scoreline predictions.",
                  detail:
                    "Recognises uncanny accuracy in predicting precise results.",
                },
                {
                  title: "Goalscorer Guru",
                  emoji: "goal",
                  color: "emerald",
                  desc: "Most correct goalscorer predictions.",
                  detail:
                    "Celebrates deep knowledge of player form and tactics.",
                },
                {
                  title: "Monthly Stars",
                  emoji: "star",
                  color: "teal",
                  desc: "Top predictor each month.",
                  detail:
                    "Temporary profile badges and newsletter features.",
                },
              ].map((award) => {
                const gradients = {
                  amber:
                    "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10",
                  indigo:
                    "from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10",
                  emerald:
                    "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-900/10",
                  teal: "from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10",
                };
                const iconColors = {
                  amber: "text-amber-light dark:text-amber-dark",
                  indigo: "text-indigo-light dark:text-indigo-dark",
                  emerald: "text-emerald-light dark:text-emerald-dark",
                  teal: "text-teal-light dark:text-teal-dark",
                };
                const emojiMap = {
                  trophy: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721"
                      />
                    </svg>
                  ),
                  crystal: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                      />
                    </svg>
                  ),
                  goal: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                      />
                    </svg>
                  ),
                  star: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  ),
                };

                return (
                  <motion.div
                    key={award.title}
                    className={`bg-gradient-to-br ${gradients[award.color]} rounded-xl p-6 border border-slate-200 dark:border-white/10`}
                    variants={fadeUp}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={iconColors[award.color]}>
                        {emojiMap[award.emoji]}
                      </div>
                      <h4 className="font-dmSerif text-lg text-light-text dark:text-white">
                        {award.title}
                      </h4>
                    </div>
                    <p className="font-outfit text-sm text-light-text dark:text-slate-200 font-medium mb-1">
                      {award.desc}
                    </p>
                    <p className="font-outfit text-sm text-light-text-secondary dark:text-slate-400">
                      {award.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="py-16 md:py-24 bg-white dark:bg-primary-800 transition-colors duration-300"
      >
        <Container size="4" className="px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div className="mb-12" variants={fadeUp}>
              <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-3">
                Common Questions
              </p>
              <h2 className="font-dmSerif text-3xl md:text-4xl text-light-text dark:text-white">
                FAQ
              </h2>
            </motion.div>

            <motion.div className="max-w-3xl space-y-3" variants={stagger}>
              {[
                {
                  q: 'What teams are the "Big Six"?',
                  a: "Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, and Tottenham Hotspur. Each gameweek features predictions for matches involving these teams.",
                },
                {
                  q: "What happens if a match is postponed?",
                  a: "Predictions for postponed matches are voided with no points awarded. You'll submit fresh predictions when the match is rescheduled.",
                },
                {
                  q: "Can I change my predictions after submitting?",
                  a: "Yes — you can edit predictions any time before the 45-minute deadline. After that, they're locked.",
                },
                {
                  q: "Can I use multiple chips in one gameweek?",
                  a: "Yes. For example, Double Down on one match and Scorer Focus on another. Cooldown periods for each chip start simultaneously.",
                },
                {
                  q: "How are tiebreakers decided?",
                  a: "If points are tied: 1) Most exact score predictions, 2) Most correct goalscorer predictions, 3) Fewest negative points accumulated.",
                },
                {
                  q: "How many leagues can I join?",
                  a: "Up to 10 private leagues, and you can create up to 3 of your own.",
                },
              ].map((item) => (
                <motion.div key={item.q} variants={fadeUp}>
                  <FaqItem question={item.q} answer={item.a} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-primary-700 transition-colors duration-300">
        <Container size="4" className="px-6">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-dmSerif text-2xl md:text-3xl text-light-text dark:text-white mb-4"
              variants={fadeUp}
            >
              Ready to start predicting?
            </motion.h2>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              variants={fadeUp}
            >
              <Link to="/signup">
                <motion.button
                  className="bg-teal-light dark:bg-teal-dark text-white dark:text-primary-800 px-6 py-2.5 rounded-lg font-outfit font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign Up Free
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="border border-slate-300 dark:border-white/20 bg-transparent text-light-text dark:text-white px-6 py-2.5 rounded-lg font-outfit font-medium text-sm cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
