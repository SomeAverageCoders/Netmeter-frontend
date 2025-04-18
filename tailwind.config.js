/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#237BDA',
        secondary: '#93C7FF',
        topic: '#333333',
        ash: '#C4C4C4',
        placehold: '#3E4259'
      }
    },
  },
  corePlugin: {
    borderOpacity: true,
  },
  plugins: [],
}

