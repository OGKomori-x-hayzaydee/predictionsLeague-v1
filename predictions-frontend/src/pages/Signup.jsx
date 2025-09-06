import React, { useState, useEffect } from "react";
import { Box, Container, Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  PersonIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import OAuthLoginSection from "../components/auth/OAuthLogin";
import oauthAPI from "../services/api/oauthAPI";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    favouriteTeam: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
    favouriteTeam: null,
    submit: null
  });
  const [formStep, setFormStep] = useState(1);
  const [oauthError, setOauthError] = useState(null);

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setOauthError(decodeURIComponent(errorParam));
      // Clean up URL
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  const handleOAuthSignup = (providerId) => {
    try {
      console.log(`🔄 Starting OAuth signup with ${providerId}`);
      
      // Store that this is a signup flow (not login)
      sessionStorage.setItem('oauth_flow_type', 'signup');
      
      // For signup, always redirect to onboarding even if user exists
      oauthAPI.initiateLogin(providerId, '/onboarding/select-team');
    } catch (error) {
      console.error('❌ OAuth signup error:', error);
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Validate based on current step
    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (step === 2) {
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

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    // Prevent form submission when clicking Continue
    e.preventDefault();
    console.log(`➡️ handleNextStep called - Current step: ${formStep}`);

    if (validateStep(formStep)) {
      console.log(`✅ Step ${formStep} validation passed, moving to step ${formStep + 1}`);
      setFormStep((prev) => prev + 1);
    } else {
      console.log(`❌ Step ${formStep} validation failed`);
    }
  };

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted");

    if (!validateStep(formStep)) {
      console.log("❌ Form validation failed");
      return;
    }

    console.log("✅ Form validation passed");

    // Clear submit errors but keep field errors initialized
    setErrors(prev => ({ ...prev, submit: null }));
    clearError();

    console.log("📋 Form data being sent:", {
      username: formData.username,
      email: formData.email,
      password: formData.password ? "[HIDDEN]" : "empty",
      confirmPassword: formData.confirmPassword ? "[HIDDEN]" : "empty",
      firstName: formData.firstName,
      lastName: formData.lastName,
      favouriteTeam: formData.favouriteTeam.toUpperCase(),
    });

    try {
      console.log("🔄 Calling register function...");
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        favouriteTeam: formData.favouriteTeam.toUpperCase(),
      });

      console.log("📥 Registration result:", result);

      if (result.success) {
        console.log("✅ Registration successful, redirecting to dashboard");
        // Redirect to dashboard after successful registration
        navigate("/home/dashboard", { replace: true });
      } else {
        console.log("❌ Registration failed:", result);
      }
    } catch (registrationError) {
      console.log("💥 Registration error caught:", registrationError);
      console.log("💥 Error message:", registrationError.message);
      console.log("💥 Error stack:", registrationError.stack);
      
      // Extract validation errors if any
      const fieldErrors = getValidationErrors(registrationError);
      console.log("🔍 Extracted field errors:", fieldErrors);
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        // Go back to the step with errors
        if (fieldErrors.username || fieldErrors.email) {
          console.log("↩️ Going back to step 1 due to field errors");
          setFormStep(1);
        } else if (fieldErrors.password || fieldErrors.confirmPassword) {
          console.log("↩️ Going back to step 2 due to password errors");
          setFormStep(2);
        }
      } else {
        console.log("⚠️ Setting general submit error");
        setErrors(prev => ({ ...prev, submit: "Failed to create account. Please try again." }));
      }
    }
  };

  return (
    <>
      <Navbar />
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

        <Container size="2" className="relative z-10 pt-32 pb-16 mt-20">
          {/* Signup form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 p-8"
          >
            <div className="text-center mb-8">
              <motion.h1
                className="text-teal-100 text-3xl font-bold font-dmSerif mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                join predictionsLeague
              </motion.h1>
              <motion.p
                className="text-white/70 font-outfit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                create an account to start your prediction journey
              </motion.p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-outfit 
                          ${
                            formStep === step
                              ? "bg-teal-600 text-white"
                              : formStep > step
                              ? "bg-teal-800 text-teal-200"
                              : "bg-primary-600/80 text-indigo-200"
                          }`}
                    >
                      {formStep > step ? <CheckIcon /> : step}
                    </div>
                    <div className="text-xs mt-1 text-teal-200 font-outfit">
                      {step === 1
                        ? "account"
                        : step === 2
                        ? "security"
                        : "preferences"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative h-1 bg-primary-600/80 mt-4">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-teal-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(formStep - 1) * 50}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {(errors.submit || oauthError) && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
                {errors.submit || oauthError}
              </div>
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
              className="space-y-5"
            >
              {/* Add hidden debug info */}
              <input type="hidden" name="debug-step" value={formStep} />
              <input type="hidden" name="debug-timestamp" value={Date.now()} />
              {/* Step 1: Account Info */}
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 flex gap-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="firstName"
                        className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                      >
                        first name
                      </label>
                      <div
                        className={`bg-primary-600/50 rounded-md border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-primary-400/30"
                        } focus-within:border-teal-500 transition-colors`}
                      >
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="choose a first name"
                          className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="lastName"
                        className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                      >
                        last name
                      </label>
                      <div
                        className={`bg-primary-600/50 rounded-md border ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-primary-400/30"
                        } focus-within:border-teal-500 transition-colors`}
                      >
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="choose a last name"
                          className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      username
                    </label>
                    <div
                      className={`bg-primary-600/50 rounded-md border ${
                        errors.username
                          ? "border-red-500"
                          : "border-primary-400/30"
                      } focus-within:border-teal-500 transition-colors`}
                    >
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="choose a username"
                        className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      email address
                    </label>
                    <div
                      className={`bg-primary-600/50 rounded-md border ${
                        errors.email
                          ? "border-red-500"
                          : "border-primary-400/30"
                      } focus-within:border-teal-500 transition-colors`}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {formStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      password
                    </label>
                    <div
                      className={`relative bg-primary-600/50 rounded-md border ${
                        errors.password
                          ? "border-red-500"
                          : "border-primary-400/30"
                      } focus-within:border-teal-500 transition-colors`}
                    >
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="choose a secure password"
                        className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-teal-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                    <div className="mt-2">
                      <div className="text-xs text-teal-200/60 font-outfit mb-1">
                        Password strength:
                      </div>
                      <div className="h-1.5 w-full bg-primary-600/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
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
                    <label
                      htmlFor="confirmPassword"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      confirm password
                    </label>
                    <div
                      className={`bg-primary-600/50 rounded-md border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-primary-400/30"
                      } focus-within:border-teal-500 transition-colors`}
                    >
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="confirm your password"
                        className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
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
                  <div>
                    <label
                      htmlFor="favouriteTeam"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      favourite team
                    </label>
                    <div className="bg-primary-600/50 rounded-md border border-primary-400/30 focus-within:border-teal-500 transition-colors">
                      <select
                        id="favouriteTeam"
                        name="favouriteTeam"
                        value={formData.favouriteTeam}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-transparent text-white font-outfit outline-none"
                      >
                        <option value="" className=" bg-primary-600/50 ">
                          Select your team
                        </option>
                        {teams.map((team) => (
                          <option
                            key={team}
                            value={team}
                            className="bg-primary-600"
                          >
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-teal-500 bg-primary-600/50 border-primary-400/30"
                      />
                      <span className="ml-2 text-white/70 text-sm font-outfit">
                        i agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-teal-300 hover:text-teal-200"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-teal-300 hover:text-teal-200"
                        >
                          privacy policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-8 justify-center">
                {formStep > 1 && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className=""
                  >
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-full px-4 py-2 border border-indigo-500/50 text-indigo-200 rounded-md hover:bg-indigo-800/20 font-outfit transition-colors"
                      size="4"
                    >
                      back
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className=""
                >
                  <Button
                    type={formStep === 3 ? "submit" : "submit"}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors"
                    disabled={isLoading}
                    size="4"
                    onClick={(e) => {
                      console.log(`🖱️ Button clicked - Step ${formStep}, Type: ${formStep === 3 ? "submit" : "continue"}`);
                      console.log("🖱️ isLoading:", isLoading);
                      console.log("🖱️ Event type:", e.type);
                      if (formStep === 3) {
                        console.log("🎯 This should trigger form submission");
                      }
                    }}
                  >
                    {isLoading
                      ? "creating account..."
                      : formStep === 3
                      ? "create account"
                      : "continue"}
                  </Button>
                </motion.div>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 font-outfit">
                already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-300 hover:text-teal-200 font-medium"
                >
                  log in
                </Link>
              </p>
            </div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
