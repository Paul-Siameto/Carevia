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

    // Style constants
    const inputClass = "bg-gray-600/80 text-white border-gray-500 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder-gray-300 h-10 w-full";
    const buttonClass = "bg-primary hover:bg-primary/90 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm h-10";
    const cardClass = "bg-gray-800/90 rounded-xl p-4 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200";
    const formGridClass = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3";
    const inputContainerClass = "space-y-1";
    const labelClass = "text-xs font-medium text-gray-300 block";

    return (_jsxs("div", { className: "space-y-6 p-4 text-white", children: [
        _jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Health Tracking" }),
        _jsx("p", { className: "text-gray-300 mb-6", children: "Track your health metrics and monitor your progress over time" }),
        
        // Input Form
        _jsx("div", { className: cardClass, children: [
            _jsx("h2", { className: "text-lg font-semibold mb-4 text-gray-100", children: "Add New Entry" }),
            _jsxs("div", { className: formGridClass, children: [
                _jsx("div", { className: inputContainerClass, children: [
                    _jsx("label", { className: labelClass, children: "Weight (kg)" }),
                    _jsx("input", { 
                        className: inputClass,
                        type: "number",
                        placeholder: "e.g. 70.5",
                        value: draft.weightKg ?? '',
                        onChange: (e) => setDraft(d => ({ ...d, weightKg: e.target.value ? Number(e.target.value) : undefined }))
                    })
                ]}),
                _jsx("div", { className: inputContainerClass, children: [
                    _jsx("label", { className: labelClass, children: "BP Systolic" }),
                    _jsx("input", { 
                        className: inputClass,
                        type: "number",
                        placeholder: "e.g. 120",
                        value: draft.bloodPressureSystolic ?? '',
                        onChange: (e) => setDraft(d => ({ ...d, bloodPressureSystolic: e.target.value ? Number(e.target.value) : undefined }))
                    })
                ]}),
                _jsx("div", { className: inputContainerClass, children: [
                    _jsx("label", { className: labelClass, children: "BP Diastolic" }),
                    _jsx("input", { 
                        className: inputClass,
                        type: "number",
                        placeholder: "e.g. 80",
                        value: draft.bloodPressureDiastolic ?? '',
                        onChange: (e) => setDraft(d => ({ ...d, bloodPressureDiastolic: e.target.value ? Number(e.target.value) : undefined }))
                    })
                ]}),
                _jsx("div", { className: inputContainerClass, children: [
                    _jsx("label", { className: labelClass, children: "Blood Sugar" }),
                    _jsx("input", { 
                        className: inputClass,
                        type: "number",
                        placeholder: "mg/dL",
                        value: draft.bloodSugarMgDl ?? '',
                        onChange: (e) => setDraft(d => ({ ...d, bloodSugarMgDl: e.target.value ? Number(e.target.value) : undefined }))
                    })
                ]}),
                _jsx("div", { className: inputContainerClass, children: [
                    _jsx("label", { className: labelClass, children: "Exercise (min)" }),
                    _jsx("input", { 
                        className: inputClass,
                        type: "number",
                        placeholder: "e.g. 30",
                        value: draft.exerciseMinutes ?? '',
                        onChange: (e) => setDraft(d => ({ ...d, exerciseMinutes: e.target.value ? Number(e.target.value) : undefined }))
                    })
                ]}),
                _jsx("div", { className: "flex items-end", children: 
                    _jsx("button", { 
                        className: buttonClass + " w-full",
                        onClick: add,
                        children: "Add Entry"
                    })
                })
            ]})
        ]}),
        
        // Entries List
        _jsx("div", { className: "space-y-3", children: 
            entries.map(e => (
                _jsxs("div", { 
                    className: `${cardClass} flex items-center justify-between p-3`,
                    children: [
                        _jsxs("div", { 
                            className: "space-y-0.5",
                            children: [
                                _jsx("div", { 
                                    className: "text-sm font-medium text-gray-200",
                                    children: new Date(e.date).toLocaleString()
                                }),
                                _jsx("div", { 
                                    className: "text-xs text-gray-400",
                                    children: [
                                        e.weightKg && `Weight: ${e.weightKg} kg`,
                                        (e.bloodPressureSystolic && e.bloodPressureDiastolic) ? 
                                            ` • BP: ${e.bloodPressureSystolic}/${e.bloodPressureDiastolic}` : '',
                                        e.bloodSugarMgDl ? ` • Sugar: ${e.bloodSugarMgDl} mg/dL` : '',
                                        e.exerciseMinutes ? ` • Exercise: ${e.exerciseMinutes} min` : ''
                                    ].filter(Boolean).join('')
                                })
                            ]
                        }),
                        _jsx("button", { 
                            className: "text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30 transition-colors ml-2",
                            onClick: () => del(e._id),
                            children: "Delete"
                        })
                    ]
                }, e._id)
            ))
        })
    ]}));
};

export default Health;