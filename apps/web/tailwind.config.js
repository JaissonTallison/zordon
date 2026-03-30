/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zordon: {
          dark: "#0f0c29",      // fundo profundo (quase preto)
          mid: "#302b63",       // roxo escuro
          primary: "#4b2a8f",   // roxo principal
          accent: "#6d28d9",    // roxo vibrante (interações)
          light: "#f8fafc",      // branco suave
        },
        primaryLight: "#A78BFA",
        primaryDark: "#5B21B6",

        snow: "#F9FAFB",
        white: "#FFFFFF",

        surface: "#FFFFFF",
        surfaceSoft: "#F3F4F6",

        textPrimary: "#111827",
        textSecondary: "#6B7280",

      }
    },
  },
  plugins: [],
};