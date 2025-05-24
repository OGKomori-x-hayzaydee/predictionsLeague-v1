import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Container, Section } from "@radix-ui/themes";

// Import from centralized data file
import { howItWorksSteps } from "../../data/sampleData";

export default function HowItWorks() {
  return (
    <Box className="relative overflow-hidden">
      <Container size="4">
        <Section size="3" className="pb-24">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              how it works
            </motion.h2>
            <motion.p
              className="text-white/70 max-w-2xl mx-auto font-outfit"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              get started in just a few simple steps and join thousands of
              football fans in the ultimate prediction game
            </motion.p>
          </motion.div>

          {/* Step-by-step guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
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
        </Section>
      </Container>
    </Box>
  );
}
