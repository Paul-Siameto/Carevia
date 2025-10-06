import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
const Dashboard = () => {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
        api.interceptors.request.use((config) => { if (token)
            config.headers.Authorization = `Bearer ${token}`; return config; });
        api.get("/health").then((res) => setEntries(res.data.entries || [])).catch(() => { });
    }, [token]);
    const weightData = entries.filter(e => e.weightKg).map(e => ({ date: new Date(e.date).toLocaleDateString(), value: e.weightKg }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Welcome back" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "card p-4", children: [_jsx("h2", { className: "font-semibold mb-2 text-secondary", children: "Weight Trend" }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: weightData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#2ECC71", strokeWidth: 2, dot: false })] }) }) })] }), _jsxs("div", { className: "card p-4", children: [_jsx("h2", { className: "font-semibold mb-2 text-accent", children: "AI Wellness Assistant" }), _jsx("p", { className: "text-sm text-gray-600", children: "Quick tips and insights appear here. Chat placeholder lives on the AI page." })] })] })] }));
};
export default Dashboard;
