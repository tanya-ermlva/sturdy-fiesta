import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
      playful: "1rem",
      "playful-lg": "2rem",
    },
    extend: {
      /* ===== Spacing Scale ===== */
      spacing: {
        "px": "1px",
        "0": "0",
        "0.5": "0.125rem",  // 2px
        "1": "0.25rem",     // 4px
        "1.5": "0.375rem",  // 6px
        "2": "0.5rem",      // 8px
        "2.5": "0.625rem",  // 10px
        "3": "0.75rem",     // 12px
        "4": "1rem",        // 16px
        "5": "1.25rem",     // 20px
        "6": "1.5rem",      // 24px
        "7": "1.75rem",     // 28px
        "8": "2rem",        // 32px
        "10": "2.5rem",     // 40px
        "12": "3rem",       // 48px
        "14": "3.5rem",     // 56px
        "16": "4rem",       // 64px
        "20": "5rem",       // 80px
        "24": "6rem",       // 96px
        "28": "7rem",       // 112px
        "32": "8rem",       // 128px
        "40": "10rem",      // 160px
        "48": "12rem",      // 192px
        "56": "14rem",      // 224px
        "64": "16rem",      // 256px
      },
      /* ===== Typography Scale ===== */
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0" }],           // 12px
        "sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "-0.005em" }],   // 14px
        "base": ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],      // 16px
        "lg": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],    // 18px
        "xl": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.015em" }],   // 20px
        "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],     // 24px
        "3xl": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],       // 32px
        "4xl": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],   // 40px
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],      // 48px
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],   // 60px
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],       // 72px
      },
      /* ===== Shadow Scale (mapped from CSS variables) ===== */
      boxShadow: {
        "xs": "var(--shadow-xs)",
        "sm": "var(--shadow-sm)",
        "md": "var(--shadow-md)",
        "lg": "var(--shadow-lg)",
        "xl": "var(--shadow-xl)",
        "inner": "var(--shadow-inner)",
        "none": "none",
      },
    },
  },
  plugins: [],
};

export default config;
