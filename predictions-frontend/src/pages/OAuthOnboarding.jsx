import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Box, Container, Button } from '@radix-ui/themes';
import authService from '../services/auth/AuthService';

export default function OAuthOnboarding() {
  const [formData, setFormData] = useState({
    username: '',
    favouriteTeam: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const teams = [
    "Arsenal", "Chelsea", "Liverpool", 
    "Manchester City", "Manchester United", "Tottenham Hotspur",
    "Brighton & Hove Albion", "Newcastle United", "West Ham United",
    "Aston Villa", "Crystal Palace", "Fulham"
  ];

  // Get user info on component mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const authResult = await authService.checkAuth({ 
          force: true, 
          source: 'oauth-onboarding' 
        });
        
        if (authResult.isAuthenticated) {
          setUserInfo(authResult.user);
        } else {
          // Not authenticated, redirect to login
          navigate('/login?error=session_expired', { replace: true });
        }
      } catch (error) {
        console.error('Failed to get user info:', error);
        navigate('/login?error=session_expired', { replace: true });
      }
    };

    getUserInfo();
  }, [navigate]);

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
    try {
      // Complete OAuth profile
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/oauth2/complete-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          favouriteTeam: formData.favouriteTeam
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrors({ username: 'Username already taken' });
          return;
        }
        throw new Error(errorData.error || 'Failed to complete profile');
      }

      const result = await response.json();
      
      // Update auth context with complete user info
      await login({
        skipApiCall: true,
        userData: {
          ...userInfo,
          username: result.user.username,
          favouriteTeam: result.user.favouriteTeam
        }
      });

      // Redirect to dashboard
      navigate('/home/dashboard', { replace: true });

    } catch (error) {
      console.error('Profile completion error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300"></div>
      </div>
    );
  }

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
              welcome {userInfo.firstName}! just a couple more details to get started
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
          </div>
        </motion.div>
      </Container>
    </Box>
  );
}
