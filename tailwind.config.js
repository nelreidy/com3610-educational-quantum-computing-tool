/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      // padding: {
      //   '1/2': '50%',
      //   full: '100%',
      // },
      spacing: {
        '22': '5.5rem',
        '33': '8.25rem',
        '42': '10.5rem',
        '56': '14rem',
        '70': '17.5rem',
        '84': '21rem',
        '98': '24.5rem',
        '112': '28rem',

      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true
    })
  ],
  safelist: [
    'h-42',
    'h-56',
    'h-70',
    'h-84',
    'h-98',
    'h-112',
  ],
}

