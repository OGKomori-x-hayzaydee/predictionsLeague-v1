import React from "react";
import { Box, Container, Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <Box className="bg-primary-500 py-20">
      <Container size="3">
        <motion.div
          className="max-w-3xl mx-auto text-center bg-primary-500/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-primary-400/20 hover:border-teal-500/30 transition-all duration-300 p-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
          }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-6"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ready to test your prediction skills?
          </motion.h2>

          <motion.div 
            className="w-24 h-1 bg-teal-400 mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          />

          <motion.p
            className="text-white/80 font-outfit text-lg mb-12 mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            join thousands of football fans in the ultimate Premier League prediction challenge. sign up today and start making your predictions for the upcoming matches.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="signupBtn px-8 py-6 text-white text-lg font-bold" color="teal" variant="solid" size="3">
                  sign up now
                </Button>
              </motion.div>
            </Link>

            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="loginBtn px-8 py-6 text-white text-lg" size="3" variant="outline" color="teal">
                  log in
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            className="mt-8 text-teal-300/70 text-sm font-outfit"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p>join over 10,000 football fans already predicting</p>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}