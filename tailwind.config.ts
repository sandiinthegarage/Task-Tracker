import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        fg: "#000000",
        accent: "#FFD700",
        danger: "#FF3B30",
        success: "#34C759",
        warning: "#FF9500",
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-lg": "6px 6px 0px 0px rgba(0, 0, 0, 1)",
      },
      borderWidth: {
        3: "3px",
      },
      spacing: {
        "safe-pb": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
export default config;
