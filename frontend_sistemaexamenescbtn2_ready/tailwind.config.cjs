/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cbtBlue: "#0d3b66",    // Azul institucional
        cbtGold: "#f4d35e",    // Dorado académico
        cbtGray: "#f4f6f8",    // Fondo gris claro
        cbtText: "#2e2e2e",    // Texto gris oscuro
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Fuente moderna
      },
    },
  },
  plugins: [],
};
