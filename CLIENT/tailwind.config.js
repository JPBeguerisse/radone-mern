/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a2d61", // Couleur primaire
        secondary: "#0848a0", // Couleur secondaire
        accent: "#282c34", // Accent
        background: "#F3F4F6", // Fond
        text: "#111827", // Couleur du texte
      },
    },
  },
  plugins: [],
};
