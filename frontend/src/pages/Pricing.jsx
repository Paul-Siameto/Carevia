import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Pricing = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack"); // "paystack" or "mpesa"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);

  // Load Paystack script dynamically
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="paystack"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load Paystack script. Please check your internet connection.");
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Optionally remove script on unmount, but usually we keep it
      // if (script.parentNode) {
      //   script.parentNode.removeChild(script);
      // }
    };
  }, []);

  // Poll for M-Pesa payment status
  useEffect(() => {
    if (!checkoutRequestID) return;

    const pollInterval = setInterval(async () => {
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

        const { data } = await api.post("/billing/mpesa/verify", {
          checkoutRequestID,
        });

        if (data.user?.isPremium) {
          setSuccess("Premium unlocked! Enjoy your features.");
          clearInterval(pollInterval);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      } catch (err) {
        // Payment not confirmed yet, continue polling
        console.log("Polling for payment status...");
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestID]);

  const handlePaystackPayment = async () => {
    setError(null);
    setSuccess(null);

    if (!scriptLoaded || !window.PaystackPop) {
      setError("Paystack script is still loading. Please wait a moment and try again.");
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError("Paystack public key is not configured.");
      return;
    }

    setLoading(true);

    // Define callback as a regular function (not async) to satisfy Paystack requirements
    const handlePaymentCallback = (response) => {
      // Use async IIFE to handle async operations
      (async () => {
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
      })();
    };

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: 1, // 5000 KES (KES uses base units, not cents)
      currency: "KES", // Change to "NGN" if using Nigerian Naira (then amount should be 5000 * 100)
      callback: handlePaymentCallback,
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const handleMpesaPayment = async () => {
    setError(null);
    setSuccess(null);

    if (!phoneNumber) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }

    setLoading(true);

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

      const { data } = await api.post("/billing/mpesa/initiate", {
        phoneNumber,
      });

      setCheckoutRequestID(data.checkoutRequestID);
      setSuccess(
        data.message || "M-Pesa payment request sent. Please check your phone and enter your M-Pesa PIN."
      );
      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to initiate M-Pesa payment. Please try again."
      );
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      setError("You need to be logged in to upgrade to premium.");
      return;
    }

    if (paymentMethod === "paystack") {
      await handlePaystackPayment();
    } else if (paymentMethod === "mpesa") {
      await handleMpesaPayment();
    }
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
            <p className="mt-3 text-xl font-semibold text-gray-900">KES 5,000</p>
            <p className="text-xs text-gray-500 mb-3">One-time unlock for now.</p>

            {/* Payment Method Selection */}
            <div className="mb-3 space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">Paystack</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">M-Pesa</span>
                </label>
              </div>
            </div>

            {/* M-Pesa Phone Number Input */}
            {paymentMethod === "mpesa" && (
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX or 0XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            )}

            <button
              type="button"
              className="btn-primary w-full mt-1 disabled:opacity-60"
              onClick={handleUpgrade}
              disabled={loading || (paymentMethod === "paystack" && !scriptLoaded)}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "paystack"
                ? scriptLoaded
                  ? "Upgrade with Paystack"
                  : "Loading payment gateway..."
                : "Upgrade with M-Pesa"}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {success && <p className="text-sm text-emerald-600 mt-2">{success}</p>}

        <p className="text-xs text-gray-500 mt-4">
          Note: Make sure you have configured your payment gateway credentials
          in the environment variables before going live.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
