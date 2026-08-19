import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircledIcon, 
  ExclamationTriangleIcon, 
  InfoCircledIcon,
  UpdateIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';
import authService from '../../services/auth/AuthService';

const StatusIcon = ({ type, className = "w-6 h-6" }) => {
  const icons = {
    success: CheckCircledIcon,
    error: CrossCircledIcon,
    warning: ExclamationTriangleIcon,
    info: InfoCircledIcon,
    loading: UpdateIcon,
  };
  
  const Icon = icons[type] || InfoCircledIcon;
  const spinClass = type === 'loading' ? 'animate-spin' : '';
  
  return <Icon className={`${className} ${spinClass}`} />;
};

const StatusMessage = ({ status, onClose, onRetry }) => {
  const statusConfig = {
    initiated: {
      type: 'info',
      title: 'Redirecting to login...',
      message: 'You will be taken to the secure login page',
      color: 'blue',
      autoClose: false,
    },
    processing: {
      type: 'loading',
      title: 'Completing login...',
      message: 'Please wait while we verify your authentication',
      color: 'blue',
      autoClose: false,
    },
    completed: {
      type: 'success',
      title: 'Login successful!',
      message: 'Welcome back! Redirecting to your dashboard...',
      color: 'green',
      autoClose: 3000,
    },
    error: {
      type: 'error',
      title: 'Login failed',
      message: 'There was a problem with your authentication',
      color: 'red',
      autoClose: false,
      showRetry: true,
    },
    cancelled: {
      type: 'warning',
      title: 'Login cancelled',
      message: 'Authentication was cancelled or interrupted',
      color: 'yellow',
      autoClose: 5000,
    },
    expired: {
      type: 'warning',
      title: 'Session expired',
      message: 'Your login session has expired, please try again',
      color: 'orange',
      autoClose: false,
      showRetry: true,
    },
    invalid_state: {
      type: 'error',
      title: 'Security error',
      message: 'Invalid authentication state detected',
      color: 'red',
      autoClose: false,
      showRetry: true,
    },
    network_error: {
      type: 'error',
      title: 'Connection error',
      message: 'Unable to connect to authentication server',
      color: 'red',
      autoClose: false,
      showRetry: true,
    },
    retrying: {
      type: 'loading',
      title: 'Retrying login...',
      message: 'Attempting to reconnect to authentication service',
      color: 'blue',
      autoClose: false,
    },
    max_retries_exceeded: {
      type: 'error',
      title: 'Connection failed',
      message: 'Unable to complete login after multiple attempts',
      color: 'red',
      autoClose: false,
      showRetry: false,
    },
  };

  const config = statusConfig[status] || statusConfig.error;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-900/30 border-blue-500/30',
      text: 'text-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
      bg: 'bg-green-900/30 border-green-500/30',
      text: 'text-green-200',
      button: 'bg-green-600 hover:bg-green-700',
    },
    red: {
      bg: 'bg-red-900/30 border-red-500/30',
      text: 'text-red-200',
      button: 'bg-red-600 hover:bg-red-700',
    },
    yellow: {
      bg: 'bg-yellow-900/30 border-yellow-500/30',
      text: 'text-yellow-200',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    orange: {
      bg: 'bg-orange-900/30 border-orange-500/30',
      text: 'text-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
  };

  const colors = colorClasses[config.color];

  useEffect(() => {
    if (config.autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, config.autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [config.autoClose, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${colors.bg} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-start space-x-3">
        <StatusIcon 
          type={config.type} 
          className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} 
        />
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${colors.text} font-outfit`}>
            {config.title}
          </h4>
          <p className="text-white/70 text-sm mt-1 font-outfit">
            {config.message}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {config.showRetry && onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className={`${colors.button} text-white px-3 py-1 rounded text-sm font-medium transition-colors`}
            >
              Retry
            </motion.button>
          )}
          
          {onClose && !config.autoClose && (
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white/70 transition-colors"
            >
              <CrossCircledIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {config.autoClose && (
        <div className="mt-3">
          <div className={`h-1 bg-white/10 rounded-full overflow-hidden`}>
            <motion.div
              className={`h-full ${colors.button.split(' ')[0]} rounded-full`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: config.autoClose / 1000, ease: 'linear' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const OAuthStatusHandler = ({ className = '' }) => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [statusDetails, setStatusDetails] = useState({});

  useEffect(() => {
    // Listen to simplified auth service events only
    const unsubscribers = [];

    // Listen to auth service events for OAuth-related errors
    unsubscribers.push(
      authService.on('oauth-error', (data) => {
        setCurrentStatus('error');
        setStatusDetails(data);
      })
    );

    unsubscribers.push(
      authService.on('oauth-authenticated', (data) => {
        setCurrentStatus('completed');
        setStatusDetails(data);
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const handleClose = () => {
    setCurrentStatus(null);
    setStatusDetails({});
  };

  const handleRetry = async () => {
    try {
      // Simple retry - just redirect to login
      handleClose();
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } catch (error) {
      console.error('Retry failed:', error);
      
      // Show error message
      setCurrentStatus('error');
      setStatusDetails({ 
        error: 'Retry failed. Please try again later.',
        errorType: 'retry_failed' 
      });
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <AnimatePresence>
        {currentStatus && (
          <StatusMessage
            status={currentStatus}
            details={statusDetails}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OAuthStatusHandler;