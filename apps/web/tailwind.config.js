/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // ── SURFACES ──
        pageBg:   "#18181B",   // zinc-900
        sidebar:  "#111116",
        card:     "#252529",   // zinc-800
        cardHi:   "#2D2D32",
        overlay:  "#373740",

        // ── BORDERS ──
        border:   "#3D3D44",   // zinc-700
        borderHi: "#525259",   // zinc-600

        // ── BRAND ──
        indigo:     "#818CF8",               // primary interactive
        indigoDark: "#6366F1",
        indigoDim:  "rgba(129,140,248,0.10)",

        // ── STATUS ──
        danger:     "#F87171",
        dangerDim:  "rgba(248,113,113,0.10)",
        warning:    "#FBBF24",
        warningDim: "rgba(251,191,36,0.10)",
        success:    "#34D399",
        successDim: "rgba(52,211,153,0.10)",
        info:       "#60A5FA",
        infoDim:    "rgba(96,165,250,0.10)",

        // ── TEXT ──
        text1: "#F4F4F5",    // zinc-100
        text2: "#A1A1AA",    // zinc-400
        text3: "#71717A",    // zinc-500
        text4: "#52525B",    // zinc-600

        // ── LEGACY compat ──
        snow:          "#18181B",
        textPrimary:   "#F4F4F5",
        textSecondary: "#A1A1AA",
        surface:       "#252529",
        zordon: {
          dark:    "#111116",
          mid:     "#252529",
          primary: "#6366F1",
          accent:  "#818CF8",
          light:   "#18181B",
          warning: "#FBBF24",
        },
      },
      boxShadow: {
        "glow-indigo": "0 0 20px rgba(129,140,248,0.2)",
        "glow-red":    "0 0 16px rgba(248,113,113,0.25)",
        "glow-amber":  "0 0 16px rgba(251,191,36,0.25)",
        "glow-green":  "0 0 16px rgba(52,211,153,0.25)",
        card:          "0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(61,61,68,0.5)",
        "card-hover":  "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(82,82,89,0.7)",
      },
      keyframes: {
        "pulse-green": {
          "0%,100%": { boxShadow: "0 0 4px rgba(52,211,153,0.6)"  },
          "50%":      { boxShadow: "0 0 12px rgba(52,211,153,1)"   },
        },
        "pulse-red": {
          "0%,100%": { boxShadow: "0 0 4px rgba(248,113,113,0.6)" },
          "50%":      { boxShadow: "0 0 12px rgba(248,113,113,1)"  },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)"   },
          "100%": { transform: "rotate(360deg)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "pulse-red":   "pulse-red 1.8s ease-in-out infinite",
        "fade-in-up":  "fade-in-up 0.35s ease-out forwards",
        "fade-in":     "fade-in 0.25s ease-out forwards",
        "spin-slow":   "spin-slow 0.9s linear infinite",
        blink:         "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};
