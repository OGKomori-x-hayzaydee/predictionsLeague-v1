import React, { useState } from "react";
import { Box, Container, Button } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeOpenIcon, EyeClosedIcon, PersonIcon, CheckIcon } from "@radix-ui/react-icons";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    favoriteTeam: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const navigate = useNavigate();

  const teams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Tottenham Hotspur"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
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
      }
      
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    } else if (step === 2) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    // Prevent form submission when clicking Continue
    e.preventDefault();
    
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(formStep)) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted with:", formData);
      
      // Show success and redirect
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Failed to create account. Please try again." });
    } finally {
      setIsLoading(false);
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
              ease: "easeInOut" 
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
              ease: "easeInOut" 
            }}
          />
        </div>

        < Container size="2" className="relative z-10 pt-32 pb-16 mt-20">
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
                          ${formStep === step 
                            ? "bg-teal-600 text-white" 
                            : formStep > step 
                              ? "bg-teal-800 text-teal-200" 
                              : "bg-primary-600/80 text-indigo-200"}`}
                      >
                        {formStep > step ? <CheckIcon /> : step}
                      </div>
                      <div className="text-xs mt-1 text-teal-200 font-outfit">
                        {step === 1 ? "account" : step === 2 ? "security" : "preferences"}
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
              
              {errors.submit && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={formStep === 3 ? handleSubmit : handleNextStep} className="space-y-5">
                {/* Step 1: Account Info */}
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                        username
                      </label>
                      <div className={`bg-primary-600/50 rounded-md border ${errors.username ? 'border-red-500' : 'border-primary-400/30'} focus-within:border-teal-500 transition-colors`}>
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
                        <p className="text-red-300 text-xs mt-1">{errors.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                        email address
                      </label>
                      <div className={`bg-primary-600/50 rounded-md border ${errors.email ? 'border-red-500' : 'border-primary-400/30'} focus-within:border-teal-500 transition-colors`}>
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
                        <p className="text-red-300 text-xs mt-1">{errors.email}</p>
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
                      <label htmlFor="password" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                        password
                      </label>
                      <div className={`relative bg-primary-600/50 rounded-md border ${errors.password ? 'border-red-500' : 'border-primary-400/30'} focus-within:border-teal-500 transition-colors`}>
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
                        <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                      )}
                      <div className="mt-2">
                        <div className="text-xs text-teal-200/60 font-outfit mb-1">Password strength:</div>
                        <div className="h-1.5 w-full bg-primary-600/80 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${formData.password.length < 8 ? 'bg-red-500' : formData.password.length < 12 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, formData.password.length * 8)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                        confirm password
                      </label>
                      <div className={`bg-primary-600/50 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-primary-400/30'} focus-within:border-teal-500 transition-colors`}>
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
                        <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
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
                      <label htmlFor="favoriteTeam" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                        favorite team
                      </label>
                      <div className="bg-primary-600/50 rounded-md border border-primary-400/30 focus-within:border-teal-500 transition-colors">
                        <select
                          id="favoriteTeam"
                          name="favoriteTeam"
                          value={formData.favoriteTeam}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-transparent text-white font-outfit outline-none"
                        >
                          <option value="" className=" bg-primary-600/50 ">Select your team</option>
                          {teams.map((team) => (
                            <option key={team} value={team} className="bg-primary-600">{team}</option>
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
                          i agree to the <Link to="/terms" className="text-teal-300 hover:text-teal-200">terms of service</Link> and <Link to="/privacy" className="text-teal-300 hover:text-teal-200">privacy policy</Link>
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
                          : "continue"}
                    </Button>
                  </motion.div>
                </div>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-white/70 font-outfit">
                  already have an account?{" "}
                  <Link to="/login" className="text-teal-300 hover:text-teal-200 font-medium">
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
