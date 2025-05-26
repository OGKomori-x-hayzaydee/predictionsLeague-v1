import React from "react";
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
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function VerticalMenu({
  activeItem,
  setActiveItem,
  isCollapsed = false,
}) {
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
      icon: <BarChartIcon />,
    },
    {
      id: "leagues",
      label: "My Leagues",
      icon: <StackIcon />,
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
      className="bg-primary-500/90 backdrop-blur-md h-full border-r border-primary-400/20 py-6"
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
        />

        {/* Text only shown when not collapsed */}
        {!isCollapsed && (
          <span className="text-teal-100 text-lg font-bold font-dmSerif">
            predictionsLeague
          </span>
        )}
      </NavLink>

      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`flex ${
                  isCollapsed ? "justify-center" : "items-center"
                } w-full px-4 py-3 text-left transition-colors ${
                  activeItem === item.id
                    ? "bg-primary-600/60 text-teal-300 border-l-2 border-teal-400"
                    : "text-white/70 hover:bg-primary-600/40 hover:text-teal-200"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-outfit">{item.label}</span>
                )}
              </button>
            </motion.li>
          ))}

          {/* Logout button*/}
          <motion.li variants={itemVariants}>
            <button
              className={`flex ${
                isCollapsed ? "justify-center" : "items-center"
              } w-full px-4 py-3 text-left text-white/50 hover:text-red-300 transition-colors mt-8`}
              onClick={() => alert("Logging out...")}
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
