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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`max-w-6xl mx-auto space-y-8 py-8 animate-fade-in transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white">
          Choose Your <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500">Wellness Plan</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unlock advanced features and AI-powered insights to take control of your health journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Free Plan */}
        <div className="card p-8 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden animate-scale-in"
             style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100/50 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16" />
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h2>
              <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">KES 0</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Dashboard overview
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Basic health tracking
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Profile & privacy controls
              </li>
            </ul>
            {!user?.isPremium && (
              <button className="w-full btn-outline py-3 font-semibold">Current Plan</button>
            )}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="card p-8 group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden border-2 border-primary-300 dark:border-primary-700 bg-gradient-to-br from-primary-50/50 to-accent-50/30 dark:from-primary-900/20 dark:to-accent-900/20 animate-scale-in"
             style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/30 to-accent-400/30 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -top-4 right-6">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-4 py-1.5 shadow-lg shadow-primary-500/30">
              ⭐ Most Popular
            </span>
          </div>
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h2>
              <p className="text-gray-600 dark:text-gray-400">Advanced features & AI support</p>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">KES 5,000</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">One-time payment</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Everything in Free
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Full Mood tracking & trends
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                Access to curated health articles
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                AI assistant for wellness questions
              </li>
            </ul>

            {/* Payment Method Selection */}
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Payment Method</label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-medium text-sm transition-all duration-300 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 peer-checked:text-primary-700 dark:peer-checked:text-primary-400 group-hover:border-primary-300">
                    Paystack
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-medium text-sm transition-all duration-300 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 peer-checked:text-primary-700 dark:peer-checked:text-primary-400 group-hover:border-primary-300">
                    M-Pesa
                  </div>
                </label>
              </div>
            </div>

            {/* M-Pesa Phone Number Input */}
            {paymentMethod === "mpesa" && (
              <div className="mb-4 animate-fade-in">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX or 0XXXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary-500 transition-all duration-300 bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            )}

            <button
              type="button"
              className="btn-primary w-full py-4 text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
              onClick={handleUpgrade}
              disabled={loading || (paymentMethod === "paystack" && !scriptLoaded) || user?.isPremium}
            >
              {user?.isPremium ? (
                "✓ Premium Active"
              ) : loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : paymentMethod === "paystack" ? (
                scriptLoaded ? (
                  <span className="flex items-center justify-center gap-2">
                    Upgrade with Paystack <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                ) : (
                  "Loading payment gateway..."
                )
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Upgrade with M-Pesa <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="max-w-2xl mx-auto animate-fade-in-down mt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-2xl mx-auto animate-fade-in-down mt-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{success}</p>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-8">
        🔒 Secure payment processing. All transactions are encrypted and secure.
      </p>
    </div>
  );
};

export default Pricing;
