/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFD93D",
        dark: "#2D3142",
        gray: "#9E9E9E",
        lightGray: "#F5F5F5",
        success: "#6BCF7F",
        error: "#FF6B6B",
        white: "#FFFFFF",
        black: "#000000",
        background: "#141416",
      },
      fontFamily: {
        regular: ["System"],
        medium: ["System"],
        bold: ["System"],
        semibold: ["System"],
      },
    },
  },
  plugins: [],
};
