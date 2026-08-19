import React from "react";
import { Container, Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Cta() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-white dark:from-primary-600 dark:via-indigo-dark/5 dark:to-primary-700 transition-colors duration-300">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-teal-light/5 dark:bg-teal-dark/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full bg-indigo-light/5 dark:bg-indigo-dark/5 blur-3xl" />
      </div>

      <Container size="4" className="px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            className="font-dmSerif text-4xl md:text-5xl lg:text-6xl text-light-text dark:text-white mb-6 leading-[1.1]"
            variants={fadeUp}
          >
            Ready to prove your football knowledge?
          </motion.h2>

          <motion.p
            className="font-outfit text-lg md:text-xl text-light-text-secondary dark:text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed"
            variants={fadeUp}
          >
            Join predictionsLeague and start competing with fans across the
            globe. Free to play, impossible to put down.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
            <Link to="/login">
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
                  Log In
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
