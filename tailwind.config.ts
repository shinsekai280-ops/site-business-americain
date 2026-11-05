import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7F5",
        ink: "#0B0B0F",
        muted: "#5F6368",
        line: "#E7E7E3",
        lemon: "#F2D90B",
        lime: "#9BE23C",
        leaf: "#1FA85B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,11,15,0.04), 0 8px 24px rgba(11,11,15,0.06)",
        float: "0 2px 4px rgba(11,11,15,0.05), 0 18px 48px rgba(11,11,15,0.12)",
        pill: "0 1px 2px rgba(11,11,15,0.08), 0 6px 16px rgba(11,11,15,0.10)",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
    },
  },
  plugins: [],
};

export default config;
