import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      if (!user?.isAdmin) {
        setError("You do not have admin access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-semibold mb-4 text-primary">Admin Login</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-primary w-full">Sign In as Admin</button>
      </form>
      <p className="mt-3 text-sm">
        Need the regular app?{" "}
        <Link className="text-primary hover:underline" to="/login">
          User Login
        </Link>
      </p>
    </div>
  );
};

export default AdminLogin;
