// Tailwind v4 ships as a PostCSS plugin rather than a `tailwind.config.js`
// file — this is the entire build-side wiring it needs. All of the actual
// design tokens (colors, fonts, spacing) live in src/app/globals.css instead,
// using Tailwind v4's CSS-first `@theme` syntax.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
