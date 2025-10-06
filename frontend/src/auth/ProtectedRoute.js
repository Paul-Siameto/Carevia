import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(Outlet, {});
};
export default ProtectedRoute;
