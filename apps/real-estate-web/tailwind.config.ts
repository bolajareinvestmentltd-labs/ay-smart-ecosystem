import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "var(--brand-light)",
          dark: "var(--brand-dark)",
          purple: "var(--brand-purple)",
          magenta: "var(--brand-magenta)",
          accent: "var(--brand-accent)",
        },
        purple: {
          600: "#701A75",
          700: "#581C87",
        },
        gold: {
          500: "#F59E0B",
        }
      },
    },
  },
  plugins: [],
};
export default config;
