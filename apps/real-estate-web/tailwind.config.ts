import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
