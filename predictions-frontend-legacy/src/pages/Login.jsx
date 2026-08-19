import React, { useState } from "react";
import { Box, Container, Button } from "@radix-ui/themes";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import OAuthLoginSection from "../components/auth/OAuthLogin";
import OAuthStatusHandler from "../components/auth/OAuthStatusHandler";
import oauthAPI from "../services/api/oauthAPI";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [oauthError, setOauthError] = useState(null);

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination after login
  const from = location.state?.from?.pathname || "/home/dashboard";

  const handleOAuthLogin = (providerId) => {
    try {
      // Store that this is a login flow (not signup)
      sessionStorage.setItem('oauth_flow_type', 'login');
      oauthAPI.initiateLogin(providerId, from);
    } catch (error) {
      setOauthError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Basic client-side validation
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const result = await login({
        username: email,
        password: password,
      });

      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (loginError) {
      console.error('Login error:', loginError);
    }
  };

  return (
    <>
      <Navbar />
      <OAuthStatusHandler />
      <Box className="relative overflow-hidden bg-white dark:bg-primary-800 min-h-screen transition-colors duration-300">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white dark:from-primary-700/40 dark:via-primary-800 dark:to-primary-800" />
          <motion.div
            className="absolute top-40 left-10 w-64 h-64 rounded-full bg-teal-light/5 dark:bg-teal-500/20 blur-3xl"
            animate={{ x: [0, 10, -10, 0], y: [0, 15, 5, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 right-10 w-72 h-72 rounded-full bg-indigo-light/5 dark:bg-indigo-500/20 blur-3xl"
            animate={{ x: [0, -20, 20, 0], y: [0, 20, -10, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
        </div>

        <Container size="2" className="relative z-10 pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6">
          {/* Login form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="rounded-xl overflow-hidden max-w-md mx-auto mt-12 sm:mt-20 p-5 sm:p-6 md:p-8 bg-white/80 dark:bg-primary-700/50 backdrop-blur-md border border-light-border dark:border-primary-700/30 shadow-lg dark:shadow-none transition-colors duration-300"
          >
            <motion.div className="text-center mb-6 sm:mb-8" variants={fadeUp}>
              <h1 className="text-light-text dark:text-white text-2xl sm:text-3xl font-bold font-dmSerif mb-2">
                welcome back
              </h1>
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm sm:text-base">
                log in to access your predictions and leaderboards
              </p>
            </motion.div>

            {(error || oauthError) && (
              <motion.div
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-6 font-outfit text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error || oauthError}
              </motion.div>
            )}

            {/* OAuth Login Section */}
            <motion.div variants={fadeUp}>
              <OAuthLoginSection
                onOAuthLogin={handleOAuthLogin}
                disabled={isLoading}
                className="mb-6"
              />
            </motion.div>

            <motion.form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6" variants={fadeUp}>
              <div>
                <label htmlFor="email" className="block text-light-text dark:text-slate-200 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-outfit">
                  email address
                </label>
                <div className={`bg-white dark:bg-primary-600/50 rounded-md sm:rounded-lg border transition-colors ${
                  validationErrors.email
                    ? 'border-red-400 dark:border-red-500/50 focus-within:border-red-500'
                    : 'border-slate-200 dark:border-primary-500/50 focus-within:border-teal-light dark:focus-within:border-teal-500'
                }`}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors(prev => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2.5 sm:py-2 bg-transparent text-light-text dark:text-white font-outfit placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm sm:text-base"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 dark:text-red-300 text-xs mt-1 font-outfit">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-light-text dark:text-slate-200 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-outfit">
                  password
                </label>
                <div className={`relative bg-white dark:bg-primary-600/50 rounded-md sm:rounded-lg border transition-colors ${
                  validationErrors.password
                    ? 'border-red-400 dark:border-red-500/50 focus-within:border-red-500'
                    : 'border-slate-200 dark:border-primary-500/50 focus-within:border-teal-light dark:focus-within:border-teal-500'
                }`}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors(prev => ({ ...prev, password: null }));
                      }
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 sm:py-2 bg-transparent text-light-text dark:text-white font-outfit placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none pr-10 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-light dark:text-teal-dark hover:opacity-70 transition-opacity"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 dark:text-red-300 text-xs mt-1 font-outfit">{validationErrors.password}</p>
                )}
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm text-teal-light dark:text-teal-dark hover:opacity-80 font-outfit transition-opacity">
                    forgot password?
                  </Link>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex justify-center"
              >
                <Button
                  type="submit"
                  className="w-full bg-teal-light dark:bg-teal-dark text-white dark:text-primary-800 hover:opacity-90 font-bold font-outfit py-3 mx-auto cursor-pointer transition-opacity"
                  disabled={isLoading}
                  size="4"
                >
                  {isLoading ? "logging in..." : "log in"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-6 sm:mt-8 text-center" variants={fadeUp}>
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm sm:text-base">
                don't have an account?{" "}
                <Link to="/signup" className="text-teal-light dark:text-teal-dark hover:opacity-80 font-medium transition-opacity">
                  sign up now
                </Link>
              </p>
            </motion.div>

            <motion.div
              className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-white/10 text-center"
              variants={fadeUp}
            >
              <p className="text-light-text-secondary/70 dark:text-teal-dark/70 text-xs font-outfit">
                predictions for the 2025/26 Premier League season are now open
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
