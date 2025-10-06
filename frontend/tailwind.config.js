/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2980B9",
        secondary: "#2ECC71",
        accent: "#9B59B6",
        "neutral-light": "#F4F6F7",
        "neutral-dark": "#BDC3C7",
      },
    },
  },
  plugins: [],
};



