/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "footer": "url('/src/img/network.jpg')",
        "header": "url('/src/img/bg-banner.jpg')",
        "post": "url('/src/img/bg-banner-shapes.jpg')",
      },
    },
  },
  plugins: [],
};
