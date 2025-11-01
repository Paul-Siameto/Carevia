import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
const Health = () => {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);
    const [draft, setDraft] = useState({});
    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const baseURL = base.endsWith("/api") ? base : `${base}/api`;
    const api = axios.create({ baseURL });
    api.interceptors.request.use((config) => { if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
    const load = async () => {
        const { data } = await api.get("/health");
        setEntries(data.entries || []);
    };
    useEffect(() => { load(); }, []);
    const add = async () => {
        await api.post("/health", draft);
        setDraft({});
        await load();
    };

    const del = async (id) => {
        await api.delete(`/health/${id}`);
        await load();
    };

    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Health Tracking" }), _jsxs("div", { className: "card p-4 grid grid-cols-2 md:grid-cols-6 gap-2", children: [_jsx("input", { className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30", type: "number", placeholder: "Weight (kg)", value: draft.weightKg ?? '', onChange: (e) => setDraft(d => ({ ...d, weightKg: e.target.value ? Number(e.target.value) : undefined })) }), _jsx("input", { className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30", type: "number", placeholder: "BP Systolic", value: draft.bloodPressureSystolic ?? '', onChange: (e) => setDraft(d => ({ ...d, bloodPressureSystolic: e.target.value ? Number(e.target.value) : undefined })) }), _jsx("input", { className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30", type: "number", placeholder: "BP Diastolic", value: draft.bloodPressureDiastolic ?? '', onChange: (e) => setDraft(d => ({ ...d, bloodPressureDiastolic: e.target.value ? Number(e.target.value) : undefined })) }), _jsx("input", { className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30", type: "number", placeholder: "Blood Sugar (mg/dL)", value: draft.bloodSugarMgDl ?? '', onChange: (e) => setDraft(d => ({ ...d, bloodSugarMgDl: e.target.value ? Number(e.target.value) : undefined })) }), _jsx("input", { className: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30", type: "number", placeholder: "Exercise (min)", value: draft.exerciseMinutes ?? '', onChange: (e) => setDraft(d => ({ ...d, exerciseMinutes: e.target.value ? Number(e.target.value) : undefined })) }), _jsx("button", { className: "btn-primary", onClick: add, children: "Add" })] }), _jsx("div", { className: "space-y-2", children: entries.map(e => (_jsxs("div", { className: "card p-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: new Date(e.date).toLocaleString() }), _jsxs("div", { className: "text-sm text-gray-600", children: ["W: ", e.weightKg ?? '-', " kg | BP: ", e.bloodPressureSystolic ?? '-', "/", e.bloodPressureDiastolic ?? '-', " | Sugar: ", e.bloodSugarMgDl ?? '-', " | Exercise: ", e.exerciseMinutes ?? '-', " min"] })] }), _jsx("button", { className: "text-red-600 hover:text-red-700", onClick: () => del(e._id), children: "Delete" })] }, e._id))) })] }));
};

export default Health;
