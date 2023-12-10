/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}"
  ],

  theme: {
    extend: {
      colors:{
        'terminal': '#00aa00'
      },
      height: {
        'full-screen': ['100vh /* fallback for Opera, IE and etc. */', '100lvh']
    }
    },
  },

  safelist: [
    'bg-rose-100',
    'border-rose-500',
    'text-rose-900',
    'text-rose-500',
    'bg-teal-100',
    'border-teal-500',
    'text-teal-900',
    'text-teal-500',
    'bg-lime-100',
    'border-lime-500',
    'text-lime-900',
    'text-lime-500',
    'bg-white',
    'bg-amber-100'
  ],
  darkMode: 'class',
};

module.exports = config;

