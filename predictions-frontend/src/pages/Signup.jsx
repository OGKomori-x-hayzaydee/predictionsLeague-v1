import React, { useState, useEffect } from "react";
import Container from "../components/ui/Container";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeSlash, Check } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landingPage/Navbar";
import OAuthLoginSection from "../components/auth/OAuthLogin";
import oauthAPI from "../services/api/oauthAPI";
import authAPI from "../services/api/authAPI";
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

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Preferences" },
];

function stepStatus(formStep, id) {
  if (id === 1) return formStep === 1 ? "current" : "complete";
  if (id === 2) return formStep === 3 ? "complete" : "upcoming";
  return formStep === 3 ? "current" : "upcoming";
}

function passwordStrength(password) {
  if (!password) return { pct: 0, tone: "bg-state-error" };
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
  ];
  const met = checks.filter(Boolean).length;
  const extra = password.length >= 12 ? 1 : 0;
  const score = met + extra;
  const pct = (score / 5) * 100;
  let tone = "bg-state-error";
  if (met === 4) tone = extra ? "bg-state-success" : "bg-state-warning";
  else if (met >= 2) tone = "bg-state-warning";
  return { pct, tone };
}

const fieldWrap = (fieldError) =>
  `rounded-md border bg-surface-elevated transition-colors ${
    fieldError
      ? "border-state-error focus-within:border-state-error"
      : "border-border-control focus-within:border-brand-teal"
  }`;

const inputClass =
  "w-full min-h-11 bg-transparent px-3 py-2.5 font-outfit text-sm text-text-primary outline-none placeholder:text-text-disabled sm:text-base";

const labelClass =
  "mb-1.5 block font-outfit text-xs font-medium text-text-secondary sm:mb-2 sm:text-sm";

