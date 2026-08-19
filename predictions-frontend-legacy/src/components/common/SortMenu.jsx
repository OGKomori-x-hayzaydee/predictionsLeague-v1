import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretSortIcon, CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

const SortMenu = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Find the current selected option label
  const selectedOption = options.find(option => option.value === value);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md flex items-center text-white/80 text-sm transition-colors min-w-[120px]"
      >
        <CaretSortIcon className="w-4 h-4 mr-1.5" />
        {selectedOption?.label || "Sort"}
        <ChevronDownIcon className="ml-1.5 w-3.5 h-3.5" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-10 bg-slate-800 border border-slate-600/40 rounded-lg shadow-xl min-w-[180px] py-1.5"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center text-left px-3 py-2 hover:bg-slate-700/50 text-sm text-white/90"
              >
                <span className="w-4 mr-2">
                  {value === option.value && (
                    <CheckIcon className="w-4 h-4 text-indigo-400" />
                  )}
                </span>
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortMenu;