import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const BackButton = ({ onClick, text }) => {
  return (
    <motion.button 
      whileHover={{ x: -3 }}
      onClick={onClick} 
      className="flex items-center text-white/70 hover:text-white transition-colors"
    >
      <ArrowLeftIcon className="mr-1.5 w-4 h-4" />
      {text}
    </motion.button>
  );
};

export default BackButton;