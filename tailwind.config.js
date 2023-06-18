/** @type {import('tailwindcss').Config} */
module.exports = {
  //darkMode: 'class',
  plugins: [require('tailwind-scrollbar')],
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontSize: {
      xs: '0.8rem',
      sm: '0.9rem',
      base: '1rem',
      lg: '1.1rem',
      xl: '1.5rem',
      xxl: '1.75rem',
      xxxl: '2.25rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      textA: '#ffffff',
      textB: '#000000',
      warning: '#ffcc00',
      danger: '#f54b4c',
      primary: '#9de04b',
      secondary: '#d9d9d9',
      tertiary: '#b4b4b4',
      selection: '#37473a',
      bgB: '#2b3738',
      bgA: '#222c2d',
      subtle: '#646464',
      ring: '#2e528c',
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0%)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        flip: {
          '0%': { transform: 'scaleX(0) scaleY(1.25)' },
          '100%': { transform: 'scaleX(1) scaleY(1)' },
        },
        hover: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-10%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms 1',
        fadeOut: 'fadeOut 300ms 1',
        flip: 'flip 300ms 1',
        hover: 'hover 1500ms ease-in-out infinite',
        zoomIn: 'zoomIn 300ms ease 1',
        zoomOut: 'zoomOut 300ms ease 1',
        slideIn: 'slideIn 300ms ease 1',
        slideOut: 'slideOut 300ms ease 1',
      },
    },
    fontFamily: {
      sans: ['"Red Hat Text"', 'sans-serif'],
      mono: ['"Red Hat Mono"', 'sans-serif'],
    },
  },
};
