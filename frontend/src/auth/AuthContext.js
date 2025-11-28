import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

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

    // Verify token on initial load
    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
                setToken(storedToken);
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [api]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, register, logout, loading };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

