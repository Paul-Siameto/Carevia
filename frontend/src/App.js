import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
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
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
    return (_jsx(Providers, { children: _jsxs("div", { className: "min-h-screen flex flex-col", children: [
                _jsx(Navbar, {}),
                _jsx("main", { className: "flex-1", children: _jsx("div", { className: "max-w-6xl mx-auto p-4", children: _jsxs(Routes, { children: [
                                _jsx(Route, { path: "/", element: _jsx(Landing, {}) }),
                                _jsx(Route, { path: "/login", element: _jsx(Login, {}) }),
                                _jsx(Route, { path: "/register", element: _jsx(Register, {}) }),
                                _jsx(Route, { path: "/welcome", element: _jsx(Landing, {}) }),
                                _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [
                                        _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }),
                                        _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }),
                                        _jsx(Route, { path: "/health", element: _jsx(Health, {}) }),
                                        _jsx(Route, { path: "/mood", element: _jsx(Mood, {}) }),
                                        _jsx(Route, { path: "/articles", element: _jsx(Articles, {}) }),
                                        _jsx(Route, { path: "/ai", element: _jsx(AI, {}) }),
                                        _jsx(Route, { path: "/privacy", element: _jsx(Privacy, {}) }),
                                        _jsx(Route, { path: "/admin", element: _jsx(Admin, {}) })] })] }) }) }),
                _jsx(Footer, {}),
                _jsx("div", { className: "fixed bottom-5 right-5 z-40", children: _jsx(Link, { to: "/ai", className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40", children: _jsxs("span", { className: "text-xl font-semibold", children: ["AI"] }) }) })
            ] }) }));
}
export default App;
