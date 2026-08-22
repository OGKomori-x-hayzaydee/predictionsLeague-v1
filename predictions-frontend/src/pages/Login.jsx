import React, { useState } from "react";
import Container from "../components/ui/Container";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landingPage/Navbar";
import OAuthLoginSection from "../components/auth/OAuthLogin";
import OAuthStatusHandler from "../components/auth/OAuthStatusHandler";
import oauthAPI from "../services/api/oauthAPI";
import Button from "../components/ui/buttons/Button";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

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

const fieldWrap = (err) =>
  `rounded-md border bg-surface-elevated transition-colors ${
    err
      ? "border-state-error focus-within:border-state-error"
      : "border-border-control focus-within:border-brand-teal"
  }`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [oauthError, setOauthError] = useState(null);

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();

  const from = location.state?.from?.pathname || "/dashboard";
  const enter = reduceMotion
    ? { initial: false, animate: false }
    : { initial: "hidden", animate: "visible" };

  const handleOAuthLogin = (providerId) => {
    try {
      sessionStorage.setItem("oauth_flow_type", "login");
      oauthAPI.initiateLogin(providerId, from);
    } catch (err) {
      setOauthError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      console.error("Login error:", loginError);
    }
  };

  return (
    <>
      <Navbar />
      <OAuthStatusHandler />
      <div className="relative min-h-dvh overflow-hidden bg-surface-app">
        <Container size="2" className="relative z-10 px-4 pb-8 pt-24 sm:px-6 sm:pb-16 sm:pt-32">
          <motion.div
            {...enter}
            variants={reduceMotion ? undefined : stagger}
            className="mx-auto mt-12 max-w-md overflow-hidden rounded-lg border border-border-card bg-surface-card p-5 shadow-card sm:mt-20 sm:p-8 relative"
          >
            <span className="pointer-events-none absolute right-4 top-4 rotate-[-8deg] rounded-sm border border-brand-teal px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-brand-teal">
              FILED
            </span>
            <motion.div className="mb-6 text-center sm:mb-8" variants={fadeUp}>
              <h1 className="mb-2 font-dmSerif text-2xl font-bold text-text-primary sm:text-3xl">
                welcome back
              </h1>
              <p className="font-outfit text-sm text-text-muted sm:text-base">
                log in to access your predictions and leaderboards
              </p>
            </motion.div>

            {(error || oauthError) && (
              <motion.div
                className="mb-6 rounded-lg border border-state-error/30 bg-state-error/10 px-4 py-3 font-outfit text-sm text-state-error"
                initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              >
                {error || oauthError}
              </motion.div>
            )}

            <motion.form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6" variants={fadeUp}>
              <div>
                <label htmlFor="email" className="mb-1.5 block font-outfit text-xs font-medium text-text-secondary sm:mb-2 sm:text-sm">
                  email address
                </label>
                <div className={fieldWrap(validationErrors.email)}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors((prev) => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="your@email.com"
                    required
                    className="w-full min-h-11 bg-transparent px-3 py-2.5 font-outfit text-sm text-text-primary outline-none placeholder:text-text-disabled sm:text-base"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 font-outfit text-xs text-state-error">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block font-outfit text-xs font-medium text-text-secondary sm:mb-2 sm:text-sm">
                  password
                </label>
                <div className={`relative ${fieldWrap(validationErrors.password)}`}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full min-h-11 bg-transparent px-3 py-2.5 pr-10 font-outfit text-sm text-text-primary outline-none placeholder:text-text-disabled sm:text-base"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-brand-teal-deep transition-opacity hover:opacity-70"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 font-outfit text-xs text-state-error">{validationErrors.password}</p>
                )}
                <div className="mt-1 flex justify-end">
                  <Link to="/forgot-password" className="font-outfit text-sm text-brand-teal-deep transition-opacity hover:opacity-80">
                    forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" loading={isLoading} className="w-full">
                {isLoading ? "logging in..." : "log in"}
              </Button>
            </motion.form>

            <motion.div variants={fadeUp} className="mt-6">
              <OAuthLoginSection
                onOAuthLogin={handleOAuthLogin}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div className="mt-6 text-center sm:mt-8" variants={fadeUp}>
              <p className="font-outfit text-sm text-text-muted sm:text-base">
                don't have an account?{" "}
                <Link to="/signup" className="font-medium text-brand-teal-deep transition-opacity hover:opacity-80">
                  sign up now
                </Link>
              </p>
            </motion.div>

            <motion.div
              className="mt-6 border-t border-border-card pt-4 text-center sm:mt-8 sm:pt-6"
              variants={fadeUp}
            >
              <p className="font-outfit text-xs text-text-muted">
                predictions for the 2025/26 Premier League season are now open
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
