import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  HomeIcon,
  PersonIcon,
  BarChartIcon,
  CalendarIcon,
  StackIcon,
  ChatBubbleIcon,
  GearIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function VerticalMenu({
  activeItem,
  setActiveItem,
  isCollapsed = false,
}) {
  // Get theme context
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("🔄 Logging out...");
      const result = await logout();
      console.log("✅ Logout result:", result);
      
      // Navigate to landing page after successful logout
      navigate("/");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Even if logout fails, redirect to landing page
      navigate("/");
    }
  };

  // Menu items configuration
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <HomeIcon />,
    },

    {
      id: "fixtures",
      label: "Fixtures",
      icon: <CalendarIcon />,
    },
    {
      id: "predictions",
      label: "My Predictions",
      icon:  <StackIcon />,
    },
    {
      id: "leagues",
      label: "My Leagues",
      icon: <BarChartIcon />,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <PersonIcon />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <GearIcon />,
    },
  ];

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <motion.div
      className={`${
        theme === 'dark' 
          ? 'bg-primary-500/90 border-slate-800' 
          : 'bg-slate-50 border-slate-200 shadow-sm'
      } backdrop-blur-md h-full border-r py-6`}
      initial="hidden"
      animate="visible"
      variants={menuVariants}
    >
      {/* Logo section - adjusts based on collapsed state */}
      <NavLink
        to="/"
        className={`flex ${
          isCollapsed ? "justify-center" : "items-center"
        } mb-10 px-4`}
      >
        {/* Logo image only */}
        <img
          src={logo}
          alt="Predictions League Logo"
          className={`h-8 ${isCollapsed ? "mx-auto" : "ml-2 mr-0.5"}`}
        />        {/* Text only shown when not collapsed */}
        {!isCollapsed && (
          <span className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-lg font-bold font-dmSerif`}>
            predictionsLeague
          </span>
        )}
      </NavLink>

      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <button
                onClick={() => setActiveItem(item.id)}                className={`flex ${
                  isCollapsed ? "justify-center" : "items-center"
                } w-full px-4 py-3 text-left transition-colors ${
                  activeItem === item.id
                    ? theme === 'dark'
                      ? "bg-primary-600/60 text-teal-300 border-l-2 border-teal-400"
                      : "bg-teal-50 text-teal-700 border-l-2 border-teal-500"
                    : theme === 'dark'
                      ? "text-white/70 hover:bg-primary-600/40 hover:text-teal-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-outfit">{item.label}</span>
                )}
              </button>
            </motion.li>          ))}

          {/* Logout button*/}
          <motion.li variants={itemVariants}>
            <button              className={`flex ${
                isCollapsed ? "justify-center" : "items-center"
              } w-full px-4 py-3 text-left ${
                theme === 'dark' 
                ? 'text-white/50 hover:text-red-300' 
                : 'text-slate-400 hover:text-red-500'
              } transition-colors mt-8`}
              onClick={handleLogout}
              title={isCollapsed ? "Logout" : ""}
            >
              <span className={isCollapsed ? "" : "mr-3"}>
                <ExitIcon />
              </span>
              {!isCollapsed && <span className="font-outfit">Logout</span>}
            </button>
          </motion.li>
        </ul>
      </nav>
    </motion.div>
  );
}
