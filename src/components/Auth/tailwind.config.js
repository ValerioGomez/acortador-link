/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Habilitar modo oscuro basado en clase
  theme: {
    extend: {
      // Aquí puedes extender la paleta de colores, fuentes, etc.
      // Por ejemplo, para que coincida con los colores de tu marca.
      colors: {
        // Puedes definir colores personalizados si lo necesitas
      },
    },
  },
  plugins: [],
};
