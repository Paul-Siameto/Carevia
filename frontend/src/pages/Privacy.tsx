import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Privacy = () => {
  const { token } = useAuth();
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
  api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});

  const exportData = async () => {
    const res = await api.get("/privacy/export", { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'carevia-export.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const deleteData = async () => {
    await api.delete("/privacy/delete");
    alert("Your personal data has been deleted.");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Privacy Controls</h1>
      <div className="card p-4 space-y-2">
        <button className="btn-primary w-fit" onClick={exportData}>Export My Data</button>
        <button className="px-4 py-2 rounded text-white bg-red-600" onClick={deleteData}>Delete My Data</button>
      </div>
    </div>
  );
};

export default Privacy;


