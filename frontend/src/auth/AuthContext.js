import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    const api = useMemo(() => {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseURL = base.endsWith("/api") ? base : `${base}/api`;
        
        const instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        // Request interceptor
        instance.interceptors.request.use(
            (config) => {
                const t = localStorage.getItem("token");
                if (t) {
                    config.headers.Authorization = `Bearer ${t}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Auto logout if 401 response returned from API
                    localStorage.removeItem("token");
                    setUser(null);
                    setToken(null);
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [navigate]);

    // Check if user is logged in on initial load
    useEffect(() => {
        const verifyToken = async () => {
            const t = localStorage.getItem("token");
            if (!t) {
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [api]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setUser(data.user);
                return data.user;
            }
            throw new Error("Login failed: No token received");
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            throw new Error(errorMessage);
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password });
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setUser(data.user);
                return data.user;
            }
            throw new Error("Registration failed: No token received");
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    const value = { 
        user, 
        token, 
        isLoading,
        isAuthenticated: !!token,
        login, 
        register, 
        logout 
    };

    return _jsx(AuthContext.Provider, { 
        value: value, 
        children: !isLoading && children 
    });
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};

