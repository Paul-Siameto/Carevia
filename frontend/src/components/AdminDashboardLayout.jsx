import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const adminLinkBase = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors";

const AdminDashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
      <aside
        className={`relative flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ease-out ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 ${collapsed ? "hidden" : "block"}`}>
            Admin
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            aria-label="Toggle sidebar"
          >
            <span className="sr-only">Toggle sidebar</span>
            <svg
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${adminLinkBase} ${isActive ? "bg-primary/10 text-primary" : ""}`
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
              D
            </span>
            {!collapsed && <span>Overview</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${adminLinkBase} ${isActive ? "bg-primary/10 text-primary" : ""}`
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
              U
            </span>
            {!collapsed && <span>Users</span>}
          </NavLink>

          <NavLink
            to="/admin/content"
            className={({ isActive }) =>
              `${adminLinkBase} ${isActive ? "bg-primary/10 text-primary" : ""}`
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
              C
            </span>
            {!collapsed && <span>Content</span>}
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `${adminLinkBase} ${isActive ? "bg-primary/10 text-primary" : ""}`
            }
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
              S
            </span>
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </nav>

        <div className="border-t border-gray-100 px-3 py-3 text-xs text-gray-500 flex items-center justify-between gap-2">
          {!collapsed && <span>Back to app</span>}
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
          >
            Home
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
