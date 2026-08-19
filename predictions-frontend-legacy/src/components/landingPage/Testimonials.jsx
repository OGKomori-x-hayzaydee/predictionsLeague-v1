import React from "react";
import { Container } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { StarFilledIcon } from "@radix-ui/react-icons";

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

const testimonials = [
  {
    quote:
      "The chip strategy element makes this so much more than a basic prediction game. Knowing when to play your Double Down or Wildcard adds a whole new layer of excitement to match week.",
    name: "James D.",
    team: "Arsenal supporter",
    initials: "JD",
    rating: 5,
  },
  {
    quote:
      "My mates and I have a private league running and it's genuinely the most fun we've had with football predictions. The banter when someone's bold prediction actually comes off is priceless.",
    name: "Sarah M.",
    team: "Liverpool supporter",
    initials: "SM",
    rating: 5,
  },
  {
    quote:
      "Love the Big Six focus — it means every prediction actually matters. Instead of guessing 10 random matches, you're properly analysing the games that everyone cares about most.",
    name: "Chris T.",
    team: "Chelsea supporter",
    initials: "CT",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50 dark:bg-primary-700 transition-colors duration-300">
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
            What players say
          </p>
          <h2 className="font-dmSerif text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-white mb-4">
            Loved by football fans
          </h2>
          <p className="font-outfit text-base md:text-lg text-light-text-secondary dark:text-slate-300 max-w-2xl mx-auto">
            Thousands of fans trust predictionsLeague for their weekly
            prediction fix.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              className="bg-white dark:bg-primary-800/60 rounded-xl p-8 border border-slate-200 dark:border-white/10 transition-colors duration-300"
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarFilledIcon
                    key={i}
                    className="w-4 h-4 text-amber-light dark:text-amber-dark"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-outfit text-base leading-relaxed text-light-text-secondary dark:text-slate-300 mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-light to-indigo-light dark:from-teal-dark dark:to-indigo-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-white dark:text-primary-800 font-bold text-sm font-outfit">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-outfit font-semibold text-sm text-light-text dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="font-outfit text-xs text-light-text-secondary dark:text-slate-400">
                    {testimonial.team}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
