import React, { useEffect, useRef } from "react";
import { Box, Container, Section, Button } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "@radix-ui/react-icons";

export default function HeroSection() {
  return (
    <Box className="relative overflow-hidden bg-primary-500">
      {/* Background elements with 1s delay */}
      <AnimatePresence>
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, 15, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-700/20 blur-3xl"
            animate={{
              x: [0, -20, 20, 0],
              y: [0, 20, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Container size="" className="min-h-screen relative z-10 bg-transparent">
        <Section className="heroSection flex items-center justify-center">
          <motion.div
            className="heroContent text-center px-4 mx-auto max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-2 inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="bg-teal-700/30 text-teal-300 dark:text-teal-700 text-sm font-medium py-1 px-3 rounded-full font-outfit">
                <StarIcon className="inline-block mr-1" />
                2025/26 Season Coming Soon
              </span>
            </motion.div>

            <motion.h1
              className="text-teal-100 text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-dmSerif"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              welcome to{" "}
              <motion.span
                className="text-teal-300 relative inline-block"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  textShadow: [
                    "0 0 0px rgba(94, 234, 212, 0)",
                    "0 0 15px rgba(94, 234, 212, 0.5)",
                    "0 0 0px rgba(94, 234, 212, 0)",
                  ],
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                  textShadow: {
                    repeat: Infinity,
                    duration: 2.5,
                    repeatType: "reverse",
                  },
                }}
              >
                predictionsLeague
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-white font-outfit mb-8 w-full md:w-4/5 lg:w-3/4 mx-auto text-lg "
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              join the ultimate Premier League prediction game focused on the
              'Big Six' teams. predict match outcomes, goalscorers, and compete
              with friends
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="getStarted px-6 py-2 text-white text-lg font-bold w-full sm:w-auto"
                    color="teal"
                    variant="solid"
                    size="4"
                  >
                    get started
                  </Button>
                </motion.div>
              </Link>
              <Link to="/howToPlay">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="howItWorks px-6 py-2 text-white text-lg w-full sm:w-auto"
                    variant="outline"
                    color="teal"
                    size="4"
                  >
                    how to play
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social proof and urgency element */}
            <motion.div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-teal-700 border-2 border-primary-500 flex items-center justify-center text-xs text-white font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-primary-500 flex items-center justify-center text-xs text-white font-medium">
                  +
                </div>
              </div>
              <p className="text-teal-200 text-sm font-outfit">
                <span className="font-bold">843 predictions</span> made in the
                last 24 hours
              </p>
            </motion.div>
          </motion.div>
        </Section>
      </Container>
    </Box>
  );
}
