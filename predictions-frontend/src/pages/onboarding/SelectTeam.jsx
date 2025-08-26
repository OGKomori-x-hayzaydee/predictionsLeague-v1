import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';

/**
 * OAuth User Onboarding Page
 * For new OAuth users to complete their profile (username + team selection)
 * Matches the design and flow of the email signup Steps 1 & 3
 */
export default function SelectTeam() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    favouriteTeam: ''
  });
  const [errors, setErrors] = useState({
    username: null,
    favouriteTeam: null
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Premier League teams (matching the signup form exactly)
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

    if (step === 1) {
      // Username validation (matching signup validation)
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      }
    } else if (step === 2) {
      // Team validation
      if (!formData.favouriteTeam) {
        newErrors.favouriteTeam = "Please select your favourite team";
      }
      // Terms validation
      if (!termsAccepted) {
        newErrors.terms = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
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
    
    if (!validateStep(formStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to update user's profile
      // const response = await userAPI.completeOAuthProfile({
      //   username: formData.username,
      //   favouriteTeam: formData.favouriteTeam.toUpperCase()
      // });
      
      // Update local user state (matching signup data structure)
      updateUser({ 
        username: formData.username,
        favouriteTeam: formData.favouriteTeam.toUpperCase(), // Convert to uppercase like signup
        isNewUser: false
      });

      console.log('✅ OAuth profile completion successful:', {
        username: formData.username,
        favouriteTeam: formData.favouriteTeam.toUpperCase()
      });
      
      // Redirect to dashboard
      navigate('/home/dashboard', { replace: true });
      
    } catch (error) {
      console.error('❌ Error completing OAuth profile:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-primary-500 min-h-screen">
      {/* Background elements - matching signup page */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-40 left-10 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl"
          animate={{ 
            x: [0, 10, -10, 0],
            y: [0, 15, 5, 0],
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ 
            x: [0, -15, 15, 0],
            y: [0, -10, 10, 0],
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-primary-500/60 backdrop-blur-md rounded-2xl p-8 border border-primary-400/20"
        >
          {/* Header - matching signup style */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-dmSerif text-teal-100 mb-2"
            >
              complete your profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 font-outfit"
            >
              {formStep === 1 ? 'choose your username' : 'select your favorite team'}
            </motion.p>
          </div>

          {/* Step Indicator - matching signup */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      formStep === step
                        ? "bg-teal-500 text-white"
                        : formStep > step
                        ? "bg-teal-600 text-white"
                        : "bg-primary-600/50 text-white/50 border border-primary-400/30"
                    }`}
                  >
                    {formStep > step ? <CheckIcon /> : step}
                  </div>
                  {step < 2 && (
                    <motion.div
                      className="w-12 h-1 bg-primary-600/50 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${(formStep - 1) * 50}%` }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-full bg-teal-500"></div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form - matching signup form structure */}
          <form onSubmit={formStep === 2 ? handleSubmit : handleNextStep} className="space-y-6">
            {/* Step 1: Username Selection */}
            {formStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
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

                {/* Show user's existing info from OAuth */}
                <div className="mt-4 p-3 bg-primary-600/30 rounded-md border border-primary-400/20">
                  <p className="text-white/60 text-sm font-outfit mb-2">Your Google account info:</p>
                  <p className="text-teal-200 text-sm font-outfit">
                    <strong>Name:</strong> {user?.name || 'Not provided'}
                  </p>
                  <p className="text-teal-200 text-sm font-outfit">
                    <strong>Email:</strong> {user?.email || 'Not provided'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Team Selection + Terms */}
            {formStep === 2 && (
              <motion.div
                key="step2"
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
                      required
                    >
                      <option value="" className="bg-primary-600/50">
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

                {/* Terms Agreement - matching signup */}
                <div className="mt-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-teal-500 bg-primary-600/50 border-primary-400/30"
                      required
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
                  {errors.terms && (
                    <p className="text-red-300 text-xs mt-1">
                      {errors.terms}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation buttons - matching signup style */}
            <div className="flex gap-4 mt-8 justify-center">
              {formStep > 1 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
              >
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors"
                  disabled={isSubmitting}
                  size="4"
                >
                  {isSubmitting ? 'completing...' : (formStep === 2 ? 'complete signup' : 'continue')}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
