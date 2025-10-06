import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
const AI = () => {
    const { token } = useAuth();
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState(null);
    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
    api.interceptors.request.use((config) => { if (token)
        config.headers.Authorization = `Bearer ${token}`; return config; });
    const send = async () => {
        const { data } = await api.post("/ai/chat", { message });
        setReply(data.reply);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary", children: "AI Assistant" }), _jsxs("div", { className: "card p-4 space-y-2", children: [_jsx("input", { className: "border rounded px-2 py-1 w-full", placeholder: "Say something...", value: message, onChange: (e) => setMessage(e.target.value) }), _jsx("button", { className: "px-4 py-2 rounded text-white", style: { backgroundColor: '#9B59B6' }, onClick: send, children: "Send" }), reply && _jsx("div", { className: "mt-2 text-gray-800", children: reply })] })] }));
};
export default AI;
