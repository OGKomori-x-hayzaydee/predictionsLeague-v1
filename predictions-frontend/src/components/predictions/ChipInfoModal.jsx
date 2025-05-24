import { motion } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";

const ChipInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg z-50 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-b from-primary-700 to-primary-800 border border-primary-400/20 rounded-lg p-5 max-w-3xl w-full font-outfit max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-primary-600/30 pb-3">
          <h3 className="text-teal-100 text-2xl font-dmSerif">
            Power Up Your Predictions
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-primary-600/20 transition-colors"
          >
            <Cross2Icon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-white/80 mb-6">
          Use strategic chips to maximize your points and gain an edge over your
          competitors
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Double Down Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-teal-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-teal-300 text-2xl font-bold">2x</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  Double Down
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Available every gameweek
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Double all points earned from one selected match.
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Best used on matches where you have high confidence in your
                prediction, especially if you've predicted goalscorers
                correctly.
              </p>
            </div>
          </div>

          {/* Wildcard Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-purple-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-300 text-2xl font-bold">3x</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  Wildcard
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Cooldown: 7 gameweeks between uses
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Triple all points earned from one selected match.
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Save this for matches where you're extremely confident, or for
                derby matches where the points multiplier is already in effect.
              </p>
            </div>
          </div>

          {/* Perfect Defense Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-blue-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-300 text-2xl">🛡️</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  Defense++
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Cooldown: 5 gameweeks between uses
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Earn 10 bonus points if you correctly predict clean sheets across
              all matches where you predicted them.
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Best used when several defensive teams are playing against
                weaker attacking sides.
              </p>
            </div>
          </div>

          {/* Scorer Focus Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-emerald-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-emerald-300 text-2xl">⚽</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  Scorer Focus
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Cooldown: 3 gameweeks between uses
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Doubles all points from goalscorer predictions in one match.
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Best used in high-scoring matches where you're confident about
                multiple goalscorers.
              </p>
            </div>
          </div>

          {/* Opportunist Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-yellow-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-300 text-2xl">🎭</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  Opportunist
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Limited Use: Available twice per season
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Change all six predictions up to 30 minutes before the first
              kickoff.
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Use when late team news significantly impacts your predictions,
                such as key players being injured or rested.{" "}
              </p>
            </div>
          </div>

          {/* All-In Week Chip */}
          <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20">
            <div className="mb-3 flex items-center">
              <div className="h-10 w-10 bg-red-700/40 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-300 text-2xl">🎯</span>
              </div>
              <div>
                <h4 className="text-teal-200 text-2xl font-dmSerif">
                  All-In Week
                </h4>
                <div className="text-teal-300/70 text-xs">
                  Limited use: Available twice per season
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-3">
              Doubles the entire gameweek score (including deductions).
            </p>

            <div className="bg-teal-900/30 rounded-md p-3">
              <h5 className="text-teal-200 text-xs font-medium mb-1">
                Strategy Tip:
              </h5>
              <p className="text-teal-100/70 text-xs">
                Use when you're confident across all matches in a gameweek, but
                be careful as negative points are also doubled.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-600/40 rounded-lg p-4 border border-primary-400/20 mt-5">
          <h4 className="text-teal-200 text-lg font-dmSerif mb-3">
            Chip Management
          </h4>
          <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
            <li>
              You can use multiple chips every gameweek. Choose wisely based on
              fixture difficulty and your confidence level.
            </li>
            <li>
              Each chip has its own cooldown period or usage limit per season.
            </li>
            <li>
              Gameweek chips apply to all your predictions in that gameweek.
            </li>
            <li>
              Match-specific chips must be selected during individual match
              predictions.
            </li>
            <li>
              Once applied, chips cannot be removed during the gameweek unless
              you use specific console commands.
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChipInfoModal;
