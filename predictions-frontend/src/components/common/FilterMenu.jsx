import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MixerHorizontalIcon, CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

const FilterMenu = ({ options, values, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
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
  
  const handleFilterChange = (category, value) => {
    onChange({
      ...values,
      [category]: value
    });
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md flex items-center text-white/80 text-sm transition-colors"
      >
        <MixerHorizontalIcon className="w-4 h-4 mr-1.5" />
        Filter
        <ChevronDownIcon className="ml-1.5 w-3.5 h-3.5" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-10 bg-slate-800 border border-slate-600/40 rounded-lg shadow-xl min-w-[220px] py-2"
          >
            {Object.entries(options).map(([category, categoryOptions]) => (
              <div key={category} className="px-3 py-2">
                <div className="text-white/60 text-xs uppercase mb-2 font-semibold">
                  {category.replace('-', ' ')}
                </div>
                <div className="space-y-1">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange(category, option.value)}
                      className="w-full flex items-center text-left px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-sm text-white/90"
                    >
                      <div className={`w-4 h-4 mr-2 rounded flex items-center justify-center ${
                        values[category] === option.value 
                          ? 'bg-indigo-600' 
                          : 'bg-slate-700 border border-slate-500/50'
                      }`}>
                        {values[category] === option.value && (
                          <CheckIcon className="w-3 h-3 text-white" />
                        )}
                      </div>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterMenu;