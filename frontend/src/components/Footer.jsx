import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full rounded-t-xl text-white bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg shadow-primary-500/20">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand + social */}
          <div>
            <div className="flex justify-center gap-2 text-primary sm:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shadow-sm">
                CV
              </div>
              <span className="text-2xl font-semibold tracking-tight">Care-via</span>
            </div>

            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-secondary-foreground/70 sm:max-w-xs sm:text-left">
              A calm space to track your health, mood, and routines. Its supported by a gentle AI assistant for everyday wellness.
            </p>

            <ul className="mt-8 flex justify-center gap-4 sm:justify-start md:gap-6 text-secondary-foreground/70">
              {[
                { label: "Facebook", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "GitHub", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-secondary-foreground/20 text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    {label[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2 text-sm">
            <div className="text-center sm:text-left">
              <p className="text-base font-semibold text-secondary-foreground">App</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/health" className="hover:text-primary transition-colors">
                    Health tracking
                  </Link>
                </li>
                <li>
                  <Link to="/mood" className="hover:text-primary transition-colors">
                    Mood journal
                  </Link>
                </li>
                <li>
                  <Link to="/ai" className="hover:text-primary transition-colors">
                    AI assistant
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-base font-semibold text-secondary-foreground">Support</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Privacy & data
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help center (coming soon)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact support
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-base font-semibold text-secondary-foreground">Contact</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="mailto: siametopaul2@gmail.com" className="hover:text-primary transition-colors">
                      siametopaul2@gmail.com
                  </a>
                </li>
                <li>
                  <span className="text-secondary-foreground/70">Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-secondary-foreground/10 pt-4">
          <div className="text-center text-xs text-secondary-foreground/60 sm:flex sm:items-center sm:justify-between sm:text-left">
            <p className="mb-2 sm:mb-0">&copy; {year} Carevia. All rights reserved.</p>
            <p>Not a medical device. Always consult a healthcare professional for medical advice.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
