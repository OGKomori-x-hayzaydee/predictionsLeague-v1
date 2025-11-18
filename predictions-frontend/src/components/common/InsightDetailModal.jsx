import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoCircledIcon, Cross2Icon } from '@radix-ui/react-icons';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * Modal to show detailed insights explanation
 */
const InsightDetailModal = ({ insight, isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  if (!insight || !isOpen) return null;

  const getInsightTips = (insightType) => {
    const tips = {
      'home_away_pattern': [
        'Consider analyzing why you\'re better at home/away predictions',
        'Look for patterns in team travel fatigue or home crowd advantages',
        'Use this strength when making future predictions'
      ],
      'team_specialist': [
        'You have deep knowledge of this team\'s playing style',
        'Consider following their transfer news and tactical changes',
        'Your expertise here could be valuable in league competitions'
      ],
      'timing_pattern': [
        'Weekend matches often have different dynamics than weekday games',
        'Player rotation and fatigue levels can vary by day',
        'Consider team schedules when making predictions'
      ],
      'clutch_performer': [
        'Big matches often have unique pressure dynamics',
        'Your understanding of high-stakes football is exceptional',
        'Use this skill in knockout competitions and title deciders'
      ],
      'underdog_expert': [
        'You spot value in matches others might overlook',
        'Smaller teams often play with different motivations',
        'This skill is valuable for finding betting value'
      ],
      'bold_predictor': [
        'Your confident predictions show good risk assessment',
        'High-margin predictions require strong conviction',
        'Balance bold calls with safer predictions for consistency'
      ],
      'safe_predictor': [
        'Consistent accuracy is the foundation of good prediction',
        'Your conservative approach minimizes big losses',
        'Consider mixing in some higher-risk, higher-reward predictions'
      ]
    };
    
    return tips[insightType] || [
      'Keep analyzing your prediction patterns',
      'Consistency is key to long-term success',
      'Use insights to improve your prediction strategy'
    ];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          } rounded-xl border p-3 sm:p-6 max-w-[90vw] sm:max-w-md w-full shadow-xl text-sm sm:text-base`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <InfoCircledIcon className={`w-5 h-5 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              } font-semibold text-lg font-outfit`}>
                Insight Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>

          {/* Insight Summary */}
          <div className={`${
            theme === 'dark' ? 'bg-slate-700/30' : 'bg-slate-50'
          } rounded-lg p-4 mb-4`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              } font-medium font-outfit`}>
                {insight.title}
              </h4>
              <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {insight.value}
              </span>
            </div>
            <p className={`${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            } text-sm`}>
              {insight.description}
            </p>
          </div>

          {/* Tips & Recommendations */}
          <div>
            <h4 className={`${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            } font-medium font-outfit mb-3`}>
              Tips to leverage this insight:
            </h4>
            <ul className="space-y-2">
              {getInsightTips(insight.id).map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                    theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                  } flex-shrink-0`} />
                  <span className={`${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  } text-sm`}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InsightDetailModal;