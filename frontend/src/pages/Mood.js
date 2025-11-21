import { createElement as h, Fragment } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const MoodPage = () => {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("good");
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState("");

  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseURL = base.endsWith("/api") ? base : `${base}/api`;
  const api = axios.create({ baseURL });

  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const load = async () => {
    const { data } = await api.get("/mood");
    setEntries(data.entries || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    await api.post("/mood", { mood, stressLevel: stress, notes });
    setMood("good");
    setStress(5);
    setNotes("");
    load();
  };

  const del = async (id) => { await api.delete(`/mood/${id}`); load(); };

  return h("div", { className: "space-y-8 text-gray-900" }, [

    // Title
    h("div", { className: "text-center" }, [
      h("h1", {
        className:
          "text-4xl font-extrabold text-primary drop-shadow-lg tracking-wide",
      }, "Mood Tracker"),
      h("p", {
        className: "text-gray-700 mt-1",
      }, "Track your emotions, stress, and wellness trends")
    ]),

    // Form card
    h("div", {
      className:
        "p-6 rounded-3xl shadow-xl bg-white/40 backdrop-blur-xl border border-white/30 " +
        "transition hover:bg-white/50 hover:shadow-2xl max-w-2xl mx-auto space-y-4 text-gray-900"
    }, [
      h("h2", {
        className: "text-lg font-semibold text-gray-900 tracking-wide"
      }, "Add Mood Entry"),

      // Mood select
      h("div", { className: "flex flex-col gap-2" }, [
        h("label", { className: "text-gray-800 text-sm" }, "How do you feel?"),
        h("select", {
          value: mood,
          onChange: (e) => setMood(e.target.value),
          className:
            "bg-white/70 text-gray-900 px-3 py-2 rounded-xl border border-gray-300 shadow-inner backdrop-blur-md"
        }, [
          h("option", { key: "opt-very-bad", value: "very-bad" }, "😢 Very Bad"),
          h("option", { key: "opt-bad", value: "bad" }, "☹️ Bad"),
          h("option", { key: "opt-neutral", value: "neutral" }, "😐 Neutral"),
          h("option", { key: "opt-good", value: "good" }, "🙂 Good"),
          h("option", { key: "opt-very-good", value: "very-good" }, "😁 Very Good"),
        ])
      ]),

      // Stress slider
      h("div", { className: "flex flex-col gap-2" }, [
        h("label", { className: "text-gray-800 text-sm" }, "Stress Level (0–10)"),
        h("input", {
          type: "range",
          min: 0,
          max: 10,
          value: stress,
          onChange: (e) => setStress(Number(e.target.value)),
          className:
            "w-full accent-primary cursor-pointer bg-white/70 rounded-lg"
        }),
        h("p", { className: "text-gray-700 text-sm" }, `Current: ${stress}`)
      ]),

      // Notes
      h("div", { className: "flex flex-col gap-2" }, [
        h("label", { className: "text-gray-800 text-sm" }, "Notes"),
        h("textarea", {
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 3,
          className:
            "bg-white/70 text-gray-900 px-3 py-2 rounded-xl border border-gray-300 " +
            "shadow-inner backdrop-blur-md"
        })
      ]),

      // Add button
      h("button", {
        className:
          "w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-primary to-accent " +
          "text-white font-semibold shadow-lg hover:opacity-90",
        onClick: add
      }, "Add Entry")
    ]),

    // Entries list
    h("div", { className: "space-y-4" }, [
      entries.map((e, idx) =>
        h("div", {
          key: e._id ?? `entry-${idx}`,
          className:
            "p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg " +
            "transition hover:bg-white/50 text-gray-900"
        }, [
          h("div", { className: "flex justify-between items-center" }, [

            h("div", {}, [
              h("p", { className: "font-medium" }, new Date(e.date).toLocaleString()),
              h("p", { className: "text-sm text-gray-700" },
                `Mood: ${e.mood} | Stress: ${e.stressLevel}`
              ),
              e.notes &&
                h("p", { className: "text-xs text-gray-600 mt-1 italic" }, e.notes)
            ]),

            h("button", {
              onClick: () => del(e._id),
              className: "text-red-600 hover:text-red-800 font-bold text-sm"
            }, "Delete")
          ])
        ])
      )
    ])
  ]);
};

export default MoodPage;
