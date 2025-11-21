import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Providers from "./components/Providers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile";
import Health from "./pages/Health";
import Mood from "./pages/Mood";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import AI from "./pages/AI";
import Pricing from "./pages/Pricing.jsx";
import Privacy from "./pages/Privacy";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import PremiumRoute from "./auth/PremiumRoute";

function App() {
    return (_jsx(Providers, { children: _jsxs("div", { className: "min-h-screen flex flex-col", children: [
                _jsx(Navbar, {}),
                _jsx("main", { className: "flex-1", children: _jsx("div", { className: "max-w-6xl mx-auto p-4", children: _jsxs(Routes, { children: [
                                _jsx(Route, { path: "/", element: _jsx(Landing, {}) }),
                                _jsx(Route, { path: "/login", element: _jsx(Login, {}) }),
                                _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }),
                                _jsx(Route, { path: "/register", element: _jsx(Register, {}) }),
                                _jsx(Route, { path: "/welcome", element: _jsx(Landing, {}) }),
                                _jsx(Route, { path: "/pricing", element: _jsx(Pricing, {}) }),
                                _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [
                                        _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }),
                                        _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }),
                                        _jsx(Route, { path: "/health", element: _jsx(Health, {}) }),
                                        _jsxs(Route, { element: _jsx(PremiumRoute, {}), children: [
                                                _jsx(Route, { path: "/mood", element: _jsx(Mood, {}) }),
                                                _jsx(Route, { path: "/articles", element: _jsx(Articles, {}) }),
                                                _jsx(Route, { path: "/articles/:id", element: _jsx(ArticleDetail, {}) }),
                                                _jsx(Route, { path: "/ai", element: _jsx(AI, {}) })] }),
                                        _jsx(Route, { path: "/privacy", element: _jsx(Privacy, {}) })] }),
                                _jsxs(Route, { element: _jsx(AdminProtectedRoute, {}), children: [
                                        _jsx(Route, { path: "/admin", element: _jsx(Admin, {}) }),
                                        _jsx(Route, { path: "/admin/users", element: _jsx(Admin, {}) }),
                                        _jsx(Route, { path: "/admin/content", element: _jsx(Admin, {}) }),
                                        _jsx(Route, { path: "/admin/settings", element: _jsx(Admin, {}) })] })] }) }) }),
                _jsx(Footer, {}),
                _jsx("div", { className: "fixed bottom-6 right-6 z-40 animate-fade-in-up", style: { animationDelay: '0.5s' }, children: _jsx(Link, { to: "/ai", className: "group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300", children: [
                    _jsx("span", { className: "text-xl font-bold group-hover:scale-110 transition-transform duration-300", children: "AI" }, "ai-label"),
                    _jsx("span", { className: "absolute -top-1 -right-1 flex h-4 w-4", children: _jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }) }, "ai-ping"),
                    _jsx("span", { className: "absolute -top-1 -right-1 inline-flex h-4 w-4 rounded-full bg-emerald-500" }, "ai-dot")
                ] }) })
            ] }) }));
}
export default App;
