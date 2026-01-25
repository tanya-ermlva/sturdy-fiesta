import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Playful color palette - customize these to match your style!
        playful: {
          primary: "#FF6B9D",
          secondary: "#4ECDC4",
          accent: "#FFE66D",
          purple: "#A8E6CF",
          orange: "#FF8B94",
        },
      },
      fontFamily: {
        sans: ["var(--font-plain)", "system-ui", "sans-serif"],
        plain: ["var(--font-plain)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s infinite",
      },
      borderRadius: {
        "playful": "1rem",
        "playful-lg": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
