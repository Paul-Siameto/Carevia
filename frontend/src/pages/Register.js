import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await register(name, email, password);
            navigate("/");
        }
        catch (err) {
            setError(err?.response?.data?.message || "Registration failed");
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto mt-10 card p-6", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4 text-primary", children: "Register" }), error && _jsx("div", { className: "text-red-600 mb-2", children: error }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-3", children: [_jsx("input", { className: "w-full border rounded px-3 py-2", placeholder: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { className: "w-full border rounded px-3 py-2", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { className: "w-full border rounded px-3 py-2", placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("button", { className: "btn-primary w-full", children: "Create Account" })] }), _jsxs("p", { className: "mt-3 text-sm", children: ["Have an account? ", _jsx(Link, { className: "text-primary", to: "/login", children: "Login" })] })] }));
};
export default Register;
