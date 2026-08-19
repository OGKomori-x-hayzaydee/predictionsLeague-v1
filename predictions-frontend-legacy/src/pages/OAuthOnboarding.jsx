import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Box, Container, Button } from '@radix-ui/themes';

export default function OAuthOnboarding() {
  const [formData, setFormData] = useState({
    username: '',
    favouriteTeam: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { completeOAuthProfile, authState, oauthData } = useAuth();
  const navigate = useNavigate();

  const teams = [
    "Arsenal", "Chelsea", "Liverpool", 
    "Manchester City", "Manchester United", "Tottenham Hotspur",
  ];

  // Handle navigation based on AuthContext state
  useEffect(() => {
    // If user becomes authenticated, redirect to dashboard
    if (authState === 'authenticated') {
      console.log('OAuth Onboarding - User authenticated, redirecting to dashboard');
      navigate('/home/dashboard', { replace: true });
    }
  }, [authState, navigate]);

  // Get user info on component mount
  useEffect(() => {
    // OAuth data should be available from AuthContext
    if (oauthData.email) {
      console.log('OAuth Onboarding - Email available from AuthContext:', oauthData.email);
    } else {
      // Fallback to session storage for backward compatibility
      const storedEmail = sessionStorage.getItem('oauth_user_email');
      if (storedEmail) {
        console.log('OAuth Onboarding - Email retrieved from session storage:', storedEmail);
      } else {
        console.log('OAuth Onboarding - No email found in AuthContext or session storage');
      }
    }
  }, [oauthData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.favouriteTeam) {
      newErrors.favouriteTeam = "Please select your favourite team";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      // Use AuthContext method instead of direct API call
      console.log('OAuth Onboarding - Using AuthContext completeOAuthProfile method');
      
      await completeOAuthProfile({
        username: formData.username,
        favouriteTeam: formData.favouriteTeam
        // Email automatically included by AuthContext from oauthData or sessionStorage
      });
      
      // AuthContext handles auth state update and navigation will happen via useEffect
      console.log('OAuth Onboarding - Profile completion successful');

    } catch (error) {
      console.error('OAuth Onboarding - Profile completion error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Username already taken')) {
        setErrors({ username: 'Username already taken' });
      } else {
        setErrors({ submit: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      </div>

      <Container size="2" className="relative z-10 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 p-8 max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h1 
              className="text-teal-100 text-3xl font-bold font-dmSerif mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              complete your profile
            </motion.h1>
            <motion.p
              className="text-white/70 font-outfit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              welcome! just a couple more details to get started
            </motion.p>
          </div>

          {errors.submit && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                choose a username
              </label>
              <div className={`bg-primary-600/50 rounded-md border transition-colors ${
                errors.username 
                  ? 'border-red-500/50 focus-within:border-red-500' 
                  : 'border-primary-400/30 focus-within:border-teal-500'
              }`}>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  required
                  className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 font-outfit">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="favouriteTeam" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                favourite premier league team
              </label>
              <div className={`bg-primary-600/50 rounded-md border transition-colors ${
                errors.favouriteTeam 
                  ? 'border-red-500/50 focus-within:border-red-500' 
                  : 'border-primary-400/30 focus-within:border-teal-500'
              }`}>
                <select
                  id="favouriteTeam"
                  name="favouriteTeam"
                  value={formData.favouriteTeam}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent text-white font-outfit outline-none"
                >
                  <option value="" className="bg-primary-600">
                    select your team
                  </option>
                  {teams.map((team) => (
                    <option key={team} value={team} className="bg-primary-600">
                      {team}
                    </option>
                  ))}
                </select>
              </div>
              {errors.favouriteTeam && (
                <p className="text-red-400 text-xs mt-1 font-outfit">{errors.favouriteTeam}</p>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-center"
            >
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 mx-auto" 
                disabled={isLoading}
                size="4"
                color="indigo"
              >
                {isLoading ? "completing profile..." : "complete profile"}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm font-outfit">
              your google account is already verified ✓
            </p>
            {(oauthData.email || sessionStorage.getItem('oauth_user_email')) && (
              <p className="text-teal-300/70 text-xs font-outfit mt-1">
                signed in as: {oauthData.email || sessionStorage.getItem('oauth_user_email')}
              </p>
            )}
          </div>
        </motion.div>
      </Container>
    </Box>
  );
}
