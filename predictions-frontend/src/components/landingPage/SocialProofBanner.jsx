import React, { useEffect, useRef } from "react";
import { Container } from "@radix-ui/themes";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";

function AnimatedStat({ value, suffix = "", label, delay = 0 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000) {
      return (latest / 1000).toFixed(1) + "K";
    }
    return Math.round(latest).toLocaleString();
  });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      animate(count, value, {
        duration: 2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
    }
  }, [inView, count, value, delay]);

  return (
    <div ref={ref} className="text-center px-6 py-4 md:py-0">
      <div className="flex items-baseline justify-center gap-1">
        <motion.span className="text-3xl md:text-4xl font-bold font-dmSerif text-light-text dark:text-white">
          {rounded}
        </motion.span>
        {suffix && (
          <span className="text-2xl md:text-3xl font-bold font-dmSerif text-teal-light dark:text-teal-dark">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-xs uppercase tracking-[0.15em] font-outfit text-light-text-secondary dark:text-slate-400 mt-2">
        {label}
      </p>
    </div>
  );
}

const stats = [
  { value: 10000, suffix: "+", label: "Active Players" },
  { value: 250000, suffix: "+", label: "Predictions Made" },
  { value: 1200, suffix: "+", label: "Leagues Created" },
  { value: 34, suffix: "%", label: "Avg Accuracy" },
];

export default function SocialProofBanner() {
  return (
    <section className="bg-slate-50 dark:bg-primary-700 border-y border-slate-100 dark:border-white/5 transition-colors duration-300">
      <Container size="4" className="px-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 py-12 md:py-16 md:divide-x md:divide-slate-200 md:dark:divide-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.15}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
