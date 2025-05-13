import React, { useState } from "react";
import { Box, Container, Button, TextField } from "@radix-ui/themes";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally have your authentication logic
      console.log("Logging in with:", { email, password });
      
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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

        <Container size="2" className="relative z-10 pt-32 pb-16">
          {/* Login form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-500/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-primary-400/20 p-8 mt-20 max-w-md mx-auto items-center"
          >
            <div className="text-center mb-8">
              <motion.h1 
                className="text-teal-100 text-3xl font-bold font-dmSerif mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                welcome back
              </motion.h1>
              <motion.p
                className="text-white/70 font-outfit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                log in to access your predictions and leaderboards
              </motion.p>
            </div>

            {error && (
              <motion.div 
                className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                  email address
                </label>
                <div className="bg-primary-600/50 rounded-md border border-primary-400/30 focus-within:border-teal-500 transition-colors">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-teal-200 text-sm font-medium mb-2 font-outfit">
                  password
                </label>
                <div className="relative bg-primary-600/50 rounded-md border border-primary-400/30 focus-within:border-teal-500 transition-colors">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 bg-transparent text-white font-outfit placeholder-white/40 outline-none pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-teal-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm text-teal-300 hover:text-teal-200 font-outfit">
                    forgot password?
                  </Link>
                </div>
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
                  {isLoading ? "logging in..." : "log in"}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 font-outfit">
                don't have an account?{" "}
                <Link to="/signup" className="text-teal-300 hover:text-teal-200 font-medium">
                  sign up now
                </Link>
              </p>
            </div>
            
            <motion.div 
              className="mt-8 pt-6 border-t border-primary-400/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-teal-300/70 text-xs font-outfit">
                predictions for the 2025/26 Premier League season are now open
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}