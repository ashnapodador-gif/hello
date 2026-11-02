import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1E3C", light: "#12305C", dark: "#061428" },
        gold: { DEFAULT: "#D4A017", light: "#F0C75E", dark: "#A87B0A" },
        orange: { DEFAULT: "#F28C28", light: "#FFB25E", dark: "#C86A12" },
        cream: "#FDF8EF"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" }
        },
        sunPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.08)", opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out both",
        float: "float 5s ease-in-out infinite",
        shine: "shine 3.5s linear infinite",
        "sun-pulse": "sunPulse 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
