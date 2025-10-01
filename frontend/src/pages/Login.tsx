import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-semibold mb-4 text-primary">Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn-primary w-full">Sign In</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="text-primary" to="/register">Register</Link></p>
    </div>
  );
};

export default Login;


