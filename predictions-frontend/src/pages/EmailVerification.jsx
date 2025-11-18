import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Container, Button } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import authAPI from '../services/api/authAPI';
import Navbar from '../components/landingPage/Navbar';
import Footer from '../components/landingPage/Footer';

export default function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Prevent multiple OTP sends
  const hasInitialized = useRef(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Determine flow type and email (only for regular signup now)
  const flowType = searchParams.get('flow') || 'signup';
  const email = searchParams.get('email') || location.state?.email || '';
  const redirectTo = searchParams.get('redirect') || '/home/dashboard';

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    // OAuth users don't need email verification - redirect them away
    if (flowType === 'oauth') {
      console.log('OAuth user detected in email verification - redirecting to finish onboarding');
      navigate('/auth/finish-onboarding', { replace: true });
      return;
    }

    if (!email) {
      console.error('No email provided for verification');
      navigate('/signup', { replace: true });
      return;
    }

    setUserEmail(email);

    // Auto-send OTP when component mounts (only once)
    sendOtp();
  }, [email, navigate, flowType]); // Keep dependencies but use ref guard

  const sendOtp = async () => {
    try {
      console.log('📧 Sending OTP to:', email);
      setIsOtpSent(false);
      
      await authAPI.sendVerifyOtp({
        email: email,
        type: 'email_verification'
      });
      
      setIsOtpSent(true);
    } catch (error) {
      setErrors({ submit: 'Failed to send verification code. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow 6 digits
    console.log('EmailVerification - OTP input changed:', value);
    setOtp(value);
    
    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: null }));
    }
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!otp) {
      newErrors.otp = "Verification code is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "Please enter a valid 6-digit code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('EmailVerification - Submit triggered');
    console.log('EmailVerification - OTP state:', otp);
    console.log('EmailVerification - OTP length:', otp.length);
    console.log('EmailVerification - Email:', email);
    
    if (!validateOtp()) return;

    setIsVerifying(true);
    
    try {
      const verifyData = {
        email: email,
        otp: otp,
        type: 'email_verification'
      };
      
      console.log('EmailVerification - Sending verify request with data:', verifyData);
      
      await authAPI.verifyOtp(verifyData);
      
      setIsVerifying(false);
      
      // Navigate to appropriate destination
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('EmailVerification - Verify error:', error);
      setIsVerifying(false);
      setErrors({ otp: 'Invalid verification code. Please try again.' });
    }
  };

  const handleResendOtp = async () => {
    await sendOtp();
    setOtp(''); // Clear current OTP input
    setErrors({}); // Clear any errors
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 p-8 max-w-md mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-teal-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckIcon className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h1
                className="text-teal-100 text-2xl font-bold font-dmSerif mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                verify your email
              </motion.h1>
              
              <motion.div
                className="text-white/70 font-outfit text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="mb-1">we've sent a 6-digit verification code to</p>
                <p className="text-teal-300 font-medium">{userEmail}</p>
              </motion.div>
            </div>

            {/* Error message */}
            {(errors.submit || errors.otp) && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
                {errors.submit || errors.otp}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-teal-200 text-sm font-medium mb-2 font-outfit"
                >
                  verification code
                </label>
                <div
                  className={`bg-primary-600/50 rounded-md border ${
                    errors.otp ? "border-red-500" : "border-primary-400/30"
                  } focus-within:border-teal-500 transition-colors`}
                >
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={handleChange}
                    placeholder="enter 6-digit code"
                    maxLength="6"
                    className="w-full px-3 py-3 bg-transparent text-white font-outfit placeholder-white/40 outline-none text-center text-lg tracking-wider"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              {/* Submit button */}
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-outfit"
                  disabled={isVerifying || !otp}
                >
                  {isVerifying ? "verifying..." : "verify email"}
                </button>
              </motion.div>

              {/* Resend link */}
              <div className="text-center">
                <p className="text-white/70 font-outfit text-sm mb-2">
                  didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-teal-300 hover:text-teal-200 font-outfit text-sm font-medium underline disabled:opacity-50"
                  disabled={!isOtpSent || isVerifying}
                >
                  resend code
                </button>
              </div>
            </form>

          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
