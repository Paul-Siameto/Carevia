import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
const Articles = () => {
    const { token } = useAuth();
    const [articles, setArticles] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const baseURL = base.endsWith("/api") ? base : `${base}/api`;
    const api = axios.create({ baseURL });
    api.interceptors.request.use((config) => { if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
    const load = async () => {
        const { data } = await api.get("/articles");
        setArticles(data.articles || []);
    };
    useEffect(() => { load(); }, []);
    const add = async () => { await api.post("/articles", { title, content }); setTitle(""); setContent(""); await load(); };
    const del = async (id) => { await api.delete(`/articles/${id}`); await load(); };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Articles" }), _jsxs("div", { className: "card p-4 space-y-2", children: [_jsx("input", { className: "border rounded px-2 py-1 w-full", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value) }), _jsx("textarea", { className: "border rounded px-2 py-1 w-full", placeholder: "Content", value: content, onChange: (e) => setContent(e.target.value) }), _jsx("button", { className: "btn-primary w-fit", onClick: add, children: "Publish" })] }), _jsx("div", { className: "space-y-2", children: articles.map(a => (_jsxs("div", { className: "card p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: a.title }), _jsx("div", { className: "text-sm text-gray-600", children: new Date(a.createdAt).toLocaleString() })] }), _jsx("button", { className: "text-red-600", onClick: () => del(a._id), children: "Delete" })] }), _jsx("p", { className: "mt-2 whitespace-pre-wrap", children: a.content })] }, a._id))) })] }));
};
export default Articles;

