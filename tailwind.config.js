/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "tb-transparent": "rgba(217, 217, 217, 0.4)",
        "tb-shadow": "0px 1px 14px rgba(0, 0, 0, 0.12)",
        "tb-warning-primary": "#FF8A00",
        "tb-warning-secondary": "rgba(255, 138, 0, 0.1)",
        "tb-text-gray": "#666D74",
        "black-bg": "#101010",
        "gv-purple": "#644CF7",
        "panel-gray": "#202020",
        "gray-text": "#AFAFAF",
      },
      transitionProperty: {
        width: "width",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        secondary: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
