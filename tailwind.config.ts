import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0a0a0f",
          900: "#111118",
          800: "#1a1a24",
          700: "#242433",
          600: "#2e2e42",
          500: "#3d3d55",
          400: "#5a5a7a",
          300: "#8888aa",
          200: "#aaaac4",
          100: "#d0d0e0",
          50:  "#f0f0f8",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
