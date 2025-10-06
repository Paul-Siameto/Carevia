import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Profile = () => {
  const { token, user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState<number | undefined>();
  const [heightCm, setHeightCm] = useState<number | undefined>();
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(()=> setName(user?.name || ""), [user]);

  const onSave = async () => {
    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
    api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});
    await api.put("/users/me", { name, healthProfile: { age, heightCm, weightKg } });
    setMessage("Profile saved");
    setTimeout(()=> setMessage(null), 2000);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-primary mb-4">Profile</h1>
      {message && <div className="text-green-600 mb-2">{message}</div>}
      <div className="card p-4 space-y-3">
        <input className="w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" />
        <div className="grid grid-cols-3 gap-2">
          <input className="border rounded px-3 py-2" type="number" value={age ?? ""} onChange={(e)=>setAge(e.target.value ? Number(e.target.value) : undefined)} placeholder="Age" />
          <input className="border rounded px-3 py-2" type="number" value={heightCm ?? ""} onChange={(e)=>setHeightCm(e.target.value ? Number(e.target.value) : undefined)} placeholder="Height (cm)" />
          <input className="border rounded px-3 py-2" type="number" value={weightKg ?? ""} onChange={(e)=>setWeightKg(e.target.value ? Number(e.target.value) : undefined)} placeholder="Weight (kg)" />
        </div>
        <button className="btn-primary w-fit" onClick={onSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;



