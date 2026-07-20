import type { Config } from 'tailwindcss';

/**
 * Design tokens voor Mijn Balans.
 * De kleuren verwijzen naar CSS-variabelen (zie src/styles/index.css),
 * zodat er nergens losse hexcodes in de componenten staan.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 3px rgb(41 51 48 / 0.06), 0 4px 16px rgb(41 51 48 / 0.05)',
        soft: '0 1px 2px rgb(41 51 48 / 0.05)',
      },
      fontSize: {
        // schaalbaar via --font-scale op :root
      },
    },
  },
  plugins: [],
} satisfies Config;
