import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return _jsx(Navigate, { to: "/admin/login", replace: true });
  }

  if (!user.isAdmin) {
    return _jsx(Navigate, { to: "/dashboard", replace: true });
  }

  return _jsx(Outlet, {});
};

export default AdminProtectedRoute;
