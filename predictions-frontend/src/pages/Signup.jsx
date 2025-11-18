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
import authAPI from "../services/api/authAPI";

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
        favouriteTeam: formData.favouriteTeam, // Remove .toUpperCase() - let mapping function handle it
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
              <div className="flex items-center justify-center">
                {[1, 3].map((step, index) => (
                  <div key={step} className="flex flex-col items-center mx-auto">
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
                      {formStep > step ? <CheckIcon /> : index + 1}
                    </div>
                    <div className="text-xs mt-1 text-teal-200 font-outfit">
                      {step === 1 ? "details" : "preferences"}
                    </div>
                  </div>
                ))}
                <div className="relative h-1 bg-primary-600/80 mt-4">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-teal-500"
                  initial={{ width: "0%" }}
                  animate={{ width: formStep === 3 ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              </div>
              <div className="relative h-1 bg-primary-600/80 mt-4">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-teal-500"
                  initial={{ width: "0%" }}
                  animate={{ width: formStep === 3 ? "100%" : "0%" }}
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
                      htmlFor="favouriteTeam"
                      className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                    >
                      favourite team
                    </label>
                    <div className={`bg-primary-600/50 rounded-md border ${
                        errors.favouriteTeam
                          ? "border-red-500"
                          : "border-primary-400/30"
                      } focus-within:border-teal-500 transition-colors`}>
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
                    {errors.favouriteTeam && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.favouriteTeam}
                      </p>
                    )}
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
