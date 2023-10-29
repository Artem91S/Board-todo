/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "boardBackgroundColor":'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
        "mainBackgroundColor":'#7aa8de',
        "columnBackgroundColor":'#3f6fa7'
      },
    },
  },
  plugins: [],
}

