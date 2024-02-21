/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      colors : {
        "gold" : "#F89832",
        "glow_red" : "#D54040"
      },
      dropShadow: {
        glowWhite: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)"
        ],
        glowGold : [
          "0 0px 20px rgba(255, 215, 0, 0.35)", 
          "0 0px 65px rgba(255, 215, 0, 0.2)" 
        ]
      }
    },
  },
  plugins: [],
}

