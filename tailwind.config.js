/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Colours resolve through RGB channel triplets defined in globals.css, so
      // Tailwind can inject an alpha channel: `bg-ink/20` works, which a bare
      // `var(--color-ink)` would silently ignore.
      colors: {
        ink: "rgb(var(--color-ink-c) / <alpha-value>)",
        paper: "rgb(var(--color-paper-c) / <alpha-value>)",
        desktop: "rgb(var(--desktop-c) / <alpha-value>)",
        chrome: {
          DEFAULT: "rgb(var(--chrome-face-c) / <alpha-value>)",
          light: "rgb(var(--chrome-light-c) / <alpha-value>)",
          shadow: "rgb(var(--chrome-shadow-c) / <alpha-value>)",
          dark: "rgb(var(--chrome-dark-c) / <alpha-value>)",
          text: "rgb(var(--chrome-text-c) / <alpha-value>)",
        },
        titlebar: {
          DEFAULT: "rgb(var(--titlebar-c) / <alpha-value>)",
          text: "rgb(var(--titlebar-text-c) / <alpha-value>)",
          inactive: "rgb(var(--titlebar-inactive-c) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Chrome and body copy are PROPORTIONAL: monospace everywhere is
        // itself a code metaphor, and it was what kept reading as "editor".
        sans: ["var(--font-chrome)"],
        chrome: ["var(--font-chrome)"],
        // Reserved for the boot terminal and filenames.
        mono: ["var(--font-terminal)"],
      },
    },
  },
  plugins: [],
};
