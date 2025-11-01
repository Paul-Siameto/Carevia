import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const AI = () => {
    const { token } = useAuth();
    const [tab, setTab] = useState("chat");
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState(null);
    const [symptoms, setSymptoms] = useState("");
    const [symptomResult, setSymptomResult] = useState(null);
    const [preferences, setPreferences] = useState("");
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const baseURL = base.endsWith("/api") ? base : `${base}/api`;
    const api = axios.create({ baseURL });
    api.interceptors.request.use((config) => { if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

    const sendChat = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post("/ai/chat", { message });
            setReply(data.reply);
        } catch (err) {
            setReply("AI service unavailable. Please try again.");
        }
        setLoading(false);
    };

    const checkSymptoms = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post("/ai/symptom-check", { symptoms });
            setSymptomResult(data.result);
        } catch (err) {
            setSymptomResult("AI service unavailable. Please try again.");
        }
        setLoading(false);
    };

    const getNutritionPlan = async () => {
        if (!preferences.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post("/ai/nutrition-plan", { preferences });
            setNutritionPlan(data.plan);
        } catch (err) {
            setNutritionPlan("AI service unavailable. Please try again.");
        }
        setLoading(false);
    };

    const tabs = [
        { id: "chat", label: "Chat" },
        { id: "symptoms", label: "Symptom Checker" },
        { id: "nutrition", label: "Nutrition Planner" },
    ];

    return (
        _jsxs("div", { className: "space-y-4", children: [
            _jsx("h1", { className: "text-2xl font-semibold text-primary", children: "AI Assistant" }),
            _jsx("div", { className: "flex gap-2 border-b", children: tabs.map(t => (
                _jsx("button", { className: `px-4 py-2 ${tab === t.id ? "border-b-2 border-accent text-accent font-semibold" : "text-gray-600"}`, onClick: () => setTab(t.id), children: t.label }, t.id)
            )) }),
            tab === "chat" && _jsxs("div", { className: "card p-4 space-y-3", children: [
                _jsx("input", { className: "border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/30", placeholder: "Ask anything about health, wellness, or habits...", value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendChat() }),
                _jsx("button", { className: "btn-accent", onClick: sendChat, disabled: loading, children: loading ? "Thinking..." : "Send" }),
                reply && _jsx("div", { className: "mt-3 p-3 bg-accent/5 border border-accent/20 rounded-md text-gray-800 whitespace-pre-wrap", children: reply })
            ] }),
            tab === "symptoms" && _jsxs("div", { className: "card p-4 space-y-3", children: [
                _jsx("textarea", { className: "border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/30", rows: 3, placeholder: "Describe your symptoms (e.g., headache, fever, fatigue)...", value: symptoms, onChange: (e) => setSymptoms(e.target.value) }),
                _jsx("button", { className: "btn-primary", onClick: checkSymptoms, disabled: loading, children: loading ? "Analyzing..." : "Check Symptoms" }),
                symptomResult && _jsx("div", { className: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-gray-800 whitespace-pre-wrap", children: symptomResult })
            ] }),
            tab === "nutrition" && _jsxs("div", { className: "card p-4 space-y-3", children: [
                _jsx("textarea", { className: "border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/30", rows: 3, placeholder: "Tell us your dietary preferences, restrictions, or goals (e.g., vegan, low-carb, muscle gain)...", value: preferences, onChange: (e) => setPreferences(e.target.value) }),
                _jsx("button", { className: "btn-primary", onClick: getNutritionPlan, disabled: loading, children: loading ? "Generating..." : "Get Nutrition Plan" }),
                nutritionPlan && _jsx("div", { className: "mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-gray-800 whitespace-pre-wrap", children: nutritionPlan })
            ] })
        ] })
    );
};

export default AI;
