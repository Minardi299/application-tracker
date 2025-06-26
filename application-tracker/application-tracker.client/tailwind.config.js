module.exports = {
  darkMode: "class", // make sure this is set!
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // or ts/tsx if needed
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // define all your semantic color tokens
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
};
