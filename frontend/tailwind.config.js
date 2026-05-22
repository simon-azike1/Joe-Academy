export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#1A2D44',
          700: '#14293a',
          800: '#10212d',
          900: '#1A2D44',
        },
        amber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#F9A825',
          600: '#f9a825',
          700: '#f57f17',
          800: '#e65100',
          900: '#bf360c',
        },
        gold: {
          50: '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#FFD54F',
          400: '#ffeb3b',
          500: '#fbc02d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
