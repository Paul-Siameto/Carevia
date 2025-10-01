import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const AI = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
  api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});

  const send = async () => {
    const { data } = await api.post("/ai/chat", { message });
    setReply(data.reply);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">AI Assistant</h1>
      <div className="card p-4 space-y-2">
        <input className="border rounded px-2 py-1 w-full" placeholder="Say something..." value={message} onChange={(e)=>setMessage(e.target.value)} />
        <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#9B59B6' }} onClick={send}>Send</button>
        {reply && <div className="mt-2 text-gray-800">{reply}</div>}
      </div>
    </div>
  );
};

export default AI;

