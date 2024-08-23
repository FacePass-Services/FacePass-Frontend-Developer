import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff', // Default (light mode)
          dark: '#000000'  // Dark mode
        },
        secondary: {
          DEFAULT: '#f2f2f8', // Default (light mode)
          dark: '#1c1c1e'    // Dark mode
        },
        tertiary: {
          DEFAULT: '#ffffff',   // Default (light mode)
          dark: '#2c2c2e'    // Dark mode
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-section":"url('/wallpapers/simon.jpg')",
      },
    },
  },
  plugins: [nextui()],
};

export default config;
