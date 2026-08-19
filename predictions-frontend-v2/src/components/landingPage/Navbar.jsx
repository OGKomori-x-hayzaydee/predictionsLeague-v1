import React, { useState, useEffect, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Container, Button } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

// Memoize the NavItem to prevent re-renders
const NavItem = memo(({ to, children, location }) => {
  const isActive = location.pathname === to;

  return (
    <motion.div variants={itemVariants} className="relative">
      <NavLink
        to={to}
        className={
          isActive
            ? "text-teal-300 font-medium"
            : "text-white hover:text-teal-300"
        }
      >
        <span className="py-1 px-1 block">{children}</span>
        <motion.div
          className="h-0.5 bg-teal-400"
          initial={{ width: 0 }}
          animate={{ width: isActive ? "100%" : 0 }}
          whileHover={{ width: isActive ? "100%" : "100%" }}
          transition={{ duration: 0.3 }}
        />
      </NavLink>
    </motion.div>
  );
});

// Animation constants outside component to prevent recreation
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

  // Handle scroll event to change navbar appearance
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full py-4 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-primary-500/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <Container size="6" className="mx-auto">
        <div className="flex items-center justify-between">
          <motion.div variants={itemVariants} className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Predictions League Logo" 
                className="h-8 mr-3" 
              />
              <span className="text-teal-100 text-2xl font-bold font-dmSerif">
                predictionsLeague
              </span>
            </NavLink>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              className="text-white"
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
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

          {/* Desktop navigation with animated underlines */}
          <motion.div
            className="hidden md:flex items-center space-x-6 font-outfit"
            variants={itemVariants}
          >
            <NavItem to="/" location={location}>home</NavItem>
            <NavItem to="/howToPlay" location={location}>how to play</NavItem>

            <motion.div variants={itemVariants}>
              <NavLink to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="loginBtn bg-indigo-600 hover:bg-indigo-700 text-white ml-4 transition-colors">
                    login
                  </Button>
                </motion.div>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants}> 
              <NavLink to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="signupBtn border border-indigo-500 bg-transparent hover:bg-indigo-800/40 text-white transition-colors">
                    sign up
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
              className="md:hidden bg-primary-500/95 backdrop-blur-md mt-4 py-3 px-4 rounded-lg shadow-lg"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="flex flex-col space-y-3">
                <NavItem to="/" location={location}>home</NavItem>
                <NavItem to="/leaderboard" location={location}>leaderboard</NavItem>
                <NavItem to="/matches" location={location}>matches</NavItem>
                <NavItem to="/howToPlay" location={location}>how to play</NavItem>

                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button className="loginBtn bg-indigo-600 hover:bg-indigo-700 text-white w-full my-1">
                      login
                    </Button>
                  </motion.div>
                </NavLink>

                <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button className="signupBtn border border-indigo-500 bg-transparent hover:bg-indigo-800/40 text-white w-full my-1">
                      sign up
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
