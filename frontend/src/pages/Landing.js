import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    _jsxs("div", { className: "min-h-[70vh] flex flex-col gap-10 lg:gap-14", children: [
      _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center", children: [
        _jsxs("div", { className: "space-y-5", children: [
          _jsx("p", { className: "inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary", children: "Digital health companion" }),
          _jsxs("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight", children: [
            "Carevia: your ",
            _jsx("span", { className: "text-primary", children: "smart wellness" }),
            " & treatment hub"
          ] }),
          _jsx("p", { className: "max-w-xl text-sm sm:text-base text-gray-600", children: "Track symptoms, medications, and mood in one calm space. Carevia blends pharmacy-grade structure with a warm AI assistant to support your everyday health decisions." }),
          _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-1", children: [
            _jsx(Link, { to: "/register", className: "btn-primary px-6 py-2 text-sm", children: "Create your account" }),
            _jsx(Link, { to: "/login", className: "btn-outline px-6 py-2 text-sm", children: "I already use Carevia" })
          ] }),
          _jsxs("div", { className: "flex flex-wrap gap-6 pt-2 text-xs text-gray-500", children: [
            _jsxs("div", { children: [
              _jsx("p", { className: "text-base font-semibold text-gray-900", children: "24/7" }),
              _jsx("p", { children: "AI wellness assistant" })
            ] }),
            _jsxs("div", { children: [
              _jsx("p", { className: "text-base font-semibold text-gray-900", children: "All-in-one" }),
              _jsx("p", { children: "Health, mood & articles" })
            ] }),
            _jsxs("div", { children: [
              _jsx("p", { className: "text-base font-semibold text-gray-900", children: "Secure" }),
              _jsx("p", { children: "Your data stays private" })
            ] })
          ] })
        ] }),
        _jsx("div", { className: "relative", children: _jsxs("div", { className: "mx-auto max-w-md rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-accent text-white p-6 sm:p-7 shadow-xl", children: [
                _jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    _jsxs("div", { children: [
                            _jsx("p", { className: "text-xs uppercase tracking-[0.22em] text-white/60", children: "Personal plan" }),
                            _jsx("p", { className: "mt-1 text-lg font-semibold", children: "Today" })
                        ] }),
                    _jsx("span", { className: "inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium", children: "Wellness overview" })
                ] }),
                _jsxs("div", { className: "mt-4 grid grid-cols-3 gap-3 text-xs", children: [
                    _jsxs("div", { className: "rounded-2xl bg-white/10 px-3 py-3", children: [
                            _jsx("p", { className: "text-[10px] uppercase tracking-[0.16em] text-white/70", children: "Medication" }),
                            _jsx("p", { className: "mt-1 text-sm font-semibold", children: "On track" }),
                            _jsx("p", { className: "mt-1 text-[11px] text-white/80", children: "Reminders and refills aligned" })
                        ] }),
                    _jsxs("div", { className: "rounded-2xl bg-white/10 px-3 py-3", children: [
                            _jsx("p", { className: "text-[10px] uppercase tracking-[0.16em] text-white/70", children: "Mood" }),
                            _jsx("p", { className: "mt-1 text-sm font-semibold", children: "Balanced" }),
                            _jsx("p", { className: "mt-1 text-[11px] text-white/80", children: "Gentle check-ins each day" })
                        ] }),
                    _jsxs("div", { className: "rounded-2xl bg-white/10 px-3 py-3", children: [
                            _jsx("p", { className: "text-[10px] uppercase tracking-[0.16em] text-white/70", children: "Activity" }),
                            _jsx("p", { className: "mt-1 text-sm font-semibold", children: "Improving" }),
                            _jsx("p", { className: "mt-1 text-[11px] text-white/80", children: "Small habits, big impact" })
                        ] })
                ] }),
                _jsxs("div", { className: "mt-4 rounded-2xl bg-white/8 px-3 py-3 text-xs backdrop-blur-sm", children: [
                    _jsx("p", { className: "text-[10px] uppercase tracking-[0.18em] text-white/70", children: "AI suggestion" }),
                    _jsx("p", { className: "mt-1 text-[11px] leading-relaxed text-white/90", children: "\"Stay hydrated, keep a consistent sleep schedule, and take a 5-minute walk between tasks. Your future self will thank you.\"" })
                ] })
            ] }) })
      ] }),
      _jsxs("section", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        _jsxs("div", { className: "card p-4 h-full", children: [
          _jsx("h3", { className: "font-semibold text-sm mb-1", children: "All your health in one place" }),
          _jsx("p", { className: "text-xs text-gray-600", children: "Log vitals, mood, and notes so you no longer have to remember everything at your next appointment." })
        ] }),
        _jsxs("div", { className: "card p-4 h-full", children: [
          _jsx("h3", { className: "font-semibold text-sm mb-1", children: "Pharmacy-style structure" }),
          _jsx("p", { className: "text-xs text-gray-600", children: "Organize medications, routines, and articles with the clarity of a digital pharmacy shelf." })
        ] }),
        _jsxs("div", { className: "card p-4 h-full", children: [
          _jsx("h3", { className: "font-semibold text-sm mb-1", children: "Gentle AI support" }),
          _jsx("p", { className: "text-xs text-gray-600", children: "Get friendly hints and explanations without replacing your doctor or pharmacist." })
        ] })
      ] })
    ] })
  );
};

export default Landing;