const errorClass = "mt-1 font-outfit text-xs text-state-error";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    favouriteTeam: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
    username: null,
    favouriteTeam: null,
    submit: null,
  });
  const [formStep, setFormStep] = useState(1);
  const [oauthError, setOauthError] = useState(null);

  const { register, isLoading, dispatch, AUTH_ACTIONS } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const enter = reduceMotion
    ? { initial: false, animate: false }
    : { initial: "hidden", animate: "visible" };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get("error");
    const stepParam = urlParams.get("step");
    const emailParam = urlParams.get("email");

    if (errorParam) {
      setOauthError(decodeURIComponent(errorParam));
      navigate(location.pathname, { replace: true });
    }

    if (stepParam === "3") {
      setFormStep(3);

      let userEmail = null;

      if (emailParam) {
        userEmail = decodeURIComponent(emailParam);
        sessionStorage.setItem("signup_email", userEmail);
      } else {
        userEmail = sessionStorage.getItem("signup_email");
      }

      if (userEmail) {
        setFormData((prev) => ({
          ...prev,
          email: userEmail,
        }));
      }

      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  const handleOAuthSignup = (providerId) => {
    try {
      oauthAPI.initiateSignup(providerId);
    } catch (err) {
      setOauthError(err.message);
    }
  };

  const clearError = () => {
    setErrors((prev) => ({ ...prev, submit: null }));
  };

  const getValidationErrors = (error) => {
    const fieldErrors = {};

    if (error?.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      Object.keys(validationErrors).forEach((field) => {
        fieldErrors[field] = validationErrors[field][0];
      });
    } else if (error?.message?.includes("Username")) {
      fieldErrors.username = error.message;
    } else if (error?.message?.includes("Email")) {
      fieldErrors.email = error.message;
    } else if (error?.message?.includes("Password")) {
      fieldErrors.password = error.message;
    }

    return fieldErrors;
  };

  const teams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Tottenham Hotspur",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));

    if (name === "email" && value) {
      sessionStorage.setItem("signup_email", value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter, uppercase letter, and number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 3) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
      }

      if (!formData.favouriteTeam) {
        newErrors.favouriteTeam = "Please select your favourite team";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async (e) => {
    e.preventDefault();

    if (!validateStep(formStep)) {
      return;
    }

    if (formStep === 1) {
      try {
        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        if (result.success) {
          const redirectUrl = `/signup?step=3`;

          setTimeout(() => {
            navigate(
              `/verify-email?flow=signup&email=${encodeURIComponent(formData.email)}&redirect=${encodeURIComponent(redirectUrl)}`,
              { replace: true }
            );
          }, 100);
          return;
        } else {
          throw new Error(result.error || "Failed to create account");
        }
      } catch (error) {
        const fieldErrors = getValidationErrors(error);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        } else {
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to create account. Please try again.",
          }));
        }
        return;
      }
    }

    setFormStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(formStep)) {
      return;
    }

    setErrors((prev) => ({ ...prev, submit: null }));
    clearError();

    try {
      const result = await authAPI.completeProfile({
        username: formData.username,
        favouriteTeam: formData.favouriteTeam,
        email: formData.email,
      });

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });

        sessionStorage.removeItem("signup_email");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      }
    } catch (registrationError) {
      const fieldErrors = getValidationErrors(registrationError);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        if (
          fieldErrors.firstName ||
          fieldErrors.lastName ||
          fieldErrors.email ||
          fieldErrors.password ||
          fieldErrors.confirmPassword
        ) {
          setFormStep(1);
        } else if (fieldErrors.username || fieldErrors.favouriteTeam) {
          setFormStep(3);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: "Failed to create account. Please try again.",
        }));
      }
    }
  };

  const strength = passwordStrength(formData.password);

  return (
    <>
      <Navbar />
      <div className="relative min-h-dvh overflow-hidden bg-surface-app">
        <Container size="2" className="relative z-10 mt-12 px-4 pb-8 pt-24 sm:mt-20 sm:px-6 sm:pb-16 sm:pt-32">
          <motion.div
            {...enter}
            variants={reduceMotion ? undefined : stagger}
            className="mx-auto max-w-md overflow-hidden rounded-lg border border-border-card bg-surface-card p-5 shadow-card sm:p-8"
          >
            <motion.div className="mb-6 text-center sm:mb-8" variants={fadeUp}>
              <h1 className="mb-2 font-dmSerif text-2xl font-bold text-text-primary sm:text-3xl">
                join predictionsLeague
              </h1>
              <p className="font-outfit text-sm text-text-muted sm:text-base">
                create an account to start your prediction journey
              </p>
            </motion.div>

            <motion.div className="mb-6 sm:mb-8" variants={fadeUp}>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {STEPS.map((step, index) => {
                  const status = stepStatus(formStep, step.id);
                  return (
                    <React.Fragment key={step.id}>
                      {index > 0 && (
                        <div className="relative h-1 w-8 overflow-hidden rounded-full bg-surface-track sm:w-12">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-brand-teal-deep transition-all duration-300"
                            style={{
                              width: stepStatus(formStep, STEPS[index - 1].id) === "complete" ? "100%" : "0%",
                            }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-outfit text-sm font-medium transition-colors sm:h-9 sm:w-9 ${
                            status === "current"
                              ? "bg-brand-teal-deep text-white"
                              : status === "complete"
                              ? "bg-brand-teal-tint text-brand-teal-deep"
                              : "bg-surface-elevated text-text-muted"
                          }`}
                        >
                          {status === "complete" ? <Check /> : step.id}
                        </div>
                        <div className="mt-1 font-outfit text-[10px] text-text-muted sm:text-xs">
                          {step.label}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>

            {(errors.submit || oauthError) && (
              <motion.div
                className="mb-6 rounded-lg border border-state-error/30 bg-state-error/10 px-4 py-3 font-outfit text-sm text-state-error"
                initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              >
                {errors.submit || oauthError}
              </motion.div>
            )}

            <form
              onSubmit={formStep === 3 ? handleSubmit : handleNextStep}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={reduceMotion ? false : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:gap-4">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="firstName" className={labelClass}>
                        first name
                      </label>
                      <div className={fieldWrap(errors.firstName)}>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="choose a first name"
                          className={inputClass}
                        />
                      </div>
                      {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="lastName" className={labelClass}>
                        last name
                      </label>
                      <div className={fieldWrap(errors.lastName)}>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="choose a last name"
                          className={inputClass}
                        />
                      </div>
                      {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="email" className={labelClass}>
                      email address
                    </label>
                    <div className={fieldWrap(errors.email)}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="password" className={labelClass}>
                      password
                    </label>
                    <div className={`relative ${fieldWrap(errors.password)}`}>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="choose a secure password"
                        className={`${inputClass} pr-10`}
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
                    {errors.password && <p className={errorClass}>{errors.password}</p>}
                    <div className="mt-2">
                      <div className="mb-1 font-outfit text-xs text-text-muted">
                        Password strength
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-track">
                        <div
                          className={`h-full transition-all ${strength.tone}`}
                          style={{ width: `${strength.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      confirm password
                    </label>
                    <div className={fieldWrap(errors.confirmPassword)}>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="confirm your password"
                        className={inputClass}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className={errorClass}>{errors.confirmPassword}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {formStep === 3 && (
                <motion.div
                  key="step3"
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={reduceMotion ? false : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="username" className={labelClass}>
                      username
                    </label>
                    <div className={fieldWrap(errors.username)}>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="choose a username"
                        className={inputClass}
                      />
                    </div>
                    {errors.username && <p className={errorClass}>{errors.username}</p>}
                  </div>
                  <div>
                    <label htmlFor="favouriteTeam" className={labelClass}>
                      favourite team
                    </label>
                    <div className={fieldWrap(errors.favouriteTeam)}>
                      <select
                        id="favouriteTeam"
                        name="favouriteTeam"
                        value={formData.favouriteTeam}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" className="bg-surface-card text-text-primary">
                          Select your team
                        </option>
                        {teams.map((team) => (
                          <option
                            key={team}
                            value={team}
                            className="bg-surface-card text-text-primary"
                          >
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.favouriteTeam && (
                      <p className={errorClass}>{errors.favouriteTeam}</p>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <label className="flex items-start sm:items-center">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded accent-brand-teal-deep sm:mt-0"
                      />
                      <span className="ml-2 font-outfit text-xs text-text-muted sm:text-sm">
                        i agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-brand-teal-deep transition-opacity hover:opacity-80"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-brand-teal-deep transition-opacity hover:opacity-80"
                        >
                          privacy policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 sm:mt-8">
                <Button type="submit" loading={isLoading} className="w-full">
                  {isLoading
                    ? "creating account..."
                    : formStep === 3
                    ? "create account"
                    : "verify email"}
                </Button>
              </div>
            </form>

            {formStep === 1 && (
              <motion.div variants={fadeUp} className="mt-6">
                <OAuthLoginSection
                  onOAuthLogin={handleOAuthSignup}
                  disabled={isLoading}
                />
              </motion.div>
            )}

            <motion.div className="mt-6 text-center sm:mt-8" variants={fadeUp}>
              <p className="font-outfit text-sm text-text-muted sm:text-base">
                already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-brand-teal-deep transition-opacity hover:opacity-80"
                >
                  log in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
