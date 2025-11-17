import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PremiumRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isPremium) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

export default PremiumRoute;
