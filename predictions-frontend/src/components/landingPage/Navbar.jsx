import React, { useState, useEffect, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Container, Button } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/logo.png";

const NavItem = memo(({ to, children, location }) => {
  const isActive = location.pathname === to;

  return (
    <motion.div variants={itemVariants} className="relative">
      <NavLink
        to={to}
        className={`font-outfit text-sm font-medium tracking-wide transition-colors duration-200 ${
          isActive
            ? "text-teal-light dark:text-teal-dark"
            : "text-light-text dark:text-white/80 hover:text-teal-light dark:hover:text-teal-dark"
        }`}
      >
        <span className="py-1 px-1 block">{children}</span>
        <motion.div
          className="h-0.5 bg-teal-light dark:bg-teal-dark"
          initial={{ width: 0 }}
          animate={{ width: isActive ? "100%" : 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </NavLink>
    </motion.div>
  );
});

const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const mobileMenuVariants = {
  closed: { opacity: 0, scale: 0.95, y: -10 },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
};

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full py-4 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-primary-500/90 backdrop-blur-md shadow-sm dark:shadow-none"
          : "bg-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <Container size="4" className="mx-auto px-6">
        <div className="flex items-center justify-between">
          <motion.div variants={itemVariants} className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src={logo}
                alt="Predictions League Logo"
                className="h-8 mr-3"
              />
              <span className="text-light-text dark:text-teal-100 text-2xl font-bold font-dmSerif">
                predictionsLeague
              </span>
            </NavLink>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              className="text-light-text dark:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
            <motion.button
              className="text-light-text dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>

          {/* Desktop navigation */}
          <motion.div
            className="hidden md:flex items-center gap-8 font-outfit"
            variants={itemVariants}
          >
            <NavItem to="/" location={location}>Home</NavItem>
            <NavItem to="/howToPlay" location={location}>How to Play</NavItem>

            <motion.button
              className="text-light-text dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </motion.button>

            <motion.div variants={itemVariants}>
              <NavLink to="/login">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="bg-indigo-light dark:bg-indigo-dark hover:opacity-90 text-white px-5 transition-opacity">
                    Log In
                  </Button>
                </motion.div>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants}>
              <NavLink to="/signup">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="border border-indigo-light dark:border-indigo-dark bg-transparent hover:bg-indigo-light/10 dark:hover:bg-indigo-dark/10 text-indigo-light dark:text-indigo-dark transition-colors">
                    Sign Up
                  </Button>
                </motion.div>
              </NavLink>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white/95 dark:bg-primary-500/95 backdrop-blur-md mt-4 py-4 px-5 rounded-xl shadow-lg dark:shadow-none border border-light-border dark:border-white/10"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="flex flex-col gap-3">
                <NavItem to="/" location={location}>Home</NavItem>
                <NavItem to="/howToPlay" location={location}>How to Play</NavItem>

                <div className="border-t border-light-border dark:border-white/10 my-2" />

                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button className="bg-indigo-light dark:bg-indigo-dark text-white w-full my-1">
                      Log In
                    </Button>
                  </motion.div>
                </NavLink>

                <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button className="border border-indigo-light dark:border-indigo-dark bg-transparent text-indigo-light dark:text-indigo-dark w-full my-1">
                      Sign Up
                    </Button>
                  </motion.div>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.nav>
  );
});

export default Navbar;
