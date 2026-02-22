import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        panel: "12px",
      },
      boxShadow: {
        panel: "0 8px 30px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
