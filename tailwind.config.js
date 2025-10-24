import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0070f3",
              foreground: "#ffffff",
            },
            background: "#f8fafc", // Light gray background for main area
            content1: "#ffffff", // Pure white for cards, sidebar, navbar
            content2: "#f1f5f9", // Slightly darker for table headers, secondary elements
            content3: "#e2e8f0", // Even darker for borders, dividers
            content4: "#cbd5e1", // Darkest content color for subtle elements
            default: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#0070f3",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};
