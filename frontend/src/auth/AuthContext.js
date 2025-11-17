import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const api = useMemo(() => {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseURL = base.endsWith("/api") ? base : `${base}/api`;
        const instance = axios.create({ baseURL });
        instance.interceptors.request.use((config) => {
            const t = localStorage.getItem("token");
            if (t) config.headers.Authorization = `Bearer ${t}`;
            return config;
        });
        return instance;
    }, []);
    useEffect(() => {
        if (!token)
            return;
        api.get("/auth/me").then((res) => setUser(res.data.user)).catch(() => setUser(null));
    }, [token, api]);
    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };
    const register = async (name, email, password) => {
        const { data } = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
    };
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };
    const value = { user, token, login, register, logout };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

