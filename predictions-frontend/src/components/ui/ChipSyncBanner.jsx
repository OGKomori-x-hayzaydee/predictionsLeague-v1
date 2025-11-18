import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useTheme } from '../../hooks/useTheme';
import { getThemeStyles } from '../../utils/themeUtils';

/**
 * ChipSyncBanner - Notification for predictions missing active gameweek chips
 * Appears at top of PredictionsView when sync is needed
 */
export default function ChipSyncBanner({ 
  validation, 
  onAutoSync, 
  onDismiss,
  syncing = false 
}) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  if (!validation || !validation.shouldShow) {
    return null;
  }
  
  const { count, summary, predictions, activeChipNames } = validation;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`mb-6 rounded-xl border overflow-hidden ${getThemeStyles(theme, {
          dark: 'bg-blue-900/20 border-blue-500/30',
          light: 'bg-blue-50 border-blue-200'
        })}`}
      >
        {/* Main Banner */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getThemeStyles(theme, {
              dark: 'bg-blue-500/20 border border-blue-500/30',
              light: 'bg-blue-100 border border-blue-300'
            })}`}>
              {syncing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h4 className={`font-semibold font-outfit ${getThemeStyles(theme, {
                  dark: 'text-blue-300',
                  light: 'text-blue-700'
                })}`}>
                  Chip Sync Available
                </h4>
                
                {/* Close button */}
                {!syncing && (
                  <button
                    onClick={onDismiss}
                    className={`p-1 rounded hover:bg-blue-500/10 transition-colors ${getThemeStyles(theme, {
                      dark: 'text-blue-400 hover:text-blue-300',
                      light: 'text-blue-600 hover:text-blue-700'
                    })}`}
                    title="Dismiss for this session"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className={`text-sm font-outfit ${getThemeStyles(theme, {
                dark: 'text-blue-200',
                light: 'text-blue-600'
              })}`}>
                {summary}
              </p>
              
              {/* Affected chips badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {activeChipNames.map(chipName => (
                  <span
                    key={chipName}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getThemeStyles(theme, {
                      dark: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                      light: 'bg-blue-100 text-blue-700 border border-blue-300'
                    })}`}
                  >
                    {chipName}
                  </span>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onClick={onAutoSync}
                  disabled={syncing}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-colors ${
                    syncing
                      ? getThemeStyles(theme, {
                          dark: 'bg-blue-500/20 text-blue-400 cursor-wait',
                          light: 'bg-blue-200 text-blue-600 cursor-wait'
                        })
                      : getThemeStyles(theme, {
                          dark: 'bg-blue-600 hover:bg-blue-700 text-white',
                          light: 'bg-blue-600 hover:bg-blue-700 text-white'
                        })
                  }`}
                >
                  {syncing ? 'Syncing...' : `Auto-sync ${count} prediction${count === 1 ? '' : 's'}`}
                </button>
                
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-colors ${getThemeStyles(theme, {
                    dark: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
                    light: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  })}`}
                >
                  {expanded ? 'Hide details' : 'Show details'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`border-t ${getThemeStyles(theme, {
                dark: 'border-blue-500/20 bg-blue-900/10',
                light: 'border-blue-200 bg-blue-50/50'
              })}`}
            >
              <div className="p-4">
                <h5 className={`text-sm font-semibold mb-3 font-outfit ${getThemeStyles(theme, {
                  dark: 'text-blue-300',
                  light: 'text-blue-700'
                })}`}>
                  Affected Predictions
                </h5>
                
                <div className="space-y-2">
                  {predictions.map((pred, index) => (
                    <div
                      key={pred.predictionId}
                      className={`flex items-center justify-between p-2 rounded-lg ${getThemeStyles(theme, {
                        dark: 'bg-slate-800/50',
                        light: 'bg-white'
                      })}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getThemeStyles(theme, {
                          dark: 'text-slate-400',
                          light: 'text-slate-600'
                        })}`}>
                          {index + 1}.
                        </span>
                        <span className={`text-sm font-outfit ${getThemeStyles(theme, {
                          dark: 'text-slate-200',
                          light: 'text-slate-800'
                        })}`}>
                          {pred.fixture}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {pred.missingChipNames.map(chipName => (
                          <span
                            key={chipName}
                            className={`text-2xs px-2 py-0.5 rounded font-medium ${getThemeStyles(theme, {
                              dark: 'bg-blue-500/20 text-blue-300',
                              light: 'bg-blue-100 text-blue-700'
                            })}`}
                          >
                            +{chipName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
