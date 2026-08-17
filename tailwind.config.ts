import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Botanical Laboratory palette
        cream: "#FAF6EF",
        parchment: "#F3ECE0",
        stone: "#E7DECF",
        sand: "#DCCFBA",
        forest: "#223027",
        ink: "#1C2620",
        moss: "#55694F",
        sage: "#8A9A82",
        clay: "#B26E4E",
        clayDark: "#9A5C40",
        charcoal: "#2B2723",
      },
      fontFamily: {
        serif: ["'Fraunces Variable'", "Georgia", "serif"],
        sans: ["'Inter Variable'", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "hero": ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.75rem",
        lg: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(34,48,39,0.04), 0 8px 24px -12px rgba(34,48,39,0.12)",
        card: "0 1px 3px rgba(34,48,39,0.05), 0 12px 32px -16px rgba(34,48,39,0.18)",
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slide-in-rtl": {
          "0%": { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-ltr": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 90s linear infinite",
        "slide-in-rtl": "slide-in-rtl 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-ltr": "slide-in-ltr 0.45s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
