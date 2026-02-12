import React from "react";
import { Container, Button } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-primary-800 overflow-hidden transition-colors duration-300">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white dark:from-primary-700/40 dark:via-primary-800 dark:to-primary-800" />

      <Container size="4" className="relative z-10 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          {/* Season badge */}
          <motion.div className="mb-8" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-light dark:text-teal-dark text-sm font-medium py-2 px-4 rounded-full font-outfit border border-teal-200 dark:border-teal-800/50">
              <span className="w-2 h-2 rounded-full bg-teal-light dark:bg-teal-dark animate-pulse" />
              2025/26 Season
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-light-text dark:text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-dmSerif mb-8 leading-[1.05]"
            variants={fadeUp}
          >
            Welcome to{" "}
            <span className="text-teal-light dark:text-teal-dark">
              predictionsLeague
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-light-text-secondary dark:text-slate-300 font-outfit text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            variants={fadeUp}
          >
            The ultimate Premier League prediction game focused on the Big Six.
            Predict match outcomes, deploy strategic chips, and compete with
            friends for glory.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeUp}
          >
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className="bg-teal-light dark:bg-teal-dark text-white dark:text-primary-800 px-8 py-3 text-base font-semibold font-outfit w-full sm:w-auto cursor-pointer"
                  size="4"
                >
                  Get Started
                </Button>
              </motion.div>
            </Link>
            <Link to="/howToPlay">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className="border border-slate-300 dark:border-white/20 bg-transparent text-light-text dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 px-8 py-3 text-base font-outfit w-full sm:w-auto cursor-pointer transition-colors"
                  size="4"
                  variant="outline"
                >
                  How to Play
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
