/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0F111E',
        primary: '#7F3DFF',
        secondary: '#E024EE',
        card: '#1D1F33',
        success: '#00BA88',
        danger: '#FF4B4B',
        text: {
          DEFAULT: '#FFFFFF',
          muted: '#8F92A1',
        }
      },
    },
  },
  plugins: [],
}

