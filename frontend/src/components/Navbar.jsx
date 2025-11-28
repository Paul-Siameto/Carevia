import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const linkBase = "px-3 py-2 rounded-md text-sm font-medium nav-link transition-colors";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLanding = location.pathname === "/" || location.pathname === "/welcome";

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItems = () => (
    <>
      <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Dashboard
      </NavLink>
      <NavLink to="/health" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Health
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        About
      </NavLink>
      <NavLink to="/mood" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Mood
      </NavLink>
      <NavLink to="/articles" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Articles
      </NavLink>
      <NavLink to="/ai" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        AI
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Profile
      </NavLink>
      <NavLink to="/privacy" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>
        Privacy
      </NavLink>
      {!user?.isPremium && (
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            `${linkBase} border border-white/40 bg-white/10 hover:bg-white/20 ${
              isActive ? "nav-active" : ""
            }`
          }
        >
          Upgrade
        </NavLink>
      )}
      <button
        className="ml-2 btn-outline bg-white/10 border-white/30 hover:bg-white/20"
        onClick={onLogout}
      >
        Logout
      </button>
    </>
  );

  const GuestItems = () => (
    <>
      <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>About</NavLink>
      <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>Login</NavLink>
      <NavLink to="/register" className={({ isActive }) => `${linkBase} ${isActive ? "nav-active" : ""}`}>Register</NavLink>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white sticky top-0 z-30 shadow-lg shadow-primary-500/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity duration-300 relative group">
            <span className="text-white">Care-via</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {!user || isLanding ? <GuestItems /> : <NavItems />}
          </div>
          <button className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden mt-3 border-t border-white/10 pt-3">
            <div className="flex flex-col gap-1">
              {!user || isLanding ? <GuestItems /> : <NavItems />}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;