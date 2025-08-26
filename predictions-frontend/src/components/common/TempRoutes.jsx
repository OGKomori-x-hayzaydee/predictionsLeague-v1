import React from 'react';

// Temporary route components for development without backend auth

// Allows all routes to be accessible during development
export const TempPrivateRoute = ({ children }) => {
  return children;
};

// Public routes that are always accessible
export const TempPublicRoute = ({ children }) => {
  return children;
};

// Conditional routes based on temp auth state
export const TempConditionalRoute = ({ children, condition = true }) => {
  return condition ? children : null;
};

export default { TempPrivateRoute, TempPublicRoute, TempConditionalRoute };
