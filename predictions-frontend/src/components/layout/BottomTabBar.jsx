import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  HomeIcon,
  PersonIcon,
  BarChartIcon,
  CalendarIcon,
  StackIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const BottomTabBar = ({ activeItem, setActiveItem }) => {
  const { theme } = useContext(ThemeContext);

  // Menu items configuration for bottom tabs
  const tabItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      id: "fixtures",
      label: "Fixtures",
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      id: "predictions",
      label: "Predict",
      icon: <StackIcon className="w-5 h-5" />,
    },
    {
      id: "leagues",
      label: "Leagues",
      icon: <BarChartIcon className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <PersonIcon className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <GearIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 ${
        theme === "dark"
          ? "bg-primary-500/95 border-primary-400/30"
          : "bg-white/95 border-slate-200"
      } backdrop-blur-md border-t`}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {tabItems.map((item) => {
          const isActive = activeItem === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveItem(item.id)}
              className={`flex flex-col items-center justify-center px-1 py-1.5 rounded-lg min-w-0 flex-1 transition-all duration-200 ${
                isActive
                  ? theme === "dark"
                    ? "bg-teal-500/20 text-teal-300"
                    : "bg-teal-50 text-teal-600"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {/* Icon with active indicator */}
              <div className="relative mb-0.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                      theme === "dark" ? "bg-teal-400" : "bg-teal-500"
                    }`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              
              {/* Label */}
              <span
                className={`text-2xs font-medium truncate max-w-full leading-none ${
                  isActive
                    ? theme === "dark"
                      ? "text-teal-300"
                      : "text-teal-600"
                    : theme === "dark"
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Safe area for devices with bottom indicators */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
};

export default BottomTabBar;