/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // colors: {
      //   primary: "#3B82F6", // Couleur primaire
      //   secondary: "#0848a0", // Couleur secondaire
      //   accent: "#282c34", // Accent
      //   background: "#F9FAFB", // Fond
      //   text: "#111827", // Couleur du texte
      // },

      colors: {
        // Thème clair
        primary: "#3B82F6", // Bleu clair (tailwind blue-500)
        secondary: "#1E3A8A", // Bleu foncé (tailwind blue-900)
        accent: "#E0F2FE", // Bleu très pâle, pour les accents (tailwind blue-100)
        background: "#F9FAFB", // Fond clair
        text: "#111827", // Texte principal (gray-900)

        // Thème sombre (à utiliser avec dark:)
        dark: {
          primary: "#3B82F6", // Même bleu pour garder une identité visuelle constante
          secondary: "#1E40AF", // Un bleu plus riche pour les éléments sur fond sombre
          accent: "#1E293B", // Gris bleuté foncé pour les cartes, encadrés, etc.
          background: "#0F172A", // Fond principal très sombre (tailwind slate-900)
          text: "#F1F5F9", // Texte clair (slate-100)
        },
      },
    },
  },
  plugins: [],
};
