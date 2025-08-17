export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          secondary: "#7c3aed",
        },
      },
      boxShadow: {
        glow: "0 10px 30px -10px rgba(37,99,235,.35)",
      },
    },
  },
  plugins: [],
}
