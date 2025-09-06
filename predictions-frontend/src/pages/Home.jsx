import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StatusBar from "../components/layout/StatusBar";
import VerticalMenu from "../components/layout/VerticalMenu";
import ContentPane from "../components/layout/ContentPane";
import { Box } from "@radix-ui/themes";
import { ThemeContext } from "../context/ThemeContext";

// Import from centralized data file
import {
  upcomingMatches,
  recentPredictions,
  leagues,
} from "../data/sampleData";

import {
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";

export default function Home() {
  const { view } = useParams();
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  
  // Add debugging for OAuth redirect detection
  useEffect(() => {
    console.log('🏠 Home page loaded:', {
      view,
      currentPath: window.location.pathname,
      referrer: document.referrer
    });
    
    // Check if this is an inappropriate OAuth redirect
    if (document.referrer && document.referrer.includes('google')) {
      console.log('🚨 CRITICAL: OAuth redirected to Home instead of /auth/oauth/callback!');
      console.log('🚨 This means your backend OAuth success handler is misconfigured');
      console.log('🚨 Backend should redirect to: http://localhost:5173/auth/oauth/callback');
      console.log('🚨 But instead redirected to:', window.location.href);
    }
  }, [view]);
  
  // Valid views
  const validViews = [
    "dashboard",
    "profile",
    "predictions",
    "fixtures",
    "leagues",
    "settings",
  ];

  // Ensure the view is valid, default to "dashboard"
  const activeItem = validViews.includes(view) ? view : "dashboard";
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [navigationParams, setNavigationParams] = useState({});
  
  // navigateToSection function to change the active item
  const navigateToSection = (section, params = {}) => {
    // Navigate to the section
    navigate(`/home/${section}`);
    
    // Store additional parameters for the ContentPane to handle
    setNavigationParams(params);
  };
  // Redirect to dashboard if invalid view
  useEffect(() => {
    if (!validViews.includes(view)) {
      navigate("/home/dashboard", { replace: true });
    }
  }, [view, navigate]);

  // Simulate loading when changing sections
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeItem]);

  // Get breadcrumb title
  const getBreadcrumbTitle = () => {
    switch (activeItem) {
      case "dashboard":
        return "Dashboard";
      case "profile":
        return "My Profile";
      case "predictions":
        return "My Predictions";
      case "fixtures":
        return "Fixtures";
      case "leagues":
        return "My Leagues";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <Box className="relative overflow-hidden bg-primary-500 min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-40 left-10 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl"
          animate={{
            x: [0, 10, -10, 0],
            y: [0, 15, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{
            x: [0, -20, 20, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 flex h-screen">
        {/* Left Menu - Full Height */}
        <AnimatePresence>
          <motion.div
            className={`h-full hidden md:block ${
              isMenuCollapsed ? "w-16" : "w-64"
            }`}
            animate={{ width: isMenuCollapsed ? "4rem" : "16rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {" "}
            <VerticalMenu
              activeItem={activeItem}
              setActiveItem={navigateToSection}
              isCollapsed={isMenuCollapsed}
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Area*/}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {" "}
          {/* Mobile Menu (only shown on small screens) */}
          <div className="md:hidden w-full bg-primary-500/90 backdrop-blur-md border-b border-primary-400/20 px-4 py-3">
            <select
              value={activeItem}
              onChange={(e) => navigateToSection(e.target.value)}
              className="bg-primary-600/60 text-white font-outfit border border-primary-400/30 rounded-md px-3 py-2 w-full"
            >
              <option value="dashboard">Dashboard</option>
              <option value="profile">My Profile</option>
              <option value="predictions">My Predictions</option>
              <option value="fixtures">Fixtures</option>
              <option value="leagues">My Leagues</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          {/* Status Bar moved inside content area */}
          <StatusBar
           onMakePredictions={() => navigateToSection("predictions")} 
          />
          {/* Breadcrumb & Search Bar */}
          <div
            className={`${
              theme === "dark"
                ? "bg-primary-500/90 border-b-slate-800"
                : "bg-slate-50 border-slate-200 text-light-text border-b-slate-200"
            } px-4 py-2 border-b flex items-center justify-between font-outfit`}
          >
            <div className="flex items-center">
              {/* Menu toggle button */}
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className="mr-3  p-1 hidden md:block"
                aria-label={isMenuCollapsed ? "Expand menu" : "Collapse menu"}
              >
                <HamburgerMenuIcon />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center text-sm">
                <span
                  className={`${
                    theme === "dark"
                      ? "bg-primary-500/90"
                      : "bg-slate-50 border-slate-200 text-light-text"
                  }`}
                >
                  Home
                </span>
                <ChevronRightIcon className={`${
                    theme === "dark"
                      ? "text-teal-300"
                      : " text-teal-700"
                  } mx-1`}/>
                <span
                  className={`${
                    theme === "dark"
                      ? "text-teal-300"
                      : " text-teal-700"
                  } font-medium`}
                >
                  {getBreadcrumbTitle()}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-primary-700/50 rounded-md overflow-hidden pr-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent px-3 py-1 text-sm text-white outline-none w-48"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="  p-1"
                  >
                    <Cross2Icon />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="  p-1"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon />
                </button>
              )}
            </div>
          </div>
          {/* Content Area with Loading State */}
          <div className="flex-1 overflow-hidden relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-primary-500/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            ) : null}            <ContentPane
              activeItem={activeItem}
              navigateToSection={navigateToSection}
              navigationParams={navigationParams}
              upcomingMatches={upcomingMatches}
              recentPredictions={recentPredictions}
              leagues={leagues}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}
