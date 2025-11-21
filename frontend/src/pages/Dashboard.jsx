import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import MoodChart from "../components/MoodChart.jsx";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [aiTip, setAiTip] = useState("Loading wellness tip...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseURL = base.endsWith("/api") ? base : `${base}/api`;
        const api = axios.create({ baseURL });
        api.interceptors.request.use((config) => {
          if (token) config.headers.Authorization = `Bearer ${token}`;
          return config;
        });

        const [healthRes, moodRes, aiRes] = await Promise.allSettled([
          api.get("/health"),
          api.get("/mood"),
          api.post("/ai/chat", { message: "Give me one quick wellness tip for today." })
        ]);

        if (healthRes.status === "fulfilled") setEntries(healthRes.value.data.entries || []);
        if (moodRes.status === "fulfilled") setMoodEntries(moodRes.value.data.entries || []);
        if (aiRes.status === "fulfilled") setAiTip(aiRes.value.data.reply || "Stay hydrated, eat well, rest.");
        if (aiRes.status === "rejected" && aiTip === "Loading wellness tip...") setAiTip("Stay hydrated, eat balanced meals, and get enough sleep!");
      } catch (err) {
        if (aiTip === "Loading wellness tip...") setAiTip("Stay hydrated, eat balanced meals, and get enough sleep!");
      }
    };

    load();
  }, [token]);

  const weightData = entries.filter(e => e?.weightKg).map(e => ({ date: new Date(e.date).toLocaleDateString(), value: e.weightKg }));
  const hasWeightData = weightData.length > 0;
  const isTipLoading = aiTip === "Loading wellness tip...";
  const totalEntries = entries.length;

  return (
    <div className={`space-y-6 animate-fade-in transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          Welcome back, <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500">{user?.name || "User"}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Here&apos;s your wellness overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-6 group relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-400/30 to-transparent rounded-full blur-2xl -translate-y-12 translate-x-12" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30"><span className="text-2xl">📊</span></div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Health Entries</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEntries}</p>
          </div>
        </div>

        <div className="card p-6 group relative overflow-hidden bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 border-secondary-200 dark:border-secondary-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary-400/30 to-transparent rounded-full blur-2xl -translate-y-12 translate-x-12" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-4 shadow-lg shadow-secondary-500/30"><span className="text-2xl">😊</span></div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Mood Entries</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{moodEntries.length}</p>
          </div>
        </div>

        <div className="card p-6 group relative overflow-hidden bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border-accent-200 dark:border-accent-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-400/30 to-transparent rounded-full blur-2xl -translate-y-12 translate-x-12" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg shadow-accent-500/30"><span className="text-2xl">🎯</span></div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">This Week</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {entries.filter(e => {
                const entryDate = new Date(e.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate >= weekAgo;
              }).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2 flex flex-col group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-500/30"><span className="text-xl">📈</span></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weight Trend</h2>
            </div>
          </div>

          {hasWeightData ? (
            <div className="h-80 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop key="g-stop-1" offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop key="g-stop-2" offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fill="url(#colorGradient)" dot={{ fill: "#22c55e", r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4"><span className="text-4xl">📊</span></div>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">No weight entries yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed max-w-sm">Go to the Health page to add your first measurements and start tracking your progress.</p>
            </div>
          )}
        </div>

        <div className="card p-6 space-y-4 group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-accent-50/50 to-purple-50/50 dark:from-accent-900/10 dark:to-purple-900/10 border-accent-200/50 dark:border-accent-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform duration-300"><span className="text-2xl">🤖</span></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Wellness Tip</h2>
          </div>

          {isTipLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-full bg-accent-200/50 dark:bg-accent-800/30 rounded-lg" />
              <div className="h-4 w-5/6 bg-accent-200/50 dark:bg-accent-800/30 rounded-lg" />
              <div className="h-4 w-4/5 bg-accent-200/50 dark:bg-accent-800/30 rounded-lg" />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm border border-accent-200/30 dark:border-accent-800/30">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{aiTip}</p>
            </div>
          )}
        </div>
      </div>

      {moodEntries.length > 0 && (
        <div className="card p-6 group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-500/30"><span className="text-xl">😊</span></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mood Trend</h2>
          </div>
          <MoodChart entries={moodEntries} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;