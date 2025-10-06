import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Health from "./pages/Health";
import Mood from "./pages/Mood";
import Articles from "./pages/Articles";
import AI from "./pages/AI";
import Privacy from "./pages/Privacy";
import ProtectedRoute from "./auth/ProtectedRoute";
function App() {
    return (_jsx(Providers, { children: _jsxs("div", { className: "min-h-screen", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-6xl mx-auto p-4", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/health", element: _jsx(Health, {}) }), _jsx(Route, { path: "/mood", element: _jsx(Mood, {}) }), _jsx(Route, { path: "/articles", element: _jsx(Articles, {}) }), _jsx(Route, { path: "/ai", element: _jsx(AI, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(Privacy, {}) })] })] }) })] }) }));
}
export default App;
