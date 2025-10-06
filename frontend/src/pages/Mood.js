import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
const MoodPage = () => {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);
    const [mood, setMood] = useState("good");
    const [stressLevel, setStressLevel] = useState();
    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
    api.interceptors.request.use((config) => { if (token)
        config.headers.Authorization = `Bearer ${token}`; return config; });
    const load = async () => {
        const { data } = await api.get("/mood");
        setEntries(data.entries || []);
    };
    useEffect(() => { load(); }, []);
    const add = async () => {
        await api.post("/mood", { mood, stressLevel });
        setMood("good");
        setStressLevel(undefined);
        await load();
    };
    const del = async (id) => { await api.delete(`/mood/${id}`); await load(); };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Mood Tracker" }), _jsxs("div", { className: "card p-4 flex items-center gap-2", children: [_jsxs("select", { className: "border rounded px-2 py-1", value: mood, onChange: (e) => setMood(e.target.value), children: [_jsx("option", { value: "very-bad", children: "Very Bad" }), _jsx("option", { value: "bad", children: "Bad" }), _jsx("option", { value: "neutral", children: "Neutral" }), _jsx("option", { value: "good", children: "Good" }), _jsx("option", { value: "very-good", children: "Very Good" })] }), _jsx("input", { className: "border rounded px-2 py-1", type: "number", placeholder: "Stress (0-10)", value: stressLevel ?? '', onChange: (e) => setStressLevel(e.target.value ? Number(e.target.value) : undefined) }), _jsx("button", { className: "btn-primary", onClick: add, children: "Add" })] }), _jsx("div", { className: "space-y-2", children: entries.map(e => (_jsxs("div", { className: "card p-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: new Date(e.date).toLocaleString() }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Mood: ", e.mood, " | Stress: ", e.stressLevel ?? '-'] })] }), _jsx("button", { className: "text-red-600", onClick: () => del(e._id), children: "Delete" })] }, e._id))) })] }));
};
export default MoodPage;
