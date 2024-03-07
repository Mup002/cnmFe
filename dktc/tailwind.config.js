/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        colorText: '#333',
        colorTextCalendar : '#717171',
        colorBgHeader : '#FFF1CE',
        colorBgHeader2: '#BCBDC0',
        colorTextCgv : '#717171',
        colorBgSite : '#343133',
        colorTextSite: '#dbdbdb',
        colorSeatSelected : '#e78181',
      }
    },
  },
  plugins: [],
}

