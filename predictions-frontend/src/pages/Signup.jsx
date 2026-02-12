import React, { useState, useEffect } from "react";
import { Box, Container, Button } from "@radix-ui/themes";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import OAuthLoginSection from "../components/auth/OAuthLogin";
import oauthAPI from "../services/api/oauthAPI";
import authAPI from "../services/api/authAPI";

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
    submit: null
  });
  const [formStep, setFormStep] = useState(1);
  const [oauthError, setOauthError] = useState(null);

  const { register, isLoading, error, dispatch, AUTH_ACTIONS } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for OAuth errors in URL parameters and handle step restoration
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    const stepParam = urlParams.get('step');
    const emailParam = urlParams.get('email');

    if (errorParam) {
      setOauthError(decodeURIComponent(errorParam));
      // Clean up URL
      navigate(location.pathname, { replace: true });
    }

    // Handle returning from email verification
    if (stepParam === '3') {
      // User account already exists, just proceed to complete profile
      setFormStep(3);

      // Restore email from URL parameter OR sessionStorage
      let userEmail = null;

      if (emailParam) {
        userEmail = decodeURIComponent(emailParam);
        console.log('Signup - Restoring email from URL:', userEmail);
        // Store in sessionStorage for future use
        sessionStorage.setItem('signup_email', userEmail);
      } else {
        // Try to get from sessionStorage
        userEmail = sessionStorage.getItem('signup_email');
        console.log('Signup - Restoring email from sessionStorage:', userEmail);
      }

      if (userEmail) {
        setFormData(prev => ({
          ...prev,
          email: userEmail
        }));
      } else {
        console.log('Signup - No email found in URL or sessionStorage');
      }

      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  const handleOAuthSignup = (providerId) => {
    try {
      // Use the dedicated signup method which handles flow type automatically
      oauthAPI.initiateSignup(providerId);
    } catch (error) {
      setOauthError(error.message);
    }
  };

  // Helper function to clear general errors
  const clearError = () => {
    setErrors(prev => ({ ...prev, submit: null }));
  };

  // Helper function to extract validation errors from API response
  const getValidationErrors = (error) => {
    const fieldErrors = {};

    // Check if error has validation details
    if (error?.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      Object.keys(validationErrors).forEach(field => {
        fieldErrors[field] = validationErrors[field][0]; // Take first error message
      });
    } else if (error?.message?.includes('Username')) {
      fieldErrors.username = error.message;
    } else if (error?.message?.includes('Email')) {
      fieldErrors.email = error.message;
    } else if (error?.message?.includes('Password')) {
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

    // Store email in sessionStorage as soon as it's entered
    if (name === 'email' && value) {
      sessionStorage.setItem('signup_email', value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Step 1: User details & password
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
    }
    // Step 3: Preferences (username & favourite team)
    else if (step === 3) {
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

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async (e) => {
    // Prevent form submission when clicking Continue
    e.preventDefault();

    if (!validateStep(formStep)) {
      return;
    }

    // If moving from step 1 to step 2, create incomplete user account
    if (formStep === 1) {
      try {
        // Register user with incomplete data (no username/team yet)
        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          // username and favouriteTeam will be added later
        });

        if (result.success) {
          console.log('Registration successful, navigating to email verification...');
          // User is created but incomplete - redirect to email verification
          const redirectUrl = `/signup?step=3`; // Email will come from sessionStorage

          // Small delay to ensure loading state is cleared
          setTimeout(() => {
            navigate(`/verify-email?flow=signup&email=${encodeURIComponent(formData.email)}&redirect=${encodeURIComponent(redirectUrl)}`, {
              replace: true
            });
          }, 100);
          return;
        } else {
          throw new Error(result.error || 'Failed to create account');
        }
      } catch (error) {
        const fieldErrors = getValidationErrors(error);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        } else {
          setErrors(prev => ({ ...prev, submit: 'Failed to create account. Please try again.' }));
        }
        return;
      }
    }

    setFormStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(formStep)) {
      return;
    }

    // Clear submit errors but keep field errors initialized
    setErrors(prev => ({ ...prev, submit: null }));
    clearError();

    try {
      // Complete user profile with username and favourite team
      const result = await authAPI.completeProfile({
        username: formData.username,
        favouriteTeam: formData.favouriteTeam,
        email: formData.email,
      });

      if (result.success) {
        console.log('Signup - CompleteProfile succeeded, result:', result);
        console.log('Signup - About to dispatch LOGIN_SUCCESS with user:', result.user);

        // Update auth context with the completed user data
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });

        console.log('Signup - LOGIN_SUCCESS dispatched');

        // Cleanup sessionStorage since signup is complete
        sessionStorage.removeItem('signup_email');
        console.log('Signup - SessionStorage cleaned up');

        // Small delay to ensure auth state is updated before navigation
        console.log('Signup - Waiting 100ms before navigation...');
        setTimeout(() => {
          console.log('Signup - Navigating to dashboard...');
          navigate("/home/dashboard", { replace: true });
        }, 100);
      }
    } catch (registrationError) {
      // Extract validation errors if any
      const fieldErrors = getValidationErrors(registrationError);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        // Go back to the step with errors
        if (fieldErrors.firstName || fieldErrors.lastName || fieldErrors.email || fieldErrors.password || fieldErrors.confirmPassword) {
          setFormStep(1);
        } else if (fieldErrors.username || fieldErrors.favouriteTeam) {
          setFormStep(3);
        }
      } else {
        setErrors(prev => ({ ...prev, submit: "Failed to create account. Please try again." }));
      }
    }
  };

  // Shared input wrapper classes
  const inputWrapperClass = (fieldError) =>
    `bg-white dark:bg-primary-600/50 rounded-md sm:rounded-lg border transition-colors ${
      fieldError
        ? "border-red-400 dark:border-red-500/50 focus-within:border-red-500"
        : "border-slate-200 dark:border-primary-500/50 focus-within:border-teal-light dark:focus-within:border-teal-500"
    }`;

  const inputClass =
    "w-full px-3 py-2.5 sm:py-2 bg-transparent text-light-text dark:text-white font-outfit placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm sm:text-base";

  const labelClass =
    "block text-light-text dark:text-slate-200 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-outfit";

  const errorClass = "text-red-500 dark:text-red-300 text-xs mt-1 font-outfit";

  return (
    <>
      <Navbar />
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

        <Container size="2" className="relative z-10 pt-24 sm:pt-32 pb-8 sm:pb-16 mt-12 sm:mt-20 px-4 sm:px-6">
          {/* Signup form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="rounded-xl overflow-hidden p-5 sm:p-6 md:p-8 bg-white/80 dark:bg-primary-700/50 backdrop-blur-md border border-light-border dark:border-primary-700/30 shadow-lg dark:shadow-none transition-colors duration-300"
          >
            <motion.div className="text-center mb-6 sm:mb-8" variants={fadeUp}>
              <h1 className="text-light-text dark:text-white text-2xl sm:text-3xl font-bold font-dmSerif mb-2">
                join predictionsLeague
              </h1>
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm sm:text-base">
                create an account to start your prediction journey
              </p>
            </motion.div>

            {/* Step Indicator */}
            <motion.div className="mb-6 sm:mb-8" variants={fadeUp}>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {[1, 3].map((step, index) => (
                  <React.Fragment key={step}>
                    {index > 0 && (
                      <div className="relative h-1 w-12 sm:w-20 bg-slate-200 dark:bg-primary-600/80 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-teal-light dark:bg-teal-dark rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: formStep >= 3 ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium font-outfit transition-colors ${
                          formStep === step
                            ? "bg-teal-light dark:bg-teal-dark text-white dark:text-primary-800"
                            : formStep > step
                            ? "bg-teal-light/20 dark:bg-teal-800 text-teal-light dark:text-teal-200"
                            : "bg-slate-100 dark:bg-primary-600/80 text-slate-400 dark:text-indigo-200"
                        }`}
                      >
                        {formStep > step ? <CheckIcon /> : index + 1}
                      </div>
                      <div className="text-xs mt-1 text-light-text-secondary dark:text-slate-300 font-outfit">
                        {step === 1 ? "details" : "preferences"}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {(errors.submit || oauthError) && (
              <motion.div
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-6 font-outfit text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.submit || oauthError}
              </motion.div>
            )}

            {/* OAuth Signup Section - Only show on step 1 */}
            {formStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <OAuthLoginSection
                  onOAuthLogin={handleOAuthSignup}
                  disabled={isLoading}
                />
              </motion.div>
            )}

            <form
              onSubmit={formStep === 3 ? handleSubmit : handleNextStep}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              {/* Step 1: Account Info */}
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="firstName" className={labelClass}>
                        first name
                      </label>
                      <div className={inputWrapperClass(errors.firstName)}>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="choose a first name"
                          className={inputClass}
                        />
                      </div>
                      {errors.firstName && (
                        <p className={errorClass}>{errors.firstName}</p>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="lastName" className={labelClass}>
                        last name
                      </label>
                      <div className={inputWrapperClass(errors.lastName)}>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="choose a last name"
                          className={inputClass}
                        />
                      </div>
                      {errors.lastName && (
                        <p className={errorClass}>{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="email" className={labelClass}>
                      email address
                    </label>
                    <div className={inputWrapperClass(errors.email)}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                    {errors.email && (
                      <p className={errorClass}>{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="password" className={labelClass}>
                      password
                    </label>
                    <div className={`relative ${inputWrapperClass(errors.password)}`}>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="choose a secure password"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-light dark:text-teal-dark hover:opacity-70 transition-opacity"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className={errorClass}>{errors.password}</p>
                    )}
                    <div className="mt-2">
                      <div className="text-xs text-light-text-secondary dark:text-slate-400 font-outfit mb-1">
                        Password strength:
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-primary-600/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            formData.password.length < 8
                              ? "bg-red-500"
                              : formData.password.length < 12
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              formData.password.length * 8
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      confirm password
                    </label>
                    <div className={inputWrapperClass(errors.confirmPassword)}>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
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

              {/* Step 3: Preferences */}
              {formStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3 sm:mb-4">
                    <label htmlFor="username" className={labelClass}>
                      username
                    </label>
                    <div className={inputWrapperClass(errors.username)}>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="choose a username"
                        className={inputClass}
                      />
                    </div>
                    {errors.username && (
                      <p className={errorClass}>{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="favouriteTeam" className={labelClass}>
                      favourite team
                    </label>
                    <div className={inputWrapperClass(errors.favouriteTeam)}>
                      <select
                        id="favouriteTeam"
                        name="favouriteTeam"
                        value={formData.favouriteTeam}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" className="bg-white dark:bg-primary-600">
                          Select your team
                        </option>
                        {teams.map((team) => (
                          <option
                            key={team}
                            value={team}
                            className="bg-white dark:bg-primary-600 text-light-text dark:text-white"
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
                        className="w-4 h-4 mt-0.5 sm:mt-0 accent-teal-light dark:accent-teal-dark rounded"
                      />
                      <span className="ml-2 text-light-text-secondary dark:text-slate-300 text-xs sm:text-sm font-outfit">
                        i agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-teal-light dark:text-teal-dark hover:opacity-80 transition-opacity"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-teal-light dark:text-teal-dark hover:opacity-80 transition-opacity"
                        >
                          privacy policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                {formStep > 1 && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-full px-4 py-2.5 sm:py-2 border border-slate-300 dark:border-white/20 bg-transparent text-light-text dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-md font-outfit transition-colors cursor-pointer"
                      size="4"
                    >
                      back
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto sm:flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-teal-light dark:bg-teal-dark text-white dark:text-primary-800 hover:opacity-90 font-bold font-outfit py-2.5 sm:py-3 px-6 rounded-md transition-opacity cursor-pointer"
                    disabled={isLoading}
                    size="4"
                  >
                    {isLoading
                      ? "creating account..."
                      : formStep === 3
                      ? "create account"
                      : "verify email"}
                  </Button>
                </motion.div>
              </div>
            </form>

            <motion.div className="mt-6 sm:mt-8 text-center" variants={fadeUp}>
              <p className="text-light-text-secondary dark:text-slate-300 font-outfit text-sm sm:text-base">
                already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-light dark:text-teal-dark hover:opacity-80 font-medium transition-opacity"
                >
                  log in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
