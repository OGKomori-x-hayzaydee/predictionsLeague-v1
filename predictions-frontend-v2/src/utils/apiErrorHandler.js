import { showToast } from '../services/notificationService.js';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
};

// Classify error based on status code and response
export const classifyError = (error) => {
  if (!error.response) {
    return ERROR_TYPES.NETWORK;
  }
  
  const status = error.response.status;
  
  if (status === 401 || status === 403) {
    return ERROR_TYPES.AUTH;
  }
  
  if (status === 422 || status === 400) {
    return ERROR_TYPES.VALIDATION;
  }
  
  if (status >= 500) {
    return ERROR_TYPES.SERVER;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Extract user-friendly error message
export const getErrorMessage = (error) => {
  // If error has a response from the server
  if (error.response?.data) {
    const { data } = error.response;
    
    // Handle different response structures
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
    
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(', ');
    }
  }
  
  // Handle network errors
  if (error.request && !error.response) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Fallback to error message
  return error.message || 'An unexpected error occurred.';
};

// Extract validation errors for forms
export const getValidationErrors = (error) => {
  if (!error.response?.data) {
    return {};
  }
  
  const { data } = error.response;
  
  // Handle Spring Boot validation error format
  if (data.fieldErrors && Array.isArray(data.fieldErrors)) {
    const errors = {};
    data.fieldErrors.forEach((fieldError) => {
      errors[fieldError.field] = fieldError.message;
    });
    return errors;
  }
  
  // Handle other validation error formats
  if (data.errors && typeof data.errors === 'object') {
    return data.errors;
  }
  
  return {};
};

// Show appropriate error notification
export const handleApiError = (error, options = {}) => {
  const {
    showToast: shouldShowToast = true,
    customMessage = null,
    silent = false,
  } = options;
  
  if (silent) {
    return;
  }
  
  const errorType = classifyError(error);
  const message = customMessage || getErrorMessage(error);
  
  if (shouldShowToast) {
    let toastType = 'error';
    
    switch (errorType) {
      case ERROR_TYPES.NETWORK:
        toastType = 'warning';
        break;
      case ERROR_TYPES.VALIDATION:
        toastType = 'warning';
        break;
      default:
        toastType = 'error';
    }
    
    showToast(message, toastType);
  }
  
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      type: errorType,
      message,
      error,
    });
  }
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFunction, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFunction();
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      const errorType = classifyError(error);
      if (errorType === ERROR_TYPES.AUTH || errorType === ERROR_TYPES.VALIDATION) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

// Check if error should trigger a retry
export const shouldRetry = (error) => {
  const errorType = classifyError(error);
  
  // Retry on network errors and server errors
  return errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.SERVER;
};

// Format error for logging/debugging
export const formatErrorForLogging = (error) => {
  return {
    message: getErrorMessage(error),
    type: classifyError(error),
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
  };
};
