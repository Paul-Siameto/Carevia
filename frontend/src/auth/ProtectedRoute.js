import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return _jsx("div", { 
            className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900",
            children: _jsx("div", { 
                className: "text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg",
                children: [
                    _jsx("div", { 
                        className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent",
                        role: "status"
                    }),
                    _jsx("p", { 
                        className: "mt-4 text-gray-600 dark:text-gray-300",
                        children: "Loading your session..."
                    })
                ]
            })
        });
    }

    if (!user) {
        return _jsx(Navigate, { 
            to: "/login", 
            replace: true,
            state: { from: window.location.pathname }
        });
    }

    return _jsx(Outlet, {});
};

export default ProtectedRoute;

