/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#040005",
        paper: "#FFF9EF",
        comment: "#2E4730",
        'comment-dark': "#8FBB96",
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        'ink': '6px 6px 0px var(--color-ink)',
        'paper': '6px 6px 0px var(--color-paper)',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
