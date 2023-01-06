/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat"],
    },
    extend: {
      colors: {
        primary: "#24484D",
        "text-primary": "#2F666F",
        "primary-ligth": "#397983",
        secondary: "#F8D648",
        "functional-grey": "#6D7580",
        "functional-grey-2": "#DADEE3",
      },
    },
  },
  plugins: [],
};
