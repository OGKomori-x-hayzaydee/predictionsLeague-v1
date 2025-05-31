import { useState, useEffect, useContext } from "react";
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { backgrounds, text } from '../../utils/themeUtils';
import { ActionButton, SecondaryButton } from '../ui/buttons';
import { 
  ReloadIcon, 
  DownloadIcon, 
  CheckCircledIcon, 
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ImageIcon
} from '@radix-ui/react-icons';
import { fetchAllTeamLogos } from "../../utils/logoFetcher";
import { getLogosFromCache, isLogoCacheValid } from "../../utils/logoCache";

const LogoManager = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success', 'error', 'info'
  const [cacheInfo, setCacheInfo] = useState(null);
  // Check logo cache status on component mount
  useEffect(() => {
    checkCacheStatus();
  }, []);

  // Auto-dismiss success messages after 3 seconds
  useEffect(() => {
    if (messageType === 'success') {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageType]);

  const checkCacheStatus = () => {
    try {
      const isCacheValid = isLogoCacheValid();
      const cachedLogos = getLogosFromCache();

      if (cachedLogos) {
        const logoCount = Object.keys(cachedLogos).length;
        const cacheDate = new Date(
          parseInt(localStorage.getItem("team_logos_cache_timestamp"), 10)
        );

        setCacheInfo({
          valid: isCacheValid,
          count: logoCount,
          date: cacheDate.toLocaleString(),
          status: isCacheValid ? "Valid" : "Expired",
        });
      } else {
        setCacheInfo({
          valid: false,
          count: 0,
          date: "Never",
          status: "Not Found",
        });
      }
    } catch (error) {
      console.error("Error checking cache status:", error);
      setCacheInfo({
        valid: false,
        count: 0,
        date: "Error",
        status: "Error",
      });
    }
  };
  const handleFetchLogos = async () => {
    setIsLoading(true);
    setMessage("Fetching team logos...");
    setMessageType("info");

    try {
      const success = await fetchAllTeamLogos();

      if (success) {
        setMessage("Team logos successfully fetched and cached!");
        setMessageType("success");
      } else {
        setMessage("Failed to fetch team logos. Please try again.");
        setMessageType("error");
      }

      // Update cache status
      checkCacheStatus();
    } catch (error) {
      console.error("Error fetching logos:", error);
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const getStatusIcon = () => {
    if (!cacheInfo) return <InfoCircledIcon />;
    return cacheInfo.valid ? <CheckCircledIcon /> : <ExclamationTriangleIcon />;
  };

  const getStatusColor = () => {
    if (!cacheInfo) return text.secondary[theme];
    return cacheInfo.valid 
      ? 'text-emerald-400' 
      : 'text-amber-400';
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircledIcon className="w-4 h-4 text-emerald-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
      case 'info':
        return <InfoCircledIcon className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'info':
        return 'text-blue-400';
      default:
        return text.secondary[theme];
    }
  };
  return (
    <motion.div 
      className={`${backgrounds.card[theme]} rounded-lg p-6 border`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className={`w-5 h-5 ${text.accent[theme]}`} />
        <div>
          <h3 className={`${text.primary[theme]} font-outfit font-semibold text-lg`}>
            Team Logo Cache Manager
          </h3>
          <p className={`${text.secondary[theme]} text-sm mt-1 font-outfit`}>
            Manage team logo cache and fetch latest logos
          </p>
        </div>
      </div>

      {cacheInfo && (
        <motion.div 
          className={`${
            theme === 'dark' 
              ? 'bg-slate-800/60 border-slate-600/50' 
              : 'bg-slate-50 border-slate-200'
          } rounded-lg p-4 mb-4 border`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            {getStatusIcon()}
            <h4 className={`${text.primary[theme]} font-outfit font-medium`}>
              Cache Status
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className={`${text.secondary[theme]} font-outfit`}>Status</p>
              <p className={`${getStatusColor()} font-outfit font-medium`}>
                {cacheInfo.status}
              </p>
            </div>
            <div>
              <p className={`${text.secondary[theme]} font-outfit`}>Teams Cached</p>
              <p className={`${text.primary[theme]} font-outfit font-medium`}>
                {cacheInfo.count}
              </p>
            </div>
            <div>
              <p className={`${text.secondary[theme]} font-outfit`}>Last Updated</p>
              <p className={`${text.primary[theme]} font-outfit font-medium`}>
                {cacheInfo.date}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <ActionButton
          color="teal"
          variant="primary"
          onClick={handleFetchLogos}
          loading={isLoading}
          disabled={isLoading}
          icon={<DownloadIcon />}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? "Fetching..." : "Fetch All Logos"}
        </ActionButton>

        <SecondaryButton
          onClick={() => {
            checkCacheStatus();
            clearMessage();
          }}
          disabled={isLoading}
          icon={<ReloadIcon />}
          className="flex-1 sm:flex-none"
        >
          Refresh Status
        </SecondaryButton>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-lg ${
            messageType === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : messageType === 'error'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}
        >
          {getMessageIcon()}
          <p className={`${getMessageColor()} text-sm font-outfit`}>
            {message}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LogoManager;
