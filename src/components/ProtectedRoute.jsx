import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useHermaAuth } from '../context/HermaAuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useHermaAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
