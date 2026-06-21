import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: { DEFAULT: "#111827", raised: "#161E2C", hover: "#1B2433" },
        border: { DEFAULT: "#1F2937", subtle: "#1A2230" },
        accent: { DEFAULT: "#00D4FF", muted: "#0AA8CC", foreground: "#03161B" },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        text: { primary: "#F3F6F9", secondary: "#9CA7B5", tertiary: "#6B7686" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,212,255,0.15), 0 0 24px rgba(0,212,255,0.08)",
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-in": "fadeIn 160ms ease-out",
        "slide-up": "slideUp 200ms ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;