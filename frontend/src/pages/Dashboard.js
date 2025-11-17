import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import MoodChart from "../components/MoodChart.jsx";
const Dashboard = () => {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);
    const [moodEntries, setMoodEntries] = useState([]);
    const [aiTip, setAiTip] = useState("Loading wellness tip...");
    useEffect(() => {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseURL = base.endsWith("/api") ? base : `${base}/api`;
        const api = axios.create({ baseURL });
        api.interceptors.request.use((config) => { if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
        api.get("/health").then((res) => setEntries(res.data.entries || [])).catch(() => { });
        api.get("/mood").then((res) => setMoodEntries(res.data.entries || [])).catch(() => { });
        api.post("/ai/chat", { message: "Give me one quick wellness tip for today." })
            .then((res) => setAiTip(res.data.reply))
            .catch(() => setAiTip("Stay hydrated, eat balanced meals, and get enough sleep!"));
    }, [token]);

    const weightData = entries.filter(e => e.weightKg).map(e => ({ date: new Date(e.date).toLocaleDateString(), value: e.weightKg }));
    const hasWeightData = weightData.length > 0;
    const isTipLoading = aiTip === "Loading wellness tip...";

    return (_jsxs("div", { className: "space-y-6", children: [
        _jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Welcome back" }),
        _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
            _jsxs("div", { className: "card p-4 lg:col-span-2 flex flex-col", children: [
                _jsx("h2", { className: "font-semibold mb-2 text-secondary", children: "Weight Trend" }),
                hasWeightData
                    ? _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: weightData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#2ECC71", strokeWidth: 2, dot: false })] }) }) })
                    : _jsxs("div", { className: "flex-1 flex items-center justify-center text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-md py-10", children: [
                        "No weight entries yet. Go to the Health page to add your first measurements and start tracking your progress."
                    ] })
            ] }),
            _jsxs("div", { className: "card p-4 space-y-3", children: [
                _jsx("h2", { className: "font-semibold text-accent", children: "AI Wellness Assistant" }),
                isTipLoading
                    ? _jsxs("div", { className: "space-y-2", children: [
                        _jsx("div", { className: "h-3 w-3/4 bg-accent/10 rounded animate-pulse" }),
                        _jsx("div", { className: "h-3 w-5/6 bg-accent/10 rounded animate-pulse" }),
                        _jsx("div", { className: "h-3 w-2/3 bg-accent/10 rounded animate-pulse" })
                    ] })
                    : _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap leading-relaxed", children: aiTip })
            ] })
        ] }),
        moodEntries.length > 0 && _jsxs("div", { className: "card p-4 space-y-3", children: [
                _jsx("h2", { className: "font-semibold text-secondary", children: "Mood Trend" }),
                _jsx(MoodChart, { entries: moodEntries })
            ] })
    ] }));
};

export default Dashboard;
