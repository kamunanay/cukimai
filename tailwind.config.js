/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        gold: { DEFAULT: "#f5c842", 400: "#f7cf3f", 500: "#f5c842", 600: "#d4a020" },
        navy: { DEFAULT: "#0b0d1a", light: "#1a1f3a", dark: "#05070e" },
        green: { 400: "#4cd9a0" },
        red: { 400: "#f87171" },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulse: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        glow: { "0%,100%": { opacity: 0.4 }, "50%": { opacity: 0.8 } },
      },
      animation: {
        pulse: "pulse 2s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        float: "float 4s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}