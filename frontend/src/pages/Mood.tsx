import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

type Mood = { _id: string; date: string; mood: string; stressLevel?: number; notes?: string };

const MoodPage = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<Mood[]>([]);
  const [mood, setMood] = useState("good");
  const [stressLevel, setStressLevel] = useState<number | undefined>();

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
  api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});

  const load = async () => {
    const { data } = await api.get("/mood");
    setEntries(data.entries || []);
  };

  useEffect(()=> { load(); }, []);

  const add = async () => {
    await api.post("/mood", { mood, stressLevel });
    setMood("good"); setStressLevel(undefined); await load();
  };

  const del = async (id: string) => { await api.delete(`/mood/${id}`); await load(); };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Mood Tracker</h1>
      <div className="card p-4 flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={mood} onChange={(e)=>setMood(e.target.value)}>
          <option value="very-bad">Very Bad</option>
          <option value="bad">Bad</option>
          <option value="neutral">Neutral</option>
          <option value="good">Good</option>
          <option value="very-good">Very Good</option>
        </select>
        <input className="border rounded px-2 py-1" type="number" placeholder="Stress (0-10)" value={stressLevel ?? ''} onChange={(e)=>setStressLevel(e.target.value? Number(e.target.value): undefined)} />
        <button className="btn-primary" onClick={add}>Add</button>
      </div>
      <div className="space-y-2">
        {entries.map(e=> (
          <div key={e._id} className="card p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{new Date(e.date).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Mood: {e.mood} | Stress: {e.stressLevel ?? '-'}</div>
            </div>
            <button className="text-red-600" onClick={()=>del(e._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodPage;



