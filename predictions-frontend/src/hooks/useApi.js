import { useState, useCallback } from 'react';
import { handleApiError, getValidationErrors } from '../utils/apiErrorHandler';

/**
 * Custom hook for making API calls with loading states and error handling
 */
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const clearErrors = useCallback(() => {
    setError(null);
    setValidationErrors({});
  }, []);

  const apiCall = useCallback(async (apiFunction, options = {}) => {
    const {
      showErrorToast = true,
      customErrorMessage = null,
      onSuccess = null,
      onError = null,
    } = options;

    setIsLoading(true);
    clearErrors();

    try {
      const result = await apiFunction();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (apiError) {
      // Extract validation errors
      const fieldErrors = getValidationErrors(apiError);
      if (Object.keys(fieldErrors).length > 0) {
        setValidationErrors(fieldErrors);
      }
      
      // Set general error
      setError(apiError.message || 'An error occurred');
      
      // Handle API error (shows toast, etc.)
      handleApiError(apiError, {
        showToast: showErrorToast,
        customMessage: customErrorMessage,
      });
      
      if (onError) {
        onError(apiError);
      }
      
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [clearErrors]);

  return {
    isLoading,
    error,
    validationErrors,
    clearErrors,
    apiCall,
  };
};

export default useApi;
