import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
const Profile = () => {
    const { token, user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [age, setAge] = useState();
    const [heightCm, setHeightCm] = useState();
    const [weightKg, setWeightKg] = useState();
    const [message, setMessage] = useState(null);
    useEffect(() => setName(user?.name || ""), [user]);
    const onSave = async () => {
        const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
        api.interceptors.request.use((config) => { if (token)
            config.headers.Authorization = `Bearer ${token}`; return config; });
        await api.put("/users/me", { name, healthProfile: { age, heightCm, weightKg } });
        setMessage("Profile saved");
        setTimeout(() => setMessage(null), 2000);
    };
    return (_jsxs("div", { className: "max-w-xl", children: [_jsx("h1", { className: "text-2xl font-semibold text-primary mb-4", children: "Profile" }), message && _jsx("div", { className: "text-green-600 mb-2", children: message }), _jsxs("div", { className: "card p-4 space-y-3", children: [_jsx("input", { className: "w-full border rounded px-3 py-2", value: name, onChange: (e) => setName(e.target.value), placeholder: "Name" }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsx("input", { className: "border rounded px-3 py-2", type: "number", value: age ?? "", onChange: (e) => setAge(e.target.value ? Number(e.target.value) : undefined), placeholder: "Age" }), _jsx("input", { className: "border rounded px-3 py-2", type: "number", value: heightCm ?? "", onChange: (e) => setHeightCm(e.target.value ? Number(e.target.value) : undefined), placeholder: "Height (cm)" }), _jsx("input", { className: "border rounded px-3 py-2", type: "number", value: weightKg ?? "", onChange: (e) => setWeightKg(e.target.value ? Number(e.target.value) : undefined), placeholder: "Weight (kg)" })] }), _jsx("button", { className: "btn-primary w-fit", onClick: onSave, children: "Save" })] })] }));
};
export default Profile;
