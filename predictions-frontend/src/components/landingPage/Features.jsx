import React from "react";
import { Container } from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  StarIcon,
  LightningBoltIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

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

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const features = [
  {
    overline: "Premier League",
    title: "Big Six Focus",
    description:
      "Concentrate on the most exciting matches featuring Manchester United, Manchester City, Liverpool, Chelsea, Arsenal, and Tottenham. Earn points for correct winners, exact scores, goalscorers, and special events like clean sheets and comebacks.",
    icon: <StarIcon className="w-8 h-8" />,
    accentColor: "teal",
    bullets: [
      "Multi-dimensional scoring system",
      "Predict scorelines & goalscorers",
      "Bonus points for clean sheets & comebacks",
    ],
  },
  {
    overline: "Gameplay",
    title: "Strategic Chips",
    description:
      "Deploy special chips like Double Down, Wildcard, and All-In Week to maximize your points at crucial moments throughout the season. Compete for prestigious end-of-season awards.",
    icon: <LightningBoltIcon className="w-8 h-8" />,
    accentColor: "indigo",
    bullets: [
      "Double Down & Wildcard chips",
      "All-In Week for maximum risk & reward",
      "Seasonal awards & recognition",
    ],
  },
  {
    overline: "Community",
    title: "Compete with Friends",
    description:
      "Create private leagues to compete with friends, family, or colleagues in your own exclusive competition. Experience the excitement of live score updates and watch your points change as matches unfold.",
    icon: <PersonIcon className="w-8 h-8" />,
    accentColor: "emerald",
    bullets: [
      "Private & public leagues",
      "Real-time score updates",
      "Live leaderboard tracking",
    ],
  },
];

const accentStyles = {
  teal: {
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
    iconText: "text-teal-light dark:text-teal-dark",
    overline: "text-teal-light dark:text-teal-dark",
    bullet: "bg-teal-light dark:bg-teal-dark",
  },
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
    iconText: "text-indigo-light dark:text-indigo-dark",
    overline: "text-indigo-light dark:text-indigo-dark",
    bullet: "bg-indigo-light dark:bg-indigo-dark",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconText: "text-emerald-light dark:text-emerald-dark",
    overline: "text-emerald-light dark:text-emerald-dark",
    bullet: "bg-emerald-light dark:bg-emerald-dark",
  },
};

export default function Features() {
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
            Features
          </p>
          <h2 className="font-dmSerif text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-white mb-4">
            Everything you need to dominate
          </h2>
          <p className="font-outfit text-base md:text-lg text-light-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            Our unique approach to football predictions makes the game more
            engaging, strategic, and social.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;
            const accent = accentStyles[feature.accentColor];

            return (
              <div
                key={feature.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  isReversed ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Visual side */}
                <motion.div
                  className={`${isReversed ? "lg:order-2" : "lg:order-1"}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={isReversed ? slideInRight : slideInLeft}
                >
                  <div
                    className={`relative aspect-[4/3] rounded-2xl ${accent.iconBg} flex items-center justify-center overflow-hidden`}
                  >
                    {/* Abstract geometric decoration */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-6 left-6 w-20 h-20 rounded-full border-2 border-current" />
                      <div className="absolute bottom-8 right-8 w-32 h-32 rounded-xl border-2 border-current rotate-12" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg border-2 border-current -rotate-6" />
                    </div>
                    <div className={`${accent.iconText} relative`}>
                      <div className="w-20 h-20 flex items-center justify-center">
                        <div className="scale-[2.5]">{feature.icon}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Text side */}
                <motion.div
                  className={`${isReversed ? "lg:order-1" : "lg:order-2"}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={isReversed ? slideInLeft : slideInRight}
                >
                  <p
                    className={`font-outfit text-xs uppercase tracking-[0.2em] ${accent.overline} mb-3`}
                  >
                    {feature.overline}
                  </p>
                  <h3 className="font-dmSerif text-2xl md:text-3xl text-light-text dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="font-outfit text-base md:text-lg text-light-text-secondary dark:text-slate-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-3 font-outfit text-sm text-light-text dark:text-slate-200"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${accent.bullet} flex-shrink-0`}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
