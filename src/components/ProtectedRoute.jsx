// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux store
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;