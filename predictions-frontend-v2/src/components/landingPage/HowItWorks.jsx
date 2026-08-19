import React from "react";
import { Container } from "@radix-ui/themes";
import { motion } from "framer-motion";

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
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your free account in seconds. Set up your profile with your favourite team and start making predictions right away.",
  },
  {
    number: "02",
    title: "Make Predictions",
    description:
      "Predict scores, goalscorers, and match outcomes for Big Six fixtures. Deploy strategic chips to maximise your points.",
  },
  {
    number: "03",
    title: "Climb the Ranks",
    description:
      "Compete in public and private leagues. Track your progress on the leaderboard and earn end-of-season awards.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white dark:bg-primary-800 transition-colors duration-300">
      <Container size="4" className="px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <p className="font-outfit text-xs uppercase tracking-[0.2em] text-teal-light dark:text-teal-dark mb-4">
            Getting Started
          </p>
          <h2 className="font-dmSerif text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-white mb-4">
            Three simple steps
          </h2>
          <p className="font-outfit text-base md:text-lg text-light-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            Getting started with predictionsLeague is easy. Begin your
            prediction journey in minutes.
          </p>
        </motion.div>

        {/* Steps with timeline */}
        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {/* Desktop connecting line */}
          <motion.div
            className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-[2px]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.5,
            }}
            viewport={{ once: true }}
            style={{ transformOrigin: "left" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-teal-light via-indigo-light to-emerald-light dark:from-teal-dark dark:via-indigo-dark dark:to-emerald-dark opacity-30" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative text-center"
                variants={fadeUp}
              >
                {/* Mobile connecting line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute left-1/2 top-24 w-[2px] h-12 -translate-x-1/2">
                    <div className="w-full h-full bg-gradient-to-b from-teal-light/30 to-indigo-light/30 dark:from-teal-dark/30 dark:to-indigo-dark/30" />
                  </div>
                )}

                {/* Number circle */}
                <motion.div
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-light to-indigo-light dark:from-teal-dark dark:to-indigo-dark flex items-center justify-center mb-8 relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white dark:text-primary-800 text-3xl font-bold font-dmSerif">
                    {step.number}
                  </span>
                </motion.div>

                {/* Content */}
                <h3 className="font-dmSerif text-xl md:text-2xl text-light-text dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-outfit text-base text-light-text-secondary dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
