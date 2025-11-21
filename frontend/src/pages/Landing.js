import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Landing = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    _jsxs("div", { className: "min-h-[85vh] flex flex-col gap-12 lg:gap-16 py-8", children: [
      // Hero Section with Animation
      _jsxs("section", { 
        className: `grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
        children: [
          _jsxs("div", { className: "space-y-6 animate-fade-in-up", children: [
            _jsx("p", { 
              className: "inline-flex items-center rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 animate-fade-in", 
              children: "✨ Digital Health Companion" 
            }),
            _jsxs("h1", { 
              className: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-tight animate-fade-in-up", 
              style: { animationDelay: '0.1s' },
              children: [
                "Your ",
                _jsx("span", { className: "gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 animate-gradient", children: "Smart Wellness" }),
                " Hub"
              ] 
            }),
            _jsx("p", { 
              className: "max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up", 
              style: { animationDelay: '0.2s' },
              children: "Track symptoms, medications, and mood in one beautiful space. Carevia blends professional health tracking with a warm AI assistant to support your everyday wellness decisions." 
            }),
            _jsxs("div", { 
              className: "flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in-up", 
              style: { animationDelay: '0.3s' },
              children: [
                _jsx(Link, { 
                  to: "/register", 
                  className: "btn-primary group relative overflow-hidden px-8 py-3.5 text-base font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/50", 
                  children: [
                    "Get Started Free ",
                    _jsx("span", { className: "inline-block ml-2 transition-transform group-hover:translate-x-1", children: "→" })
                  ]
                }),
                _jsx(Link, { 
                  to: "/login", 
                  className: "btn-outline px-8 py-3.5 text-base font-semibold", 
                  children: "Sign In" 
                })
              ] 
            }),
            _jsxs("div", { 
              className: "flex flex-wrap gap-8 pt-6 animate-fade-in-up", 
              style: { animationDelay: '0.4s' },
              children: [
                _jsxs("div", { className: "flex items-center gap-3 group", children: [
                  _jsx("div", { className: "p-2 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "🤖" }) }),
                  _jsxs("div", { children: [
                    _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "24/7 AI" }),
                    _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Wellness assistant" })
                  ] })
                ] }),
                _jsxs("div", { className: "flex items-center gap-3 group", children: [
                  _jsx("div", { className: "p-2 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "📊" }) }),
                  _jsxs("div", { children: [
                    _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "All-in-One" }),
                    _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Health & mood tracking" })
                  ] })
                ] }),
                _jsxs("div", { className: "flex items-center gap-3 group", children: [
                  _jsx("div", { className: "p-2 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "🔒" }) }),
                  _jsxs("div", { children: [
                    _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Secure" }),
                    _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Privacy first" })
                  ] })
                ] })
              ] 
            })
          ] }),
          // Enhanced Hero Card with Animation
          _jsx("div", { 
            className: `relative animate-scale-in ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`,
            style: { animationDelay: '0.3s' },
            children: _jsxs("div", { 
              className: "relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white p-8 shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all duration-500 hover:scale-105 overflow-hidden group", 
              children: [
                // Animated background gradient
                _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-500" }),
                _jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" }),
                _jsxs("div", { className: "relative z-10", children: [
                  _jsxs("div", { className: "flex items-center justify-between gap-3 mb-6", children: [
                    _jsxs("div", { children: [
                      _jsx("p", { className: "text-xs uppercase tracking-widest text-white/70 font-semibold", children: "Personal Plan" }),
                      _jsx("p", { className: "mt-1 text-2xl font-bold", children: "Today's Overview" })
                    ] }),
                    _jsx("span", { className: "inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold border border-white/30", children: "✨ Wellness" })
                  ] }),
                  _jsxs("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [
                    _jsxs("div", { className: "rounded-2xl bg-white/10 backdrop-blur-md px-4 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105", children: [
                      _jsx("p", { className: "text-[10px] uppercase tracking-wider text-white/70 font-bold mb-1", children: "💊 Medication" }),
                      _jsx("p", { className: "text-lg font-bold mb-1", children: "On Track" }),
                      _jsx("p", { className: "text-[11px] text-white/80 leading-relaxed", children: "All reminders aligned" })
                    ] }),
                    _jsxs("div", { className: "rounded-2xl bg-white/10 backdrop-blur-md px-4 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105", children: [
                      _jsx("p", { className: "text-[10px] uppercase tracking-wider text-white/70 font-bold mb-1", children: "😊 Mood" }),
                      _jsx("p", { className: "text-lg font-bold mb-1", children: "Balanced" }),
                      _jsx("p", { className: "text-[11px] text-white/80 leading-relaxed", children: "Feeling great today" })
                    ] }),
                    _jsxs("div", { className: "rounded-2xl bg-white/10 backdrop-blur-md px-4 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105", children: [
                      _jsx("p", { className: "text-[10px] uppercase tracking-wider text-white/70 font-bold mb-1", children: "🏃 Activity" }),
                      _jsx("p", { className: "text-lg font-bold mb-1", children: "Active" }),
                      _jsx("p", { className: "text-[11px] text-white/80 leading-relaxed", children: "Improving daily" })
                    ] })
                  ] }),
                  _jsxs("div", { className: "rounded-2xl bg-white/15 backdrop-blur-md px-5 py-4 border border-white/25", children: [
                    _jsx("p", { className: "text-[10px] uppercase tracking-wider text-white/70 font-bold mb-2", children: "💡 AI Suggestion" }),
                    _jsx("p", { className: "text-sm leading-relaxed text-white/95 italic", children: "\"Stay hydrated, maintain a consistent sleep schedule, and take 5-minute walking breaks. Your future self will thank you.\"" })
                  ] })
                ] })
              ] 
            })
          })
        ] 
      }),
      // Features Section with Enhanced Cards
      _jsxs("section", { 
        className: "space-y-8 animate-fade-in-up",
        style: { animationDelay: '0.5s' },
        children: [
          _jsxs("div", { className: "text-center space-y-3 mb-10", children: [
            _jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white", children: "Everything you need for better wellness" }),
            _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto", children: "Professional health tracking made simple and beautiful" })
          ] }),
          _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            _jsxs("div", { 
              className: "card p-6 group relative overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500", 
              children: [
                _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" }),
                _jsx("div", { className: "relative z-10", children: [
                  _jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "📱" }) }),
                  _jsx("h3", { className: "font-bold text-lg mb-2 text-gray-900 dark:text-white", children: "All Your Health in One Place" }),
                  _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed", children: "Log vitals, mood, and notes so you never have to remember everything at your next appointment. Keep it all organized and accessible." })
                ] })
              ] 
            }),
            _jsxs("div", { 
              className: "card p-6 group relative overflow-hidden hover:shadow-2xl hover:shadow-secondary-500/20 transition-all duration-500", 
              children: [
                _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-400/20 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" }),
                _jsx("div", { className: "relative z-10", children: [
                  _jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-4 shadow-lg shadow-secondary-500/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "💊" }) }),
                  _jsx("h3", { className: "font-bold text-lg mb-2 text-gray-900 dark:text-white", children: "Pharmacy-Style Structure" }),
                  _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed", children: "Organize medications, routines, and articles with the clarity of a digital pharmacy shelf. Professional organization meets intuitive design." })
                ] })
              ] 
            }),
            _jsxs("div", { 
              className: "card p-6 group relative overflow-hidden hover:shadow-2xl hover:shadow-accent-500/20 transition-all duration-500", 
              children: [
                _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" }),
                _jsx("div", { className: "relative z-10", children: [
                  _jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform duration-300", children: _jsx("span", { className: "text-2xl", children: "🤖" }) }),
                  _jsx("h3", { className: "font-bold text-lg mb-2 text-gray-900 dark:text-white", children: "Gentle AI Support" }),
                  _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed", children: "Get friendly hints and explanations without replacing your doctor or pharmacist. AI-powered wellness guidance when you need it most." })
                ] })
              ] 
            })
          ] })
        ] 
      })
    ] })
  );
};

export default Landing;
