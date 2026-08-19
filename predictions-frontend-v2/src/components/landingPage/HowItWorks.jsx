import React from "react";
import { Box, Container } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "sign up",
      description:
        "create your account and set up your profile with your favorite team and preferences.",
    },
    {
      number: "02",
      title: "make predictions",
      description:
        "predict the outcomes of matches involving the 'Big Six' teams, including scorelines and goalscorers.",
    },
    {
      number: "03",
      title: "use chips strategically",
      description:
        "deploy special chips like Double Down and Wildcard at the right moments to maximize your points.",
    },
    {
      number: "04",
      title: "follow live updates",
      description:
        "watch your predictions come to life with real-time updates during matches.",
    },
    {
      number: "05",
      title: "compete in leagues",
      description:
        "join public leagues or create private ones to compete with friends and fellow fans.",
    },
    {
      number: "06",
      title: "win seasonal awards",
      description:
        "earn recognition with end-of-season awards based on your prediction performance.",
    },
  ];

  return (
    <Box className="bg-gradient-to-b from-primary-600 to-primary-500 py-24">
      <Container size="3">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            how it works
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-teal-400 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.p
            className="text-white font-outfit text-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            getting started with predictionsLeague is easy. follow these simple
            steps to begin your prediction journey.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 50,
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex flex-col h-full">
                <motion.div
                  className="w-14 h-14 rounded-full bg-teal-900/50 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-teal-300 text-2xl font-bold font-dmSerif ">
                    {step.number}
                  </span>
                </motion.div>
                <h4 className="text-lg font-bold text-teal-200 font-dmSerif mb-3">
                  {step.title}
                </h4>
                <p className="text-white/80 font-outfit text-base">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/signup">
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              delay: 1.0,
            }}
            viewport={{ once: true }}
          >
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              start predicting
            </button>
          </motion.div>
        </Link>
      </Container>
    </Box>
  );
}