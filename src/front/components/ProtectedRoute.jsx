import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProtectedRoute = ({ children }) => {
  const { store } = useGlobalReducer();
  
  if (!store.auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};