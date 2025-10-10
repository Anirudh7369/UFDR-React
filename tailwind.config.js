/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#9333ea",
        "background-light": "#f7f6f8",
        "background-dark": "#121212",
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
        "accent-dark": "#2a2a2a",
        "muted-light": "#6b7280",
        "muted-dark": "#9ca3af",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'aurora': '0 0 120px 10px rgba(147, 51, 234, 0.3), 0 0 40px 5px rgba(59, 130, 246, 0.2)',
        'button-glow': '0 0 20px 4px rgba(147, 51, 234, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(147, 51, 234, 0.2)' },
          '50%': { boxShadow: '0 0 35px 8px rgba(147, 51, 234, 0.5)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}