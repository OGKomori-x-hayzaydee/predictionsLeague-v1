import { useState, useEffect } from "react";
import { fetchAllTeamLogos } from "../../utils/logoFetcher";
import { getLogosFromCache, isLogoCacheValid } from "../../utils/logoCache";

const LogoManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cacheInfo, setCacheInfo] = useState(null);

  // Check logo cache status on component mount
  useEffect(() => {
    checkCacheStatus();
  }, []);

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

    try {
      const success = await fetchAllTeamLogos();

      if (success) {
        setMessage("Team logos successfully fetched and cached!");
      } else {
        setMessage("Failed to fetch team logos. Please try again.");
      }

      // Update cache status
      checkCacheStatus();
    } catch (error) {
      console.error("Error fetching logos:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-800/30 rounded-lg p-4 border border-primary-700/30">
      <h3 className="text-lg font-medium text-white mb-3">
        Team Logo Cache Manager
      </h3>

      {cacheInfo && (
        <div className="bg-primary-700/30 rounded p-3 mb-4">
          <p className="text-sm text-white/80">
            <span className="font-medium text-white">Status:</span>{" "}
            <span
              className={cacheInfo.valid ? "text-teal-300" : "text-amber-300"}
            >
              {cacheInfo.status}
            </span>
          </p>
          <p className="text-sm text-white/80">
            <span className="font-medium text-white">Teams cached:</span>{" "}
            {cacheInfo.count}
          </p>
          <p className="text-sm text-white/80">
            <span className="font-medium text-white">Last updated:</span>{" "}
            {cacheInfo.date}
          </p>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleFetchLogos}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          {isLoading ? "Fetching..." : "Fetch All Team Logos"}
        </button>

        <button
          onClick={checkCacheStatus}
          className="bg-primary-700 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          Refresh Status
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-white/80">{message}</p>}
    </div>
  );
};

export default LogoManager;
