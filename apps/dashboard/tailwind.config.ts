import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        midnight: "#0f172a",
        neon: {
          purple: "#a855f7",
          blue: "#38bdf8",
          green: "#34d399",
        },
      },
      boxShadow: {
        soft: "0 25px 60px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
