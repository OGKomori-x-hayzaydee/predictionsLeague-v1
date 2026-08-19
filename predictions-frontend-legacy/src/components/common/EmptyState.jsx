import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({ message, submessage }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-8 text-center"
  >
    <p className="text-white/70 text-lg mb-2 font-dmSerif">
      {message || "No predictions found"}
    </p>
    <p className="text-white/50 text-sm font-outfit">
      {submessage || "Try adjusting your filters"}
    </p>
  </motion.div>
);

export default EmptyState;