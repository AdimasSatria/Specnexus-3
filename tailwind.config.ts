import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "#09090b",
          secondary: "#18181b",
          tertiary: "#27272a",
          elevated: "#303033",
        },
        border: {
          DEFAULT: "#3f3f46",
          subtle: "#27272a",
          strong: "#52525b",
        },
        accent: {
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(6, 182, 212, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
