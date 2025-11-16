import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import AdminDashboardLayout from "../components/AdminDashboardLayout.jsx";

const Admin = () => {
  const location = useLocation();
  const path = location.pathname;

  let sectionTitle = "Overview";
  let sectionSubtitle = "High-level insight into how Carevia is being used.";

  if (path.startsWith("/admin/users")) {
    sectionTitle = "Users";
    sectionSubtitle = "Monitor signups and active members.";
  } else if (path.startsWith("/admin/content")) {
    sectionTitle = "Content";
    sectionSubtitle = "Manage articles and wellness content.";
  } else if (path.startsWith("/admin/settings")) {
    sectionTitle = "Settings";
    sectionSubtitle = "Fine-tune platform configuration.";
  }

  return (
    _jsx(AdminDashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [
      _jsxs("div", { className: "space-y-1", children: [
        _jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: sectionTitle }),
        _jsx("p", { className: "text-sm text-gray-500", children: sectionSubtitle })
      ] }),
      _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        _jsxs("div", { className: "card p-4", children: [
          _jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]", children: "Active users" }),
          _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: "--" }),
          _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Hook this up to your real metrics later." })
        ] }),
        _jsxs("div", { className: "card p-4", children: [
          _jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]", children: "AI requests today" }),
          _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: "--" }),
          _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Track chat, symptom checks, and nutrition plans." })
        ] }),
        _jsxs("div", { className: "card p-4", children: [
          _jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]", children: "Errors" }),
          _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: "--" }),
          _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Surface backend or AI issues here." })
        ] })
      ] }),
      _jsxs("div", { className: "card p-4", children: [
        _jsx("h2", { className: "text-sm font-semibold text-gray-900 mb-2", children: "Recent activity" }),
        _jsx("p", { className: "text-xs text-gray-500", children: "This is a placeholder. You can plug in audit logs or key events here later." })
      ] })
    ] }) })
  );
};

export default Admin;
