import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

const ChatBox = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    const baseURL = base.endsWith("/api") ? base : `${base}/api`;

    try {
      const res = await fetch(`${baseURL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: trimmed }),
      });

      let replyText = "AI service unavailable. Please try again.";
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }

      const reply = {
        id: Date.now() + 1,
        from: "bot",
        text: replyText,
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      const reply = {
        id: Date.now() + 1,
        from: "bot",
        text: "We could not reach the Carevia AI service. Please check your connection or try again shortly.",
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary/5 via-blue-50 to-accent/10 p-[1px] shadow-xl">
      <div className="flex h-[480px] flex-col rounded-[1.4rem] bg-white/80 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 rounded-t-[1.4rem] border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold shadow-sm">
              CV
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Carevia Assistant</p>
              <p className="text-[11px] text-gray-500">Wellness-focused AI companion</p>
            </div>
          </div>
          <span className="hidden text-[11px] text-primary/80 sm:inline-flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Online
          </span>
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-sm text-gray-800"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed shadow-sm ${
                    m.from === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white/90 text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex justify-start"
              >
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-100 bg-white/90 px-3 py-2 text-[11px] text-gray-500">
                  <span>Carevia is typing</span>
                  <span className="flex items-center gap-0.5">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.12s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.24s]" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 px-3 py-3">
          <div className="flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message"
              className="max-h-24 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span className="sr-only">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M5 12L4.15711 4.57146C4.09941 4.05672 4.60977 3.67986 5.0799 3.88677L20 10L5.0799 16.1132C4.60977 16.3201 4.09941 15.9433 4.15711 15.4285L5 12ZM5 12H12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-[10px] text-gray-400">
            Carevia does not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
