import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Pricing = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpgrade = async () => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("You need to be logged in to upgrade to premium.");
      return;
    }

    if (!window.PaystackPop) {
      setError("Paystack script is not loaded.");
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError("Paystack public key is not configured.");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: 500000, // 5000 NGN in kobo
      currency: "NGN",
      callback: async (response) => {
        try {
          const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
          const baseURL = base.endsWith("/api") ? base : `${base}/api`;
          const api = axios.create({ baseURL });
          const token = localStorage.getItem("token");
          if (token) {
            api.interceptors.request.use((config) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            });
          }

          const { data } = await api.post("/billing/paystack/confirm", {
            reference: response.reference,
          });

          setSuccess("Premium unlocked! Enjoy your features.");

          // Optionally refresh auth state by re-login or /auth/me
          // For simplicity, just reload the page so AuthContext refetches
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } catch (err) {
          setError(
            err?.response?.data?.message ||
              "Payment verified, but we could not update your account."
          );
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-primary">Carevia Plans</h1>
        <p className="text-sm text-gray-600">
          Choose the plan that works best for you. Upgrade to unlock AI and deeper
          insights.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mt-2">
          <div className="border rounded-xl p-4 bg-white/60">
            <h2 className="text-lg font-semibold text-gray-900">Free</h2>
            <p className="text-sm text-gray-600 mb-2">For getting started.</p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Dashboard overview</li>
              <li>Health tracking</li>
              <li>Profile & privacy controls</li>
            </ul>
            <p className="mt-3 text-xl font-semibold text-gray-900">Ksh 0</p>
          </div>

          <div className="border-2 border-primary rounded-xl p-4 bg-primary/5 relative">
            <div className="absolute -top-3 right-4 bg-primary text-white text-[11px] px-2 py-0.5 rounded-full uppercase tracking-[0.18em]">
              Most popular
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Premium</h2>
            <p className="text-sm text-gray-600 mb-2">
              For deeper insights and AI support.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Everything in Free</li>
              <li>Full Mood tracking & trends</li>
              <li>Access to curated health articles</li>
              <li>AI assistant for wellness questions</li>
            </ul>
            <p className="mt-3 text-xl font-semibold text-gray-900">NGN 5,000</p>
            <p className="text-xs text-gray-500 mb-3">One-time unlock for now.</p>
            <button
              type="button"
              className="btn-primary w-full mt-1 disabled:opacity-60"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade with Paystack"}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {success && <p className="text-sm text-emerald-600 mt-2">{success}</p>}

        <p className="text-xs text-gray-500 mt-4">
          Note: Make sure you have configured your Paystack public and secret keys
          in the environment variables before going live.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
