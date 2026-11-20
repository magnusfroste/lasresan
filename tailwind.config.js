/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Fredoka", "system-ui", "sans-serif"] },
      colors: {
        ink: "#14181f",
        muted: "#5b6472",
        line: "#e7e2d9",
        paper: "#faf7f2",
        brand: { DEFAULT: "#d6367f", soft: "#fdeef5", dark: "#b02a68" },
      },
      borderRadius: { "3xl": "24px" },
    },
  },
  plugins: [],
};