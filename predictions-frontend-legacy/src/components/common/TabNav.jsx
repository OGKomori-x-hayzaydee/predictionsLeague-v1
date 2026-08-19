import { motion } from "framer-motion";

const TabNav = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-slate-600/30 mb-5">
      <div className="flex font-outfit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-2 px-4 relative ${
              activeTab === tab.id 
                ? "text-teal-200" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                layoutId="tabIndicator"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNav;