import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type HealthEntry = {
  _id: string;
  date: string;
  weightKg?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugarMgDl?: number;
  exerciseMinutes?: number;
};

const Dashboard = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<HealthEntry[]>([]);

  useEffect(() => {
    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
    api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});
    api.get("/health").then((res)=> setEntries(res.data.entries || [])).catch(()=>{});
  }, [token]);

  const weightData = entries.filter(e=> e.weightKg).map(e=> ({ date: new Date(e.date).toLocaleDateString(), value: e.weightKg }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-semibold mb-2 text-secondary">Weight Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2ECC71" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold mb-2 text-accent">AI Wellness Assistant</h2>
          <p className="text-sm text-gray-600">Quick tips and insights appear here. Chat placeholder lives on the AI page.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


