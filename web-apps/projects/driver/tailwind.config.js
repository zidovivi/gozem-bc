module.exports = {
  prefix: '',
  purge: {
    enabled: true,
    content: [
      './projects/driver/src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['disabled']
    },
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
};
