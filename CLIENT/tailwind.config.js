/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff7b77", // Couleur primaire
        secondary: "#b45754", // Couleur secondaire
        accent: "#282c34", // Accent
        background: "#F3F4F6", // Fond
        text: "#111827", // Couleur du texte
      },
    },
  },
  plugins: [],
};
