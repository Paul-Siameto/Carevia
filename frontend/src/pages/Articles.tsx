import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

type Article = { _id: string; title: string; content: string; createdAt: string };

const Articles = () => {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
  api.interceptors.request.use((config)=>{ if(token) config.headers.Authorization = `Bearer ${token}`; return config;});

  const load = async () => {
    const { data } = await api.get("/articles");
    setArticles(data.articles || []);
  };

  useEffect(()=> { load(); }, []);

  const add = async () => { await api.post("/articles", { title, content }); setTitle(""); setContent(""); await load(); };
  const del = async (id: string) => { await api.delete(`/articles/${id}`); await load(); };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Articles</h1>
      <div className="card p-4 space-y-2">
        <input className="border rounded px-2 py-1 w-full" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="border rounded px-2 py-1 w-full" placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} />
        <button className="btn-primary w-fit" onClick={add}>Publish</button>
      </div>
      <div className="space-y-2">
        {articles.map(a => (
          <div key={a._id} className="card p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <div className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <button className="text-red-600" onClick={()=>del(a._id)}>Delete</button>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;



