import React from "react";
import { motion } from "framer-motion";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";

const StatCard = ({ title, value, subtitle, badge, icon, trend }) => {
  return (    <motion.div 
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 overflow-hidden group"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">        {/* Header with icon and badge */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-1.5 bg-teal-500/10 rounded-lg border border-teal-500/20">
                <div className="text-teal-400">
                  {icon}
                </div>
              </div>
            )}
            <h3 className="text-slate-300 font-outfit font-medium text-xs">
              {title}
            </h3>
          </div>
          
          {badge && (
            badge.icon ? (
              <span className="text-white/60 text-xs font-medium py-1 px-2 rounded-full bg-slate-700/30">
                {badge.icon}
              </span>
            ) : (
              <span className={`
                ${badge.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : badge.type === 'info'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                } 
                text-xs font-medium py-1 px-3 rounded-full border
              `}>
                {badge.text}
              </span>
            )
          )}
        </div>        {/* Value and trend */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <p className="text-3xl font-bold text-white font-dmSerif">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
              trend.direction === 'up' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {trend.direction === 'up' ? (
                <DoubleArrowUpIcon className="w-2.5 h-2.5" />
              ) : (
                <DoubleArrowDownIcon className="w-2.5 h-2.5" />
              )}
              <span className="text-xs font-medium">{trend.value}</span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        <div className="text-slate-400 text-xs font-outfit">
          {subtitle}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;