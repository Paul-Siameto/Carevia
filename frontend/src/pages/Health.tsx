import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

type Entry = {
  _id: string;
  date: string;
  weightKg?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugarMgDl?: number;
  exerciseMinutes?: number;
};

const Health = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState<Partial<Entry>>({});

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
  api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});

  const load = async () => {
    const { data } = await api.get("/health");
    setEntries(data.entries || []);
  };

  useEffect(()=> { load(); }, []);

  const add = async () => {
    await api.post("/health", draft);
    setDraft({});
    await load();
  };

  const del = async (id: string) => {
    await api.delete(`/health/${id}`);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Health Tracking</h1>
      <div className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-2">
        <input className="border rounded px-2 py-1" type="number" placeholder="Weight" value={draft.weightKg ?? ''} onChange={(e)=>setDraft(d=>({...d, weightKg: e.target.value? Number(e.target.value): undefined}))} />
        <input className="border rounded px-2 py-1" type="number" placeholder="BP Sys" value={draft.bloodPressureSystolic ?? ''} onChange={(e)=>setDraft(d=>({...d, bloodPressureSystolic: e.target.value? Number(e.target.value): undefined}))} />
        <input className="border rounded px-2 py-1" type="number" placeholder="BP Dia" value={draft.bloodPressureDiastolic ?? ''} onChange={(e)=>setDraft(d=>({...d, bloodPressureDiastolic: e.target.value? Number(e.target.value): undefined}))} />
        <input className="border rounded px-2 py-1" type="number" placeholder="Sugar" value={draft.bloodSugarMgDl ?? ''} onChange={(e)=>setDraft(d=>({...d, bloodSugarMgDl: e.target.value? Number(e.target.value): undefined}))} />
        <input className="border rounded px-2 py-1" type="number" placeholder="Exercise" value={draft.exerciseMinutes ?? ''} onChange={(e)=>setDraft(d=>({...d, exerciseMinutes: e.target.value? Number(e.target.value): undefined}))} />
        <button className="btn-primary" onClick={add}>Add</button>
      </div>
      <div className="space-y-2">
        {entries.map(e=> (
          <div key={e._id} className="card p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{new Date(e.date).toLocaleString()}</div>
              <div className="text-sm text-gray-600">W: {e.weightKg ?? '-'} kg, BP: {e.bloodPressureSystolic ?? '-'} / {e.bloodPressureDiastolic ?? '-'}, Sugar: {e.bloodSugarMgDl ?? '-'}, Ex: {e.exerciseMinutes ?? '-'}</div>
            </div>
            <button className="text-red-600" onClick={()=>del(e._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Health;

