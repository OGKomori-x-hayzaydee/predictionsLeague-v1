import { useState, useLayoutEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for handling OAuth callback processing
 * Uses useLayoutEffect and ref guards to prevent race conditions
 * Delegates to AuthContext for all OAuth logic
 */
export const useOAuthCallback = () => {
  const { handleOAuthCallback, authState, error } = useAuth();
  const [localState, setLocalState] = useState({
    isProcessing: true,
    error: null,
    completed: false
  });
  
  // Prevent multiple executions
  const hasProcessed = useRef(false);
  const processingRef = useRef(false);

  useLayoutEffect(() => {
    // Double guard against multiple executions
    if (hasProcessed.current || processingRef.current) {
      return;
    }

    const processOAuthCallback = async () => {
      // Immediate guards
      if (processingRef.current) return;
      processingRef.current = true;
      hasProcessed.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Delegate all OAuth logic to AuthContext
        await handleOAuthCallback(urlParams);
        
        setLocalState({
          isProcessing: false,
          error: null,
          completed: true
        });
        
      } catch (error) {
        setLocalState({
          isProcessing: false,
          error: error.message || 'OAuth processing failed',
          completed: false
        });
      }
    };

    processOAuthCallback();
  }, [handleOAuthCallback]);

  // Return state based on AuthContext state + local processing state
  return {
    isProcessing: localState.isProcessing,
    error: localState.error || error,
    completed: localState.completed
  };
};
