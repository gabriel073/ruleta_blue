/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          // paleta propia de Blue (pisa el azul por defecto de Tailwind)
          50: "#f0f7ff",
          100: "#dcecff",
          200: "#bcd9fb",
          300: "#8fbdf5",
          400: "#5e9bea",
          500: "#3b7fd9",
          600: "#2a63b8",
          700: "#234e92",
          800: "#1f4175",
          900: "#1b3459",
        },
        butter: "#ffe48a",
        blush: "#ffc9d6",
        mint: "#c8f0df",
      },
      fontFamily: {
        sans: ['ui-rounded', '"Nunito"', '"Quicksand"', "system-ui", "sans-serif"],
      },
      keyframes: {
        logoIn: {
          "0%": { transform: "scale(0.2) rotate(-18deg)", opacity: "0" },
          "55%": { transform: "scale(1.12) rotate(4deg)", opacity: "1" },
          "75%": { transform: "scale(0.96) rotate(-2deg)" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        letterUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(59,127,217,0.45)" },
          "100%": { boxShadow: "0 0 0 22px rgba(59,127,217,0)" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        pointerTap: {
          "0%": { transform: "rotate(0deg)" },
          "12%": { transform: "rotate(9deg)" },
          "38%": { transform: "rotate(-2.5deg)" },
          "62%": { transform: "rotate(2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        idle: {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.02)" },
        },
      },
      animation: {
        logoIn: "logoIn 1.1s cubic-bezier(.2,.8,.2,1) both",
        letterUp: "letterUp .6s ease-out both",
        float: "float 4s ease-in-out infinite",
        fadeIn: "fadeIn .6s ease-out both",
        pop: "pop .55s cubic-bezier(.2,.9,.3,1.2) both",
        wiggle: "wiggle 1.4s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        shine: "shine 3.2s linear infinite",
        blink: "blink 1.2s ease-in-out infinite",
        pointerTap: "pointerTap 120ms cubic-bezier(.2,.7,.3,1) both",
        idle: "idle 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
