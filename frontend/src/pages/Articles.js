import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Articles = () => {
    const [articles, setArticles] = useState([]);

    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const baseURL = base.endsWith("/api") ? base : `${base}/api`;
    const api = axios.create({ baseURL });

    const load = async () => {
        const { data } = await api.get("/articles");
        setArticles(data.articles || []);
    };

    useEffect(() => { load(); }, []);

    return (_jsxs("div", { className: "space-y-4", children: [
            _jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Articles" }),
            _jsx("p", { className: "text-sm text-gray-500", children: "Health and wellness articles curated by your Carevia admin." }),
            _jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: articles.map((a) => {
                    const summary = a.summary || (a.body || a.content || "").slice(0, 140) + ((a.body || a.content || "").length > 140 ? "..." : "");
                    return (_jsx(Link, { key: a._id, to: `/articles/${a._id}`, className: "block", children: _jsxs("article", { className: "card overflow-hidden flex flex-col hover:shadow-md transition-shadow", children: [
                                a.imageUrl && (_jsx("div", { className: "h-40 w-full bg-gray-100", children: _jsx("img", { src: a.imageUrl, alt: "Article visual", className: "h-full w-full object-cover", onError: (e) => {
                                                e.currentTarget.style.display = "none";
                                            } }) })),
                                _jsxs("div", { className: "p-4 space-y-2 flex-1 flex flex-col", children: [
                                        _jsx("h2", { className: "text-base font-semibold text-gray-900 line-clamp-2", children: a.title }),
                                        _jsx("p", { className: "text-xs text-gray-500", children: new Date(a.createdAt).toLocaleDateString() }),
                                        summary && _jsx("p", { className: "text-sm text-gray-700 line-clamp-3", children: summary })
                                    ] })
                            ] }, a._id) }));
                }) })
        ] }));
};
export default Articles;
