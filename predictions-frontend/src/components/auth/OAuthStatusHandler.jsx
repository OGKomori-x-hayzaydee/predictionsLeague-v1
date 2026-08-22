import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Warning,
  Info,
  ArrowsClockwise,
  XCircle,
} from '@phosphor-icons/react';
import authService from '../../services/auth/AuthService';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import Button from '../ui/buttons/Button';
import IconButton from '../ui/buttons/IconButton';

const StatusIcon = ({ type, className = 'h-6 w-6' }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: Warning,
    info: Info,
    loading: ArrowsClockwise,
  };

  const Icon = icons[type] || Info;
  const spinClass = type === 'loading' ? 'animate-spin' : '';

  return <Icon className={`${className} ${spinClass}`} />;
};

const ICON_TONE = {
  success: 'text-state-success',
  error: 'text-state-error',
  warning: 'text-state-warning',
  info: 'text-state-info',
  loading: 'text-brand-teal',
};

const StatusMessage = ({ status, onClose, onRetry }) => {
  const statusConfig = {
    initiated: {
      type: 'info',
      title: 'Redirecting to login...',
      message: 'You will be taken to the secure login page',
      autoClose: false,
    },
    processing: {
      type: 'loading',
      title: 'Completing login...',
      message: 'Please wait while we verify your authentication',
      autoClose: false,
    },
    completed: {
      type: 'success',
      title: 'Login successful!',
      message: 'Welcome back! Redirecting to your dashboard...',
      autoClose: 3000,
    },
    error: {
      type: 'error',
      title: 'Login failed',
      message: 'There was a problem with your authentication',
      autoClose: false,
      showRetry: true,
    },
    cancelled: {
      type: 'warning',
      title: 'Login cancelled',
      message: 'Authentication was cancelled or interrupted',
      autoClose: 5000,
    },
    expired: {
      type: 'warning',
      title: 'Session expired',
      message: 'Your login session has expired, please try again',
      autoClose: false,
      showRetry: true,
    },
    invalid_state: {
      type: 'error',
      title: 'Security error',
      message: 'Invalid authentication state detected',
      autoClose: false,
      showRetry: true,
    },
    network_error: {
      type: 'error',
      title: 'Connection error',
      message: 'Unable to connect to authentication server',
      autoClose: false,
      showRetry: true,
    },
    retrying: {
      type: 'loading',
      title: 'Retrying login...',
      message: 'Attempting to reconnect to authentication service',
      autoClose: false,
    },
    max_retries_exceeded: {
      type: 'error',
      title: 'Connection failed',
      message: 'Unable to complete login after multiple attempts',
      autoClose: false,
      showRetry: false,
    },
  };

  const config = statusConfig[status] || statusConfig.error;
  const iconTone = ICON_TONE[config.type] || ICON_TONE.info;

  useEffect(() => {
    if (config.autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, config.autoClose);

      return () => clearTimeout(timer);
    }
  }, [config.autoClose, onClose]);

  const reduce = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
      className="rounded-lg border border-border-card bg-surface-elevated p-4 text-text-primary shadow-card"
    >
      <div className="flex items-start space-x-3">
        <StatusIcon
          type={config.type}
          className={`mt-0.5 h-6 w-6 flex-shrink-0 ${iconTone}`}
        />

        <div className="min-w-0 flex-1">
          <h4 className="font-outfit font-semibold text-text-primary">{config.title}</h4>
          <p className="mt-1 font-outfit text-sm text-text-muted">{config.message}</p>
        </div>

        <div className="flex items-center space-x-2">
          {config.showRetry && onRetry && (
            <Button onClick={onRetry} className="min-h-11">
              Retry
            </Button>
          )}

          {onClose && !config.autoClose && (
            <IconButton label="Dismiss" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </IconButton>
          )}
        </div>
      </div>

      {config.autoClose && (
        <div className="mt-3">
          <div className="h-1 overflow-hidden rounded-full bg-surface-track">
            <motion.div
              className="h-full rounded-full bg-brand-teal-deep"
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
    const unsubscribers = [];

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

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const handleClose = () => {
    setCurrentStatus(null);
    setStatusDetails({});
  };

  const handleRetry = async () => {
    try {
      handleClose();

      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } catch (error) {
      console.error('Retry failed:', error);

      setCurrentStatus('error');
      setStatusDetails({
        error: 'Retry failed. Please try again later.',
        errorType: 'retry_failed',
      });
    }
  };

  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm ${className}`}>
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
